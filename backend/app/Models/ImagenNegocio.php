<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ImagenNegocio extends Model {
    protected $table = 'imagenes_negocio'; public $timestamps = false;
    protected $fillable = ['negocio_id','url_imagen','titulo','orden'];
    public function negocio(){ return $this->belongsTo(Negocio::class,'negocio_id'); }
}
