<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Negocio;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NegocioController extends Controller
{
    public function index(Request $request)
    {
        $query = Negocio::with(['categoria', 'plan', 'caracteristicas', 'resenas'])
            ->aprobado();

        // Filtros
        if ($request->filled('categoria')) {
            $query->whereHas('categoria', fn($q) => $q->where('slug', $request->categoria));
        }
        if ($request->filled('categoria_id')) {
            $query->where('categoria_id', $request->categoria_id);
        }
        if ($request->filled('precio')) {
            $query->where('precio_medio', $request->precio);
        }
        if ($request->filled('q')) {
            $query->where('nombre', 'like', '%' . $request->q . '%');
        }
        if ($request->filled('destacado')) {
            $query->where('destacado', true);
        }
        if ($request->filled('caracteristica')) {
            $query->whereHas('caracteristicas', fn($q) => $q->where('id', $request->caracteristica));
        }

        // Ordenar por plan (prioridad)
        $query->join('planes', 'negocios.plan_id', '=', 'planes.id')
              ->orderBy('planes.nivel_prioridad', 'desc')
              ->orderBy('negocios.nombre', 'asc')
              ->select('negocios.*');

        $negocios = $query->paginate($request->get('per_page', 12));

        // Añadir puntuación media
        $negocios->through(function ($neg) {
            $neg->puntuacion_media = round($neg->resenas->where('validado', true)->avg('puntuacion'), 1);
            $neg->total_resenas    = $neg->resenas->where('validado', true)->count();
            return $neg;
        });

        return response()->json($negocios);
    }

    public function show($id)
    {
        $negocio = Negocio::with([
            'categoria', 'plan', 'caracteristicas',
            'horarios', 'imagenes', 'redesSociales',
            'resenas.usuario', 'ofertas', 'eventos',
        ])->findOrFail($id);

        $negocio->puntuacion_media = round($negocio->resenas->where('validado', true)->avg('puntuacion'), 1);
        $negocio->total_resenas    = $negocio->resenas->where('validado', true)->count();

        return response()->json($negocio);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'categoria_id'   => 'required|exists:categorias,id',
            'nombre'         => 'required|string|max:100',
            'descripcion_es' => 'required|string',
            'descripcion_en' => 'nullable|string',
            'direccion'      => 'nullable|string',
            'telefono'       => 'nullable|string',
            'email_contacto' => 'nullable|email',
            'web'            => 'nullable|url',
            'precio_medio'   => 'nullable|in:€,€€,€€€,€€€€',
        ]);

        $data['usuario_id'] = $request->user()->id;
        $data['plan_id']    = 1; // Básico por defecto
        $data['slug']       = Str::slug($data['nombre']) . '-' . Str::random(4);
        $data['estado']     = 'pendiente';

        $negocio = Negocio::create($data);
        return response()->json($negocio, 201);
    }

    public function update(Request $request, $id)
    {
        $negocio = Negocio::findOrFail($id);

        // Solo el dueño o admin puede editar
        $user = $request->user();
        if ($negocio->usuario_id !== $user->id && $user->rol !== 'admin') {
            return response()->json(['message' => 'Sin permisos.'], 403);
        }

        $data = $request->validate([
            'nombre'         => 'sometimes|string|max:100',
            'descripcion_es' => 'sometimes|string',
            'descripcion_en' => 'nullable|string',
            'direccion'      => 'nullable|string',
            'telefono'       => 'nullable|string',
            'email_contacto' => 'nullable|email',
            'web'            => 'nullable|url',
            'precio_medio'   => 'nullable|in:€,€€,€€€,€€€€',
        ]);

        $negocio->update($data);
        return response()->json($negocio);
    }

    public function destroy(Request $request, $id)
    {
        $negocio = Negocio::findOrFail($id);
        $user    = $request->user();

        if ($negocio->usuario_id !== $user->id && $user->rol !== 'admin') {
            return response()->json(['message' => 'Sin permisos.'], 403);
        }

        $negocio->delete();
        return response()->json(['message' => 'Negocio eliminado.']);
    }
}
