<?php

namespace App\Http\Controllers\Api;

use App\Models\Reserva;
use App\Models\Notificacion;
use App\Models\ReglaPunto;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ReservaExtendidaController extends Controller
{
    /**
     * Historial de reservas del usuario autenticado
     */
    public function miHistorial(Request $request)
    {
        $usuario = $request->user();
        $filtro = $request->get('filtro', 'todas'); // todas, pendientes, confirmadas, pasadas, canceladas

        $query = Reserva::with(['negocio', 'tipoReserva'])
            ->where('usuario_id', $usuario->id);

        if ($filtro === 'pendientes') {
            $query->where('estado', 'pendiente');
        } elseif ($filtro === 'confirmadas') {
            $query->where('estado', 'confirmada');
        } elseif ($filtro === 'pasadas') {
            $query->where('estado', 'finalizada');
        } elseif ($filtro === 'canceladas') {
            $query->where('estado', 'cancelada');
        }

        $reservas = $query->orderBy('fecha_reserva', 'desc')
            ->orderBy('hora_reserva', 'desc')
            ->paginate(10);

        return response()->json($reservas);
    }

    /**
     * Reservas del negocio del usuario autenticado (empresas)
     */
    public function reservasNegocio(Request $request)
    {
        $usuario = $request->user();

        if ($usuario->rol !== 'empresa') {
            return response()->json(['message' => 'Acceso denegado. Solo para empresas.'], 403);
        }

        // Obtener negocio del usuario
        $negocio = $usuario->negocios()->first();
        if (!$negocio) {
            return response()->json(['message' => 'No tienes un negocio registrado.'], 404);
        }

        $filtro = $request->get('filtro', 'todas');

        $query = Reserva::with(['usuario', 'tipoReserva'])
            ->where('negocio_id', $negocio->id);

        if ($filtro === 'pendientes') {
            $query->where('estado', 'pendiente');
        } elseif ($filtro === 'confirmadas') {
            $query->where('estado', 'confirmada');
        } elseif ($filtro === 'hoy') {
            $query->whereDate('fecha_reserva', today())
                  ->where('estado', 'confirmada');
        } elseif ($filtro === 'futuras') {
            $query->whereDate('fecha_reserva', '>=', today())
                  ->where('estado', 'confirmada');
        }

        $reservas = $query->orderBy('fecha_reserva', 'desc')
            ->orderBy('hora_reserva', 'desc')
            ->paginate(10);

        return response()->json($reservas);
    }

    /**
     * Confirmar reserva (solo empresa propietaria)
     */
    public function confirmarReserva(Request $request, $id)
    {
        $usuario = $request->user();
        $reserva = Reserva::with(['usuario', 'negocio'])->findOrFail($id);

        // Verificar que el usuario es dueño del negocio
        if ($reserva->negocio->usuario_id !== $usuario->id && $usuario->rol !== 'admin') {
            return response()->json(['message' => 'Sin permisos para confirmar esta reserva.'], 403);
        }

        // Cambiar estado
        $reserva->estado = 'confirmada';
        $reserva->save();

        // Crear notificación para el cliente
        Notificacion::create([
            'usuario_id' => $reserva->usuario_id,
            'titulo' => '¡Reserva confirmada!',
            'mensaje' => "Tu reserva en {$reserva->negocio->nombre} para el {$reserva->fecha_reserva} a las {$reserva->hora_reserva} ha sido confirmada.",
            'tipo' => 'reserva',
            'link_accion' => "/perfil?tab=reservas",
        ]);

        // Otorgar puntos al usuario
        $puntosReserva = ReglaPunto::obtenerPuntosPorAccion('reserva_completada');
        if ($puntosReserva > 0) {
            $reserva->usuario->agregarPuntos(
                $puntosReserva,
                "Reserva confirmada en {$reserva->negocio->nombre}",
                'reserva',
                $reserva->id
            );
            $reserva->puntos_otorgados = $puntosReserva;
            $reserva->save();
        }

        return response()->json([
            'message' => 'Reserva confirmada exitosamente.',
            'reserva' => $reserva->fresh(['usuario', 'negocio', 'tipoReserva']),
        ]);
    }

    /**
     * Rechazar reserva (solo empresa propietaria)
     */
    public function rechazarReserva(Request $request, $id)
    {
        $request->validate([
            'motivo_cancelacion' => 'required|string|max:500',
        ]);

        $usuario = $request->user();
        $reserva = Reserva::with(['usuario', 'negocio'])->findOrFail($id);

        // Verificar permisos
        if ($reserva->negocio->usuario_id !== $usuario->id && $usuario->rol !== 'admin') {
            return response()->json(['message' => 'Sin permisos para rechazar esta reserva.'], 403);
        }

        // Cambiar estado
        $reserva->estado = 'cancelada';
        $reserva->motivo_cancelacion = $request->motivo_cancelacion;
        $reserva->save();

        // Crear notificación para el cliente
        Notificacion::create([
            'usuario_id' => $reserva->usuario_id,
            'titulo' => 'Reserva cancelada',
            'mensaje' => "Lamentamos informarte que tu reserva en {$reserva->negocio->nombre} ha sido cancelada. Motivo: {$request->motivo_cancelacion}",
            'tipo' => 'reserva',
            'link_accion' => "/perfil?tab=reservas",
        ]);

        return response()->json([
            'message' => 'Reserva rechazada.',
            'reserva' => $reserva->fresh(['usuario', 'negocio', 'tipoReserva']),
        ]);
    }

    /**
     * Verificar disponibilidad para una reserva
     */
    public function verificarDisponibilidad(Request $request)
    {
        $request->validate([
            'negocio_id' => 'required|exists:negocios,id',
            'fecha_reserva' => 'required|date',
            'hora_reserva' => 'required',
            'num_personas' => 'required|integer|min:1',
        ]);

        // Aquí se puede implementar lógica más compleja de verificación de slots
        // Por ahora retornamos disponible=true (simplificado)

        return response()->json([
            'disponible' => true,
            'message' => 'Horario disponible para reserva.',
        ]);
    }
}
