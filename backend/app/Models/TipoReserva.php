<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoReserva extends Model
{
    use HasFactory;

    protected $table = 'tipos_reserva';

    protected $fillable = [
        'negocio_id',
        'nombre',
        'descripcion',
        'duracion_minutos',
        'capacidad_maxima',
        'requiere_aprobacion',
        'activo',
    ];

    protected $casts = [
        'requiere_aprobacion' => 'boolean',
        'activo' => 'boolean',
    ];

    // Relaciones
    public function negocio()
    {
        return $this->belongsTo(Negocio::class);
    }

    public function reservas()
    {
        return $this->hasMany(Reserva::class);
    }

    public function slots()
    {
        return $this->hasMany(SlotDisponibilidad::class);
    }
}
