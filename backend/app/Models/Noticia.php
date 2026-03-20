<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Noticia extends Model {
    protected $table = 'noticias'; public $timestamps = false;
    protected $fillable = ['autor_id','titulo_es','titulo_en','contenido_es','contenido_en','imagen_url'];
    protected function casts(): array { return ['fecha_publicacion'=>'datetime']; }
    public function autor(){ return $this->belongsTo(Usuario::class,'autor_id'); }
}
