<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Playa;
use Illuminate\Http\Request;

class PlayaController extends Controller
{
    public function index()
    {
        return response()->json(Playa::orderBy('nombre')->get());
    }

    public function show($id)
    {
        return response()->json(Playa::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $playa = Playa::findOrFail($id);

        $data = $request->validate([
            'bandera'          => 'in:Verde,Amarilla,Roja,Negra,Medusas',
            'estado_mar'       => 'in:Calma,Rizado,Marejada,Fuerte Marejada',
            'ocupacion'        => 'in:Baja,Media,Alta,Completo',
            'temperatura_agua' => 'numeric|between:0,40',
        ]);

        $playa->update($data);
        return response()->json($playa);
    }
}
