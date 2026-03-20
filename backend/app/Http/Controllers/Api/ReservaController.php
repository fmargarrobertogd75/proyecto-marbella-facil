<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reserva;
use App\Models\Notificacion;
use Illuminate\Http\Request;

class ReservaController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Reserva::with(['negocio', 'usuario']);

        if ($user->rol === 'empresa') {
            // Empresas ven reservas de sus negocios
            $query->whereHas('negocio', fn($q) => $q->where('usuario_id', $user->id));
        } else {
            // Usuarios ven sus propias reservas
            $query->where('usuario_id', $user->id);
        }

        return response()->json($query->orderBy('fecha_reserva', 'desc')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'negocio_id'    => 'required|exists:negocios,id',
            'fecha_reserva' => 'required|date|after:today',
            'hora_reserva'  => 'required',
            'num_personas'  => 'required|integer|min:1|max:20',
            'observaciones' => 'nullable|string',
        ]);

        $data['usuario_id'] = $request->user()->id;
        $data['estado']     = 'pendiente';

        $reserva = Reserva::create($data);

        // Notificar al usuario
        Notificacion::create([
            'usuario_id' => $request->user()->id,
            'titulo'     => '¡Reserva recibida!',
            'mensaje'    => "Tu reserva para el {$data['fecha_reserva']} a las {$data['hora_reserva']} está pendiente de confirmación.",
            'tipo'       => 'reserva',
            'link_accion'=> "/reservas/detalle/{$reserva->id}",
        ]);

        return response()->json($reserva->load('negocio'), 201);
    }

    public function cambiarEstado(Request $request, $id)
    {
        $reserva = Reserva::findOrFail($id);
        $data    = $request->validate([
            'estado'             => 'required|in:pendiente,confirmada,cancelada,finalizada',
            'motivo_cancelacion' => 'nullable|string',
        ]);

        $reserva->update($data);

        // Notificar al usuario
        Notificacion::create([
            'usuario_id' => $reserva->usuario_id,
            'titulo'     => 'Estado de reserva actualizado',
            'mensaje'    => "Tu reserva ha sido {$data['estado']}.",
            'tipo'       => 'reserva',
            'link_accion'=> "/reservas/detalle/{$reserva->id}",
        ]);

        return response()->json($reserva);
    }

    /**
     * El usuario cancela su propia reserva (solo pendiente o confirmada)
     */
    public function cancelarPropia(Request $request, $id)
    {
        $usuario = $request->user();
        $reserva = Reserva::with(['negocio'])->findOrFail($id);

        if ($reserva->usuario_id !== $usuario->id) {
            return response()->json(['message' => 'No tienes permiso para cancelar esta reserva.'], 403);
        }

        if (!in_array($reserva->estado, ['pendiente', 'confirmada'])) {
            return response()->json(['message' => 'Solo puedes cancelar reservas pendientes o confirmadas.'], 422);
        }

        $motivo = $request->input('motivo_cancelacion', 'Cancelada por el usuario');

        $reserva->estado = 'cancelada';
        $reserva->motivo_cancelacion = $motivo;
        $reserva->save();

        // Notificar al negocio (al propietario del negocio)
        if ($reserva->negocio && $reserva->negocio->usuario_id) {
            Notificacion::create([
                'usuario_id' => $reserva->negocio->usuario_id,
                'titulo'     => 'Reserva cancelada por el cliente',
                'mensaje'    => "La reserva del {$reserva->fecha_reserva} a las {$reserva->hora_reserva} ha sido cancelada por el cliente.",
                'tipo'       => 'reserva',
                'link_accion'=> "/negocio/reservas",
            ]);
        }

        return response()->json([
            'message' => 'Reserva cancelada correctamente.',
            'reserva' => $reserva->fresh(['negocio', 'tipoReserva']),
        ]);
    }

    /**
     * El usuario modifica la fecha/hora de su propia reserva (solo pendiente)
     */
    public function modificarPropia(Request $request, $id)
    {
        $usuario = $request->user();
        $reserva = Reserva::with(['negocio'])->findOrFail($id);

        if ($reserva->usuario_id !== $usuario->id) {
            return response()->json(['message' => 'No tienes permiso para modificar esta reserva.'], 403);
        }

        if ($reserva->estado !== 'pendiente') {
            return response()->json(['message' => 'Solo puedes modificar reservas en estado pendiente.'], 422);
        }

        $data = $request->validate([
            'fecha_reserva'  => 'required|date|after:today',
            'hora_reserva'   => 'required|string',
            'num_personas'   => 'nullable|integer|min:1|max:20',
            'observaciones'  => 'nullable|string',
        ]);

        $reserva->update($data);

        // Notificar al negocio
        if ($reserva->negocio && $reserva->negocio->usuario_id) {
            Notificacion::create([
                'usuario_id' => $reserva->negocio->usuario_id,
                'titulo'     => 'Reserva modificada por el cliente',
                'mensaje'    => "El cliente ha cambiado su reserva al {$data['fecha_reserva']} a las {$data['hora_reserva']}.",
                'tipo'       => 'reserva',
                'link_accion'=> "/negocio/reservas",
            ]);
        }

        // Notificar al propio usuario
        Notificacion::create([
            'usuario_id' => $usuario->id,
            'titulo'     => 'Reserva modificada',
            'mensaje'    => "Tu reserva ha sido actualizada al {$data['fecha_reserva']} a las {$data['hora_reserva']}.",
            'tipo'       => 'reserva',
            'link_accion'=> "/perfil?tab=reservas",
        ]);

        return response()->json([
            'message' => 'Reserva actualizada correctamente.',
            'reserva' => $reserva->fresh(['negocio', 'tipoReserva']),
        ]);
    }
}
