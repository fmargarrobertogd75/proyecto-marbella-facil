<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Negocio extends Model
{
    protected $table = 'negocios';
    public $timestamps = false;

    protected $fillable = [
        'usuario_id','categoria_id','plan_id','fecha_inicio_plan','fecha_fin_plan',
        'nombre','slug','descripcion_es','descripcion_en','direccion','telefono',
        'email_contacto','web','imagen_principal','precio_medio',
        'latitud','longitud','destacado','estado',
    ];

    protected function casts(): array
    {
        return [
            'destacado' => 'boolean',
            'latitud'   => 'float',
            'longitud'  => 'float',
            'created_at'=> 'datetime',
        ];
    }

    // Relaciones
    public function usuario()       { return $this->belongsTo(Usuario::class, 'usuario_id'); }
    public function categoria()     { return $this->belongsTo(Categoria::class, 'categoria_id'); }
    public function plan()          { return $this->belongsTo(Plan::class, 'plan_id'); }
    public function caracteristicas(){ return $this->belongsToMany(Caracteristica::class, 'negocio_caracteristicas'); }
    public function horarios()      { return $this->hasMany(Horario::class, 'negocio_id'); }
    public function imagenes()      { return $this->hasMany(ImagenNegocio::class, 'negocio_id')->orderBy('orden'); }
    public function redesSociales() { return $this->hasMany(RedSocial::class, 'negocio_id'); }
    public function reservas()      { return $this->hasMany(Reserva::class, 'negocio_id'); }
    public function resenas()       { return $this->hasMany(Resena::class, 'negocio_id'); }
    public function ofertas()       { return $this->hasMany(Oferta::class, 'negocio_id')->where('activo', true); }
    public function eventos()       { return $this->hasMany(Evento::class, 'negocio_id'); }
    public function mensajes()      { return $this->hasMany(MensajeContacto::class, 'negocio_id'); }
    public function tiposReserva()  { return $this->hasMany(TipoReserva::class, 'negocio_id')->where('activo', true); }
    public function slotsDisponibilidad(){ return $this->hasMany(SlotDisponibilidad::class, 'negocio_id')->where('activo', true); }

    // Scope: solo aprobados
    public function scopeAprobado($q) { return $q->where('estado', 'aprobado'); }

    // Puntuación promedio
    public function getPuntuacionMediaAttribute()
    {
        return $this->resenas()->where('validado', true)->avg('puntuacion');
    }
}
