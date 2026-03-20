<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class MensajeContacto extends Model {
    protected $table = 'mensajes_contacto'; public $timestamps = false;
    protected $fillable = ['negocio_id','nombre_remitente','email_remitente','mensaje','leido'];
    protected function casts(): array { return ['leido'=>'boolean']; }
    public function negocio(){ return $this->belongsTo(Negocio::class,'negocio_id'); }
}
