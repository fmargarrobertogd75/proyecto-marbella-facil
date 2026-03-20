<?php

namespace App\Http\Controllers\Api;

use App\Models\SlotDisponibilidad;
use App\Models\Negocio;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SlotsDisponibilidadController extends Controller
{
    /**
     * Obtener slots de disponibilidad de un negocio (público)
     */
    public function index($negocio_id)
    {
        $slots = SlotDisponibilidad::with('tipoReserva')
            ->where('negocio_id', $negocio_id)
            ->where('activo', true)
            ->orderByRaw("FIELD(dia_semana, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo')")
            ->orderBy('hora_inicio')
            ->get();

        // Agrupar por día de la semana
        $slotsPorDia = $slots->groupBy('dia_semana');

        return response()->json($slotsPorDia);
    }

    /**
     * Crear slot de disponibilidad (solo dueño del negocio)
     */
    public function store(Request $request)
    {
        $usuario = $request->user();

        $request->validate([
            'negocio_id' => 'required|exists:negocios,id',
            'tipo_reserva_id' => 'nullable|exists:tipos_reserva,id',
            'dia_semana' => 'required|in:Lunes,Martes,Miércoles,Jueves,Viernes,Sábado,Domingo',
            'hora_inicio' => 'required',
            'hora_fin' => 'required',
            'capacidad_maxima' => 'required|integer|min:1',
        ]);

        // Verificar que el usuario es dueño del negocio
        $negocio = Negocio::findOrFail($request->negocio_id);
        if ($negocio->usuario_id !== $usuario->id && $usuario->rol !== 'admin') {
            return response()->json(['message' => 'Sin permisos.'], 403);
        }

        $slot = SlotDisponibilidad::create($request->all());

        return response()->json([
            'message' => 'Horario de disponibilidad creado.',
            'slot' => $slot->load('tipoReserva'),
        ], 201);
    }

    /**
     * Actualizar slot de disponibilidad
     */
    public function update(Request $request, $id)
    {
        $usuario = $request->user();
        $slot = SlotDisponibilidad::with('negocio')->findOrFail($id);

        // Verificar permisos
        if ($slot->negocio->usuario_id !== $usuario->id && $usuario->rol !== 'admin') {
            return response()->json(['message' => 'Sin permisos.'], 403);
        }

        $request->validate([
            'tipo_reserva_id' => 'nullable|exists:tipos_reserva,id',
            'dia_semana' => 'sometimes|in:Lunes,Martes,Miércoles,Jueves,Viernes,Sábado,Domingo',
            'hora_inicio' => 'sometimes',
            'hora_fin' => 'sometimes',
            'capacidad_maxima' => 'sometimes|integer|min:1',
            'activo' => 'boolean',
        ]);

        $slot->update($request->all());

        return response()->json([
            'message' => 'Horario actualizado.',
            'slot' => $slot->fresh(['tipoReserva']),
        ]);
    }

    /**
     * Eliminar slot de disponibilidad
     */
    public function destroy(Request $request, $id)
    {
        $usuario = $request->user();
        $slot = SlotDisponibilidad::with('negocio')->findOrFail($id);

        // Verificar permisos
        if ($slot->negocio->usuario_id !== $usuario->id && $usuario->rol !== 'admin') {
            return response()->json(['message' => 'Sin permisos.'], 403);
        }

        $slot->delete();

        return response()->json(['message' => 'Horario eliminado.']);
    }

    /**
     * Vista de ocupación (simplificada)
     */
    public function ocupacion(Request $request)
    {
        $usuario = $request->user();

        if ($usuario->rol !== 'empresa') {
            return response()->json(['message' => 'Acceso denegado.'], 403);
        }

        $negocio = $usuario->negocios()->first();
        if (!$negocio) {
            return response()->json(['message' => 'No tienes un negocio registrado.'], 404);
        }

        // Esto es una versión simplificada. Se puede expandir con lógica más compleja
        $reservasProximas = $negocio->reservas()
            ->where('estado', 'confirmada')
            ->whereDate('fecha_reserva', '>=', today())
            ->orderBy('fecha_reserva')
            ->orderBy('hora_reserva')
            ->take(20)
            ->get();

        return response()->json([
            'negocio_id' => $negocio->id,
            'reservas_proximas' => $reservasProximas,
        ]);
    }
}
