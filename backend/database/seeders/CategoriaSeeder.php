<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categoria;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = [
            ['nombre_es' => 'Gastronomía',      'nombre_en' => 'Gastronomy',      'slug' => 'gastronomia',   'icono' => 'fa-utensils'],
            ['nombre_es' => 'Hoteles',           'nombre_en' => 'Hotels',          'slug' => 'hoteles',       'icono' => 'fa-bed'],
            ['nombre_es' => 'Ocio y Cultura',    'nombre_en' => 'Leisure',         'slug' => 'ocio',          'icono' => 'fa-theater-masks'],
            ['nombre_es' => 'Belleza y Salud',   'nombre_en' => 'Beauty & Spa',    'slug' => 'belleza',       'icono' => 'fa-spa'],
            ['nombre_es' => 'Deporte y Aventura','nombre_en' => 'Sports',          'slug' => 'deporte',       'icono' => 'fa-person-running'],
            ['nombre_es' => 'Comercios',         'nombre_en' => 'Shops',           'slug' => 'comercios',     'icono' => 'fa-store'],
            ['nombre_es' => 'Servicios',         'nombre_en' => 'Services',        'slug' => 'servicios',     'icono' => 'fa-briefcase'],
            ['nombre_es' => 'Nightlife',         'nombre_en' => 'Nightlife',       'slug' => 'nightlife',     'icono' => 'fa-martini-glass'],
        ];

        foreach ($categorias as $cat) {
            Categoria::firstOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}
