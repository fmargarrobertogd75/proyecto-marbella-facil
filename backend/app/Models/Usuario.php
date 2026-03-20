<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'usuarios';

    protected $fillable = [
        'nombre', 'email', 'password', 'rol', 'telefono',
        'avatar_url', 'puntos_fidelidad', 'nivel_usuario',
        'acepta_terminos', 'fecha_acepta_terminos', 'marketing_consent', 'activo',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'activo' => 'boolean',
            'acepta_terminos' => 'boolean',
            'marketing_consent' => 'boolean',
            'fecha_registro' => 'datetime',
        ];
    }

    public $timestamps = false;

    // Relaciones
    public function negocios() { return $this->hasMany(Negocio::class, 'usuario_id'); }
    public function reservas() { return $this->hasMany(Reserva::class, 'usuario_id'); }
    public function resenas()  { return $this->hasMany(Resena::class, 'usuario_id'); }
    public function favoritos(){ return $this->belongsToMany(Negocio::class, 'favoritos', 'usuario_id', 'negocio_id')->withPivot('fecha_guardado'); }
    public function notificaciones(){ return $this->hasMany(Notificacion::class, 'usuario_id'); }
    public function auditorias(){ return $this->hasMany(Auditoria::class, 'usuario_id'); }
    public function historialPuntos(){ return $this->hasMany(HistorialPunto::class, 'usuario_id')->orderBy('created_at', 'desc'); }
    public function canjes(){ return $this->hasMany(CanjeRecompensa::class, 'usuario_id')->orderBy('fecha_canje', 'desc'); }

    /**
     * Agregar puntos al usuario y registrar en historial
     */
    public function agregarPuntos(int $puntos, string $concepto, ?string $referencia_tipo = null, ?int $referencia_id = null): void
    {
        // Actualizar puntos del usuario
        $this->increment('puntos_fidelidad', $puntos);
        $this->refresh();

        // Registrar en historial
        HistorialPunto::create([
            'usuario_id' => $this->id,
            'puntos' => $puntos,
            'tipo' => 'ganado',
            'concepto' => $concepto,
            'referencia_tipo' => $referencia_tipo,
            'referencia_id' => $referencia_id,
        ]);

        // Actualizar nivel
        $this->actualizarNivel();
    }

    /**
     * Restar puntos al usuario y registrar en historial
     */
    public function restarPuntos(int $puntos, string $concepto, ?string $referencia_tipo = null, ?int $referencia_id = null): void
    {
        // Actualizar puntos del usuario
        $this->decrement('puntos_fidelidad', $puntos);
        $this->refresh();

        // Registrar en historial
        HistorialPunto::create([
            'usuario_id' => $this->id,
            'puntos' => $puntos,
            'tipo' => 'canjeado',
            'concepto' => $concepto,
            'referencia_tipo' => $referencia_tipo,
            'referencia_id' => $referencia_id,
        ]);

        // Actualizar nivel
        $this->actualizarNivel();
    }

    /**
     * Obtener nivel actual del usuario
     */
    public function getNivelActual()
    {
        return NivelUsuario::obtenerNivelPorPuntos($this->puntos_fidelidad);
    }

    /**
     * Actualizar nivel del usuario según puntos
     */
    public function actualizarNivel(): void
    {
        $nivel = $this->getNivelActual();
        if ($nivel) {
            $this->nivel_usuario = $nivel->nombre;
            $this->save();
        }
    }
}
