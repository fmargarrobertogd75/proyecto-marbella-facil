<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Caracteristica;

class CaracteristicaSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['nombre_es' => 'WiFi Gratis',          'nombre_en' => 'Free WiFi',         'icono' => 'fa-wifi'],
            ['nombre_es' => 'Terraza',               'nombre_en' => 'Terrace',            'icono' => 'fa-sun'],
            ['nombre_es' => 'Parking',               'nombre_en' => 'Parking',            'icono' => 'fa-car'],
            ['nombre_es' => 'Aire Acondicionado',    'nombre_en' => 'Air Conditioning',   'icono' => 'fa-wind'],
            ['nombre_es' => 'Accesible',             'nombre_en' => 'Accessible',         'icono' => 'fa-wheelchair'],
            ['nombre_es' => 'Apto Mascotas',         'nombre_en' => 'Pet Friendly',       'icono' => 'fa-paw'],
            ['nombre_es' => 'Vistas al Mar',         'nombre_en' => 'Sea Views',          'icono' => 'fa-water'],
            ['nombre_es' => 'Música en Vivo',        'nombre_en' => 'Live Music',         'icono' => 'fa-music'],
            ['nombre_es' => 'Carta Vegetariana',     'nombre_en' => 'Vegetarian Menu',    'icono' => 'fa-leaf'],
            ['nombre_es' => 'Reserva Online',        'nombre_en' => 'Online Booking',     'icono' => 'fa-calendar-check'],
        ];

        foreach ($items as $item) {
            Caracteristica::firstOrCreate(['nombre_es' => $item['nombre_es']], $item);
        }
    }
}
