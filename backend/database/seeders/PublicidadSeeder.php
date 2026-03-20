<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EspacioPublicitario;
use App\Models\CampanaBanner;

class PublicidadSeeder extends Seeder
{
    public function run(): void
    {
        $espacios = [
            EspacioPublicitario::create(['nombre' => 'Cabecera Principal', 'slug' => 'home_top',    'ancho_px' => 1200, 'alto_px' => 300, 'precio_diario' => 50.00]),
            EspacioPublicitario::create(['nombre' => 'Sidebar Derecho',    'slug' => 'sidebar',     'ancho_px' => 300,  'alto_px' => 250, 'precio_diario' => 25.00]),
            EspacioPublicitario::create(['nombre' => 'Footer Banner',      'slug' => 'footer_main', 'ancho_px' => 1200, 'alto_px' => 90,  'precio_diario' => 20.00]),
        ];

        CampanaBanner::create([
            'espacio_id'           => $espacios[0]->id,
            'negocio_id'           => 1, // BiBo Marbella
            'titulo'               => 'Verano en BiBo',
            'imagen_url'           => 'banner_bibo.jpg',
            'link_destino'         => 'https://bibo.com',
            'fecha_inicio'         => '2025-06-01 00:00:00',
            'fecha_fin'            => '2025-09-01 00:00:00',
            'clicks_actuales'      => 0,
            'impresiones_actuales' => 0,
            'activo'               => true,
        ]);
    }
}
