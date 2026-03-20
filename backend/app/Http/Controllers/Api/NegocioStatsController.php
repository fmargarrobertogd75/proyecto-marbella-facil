<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class NegocioStatsController extends Controller
{
    /**
     * Dashboard de estadísticas del negocio
     */
    public function dashboard(Request $request)
    {
        $usuario = $request->user();

        if ($usuario->rol !== 'empresa') {
            return response()->json(['message' => 'Acceso denegado. Solo para empresas.'], 403);
        }

        $negocio = $usuario->negocios()->first();
        if (!$negocio) {
            return response()->json(['message' => 'No tienes un negocio registrado.'], 404);
        }

        // Estadísticas del mes actual
        $inicioMes = Carbon::now()->startOfMonth();
        $finMes = Carbon::now()->endOfMonth();

        $reservasEsteMes = $negocio->reservas()
            ->whereBetween('fecha_reserva', [$inicioMes, $finMes])
            ->count();

        $reservasConfirmadas = $negocio->reservas()
            ->whereBetween('fecha_reserva', [$inicioMes, $finMes])
            ->where('estado', 'confirmada')
            ->count();

        $reservasPendientes = $negocio->reservas()
            ->where('estado', 'pendiente')
            ->count();

        // Rating promedio
        $ratingPromedio = $negocio->resenas()
            ->where('validado', true)
            ->avg('puntuacion');

        $totalResenas = $negocio->resenas()
            ->where('validado', true)
            ->count();

        // Tasa de ocupación (simplificada)
        $tasaOcupacion = $reservasEsteMes > 0 ? round(($reservasConfirmadas / $reservasEsteMes) * 100, 1) : 0;

        return response()->json([
            'negocio' => [
                'id' => $negocio->id,
                'nombre' => $negocio->nombre,
                'plan' => $negocio->plan->nombre ?? 'Sin plan',
            ],
            'estadisticas' => [
                'reservas_este_mes' => $reservasEsteMes,
                'reservas_confirmadas' => $reservasConfirmadas,
                'reservas_pendientes' => $reservasPendientes,
                'tasa_ocupacion' => $tasaOcupacion,
                'rating_promedio' => $ratingPromedio ? round($ratingPromedio, 1) : 0,
                'total_resenas' => $totalResenas,
            ]
        ]);
    }
}
