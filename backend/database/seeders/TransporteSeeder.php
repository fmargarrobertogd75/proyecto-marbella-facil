<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TransporteLinea;
use App\Models\TransporteParada;

class TransporteSeeder extends Seeder
{
    public function run(): void
    {
        $lineas = [
            [
                'nombre'             => 'L1: Centro - Puerto Banús',
                'tipo'               => 'Bus Urbano',
                'horario_inicio'     => '07:00:00',
                'horario_fin'        => '23:00:00',
                'frecuencia_minutos' => 15,
                'precio_billete'     => 1.20,
                'color_hex'          => '#007bff',
                'paradas' => [
                    ['nombre_parada' => 'Estación de Autobuses Marbella', 'latitud' => 36.5080, 'longitud' => -4.8800, 'orden' => 1],
                    ['nombre_parada' => 'Av. Ricardo Soriano (Centro)',    'latitud' => 36.5098, 'longitud' => -4.8860, 'orden' => 2],
                    ['nombre_parada' => 'Marbella Club',                   'latitud' => 36.5151, 'longitud' => -4.9362, 'orden' => 3],
                    ['nombre_parada' => 'Hotel Puente Romano',             'latitud' => 36.5097, 'longitud' => -4.9244, 'orden' => 4],
                    ['nombre_parada' => 'Puerto Banús (Entrada)',          'latitud' => 36.4888, 'longitud' => -4.9586, 'orden' => 5],
                ],
            ],
            [
                'nombre'             => 'L2: Centro - Elviria',
                'tipo'               => 'Bus Urbano',
                'horario_inicio'     => '08:00:00',
                'horario_fin'        => '22:00:00',
                'frecuencia_minutos' => 30,
                'precio_billete'     => 1.20,
                'color_hex'          => '#28a745',
                'paradas' => [
                    ['nombre_parada' => 'Av. Ricardo Soriano (Centro)',          'latitud' => 36.5098, 'longitud' => -4.8860, 'orden' => 1],
                    ['nombre_parada' => 'Av. del Mar',                            'latitud' => 36.5103, 'longitud' => -4.8780, 'orden' => 2],
                    ['nombre_parada' => 'Rotonda Las Chapas',                     'latitud' => 36.4970, 'longitud' => -4.8100, 'orden' => 3],
                    ['nombre_parada' => 'Elviria Centro Comercial',              'latitud' => 36.4920, 'longitud' => -4.7900, 'orden' => 4],
                ],
            ],
            [
                'nombre'             => 'Bus Turístico: Marbella City Tour',
                'tipo'               => 'Bus Turístico',
                'horario_inicio'     => '10:00:00',
                'horario_fin'        => '19:00:00',
                'frecuencia_minutos' => 60,
                'precio_billete'     => 18.00,
                'color_hex'          => '#dc3545',
                'paradas' => [
                    ['nombre_parada' => 'Plaza de los Naranjos',   'latitud' => 36.5103, 'longitud' => -4.8861, 'orden' => 1],
                    ['nombre_parada' => 'Paseo Marítimo',           'latitud' => 36.5088, 'longitud' => -4.8853, 'orden' => 2],
                    ['nombre_parada' => 'Marbella Club Hotel',      'latitud' => 36.5151, 'longitud' => -4.9362, 'orden' => 3],
                    ['nombre_parada' => 'Puerto Banús',             'latitud' => 36.4888, 'longitud' => -4.9586, 'orden' => 4],
                ],
            ],
        ];

        foreach ($lineas as $lineaData) {
            $paradas = $lineaData['paradas'];
            unset($lineaData['paradas']);

            $linea = TransporteLinea::create($lineaData);
            foreach ($paradas as $p) {
                $linea->paradas()->create($p);
            }
        }
    }
}
