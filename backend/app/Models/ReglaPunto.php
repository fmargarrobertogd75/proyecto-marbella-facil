<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReglaPunto extends Model
{
    use HasFactory;

    protected $table = 'reglas_puntos';

    protected $fillable = [
        'accion',
        'puntos',
        'descripcion',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    /**
     * Obtener puntos por acción específica
     */
    public static function obtenerPuntosPorAccion(string $accion): int
    {
        $regla = self::where('accion', $accion)
            ->where('activo', true)
            ->first();

        return $regla ? $regla->puntos : 0;
    }
}
