<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistorialPunto extends Model
{
    use HasFactory;

    protected $table = 'historial_puntos';

    public $timestamps = false;

    protected $fillable = [
        'usuario_id',
        'puntos',
        'tipo',
        'concepto',
        'referencia_tipo',
        'referencia_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    // Scopes
    public function scopeGanados($query)
    {
        return $query->where('tipo', 'ganado');
    }

    public function scopeCanjeados($query)
    {
        return $query->where('tipo', 'canjeado');
    }
}
