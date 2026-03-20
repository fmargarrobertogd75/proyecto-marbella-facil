<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\NivelUsuario;

class NivelUsuarioSeeder extends Seeder
{
    public function run(): void
    {
        $niveles = [
            [
                'nombre' => 'Turista Novato',
                'puntos_minimos' => 0,
                'puntos_maximos' => 49,
                'icono' => '🏖️',
                'descripcion_beneficios' => 'Bienvenido a Marbella Fácil. Comienza a explorar y gana puntos.',
                'orden' => 1,
            ],
            [
                'nombre' => 'Viajero',
                'puntos_minimos' => 50,
                'puntos_maximos' => 199,
                'icono' => '✈️',
                'descripcion_beneficios' => 'Acceso a ofertas especiales y descuentos del 5% en recompensas.',
                'orden' => 2,
            ],
            [
                'nombre' => 'Explorador',
                'puntos_minimos' => 200,
                'puntos_maximos' => 499,
                'icono' => '🗺️',
                'descripcion_beneficios' => 'Descuentos del 10% en recompensas y prioridad en reservas.',
                'orden' => 3,
            ],
            [
                'nombre' => 'Explorador Experto',
                'puntos_minimos' => 500,
                'puntos_maximos' => 999,
                'icono' => '🌟',
                'descripcion_beneficios' => 'Descuentos del 15% en recompensas, acceso anticipado a eventos.',
                'orden' => 4,
            ],
            [
                'nombre' => 'Embajador Marbella',
                'puntos_minimos' => 1000,
                'puntos_maximos' => null,
                'icono' => '👑',
                'descripcion_beneficios' => 'Máximo nivel: 20% descuento en recompensas, experiencias VIP exclusivas.',
                'orden' => 5,
            ],
        ];

        foreach ($niveles as $nivel) {
            NivelUsuario::create($nivel);
        }

        $this->command->info('Niveles de usuario creados: ' . count($niveles));
    }
}
