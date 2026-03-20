<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class RedSocial extends Model {
    protected $table = 'redes_sociales'; public $timestamps = false;
    protected $fillable = ['negocio_id','plataforma','url'];
    public function negocio(){ return $this->belongsTo(Negocio::class,'negocio_id'); }
}
