<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NivelUsuario extends Model
{
    use HasFactory;

    protected $table = 'niveles_usuario';

    protected $fillable = [
        'nombre',
        'puntos_minimos',
        'puntos_maximos',
        'icono',
        'descripcion_beneficios',
        'orden',
    ];

    /**
     * Obtener nivel según puntos del usuario
     */
    public static function obtenerNivelPorPuntos(int $puntos)
    {
        return self::where('puntos_minimos', '<=', $puntos)
            ->where(function($query) use ($puntos) {
                $query->whereNull('puntos_maximos')
                      ->orWhere('puntos_maximos', '>=', $puntos);
            })
            ->orderBy('orden', 'desc')
            ->first();
    }

    /**
     * Obtener todos los niveles ordenados
     */
    public static function obtenerTodosLosNiveles()
    {
        return self::orderBy('orden', 'asc')->get();
    }
}
