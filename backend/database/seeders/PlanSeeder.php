<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Plan;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $planes = [
            ['nombre' => 'Básico',       'precio_mensual' => 0.00,  'nivel_prioridad' => 1,  'max_fotos' => 1,  'permite_videos' => false, 'permite_ofertas' => false, 'descripcion' => 'Plan gratuito con presencia básica en el directorio.',         'activo' => true],
            ['nombre' => 'Profesional',  'precio_mensual' => 29.99, 'nivel_prioridad' => 5,  'max_fotos' => 10, 'permite_videos' => true,  'permite_ofertas' => false, 'descripcion' => 'Plan estándar con mayor visibilidad y galería de fotos.',       'activo' => true],
            ['nombre' => 'Premium Gold', 'precio_mensual' => 59.99, 'nivel_prioridad' => 10, 'max_fotos' => 50, 'permite_videos' => true,  'permite_ofertas' => true,  'descripcion' => 'Máxima visibilidad: destacado, ofertas y gestión de reservas.', 'activo' => true],
        ];

        foreach ($planes as $plan) {
            Plan::firstOrCreate(['nombre' => $plan['nombre']], $plan);
        }
    }
}
