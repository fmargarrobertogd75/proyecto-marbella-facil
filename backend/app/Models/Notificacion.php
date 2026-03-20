<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Notificacion extends Model {
    protected $table = 'notificaciones'; public $timestamps = false;
    protected $fillable = ['usuario_id','titulo','mensaje','tipo','leido','link_accion'];
    protected function casts(): array { return ['leido'=>'boolean']; }
    public function usuario(){ return $this->belongsTo(Usuario::class,'usuario_id'); }
}
