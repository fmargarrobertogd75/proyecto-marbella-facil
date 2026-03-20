<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Caracteristica extends Model {
    protected $table = 'caracteristicas'; public $timestamps = false;
    protected $fillable = ['nombre_es','nombre_en','icono'];
    public function negocios(){ return $this->belongsToMany(Negocio::class,'negocio_caracteristicas'); }
}
