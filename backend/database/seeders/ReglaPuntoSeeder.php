<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ReglaPunto;

class ReglaPuntoSeeder extends Seeder
{
    public function run(): void
    {
        $reglas = [
            [
                'accion' => 'registro',
                'puntos' => 25,
                'descripcion' => 'Puntos de bienvenida por registrarte en Marbella Fácil',
                'activo' => true,
            ],
            [
                'accion' => 'resena_creada',
                'puntos' => 10,
                'descripcion' => 'Puntos por escribir una reseña de un negocio',
                'activo' => true,
            ],
            [
                'accion' => 'reserva_completada',
                'puntos' => 50,
                'descripcion' => 'Puntos por completar una reserva en un negocio',
                'activo' => true,
            ],
            [
                'accion' => 'check_in',
                'puntos' => 5,
                'descripcion' => 'Puntos por hacer check-in en un negocio',
                'activo' => true,
            ],
        ];

        foreach ($reglas as $regla) {
            ReglaPunto::create($regla);
        }

        $this->command->info('Reglas de puntos creadas: ' . count($reglas));
    }
}
