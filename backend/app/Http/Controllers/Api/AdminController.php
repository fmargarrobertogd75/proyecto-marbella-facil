<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Models\Auditoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    private function soloAdmin(Request $request)
    {
        if ($request->user()->rol !== 'admin') {
            abort(403, 'Acceso denegado: se requiere rol admin.');
        }
    }

    /**
     * GET /admin/usuarios?search=&page=&per_page=
     * Devuelve paginación con búsqueda por nombre/email/rol.
     */
    public function usuarios(Request $request)
    {
        $this->soloAdmin($request);

        $query = Usuario::orderBy('fecha_registro', 'desc');

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('rol', 'like', "%{$search}%");
            });
        }

        $perPage = (int) $request->get('per_page', 12);
        $result  = $query->paginate($perPage);

        return response()->json($result);
    }

    /**
     * POST /admin/usuarios — Crear usuario
     */
    public function crearUsuario(Request $request)
    {
        $this->soloAdmin($request);

        $data = $request->validate([
            'nombre'             => 'required|string|max:100',
            'email'              => 'required|email|unique:usuarios,email',
            'password'           => 'required|min:6',
            'rol'                => 'in:admin,usuario,empresa',
            'nivel_usuario'      => 'nullable|string|max:50',
            'puntos_fidelidad'   => 'nullable|integer|min:0',
            'acepta_terminos'    => 'nullable|boolean',
            'activo'             => 'nullable|boolean',
            'marketing_consent'  => 'nullable|boolean',
        ]);

        $usuario = Usuario::create([
            'nombre'            => $data['nombre'],
            'email'             => $data['email'],
            'password'          => Hash::make($data['password']),
            'rol'               => $data['rol'] ?? 'usuario',
            'nivel_usuario'     => $data['nivel_usuario'] ?? 'Turista Novato',
            'puntos_fidelidad'  => $data['puntos_fidelidad'] ?? 0,
            'acepta_terminos'   => $data['acepta_terminos'] ?? true,
            'activo'            => $data['activo'] ?? true,
            'marketing_consent' => $data['marketing_consent'] ?? false,
        ]);

        Auditoria::create([
            'usuario_id' => $request->user()->id,
            'accion'     => "Admin creó usuario: {$usuario->email}",
            'ip_origen'  => $request->ip(),
        ]);

        return response()->json($usuario, 201);
    }

    /**
     * PUT /admin/usuarios/{id} — Actualizar usuario
     */
    public function actualizarUsuario(Request $request, $id)
    {
        $this->soloAdmin($request);

        $usuario = Usuario::findOrFail($id);

        $data = $request->validate([
            'nombre'             => 'sometimes|required|string|max:100',
            'email'              => "sometimes|required|email|unique:usuarios,email,{$id}",
            'rol'                => 'sometimes|in:admin,usuario,empresa',
            'nivel_usuario'      => 'nullable|string|max:50',
            'puntos_fidelidad'   => 'nullable|integer|min:0',
            'acepta_terminos'    => 'nullable|boolean',
            'activo'             => 'nullable|boolean',
            'marketing_consent'  => 'nullable|boolean',
        ]);

        $usuario->update($data);

        Auditoria::create([
            'usuario_id' => $request->user()->id,
            'accion'     => "Admin actualizó usuario ID:{$id} ({$usuario->email})",
            'ip_origen'  => $request->ip(),
        ]);

        return response()->json($usuario);
    }

    /**
     * PUT /admin/usuarios/{id}/password — Cambiar contraseña
     */
    public function cambiarPassword(Request $request, $id)
    {
        $this->soloAdmin($request);

        $data    = $request->validate([
            'password'              => 'required|min:6',
            'password_confirmation' => 'nullable|same:password',
        ]);
        $usuario = Usuario::findOrFail($id);
        $usuario->update(['password' => Hash::make($data['password'])]);

        Auditoria::create([
            'usuario_id' => $request->user()->id,
            'accion'     => "Admin cambió contraseña de usuario ID: {$id}",
            'ip_origen'  => $request->ip(),
        ]);

        return response()->json(['message' => 'Contraseña actualizada correctamente.']);
    }

    /**
     * DELETE /admin/usuarios/{id} — Eliminar usuario
     */
    public function eliminarUsuario(Request $request, $id)
    {
        $this->soloAdmin($request);

        $usuario = Usuario::findOrFail($id);

        if ($usuario->id === $request->user()->id) {
            return response()->json(['message' => 'No puedes eliminarte a ti mismo.'], 400);
        }

        $nombre = $usuario->nombre;
        $usuario->delete();

        Auditoria::create([
            'usuario_id' => $request->user()->id,
            'accion'     => "Admin eliminó usuario: {$nombre} (ID:{$id})",
            'ip_origen'  => $request->ip(),
        ]);

        return response()->json(['message' => "Usuario \"{$nombre}\" eliminado."]);
    }

    /**
     * GET /admin/auditoria
     */
    public function auditoria(Request $request)
    {
        $this->soloAdmin($request);
        return response()->json(
            Auditoria::with('usuario:id,nombre,email')
                ->orderBy('fecha', 'desc')
                ->limit(200)
                ->get()
        );
    }

    /**
     * GET /admin/reportes
     */
    public function reportes(Request $request)
    {
        $this->soloAdmin($request);
        return response()->json(
            \App\Models\ReporteCalidad::with(['usuario:id,nombre', 'negocio:id,nombre'])
                ->orderBy('fecha_reporte', 'desc')
                ->get()
        );
    }

    /**
     * PUT /admin/negocios/{id}/estado
     */
    public function toggleNegocio(Request $request, $id)
    {
        $this->soloAdmin($request);
        $negocio = \App\Models\Negocio::findOrFail($id);
        $data    = $request->validate(['estado' => 'required|in:pendiente,aprobado,suspendido']);
        $negocio->update($data);

        Auditoria::create([
            'usuario_id' => $request->user()->id,
            'accion'     => "Admin cambió estado de negocio '{$negocio->nombre}' a: {$data['estado']}",
            'ip_origen'  => $request->ip(),
        ]);

        return response()->json($negocio);
    }
}
