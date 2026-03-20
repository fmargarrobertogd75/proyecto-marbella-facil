<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Horario extends Model {
    protected $table = 'horarios'; public $timestamps = false;
    protected $fillable = ['negocio_id','dia_semana','hora_apertura','hora_cierre','cerrado'];
    protected function casts(): array { return ['cerrado'=>'boolean']; }
    public function negocio(){ return $this->belongsTo(Negocio::class,'negocio_id'); }
}
