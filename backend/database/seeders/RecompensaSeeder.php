<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Recompensa;

class RecompensaSeeder extends Seeder
{
    public function run(): void
    {
        $recompensas = [
            [
                'titulo' => 'Descuento 10% en tu próxima reserva',
                'descripcion' => 'Canjea este cupón y obtén un 10% de descuento en cualquier reserva de restaurante.',
                'puntos_necesarios' => 100,
                'tipo' => 'descuento',
                'valor' => '10%',
                'stock' => null,
                'imagen_url' => 'reward_discount_10.png',
                'activo' => true,
            ],
            [
                'titulo' => 'Descuento 20% en tu próxima reserva',
                'descripcion' => 'Canjea este cupón y obtén un 20% de descuento en cualquier reserva de restaurante.',
                'puntos_necesarios' => 200,
                'tipo' => 'descuento',
                'valor' => '20%',
                'stock' => null,
                'imagen_url' => 'reward_discount_20.png',
                'activo' => true,
            ],
            [
                'titulo' => 'Copa de bienvenida gratis',
                'descripcion' => 'Disfruta de una copa de bienvenida cortesía en negocios seleccionados.',
                'puntos_necesarios' => 150,
                'tipo' => 'regalo',
                'valor' => 'Copa gratis',
                'stock' => 50,
                'imagen_url' => 'reward_drink.png',
                'activo' => true,
            ],
            [
                'titulo' => 'Tour guiado por el puerto de Marbella',
                'descripcion' => 'Experiencia exclusiva: tour guiado de 2 horas por el Puerto Banús y casco antiguo.',
                'puntos_necesarios' => 500,
                'tipo' => 'experiencia',
                'valor' => 'Tour 2h',
                'stock' => 10,
                'imagen_url' => 'reward_tour.png',
                'activo' => true,
            ],
            [
                'titulo' => 'Cena romántica VIP',
                'descripcion' => 'Cena especial para 2 personas en restaurantes premium con vista al mar.',
                'puntos_necesarios' => 1000,
                'tipo' => 'experiencia',
                'valor' => 'Cena 2 pax',
                'stock' => 5,
                'imagen_url' => 'reward_dinner.png',
                'activo' => true,
            ],
            [
                'titulo' => 'Acceso VIP a evento exclusivo',
                'descripcion' => 'Entrada VIP a eventos culturales y gastronómicos de Marbella.',
                'puntos_necesarios' => 750,
                'tipo' => 'experiencia',
                'valor' => 'Entrada VIP',
                'stock' => 20,
                'imagen_url' => 'reward_event.png',
                'activo' => true,
            ],
            [
                'titulo' => 'Descuento 5% en cualquier negocio',
                'descripcion' => 'Cupón de descuento del 5% aplicable en cualquier negocio de la plataforma.',
                'puntos_necesarios' => 50,
                'tipo' => 'descuento',
                'valor' => '5%',
                'stock' => null,
                'imagen_url' => 'reward_discount_5.png',
                'activo' => true,
            ],
        ];

        foreach ($recompensas as $recompensa) {
            Recompensa::create($recompensa);
        }

        $this->command->info('Recompensas creadas: ' . count($recompensas));
    }
}
