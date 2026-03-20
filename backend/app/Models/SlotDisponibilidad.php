<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SlotDisponibilidad extends Model
{
    use HasFactory;

    protected $table = 'slots_disponibilidad';

    protected $fillable = [
        'negocio_id',
        'tipo_reserva_id',
        'dia_semana',
        'hora_inicio',
        'hora_fin',
        'capacidad_maxima',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    // Relaciones
    public function negocio()
    {
        return $this->belongsTo(Negocio::class);
    }

    public function tipoReserva()
    {
        return $this->belongsTo(TipoReserva::class);
    }
}
