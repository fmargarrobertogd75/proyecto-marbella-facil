<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TransporteParada extends Model {
    protected $table = 'transporte_paradas'; public $timestamps = false;
    protected $fillable = ['linea_id','nombre_parada','latitud','longitud','orden'];
    public function linea(){ return $this->belongsTo(TransporteLinea::class,'linea_id'); }
}
