<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ReporteCalidad extends Model {
    protected $table = 'reportes_calidad'; public $timestamps = false;
    protected $fillable = ['usuario_id','negocio_id','tipo_problema','descripcion','estado'];
    public function usuario(){ return $this->belongsTo(Usuario::class,'usuario_id'); }
    public function negocio(){ return $this->belongsTo(Negocio::class,'negocio_id'); }
}
