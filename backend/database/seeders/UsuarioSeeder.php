<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;

class UsuarioSeeder extends Seeder
{
    public function run(): void
    {
        $usuarios = [
            [
                'nombre'              => 'Admin',
                'email'               => 'admin@marbella.com',
                'password'            => Hash::make('1234'),
                'rol'                 => 'admin',
                'avatar_url'          => 'default_avatar.png',
                'puntos_fidelidad'    => 0,
                'nivel_usuario'       => 'Administrador',
                'acepta_terminos'     => true,
                'marketing_consent'   => false,
                'activo'              => true,
            ],
            [
                'nombre'              => 'Turista Pepe',
                'email'               => 'pepe@mail.com',
                'password'            => Hash::make('1234'),
                'rol'                 => 'usuario',
                'avatar_url'          => 'default_avatar.png',
                'puntos_fidelidad'    => 150,
                'nivel_usuario'       => 'Turista Novato',
                'acepta_terminos'     => true,
                'marketing_consent'   => false,
                'activo'              => true,
            ],
            [
                'nombre'              => 'Dueño BiBo',
                'email'               => 'bibo@danigarcia.com',
                'password'            => Hash::make('1234'),
                'rol'                 => 'empresa',
                'avatar_url'          => 'default_avatar.png',
                'puntos_fidelidad'    => 0,
                'nivel_usuario'       => 'Turista Novato',
                'acepta_terminos'     => true,
                'marketing_consent'   => false,
                'activo'              => true,
            ],
            [
                'nombre'              => 'María García',
                'email'               => 'maria@empresa.com',
                'password'            => Hash::make('1234'),
                'rol'                 => 'empresa',
                'avatar_url'          => 'default_avatar.png',
                'puntos_fidelidad'    => 0,
                'nivel_usuario'       => 'Turista Novato',
                'acepta_terminos'     => true,
                'marketing_consent'   => true,
                'activo'              => true,
            ],
            [
                'nombre'              => 'Carlos Martínez',
                'email'               => 'carlos@mail.com',
                'password'            => Hash::make('1234'),
                'rol'                 => 'usuario',
                'avatar_url'          => 'default_avatar.png',
                'puntos_fidelidad'    => 320,
                'nivel_usuario'       => 'Explorador',
                'acepta_terminos'     => true,
                'marketing_consent'   => true,
                'activo'              => true,
            ],
        ];

        foreach ($usuarios as $u) {
            Usuario::firstOrCreate(['email' => $u['email']], $u);
        }
    }
}
