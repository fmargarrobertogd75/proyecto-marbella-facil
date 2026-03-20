<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resena;
use App\Models\Usuario;
use Illuminate\Http\Request;

class ResenaController extends Controller
{
    public function index($negocio_id)
    {
        $resenas = Resena::with('usuario:id,nombre,avatar_url')
            ->where('negocio_id', $negocio_id)
            ->where('validado', true)
            ->orderBy('fecha', 'desc')
            ->get();

        return response()->json($resenas);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'negocio_id'  => 'required|exists:negocios,id',
            'puntuacion'  => 'required|integer|between:1,5',
            'comentario'  => 'nullable|string|max:1000',
        ]);

        $data['usuario_id'] = $request->user()->id;

        // Evitar duplicados
        $existe = Resena::where('usuario_id', $data['usuario_id'])
            ->where('negocio_id', $data['negocio_id'])
            ->first();

        if ($existe) {
            return response()->json(['message' => 'Ya has reseñado este negocio.'], 409);
        }

        $resena = Resena::create($data);

        // Gamificación: sumar puntos al usuario
        $request->user()->increment('puntos_fidelidad', 10);
        $this->actualizarNivel($request->user());

        return response()->json($resena->load('usuario:id,nombre,avatar_url'), 201);
    }

    private function actualizarNivel(Usuario $usuario): void
    {
        $puntos = $usuario->puntos_fidelidad;
        $nivel  = match(true) {
            $puntos >= 1000 => 'Embajador Marbella',
            $puntos >= 500  => 'Explorador Experto',
            $puntos >= 200  => 'Explorador',
            $puntos >= 50   => 'Viajero',
            default         => 'Turista Novato',
        };
        $usuario->update(['nivel_usuario' => $nivel]);
    }
}
