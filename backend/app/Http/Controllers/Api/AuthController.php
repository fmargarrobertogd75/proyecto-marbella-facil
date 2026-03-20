<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Models\Auditoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $usuario = Usuario::where('email', $request->email)->first();

        if (!$usuario || !Hash::check($request->password, $usuario->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales no son correctas.'],
            ]);
        }

        if (!$usuario->activo) {
            return response()->json(['message' => 'Cuenta suspendida.'], 403);
        }

        // Auditoría
        Auditoria::create([
            'usuario_id' => $usuario->id,
            'accion'     => "Login: {$usuario->email}",
            'ip_origen'  => $request->ip(),
        ]);

        $token = $usuario->createToken('api-token')->plainTextToken;

        return response()->json([
            'token'   => $token,
            'usuario' => [
                'id'               => $usuario->id,
                'nombre'           => $usuario->nombre,
                'email'            => $usuario->email,
                'rol'              => $usuario->rol,
                'avatar_url'       => $usuario->avatar_url,
                'puntos_fidelidad' => $usuario->puntos_fidelidad,
                'nivel_usuario'    => $usuario->nivel_usuario,
            ],
        ]);
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'nombre'           => 'required|string|max:100',
            'email'            => 'required|email|unique:usuarios,email',
            'password'         => 'required|string|min:6',
            'acepta_terminos'  => 'required|accepted',
            'marketing_consent'=> 'boolean',
        ]);

        $usuario = Usuario::create([
            'nombre'            => $data['nombre'],
            'email'             => $data['email'],
            'password'          => Hash::make($data['password']),
            'rol'               => 'usuario',
            'acepta_terminos'   => true,
            'marketing_consent' => $data['marketing_consent'] ?? false,
        ]);

        $token = $usuario->createToken('api-token')->plainTextToken;

        return response()->json(['token' => $token, 'usuario' => $usuario], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada correctamente.']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
