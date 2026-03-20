<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Evento;

class EventoSeeder extends Seeder
{
    public function run(): void
    {
        $eventos = [
            [
                'negocio_id'    => null,
                'titulo_es'     => 'Starlite Festival Marbella 2026',
                'titulo_en'     => 'Starlite Festival Marbella 2026',
                'descripcion_es'=> 'El festival de música y arte más exclusivo del sur de Europa, celebrado en la cantera de Nagüeles.',
                'descripcion_en'=> 'The most exclusive music and art festival in southern Europe, held at the Nagüeles quarry.',
                'fecha_inicio'  => '2026-07-01 21:00:00',
                'fecha_fin'     => '2026-08-15 02:00:00',
                'ubicacion'     => 'Cantera de Nagüeles, Marbella',
                'precio'        => 85.00,
                'imagen_url'    => 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
            ],
            [
                'negocio_id'    => null,
                'titulo_es'     => 'Feria de San Bernabé 2026',
                'titulo_en'     => 'San Bernabé Fair 2026',
                'descripcion_es'=> 'La feria patronal de Marbella: 6 días de música, gastronomía y flamenco en el recinto ferial.',
                'descripcion_en'=> 'Marbella\'s patron fair: 6 days of music, gastronomy and flamenco at the fairgrounds.',
                'fecha_inicio'  => '2026-06-06 18:00:00',
                'fecha_fin'     => '2026-06-11 05:00:00',
                'ubicacion'     => 'Recinto Ferial de Marbella',
                'precio'        => 0.00,
                'imagen_url'    => 'https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=800&q=80',
            ],
            [
                'negocio_id'    => null,
                'titulo_es'     => 'Marbella Motor Festival 2026',
                'titulo_en'     => 'Marbella Motor Festival 2026',
                'descripcion_es'=> 'Exhibición de superdeportivos y coches de lujo en el Puerto Banús.',
                'descripcion_en'=> 'Exhibition of supercars and luxury cars at Puerto Banús.',
                'fecha_inicio'  => '2026-05-15 10:00:00',
                'fecha_fin'     => '2026-05-17 20:00:00',
                'ubicacion'     => 'Puerto Banús, Marbella',
                'precio'        => 15.00,
                'imagen_url'    => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
            ],
            [
                'negocio_id'    => null,
                'titulo_es'     => 'Open de Tenis Puente Romano',
                'titulo_en'     => 'Puente Romano Tennis Open',
                'descripcion_es'=> 'Torneo internacional de tenis en las famosas pistas del Hotel Puente Romano.',
                'descripcion_en'=> 'International tennis tournament on the famous courts of Hotel Puente Romano.',
                'fecha_inicio'  => '2026-04-20 10:00:00',
                'fecha_fin'     => '2026-04-26 20:00:00',
                'ubicacion'     => 'Hotel Puente Romano Tennis Club',
                'precio'        => 20.00,
                'imagen_url'    => 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80',
            ],
        ];

        foreach ($eventos as $e) {
            Evento::create($e);
        }
    }
}
