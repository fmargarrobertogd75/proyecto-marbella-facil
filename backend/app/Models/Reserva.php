<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    protected $table = 'reservas';
    public $timestamps = false;

    protected $fillable = [
        'usuario_id',
        'negocio_id',
        'tipo_reserva_id',
        'fecha_reserva',
        'hora_reserva',
        'num_personas',
        'estado',
        'observaciones',
        'motivo_cancelacion',
        'puntos_otorgados',
    ];

    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    public function negocio()
    {
        return $this->belongsTo(Negocio::class, 'negocio_id');
    }

    public function tipoReserva()
    {
        return $this->belongsTo(TipoReserva::class, 'tipo_reserva_id');
    }
}
