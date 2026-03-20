<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Orden importante: respetar las FKs
        $this->call([
            // Configuración de sistema de puntos
            ReglaPuntoSeeder::class,
            NivelUsuarioSeeder::class,
            RecompensaSeeder::class,
            // Tablas base
            PlanSeeder::class,
            CategoriaSeeder::class,
            CaracteristicaSeeder::class, // Debe ir ANTES de NegocioSeeder
            UsuarioSeeder::class,
            NegocioSeeder::class,        // Necesita Plan, Categoria y Caracteristica
            PlayaSeeder::class,
            TransporteSeeder::class,
            PublicidadSeeder::class,
            EventoSeeder::class,
        ]);
    }
}
