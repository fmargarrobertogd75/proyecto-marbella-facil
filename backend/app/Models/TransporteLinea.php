<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TransporteLinea extends Model {
    protected $table = 'transporte_lineas'; public $timestamps = false;
    protected $fillable = ['nombre','tipo','horario_inicio','horario_fin','frecuencia_minutos','precio_billete','color_hex'];
    public function paradas(){ return $this->hasMany(TransporteParada::class,'linea_id')->orderBy('orden'); }
}
