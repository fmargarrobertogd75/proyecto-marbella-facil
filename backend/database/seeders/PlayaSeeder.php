<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Playa;

class PlayaSeeder extends Seeder
{
    public function run(): void
    {
        $playas = [
            ['nombre' => 'Playa de Nagüeles',     'municipio' => 'Marbella', 'bandera' => 'Verde',    'estado_mar' => 'Calma',   'ocupacion' => 'Media',    'temperatura_agua' => 22.5, 'latitud' => 36.502000, 'longitud' => -4.928500],
            ['nombre' => 'Playa de la Fontanilla', 'municipio' => 'Marbella', 'bandera' => 'Verde',    'estado_mar' => 'Calma',   'ocupacion' => 'Alta',     'temperatura_agua' => 22.0, 'latitud' => 36.508550, 'longitud' => -4.883900],
            ['nombre' => 'Playa del Cable',        'municipio' => 'Marbella', 'bandera' => 'Amarilla', 'estado_mar' => 'Rizado',  'ocupacion' => 'Alta',     'temperatura_agua' => 21.5, 'latitud' => 36.505800, 'longitud' => -4.878000],
            ['nombre' => 'Dunas de Artola',        'municipio' => 'Cabopino', 'bandera' => 'Verde',    'estado_mar' => 'Calma',   'ocupacion' => 'Baja',     'temperatura_agua' => 21.0, 'latitud' => 36.487200, 'longitud' => -4.761700],
            ['nombre' => 'Venus Beach',            'municipio' => 'Marbella', 'bandera' => 'Amarilla', 'estado_mar' => 'Rizado',  'ocupacion' => 'Completo', 'temperatura_agua' => 22.5, 'latitud' => 36.488900, 'longitud' => -4.960500],
            ['nombre' => 'Playa de Casablanca',    'municipio' => 'Marbella', 'bandera' => 'Verde',    'estado_mar' => 'Calma',   'ocupacion' => 'Baja',     'temperatura_agua' => 20.0, 'latitud' => 36.491300, 'longitud' => -4.972100],
            ['nombre' => 'Playa de San Pedro',     'municipio' => 'San Pedro','bandera' => 'Verde',    'estado_mar' => 'Calma',   'ocupacion' => 'Media',    'temperatura_agua' => 21.5, 'latitud' => 36.492400, 'longitud' => -4.989800],
        ];

        foreach ($playas as $p) {
            Playa::create($p);
        }
    }
}
