<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class CampanaBanner extends Model {
    protected $table = 'campanas_banners'; public $timestamps = false;
    protected $fillable = ['espacio_id','negocio_id','cliente_externo','titulo','imagen_url','link_destino','fecha_inicio','fecha_fin','clicks_actuales','impresiones_actuales','max_impresiones','activo'];
    protected function casts(): array { return ['activo'=>'boolean','fecha_inicio'=>'datetime','fecha_fin'=>'datetime']; }
    public function espacio(){ return $this->belongsTo(EspacioPublicitario::class,'espacio_id'); }
    public function negocio(){ return $this->belongsTo(Negocio::class,'negocio_id'); }
}
