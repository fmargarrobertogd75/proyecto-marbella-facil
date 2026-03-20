<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Evento extends Model {
    protected $table = 'eventos'; public $timestamps = false;
    protected $fillable = ['negocio_id','titulo_es','titulo_en','descripcion_es','descripcion_en','fecha_inicio','fecha_fin','ubicacion','precio','imagen_url'];
    protected function casts(): array { return ['fecha_inicio'=>'datetime','fecha_fin'=>'datetime']; }
    public function negocio(){ return $this->belongsTo(Negocio::class,'negocio_id'); }
}
