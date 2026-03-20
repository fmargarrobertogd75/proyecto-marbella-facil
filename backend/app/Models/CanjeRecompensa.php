<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CanjeRecompensa extends Model
{
    use HasFactory;

    protected $table = 'canjes_recompensas';

    protected $fillable = [
        'usuario_id',
        'recompensa_id',
        'puntos_gastados',
        'estado',
        'codigo_canje',
        'fecha_canje',
        'fecha_entrega',
    ];

    protected $casts = [
        'fecha_canje' => 'datetime',
        'fecha_entrega' => 'datetime',
    ];

    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function recompensa()
    {
        return $this->belongsTo(Recompensa::class);
    }

    /**
     * Generar código único de canje
     */
    public static function generarCodigoCanje(): string
    {
        do {
            $codigo = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 10));
        } while (self::where('codigo_canje', $codigo)->exists());

        return $codigo;
    }
}
