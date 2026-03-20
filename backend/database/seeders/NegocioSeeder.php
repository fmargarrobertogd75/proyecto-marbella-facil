<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Negocio;

class NegocioSeeder extends Seeder
{
    public function run(): void
    {
        $negocios = [
            // --- Gastronomía (categoria_id=1) ---
            [
                'usuario_id'    => 3, // Dueño BiBo
                'categoria_id'  => 1,
                'plan_id'       => 3, // Premium Gold
                'nombre'        => 'BiBo Marbella',
                'slug'          => 'bibo-marbella',
                'descripcion_es'=> 'Brasserie andaluza del chef Dani García con cocina de autor y ambiente sofisticado en el Hotel Puente Romano.',
                'descripcion_en'=> 'Andalusian brasserie by chef Dani García, featuring signature cuisine and sophisticated atmosphere at Hotel Puente Romano.',
                'direccion'     => 'Hotel Puente Romano, Bulevar Príncipe Alfonso von Hohenlohe, s/n',
                'telefono'      => '+34 952 764 252',
                'email_contacto'=> 'bibo@puenteromano.com',
                'imagen_principal' => 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
                'precio_medio'  => '€€€',
                'latitud'       => 36.5097,
                'longitud'      => -4.9246,
                'destacado'     => true,
                'estado'        => 'aprobado',
            ],
            [
                'usuario_id'    => 1,
                'categoria_id'  => 1,
                'plan_id'       => 1,
                'nombre'        => 'La Meridiana',
                'slug'          => 'la-meridiana',
                'descripcion_es'=> 'Restaurante de alta cocina mediterránea con jardines de ensueño y una carta de vinos excepcional.',
                'descripcion_en'=> 'High-end Mediterranean restaurant with beautiful gardens and an exceptional wine list.',
                'direccion'     => 'Camino de la Cruz, s/n, Las Lomas del Marbella Club',
                'imagen_principal' => 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80',
                'precio_medio'  => '€€€',
                'latitud'       => 36.5140,
                'longitud'      => -4.9360,
                'destacado'     => false,
                'estado'        => 'aprobado',
            ],
            [
                'usuario_id'    => 1,
                'categoria_id'  => 1,
                'plan_id'       => 1,
                'nombre'        => 'Skina Marbella',
                'slug'          => 'skina-marbella',
                'descripcion_es'=> 'Cocina tradicional andaluza renovada. Dos estrellas Michelin en el corazón del Casco Antiguo.',
                'descripcion_en'=> 'Renewed traditional Andalusian cuisine. Two Michelin stars in the heart of the Old Town.',
                'direccion'     => 'Calle Aduar, 12, Casco Antiguo',
                'imagen_principal' => 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
                'precio_medio'  => '€€€€',
                'latitud'       => 36.5103,
                'longitud'      => -4.8861,
                'destacado'     => true,
                'estado'        => 'aprobado',
            ],
            [
                'usuario_id'    => 4,
                'categoria_id'  => 1,
                'plan_id'       => 2,
                'nombre'        => 'Nobu Marbella',
                'slug'          => 'nobu-marbella',
                'descripcion_es'=> 'El restaurante de Nobu Matsuhisa en el corazón de Puerto Banús. Cocina japonesa-peruana de lujo.',
                'descripcion_en'=> 'Nobu Matsuhisa\'s restaurant in the heart of Puerto Banús. Luxury Japanese-Peruvian cuisine.',
                'direccion'     => 'Hotel Puente Romano Marbella, Local 003',
                'imagen_principal' => 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80',
                'precio_medio'  => '€€€€',
                'latitud'       => 36.5092,
                'longitud'      => -4.9249,
                'destacado'     => false,
                'estado'        => 'aprobado',
            ],
            [
                'usuario_id'    => 4,
                'categoria_id'  => 1,
                'plan_id'       => 2,
                'nombre'        => 'El Lago',
                'slug'          => 'el-lago-marbella',
                'descripcion_es'=> 'Estrella Michelin en Elviria. Cocina creativa con productos de temporada en un entorno natural privilegiado.',
                'descripcion_en'=> 'Michelin star in Elviria. Creative cuisine with seasonal produce in a privileged natural setting.',
                'direccion'     => 'Urb. Greenlife, Elviria, Marbella',
                'imagen_principal' => 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
                'precio_medio'  => '€€€€',
                'latitud'       => 36.5012,
                'longitud'      => -4.8234,
                'destacado'     => true,
                'estado'        => 'aprobado',
            ],
            [
                'usuario_id'    => 1,
                'categoria_id'  => 1,
                'plan_id'       => 1,
                'nombre'        => 'La Taberna del Alabardero',
                'slug'          => 'La-Taberna-del-Alabardero',
                'descripcion_es'=> 'Taberna clásica española con tapas artesanales y ambiente tradicional en el centro de Marbella.',
                'descripcion_en'=> 'Classic Spanish tavern with artisan tapas in a traditional atmosphere in central Marbella.',
                'direccion'     => 'Calle Lobatas, 4, Centro',
                'imagen_principal' => 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
                'precio_medio'  => '€€',
                'latitud'       => 36.5098,
                'longitud'      => -4.8860,
                'destacado'     => false,
                'estado'        => 'aprobado',
            ],
            // --- Hoteles (categoria_id=2) ---
            [
                'usuario_id'    => 4,
                'categoria_id'  => 2,
                'plan_id'       => 3,
                'nombre'        => 'Marbella Club Hotel',
                'slug'          => 'marbella-club-hotel',
                'descripcion_es'=> 'El hotel más emblemático de Marbella, fundado en 1954. Lujo, elegancia y la Milla de Oro a sus pies.',
                'descripcion_en'=> 'Marbella\'s most iconic hotel, founded in 1954. Luxury, elegance, and the Golden Mile at your feet.',
                'direccion'     => 'Bulevar Príncipe Alfonso von Hohenlohe, s/n',
                'imagen_principal' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
                'precio_medio'  => '€€€€',
                'latitud'       => 36.5151,
                'longitud'      => -4.9362,
                'destacado'     => true,
                'estado'        => 'aprobado',
            ],
            [
                'usuario_id'    => 4,
                'categoria_id'  => 2,
                'plan_id'       => 2,
                'nombre'        => 'Hotel Puente Romano',
                'slug'          => 'hotel-puente-romano',
                'descripcion_es'=> 'Resort de lujo con aldea andaluza, spa Six Senses y acceso directo a la playa.',
                'descripcion_en'=> 'Luxury resort with Andalusian village style, Six Senses spa and direct beach access.',
                'direccion'     => 'Bulevar Príncipe Alfonso von Hohenlohe, s/n',
                'imagen_principal' => 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
                'precio_medio'  => '€€€€',
                'latitud'       => 36.5097,
                'longitud'      => -4.9244,
                'destacado'     => true,
                'estado'        => 'aprobado',
            ],
        ];

        foreach ($negocios as $neg) {
            Negocio::firstOrCreate(['slug' => $neg['slug']], $neg);
        }

        // Asignar características
        $bibo = Negocio::where('slug', 'bibo-marbella')->first();
        if ($bibo) {
            $bibo->caracteristicas()->syncWithoutDetaching([1, 2, 4, 7]); // WiFi, Terraza, AC, Vistas Mar
        }

        $skina = Negocio::where('slug', 'skina-marbella')->first();
        if ($skina) {
            $skina->caracteristicas()->syncWithoutDetaching([1, 4, 10]); // WiFi, AC, Reserva Online
        }

        $mclub = Negocio::where('slug', 'marbella-club-hotel')->first();
        if ($mclub) {
            $mclub->caracteristicas()->syncWithoutDetaching([1, 2, 3, 4, 5, 6, 7]); // Todos los amenities
        }
    }
}
