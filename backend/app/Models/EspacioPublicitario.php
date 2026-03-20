<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class EspacioPublicitario extends Model {
    protected $table = 'espacios_publicitarios'; public $timestamps = false;
    protected $fillable = ['nombre','slug','ancho_px','alto_px','precio_diario'];
    public function campanas(){ return $this->hasMany(CampanaBanner::class,'espacio_id'); }
}
