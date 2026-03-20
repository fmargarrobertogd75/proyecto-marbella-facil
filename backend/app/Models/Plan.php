<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Plan extends Model {
    protected $table = 'planes'; public $timestamps = false;
    protected $fillable = ['nombre','precio_mensual','nivel_prioridad','max_fotos','permite_videos','permite_ofertas','descripcion','activo'];
    protected function casts(): array { return ['permite_videos'=>'boolean','permite_ofertas'=>'boolean','activo'=>'boolean']; }
    public function negocios(){ return $this->hasMany(Negocio::class,'plan_id'); }
}
