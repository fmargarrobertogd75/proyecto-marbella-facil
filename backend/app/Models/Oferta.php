<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Oferta extends Model {
    protected $table = 'ofertas'; public $timestamps = false;
    protected $fillable = ['negocio_id','titulo_es','titulo_en','descripcion','fecha_inicio','fecha_fin','codigo_promo','activo'];
    protected function casts(): array { return ['activo'=>'boolean']; }
    public function negocio(){ return $this->belongsTo(Negocio::class,'negocio_id'); }
}
