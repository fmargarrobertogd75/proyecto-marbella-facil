<?php

namespace App\Http\Controllers\Api;

use App\Models\TipoReserva;
use App\Models\Negocio;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TiposReservaController extends Controller
{
    /**
     * Obtener tipos de reserva de un negocio (público)
     */
    public function index($negocio_id)
    {
        $tipos = TipoReserva::where('negocio_id', $negocio_id)
            ->where('activo', true)
            ->get();

        return response()->json($tipos);
    }

    /**
     * Crear tipo de reserva (solo dueño del negocio)
     */
    public function store(Request $request)
    {
        $usuario = $request->user();

        $request->validate([
            'negocio_id' => 'required|exists:negocios,id',
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
            'duracion_minutos' => 'required|integer|min:15|max:480',
            'capacidad_maxima' => 'required|integer|min:1',
            'requiere_aprobacion' => 'boolean',
        ]);

        // Verificar que el usuario es dueño del negocio
        $negocio = Negocio::findOrFail($request->negocio_id);
        if ($negocio->usuario_id !== $usuario->id && $usuario->rol !== 'admin') {
            return response()->json(['message' => 'Sin permisos.'], 403);
        }

        $tipo = TipoReserva::create($request->all());

        return response()->json([
            'message' => 'Tipo de reserva creado exitosamente.',
            'tipo' => $tipo,
        ], 201);
    }

    /**
     * Actualizar tipo de reserva
     */
    public function update(Request $request, $id)
    {
        $usuario = $request->user();
        $tipo = TipoReserva::with('negocio')->findOrFail($id);

        // Verificar permisos
        if ($tipo->negocio->usuario_id !== $usuario->id && $usuario->rol !== 'admin') {
            return response()->json(['message' => 'Sin permisos.'], 403);
        }

        $request->validate([
            'nombre' => 'sometimes|string|max:100',
            'descripcion' => 'nullable|string',
            'duracion_minutos' => 'sometimes|integer|min:15|max:480',
            'capacidad_maxima' => 'sometimes|integer|min:1',
            'requiere_aprobacion' => 'boolean',
            'activo' => 'boolean',
        ]);

        $tipo->update($request->all());

        return response()->json([
            'message' => 'Tipo de reserva actualizado.',
            'tipo' => $tipo->fresh(),
        ]);
    }

    /**
     * Eliminar tipo de reserva
     */
    public function destroy(Request $request, $id)
    {
        $usuario = $request->user();
        $tipo = TipoReserva::with('negocio')->findOrFail($id);

        // Verificar permisos
        if ($tipo->negocio->usuario_id !== $usuario->id && $usuario->rol !== 'admin') {
            return response()->json(['message' => 'Sin permisos.'], 403);
        }

        $tipo->delete();

        return response()->json(['message' => 'Tipo de reserva eliminado.']);
    }
}
