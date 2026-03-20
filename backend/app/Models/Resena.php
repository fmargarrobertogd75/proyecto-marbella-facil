<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Resena extends Model {
    protected $table = 'resenas'; public $timestamps = false;
    protected $fillable = ['usuario_id','negocio_id','puntuacion','comentario','validado'];
    protected function casts(): array { return ['validado'=>'boolean']; }
    public function usuario(){ return $this->belongsTo(Usuario::class,'usuario_id'); }
    public function negocio(){ return $this->belongsTo(Negocio::class,'negocio_id'); }
}
