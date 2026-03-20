<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recompensa extends Model
{
    use HasFactory;

    protected $table = 'recompensas';

    protected $fillable = [
        'titulo',
        'descripcion',
        'puntos_necesarios',
        'tipo',
        'valor',
        'stock',
        'imagen_url',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    protected $appends = ['disponible'];

    // Relaciones
    public function canjes()
    {
        return $this->hasMany(CanjeRecompensa::class);
    }

    // Accessors
    public function getDisponibleAttribute()
    {
        if ($this->stock === null) {
            return true;
        }
        return $this->stock > 0;
    }

    /**
     * Verificar si hay stock disponible
     */
    public function verificarStock(): bool
    {
        if ($this->stock === null) {
            return true;
        }
        return $this->stock > 0;
    }

    /**
     * Decrementar stock
     */
    public function decrementarStock(): void
    {
        if ($this->stock !== null && $this->stock > 0) {
            $this->decrement('stock');
        }
    }
}
