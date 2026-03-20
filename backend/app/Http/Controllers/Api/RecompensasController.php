<?php

namespace App\Http\Controllers\Api;

use App\Models\Recompensa;
use App\Models\CanjeRecompensa;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RecompensasController extends Controller
{
    /**
     * Catálogo de recompensas activas
     */
    public function index(Request $request)
    {
        $query = Recompensa::where('activo', true);

        // Filtro opcional por puntos del usuario (si está autenticado)
        if ($request->user()) {
            $puntosUsuario = $request->user()->puntos_fidelidad;
            $filtro = $request->get('filtro'); // disponibles, todas

            if ($filtro === 'disponibles') {
                $query->where('puntos_necesarios', '<=', $puntosUsuario);
            }
        }

        $tipo = $request->get('tipo'); // descuento, regalo, experiencia
        if ($tipo) {
            $query->where('tipo', $tipo);
        }

        $recompensas = $query->orderBy('puntos_necesarios', 'asc')->get();

        return response()->json($recompensas);
    }

    /**
     * Canjear recompensa
     */
    public function canjear(Request $request, $id)
    {
        $usuario = $request->user();
        $recompensa = Recompensa::findOrFail($id);

        // Validar que la recompensa esté activa
        if (!$recompensa->activo) {
            return response()->json(['message' => 'Esta recompensa no está disponible.'], 400);
        }

        // Validar que el usuario tenga suficientes puntos
        if ($usuario->puntos_fidelidad < $recompensa->puntos_necesarios) {
            return response()->json([
                'message' => 'No tienes suficientes puntos para canjear esta recompensa.',
                'puntos_actuales' => $usuario->puntos_fidelidad,
                'puntos_necesarios' => $recompensa->puntos_necesarios,
            ], 400);
        }

        // Validar stock
        if (!$recompensa->verificarStock()) {
            return response()->json(['message' => 'Recompensa agotada.'], 400);
        }

        // Crear canje
        $canje = CanjeRecompensa::create([
            'usuario_id' => $usuario->id,
            'recompensa_id' => $recompensa->id,
            'puntos_gastados' => $recompensa->puntos_necesarios,
            'estado' => 'pendiente',
            'codigo_canje' => CanjeRecompensa::generarCodigoCanje(),
            'fecha_canje' => now(),
        ]);

        // Restar puntos al usuario
        $usuario->restarPuntos(
            $recompensa->puntos_necesarios,
            "Canjeado: {$recompensa->titulo}",
            'recompensa',
            $canje->id
        );

        // Decrementar stock
        $recompensa->decrementarStock();

        return response()->json([
            'message' => '¡Recompensa canjeada exitosamente!',
            'canje' => $canje->fresh(['recompensa']),
            'puntos_restantes' => $usuario->puntos_fidelidad,
        ]);
    }

    /**
     * Historial de canjes del usuario
     */
    public function misCanjes(Request $request)
    {
        $usuario = $request->user();

        $canjes = CanjeRecompensa::with('recompensa')
            ->where('usuario_id', $usuario->id)
            ->orderBy('fecha_canje', 'desc')
            ->paginate(10);

        return response()->json($canjes);
    }

    /**
     * Marcar canje como entregado (solo admin)
     */
    public function marcarEntregado(Request $request, $id)
    {
        if ($request->user()->rol !== 'admin') {
            return response()->json(['message' => 'Acceso denegado.'], 403);
        }

        $canje = CanjeRecompensa::with(['usuario', 'recompensa'])->findOrFail($id);
        $canje->estado = 'entregado';
        $canje->fecha_entrega = now();
        $canje->save();

        return response()->json([
            'message' => 'Canje marcado como entregado.',
            'canje' => $canje,
        ]);
    }
}
