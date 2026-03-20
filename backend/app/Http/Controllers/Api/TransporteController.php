<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TransporteLinea;

class TransporteController extends Controller
{
    public function lineas()
    {
        return response()->json(TransporteLinea::with('paradas')->get());
    }

    public function paradas($linea_id)
    {
        $linea = TransporteLinea::with('paradas')->findOrFail($linea_id);
        return response()->json($linea->paradas);
    }
}
