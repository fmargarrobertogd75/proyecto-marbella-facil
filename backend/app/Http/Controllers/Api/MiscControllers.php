<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use App\Models\Caracteristica;
use App\Models\Plan;
use App\Models\Evento;
use App\Models\Noticia;
use App\Models\Notificacion;
use App\Models\MensajeContacto;
use App\Models\CampanaBanner;
use Illuminate\Http\Request;

// Categorías
class CategoriaController extends Controller {
    public function index() {
        return response()->json(Categoria::withCount('negocios')->get());
    }
}

// Características
class CaracteristicaController extends Controller {
    public function index() {
        return response()->json(Caracteristica::all());
    }
}

// Planes
class PlanController extends Controller {
    public function index() {
        return response()->json(Plan::where('activo', true)->orderBy('nivel_prioridad')->get());
    }
}

// Eventos
class EventoController extends Controller {
    public function index(Request $request) {
        $query = Evento::with('negocio:id,nombre')->orderBy('fecha_inicio');
        if ($request->filled('proximos')) {
            $query->where('fecha_inicio', '>=', now());
        }
        return response()->json($query->get());
    }
}

// Noticias
class NoticiaController extends Controller {
    public function index() {
        return response()->json(
            Noticia::with('autor:id,nombre')->orderBy('fecha_publicacion', 'desc')->get()
        );
    }
}

// Notificaciones (auth requerido)
class NotificacionController extends Controller {
    public function index(Request $request) {
        return response()->json(
            Notificacion::where('usuario_id', $request->user()->id)
                ->orderBy('fecha_envio', 'desc')->get()
        );
    }
    public function marcarLeida(Request $request, $id) {
        $noti = Notificacion::where('id', $id)->where('usuario_id', $request->user()->id)->firstOrFail();
        $noti->update(['leido' => true]);
        return response()->json($noti);
    }
    public function marcarTodasLeidas(Request $request) {
        Notificacion::where('usuario_id', $request->user()->id)->update(['leido' => true]);
        return response()->json(['message' => 'Todas marcadas como leídas.']);
    }
}

// Mensajes de contacto
class MensajeContactoController extends Controller {
    public function store(Request $request) {
        $data = $request->validate([
            'negocio_id' => 'nullable|exists:negocios,id',
            'nombre'     => 'required|string|max:100',
            'email'      => 'required|email',
            'asunto'     => 'nullable|string|max:150',
            'mensaje'    => 'required|string|max:2000',
        ]);

        // Mapear campos del frontend a columnas de la BD
        $mensajeTexto = $data['asunto']
            ? "[{$data['asunto']}] {$data['mensaje']}"
            : $data['mensaje'];

        $msg = MensajeContacto::create([
            'negocio_id'       => $data['negocio_id'] ?? 1, // Negocio genérico si no se especifica
            'nombre_remitente' => $data['nombre'],
            'email_remitente'  => $data['email'],
            'mensaje'          => $mensajeTexto,
        ]);
        return response()->json(['message' => 'Mensaje enviado correctamente.', 'id' => $msg->id], 201);
    }
}

// Banners publicitarios
class CampanaBannerController extends Controller {
    public function getActivo($slug) {
        $banner = CampanaBanner::whereHas('espacio', fn($q) => $q->where('slug', $slug))
            ->where('activo', true)
            ->where('fecha_inicio', '<=', now())
            ->where('fecha_fin', '>=', now())
            ->inRandomOrder()->first();

        if ($banner) {
            $banner->increment('impresiones_actuales');
        }
        return response()->json($banner);
    }

    public function registrarClick($id) {
        $banner = CampanaBanner::findOrFail($id);
        $banner->increment('clicks_actuales');
        return response()->json(['redirect' => $banner->link_destino]);
    }
}

// Favoritos
class FavoritoController extends Controller {
    public function index(Request $request) {
        return response()->json($request->user()->favoritos()->with(['categoria','plan'])->get());
    }
    public function toggle(Request $request, $negocio_id) {
        $user = $request->user();
        $existe = $user->favoritos()->where('negocio_id', $negocio_id)->exists();
        if ($existe) {
            $user->favoritos()->detach($negocio_id);
            return response()->json(['favorito' => false]);
        } else {
            $user->favoritos()->attach($negocio_id, ['fecha_guardado' => now()]);
            return response()->json(['favorito' => true]);
        }
    }
}
