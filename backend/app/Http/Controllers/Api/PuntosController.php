<?php

namespace App\Http\Controllers\Api;

use App\Models\HistorialPunto;
use App\Models\NivelUsuario;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PuntosController extends Controller
{
    /**
     * Obtener puntos actuales, nivel y progreso del usuario autenticado
     */
    public function misPuntos(Request $request)
    {
        $usuario = $request->user();
        $nivelActual = $usuario->getNivelActual();

        // Calcular siguiente nivel
        $siguienteNivel = NivelUsuario::where('orden', '>', $nivelActual->orden ?? 0)
            ->orderBy('orden', 'asc')
            ->first();

        return response()->json([
            'puntos_actuales' => $usuario->puntos_fidelidad,
            'nivel_actual' => [
                'nombre' => $nivelActual->nombre ?? 'Turista Novato',
                'icono' => $nivelActual->icono ?? '🏖️',
                'descripcion_beneficios' => $nivelActual->descripcion_beneficios ?? '',
                'puntos_minimos' => $nivelActual->puntos_minimos ?? 0,
                'puntos_maximos' => $nivelActual->puntos_maximos,
            ],
            'siguiente_nivel' => $siguienteNivel ? [
                'nombre' => $siguienteNivel->nombre,
                'icono' => $siguienteNivel->icono,
                'puntos_necesarios' => $siguienteNivel->puntos_minimos,
                'faltan' => max(0, $siguienteNivel->puntos_minimos - $usuario->puntos_fidelidad),
            ] : null,
            'progreso' => $siguienteNivel
                ? min(100, ($usuario->puntos_fidelidad / $siguienteNivel->puntos_minimos) * 100)
                : 100,
        ]);
    }

    /**
     * Historial de transacciones de puntos paginado
     */
    public function historial(Request $request)
    {
        $usuario = $request->user();
        $tipo = $request->get('tipo'); // ganado, canjeado, ajuste

        $query = HistorialPunto::where('usuario_id', $usuario->id);

        if ($tipo) {
            $query->where('tipo', $tipo);
        }

        $historial = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($historial);
    }

    /**
     * Obtener todos los niveles disponibles (público)
     */
    public function niveles()
    {
        $niveles = NivelUsuario::orderBy('orden', 'asc')->get();
        return response()->json($niveles);
    }

    /**
     * Otorgar puntos manualmente (solo admin)
     */
    public function otorgarPuntos(Request $request)
    {
        if ($request->user()->rol !== 'admin') {
            return response()->json(['message' => 'Acceso denegado.'], 403);
        }

        $request->validate([
            'usuario_id' => 'required|exists:usuarios,id',
            'puntos' => 'required|integer',
            'concepto' => 'required|string|max:255',
        ]);

        $usuario = \App\Models\Usuario::findOrFail($request->usuario_id);

        if ($request->puntos > 0) {
            $usuario->agregarPuntos($request->puntos, $request->concepto, 'ajuste', null);
        } else {
            $usuario->restarPuntos(abs($request->puntos), $request->concepto, 'ajuste', null);
        }

        return response()->json([
            'message' => 'Puntos otorgados exitosamente.',
            'usuario' => [
                'id' => $usuario->id,
                'nombre' => $usuario->nombre,
                'puntos_fidelidad' => $usuario->puntos_fidelidad,
                'nivel_usuario' => $usuario->nivel_usuario,
            ],
        ]);
    }
}
