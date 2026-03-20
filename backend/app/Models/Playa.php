<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Playa extends Model {
    protected $table = 'playas'; public $timestamps = false;
    const UPDATED_AT = 'ultima_actualizacion';
    protected $fillable = ['nombre','municipio','bandera','estado_mar','ocupacion','temperatura_agua','latitud','longitud'];
}
