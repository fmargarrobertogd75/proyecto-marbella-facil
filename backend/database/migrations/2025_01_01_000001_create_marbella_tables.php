<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. planes (sin dependencias)
        Schema::create('planes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 50);
            $table->decimal('precio_mensual', 6, 2)->default(0.00);
            $table->integer('nivel_prioridad')->default(0);
            $table->integer('max_fotos')->default(1);
            $table->boolean('permite_videos')->default(false);
            $table->boolean('permite_ofertas')->default(false);
            $table->text('descripcion')->nullable();
            $table->boolean('activo')->default(true);
        });

        // 2. categorias (sin dependencias)
        Schema::create('categorias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_es', 50);
            $table->string('nombre_en', 50);
            $table->string('slug', 60)->nullable()->unique();
            $table->text('descripcion')->nullable();
            $table->string('icono', 50)->nullable();
        });

        // 3. usuarios (depende de nada)
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->string('email', 100)->unique();
            $table->string('password', 255);
            $table->enum('rol', ['admin', 'usuario', 'empresa'])->default('usuario');
            $table->string('telefono', 15)->nullable();
            $table->timestamp('fecha_registro')->useCurrent();
            $table->string('avatar_url', 255)->default('default_avatar.png');
            $table->integer('puntos_fidelidad')->default(0);
            $table->string('nivel_usuario', 50)->default('Turista Novato');
            $table->boolean('acepta_terminos')->default(false);
            $table->timestamp('fecha_acepta_terminos')->useCurrent();
            $table->boolean('marketing_consent')->default(false);
            $table->boolean('activo')->default(true);
            $table->rememberToken();
        });

        // 4. negocios (depende de usuarios, categorias, planes)
        Schema::create('negocios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->foreignId('categoria_id')->constrained('categorias');
            $table->foreignId('plan_id')->default(1)->constrained('planes');
            $table->date('fecha_inicio_plan')->nullable();
            $table->date('fecha_fin_plan')->nullable();
            $table->string('nombre', 100);
            $table->string('slug', 120)->nullable()->unique();
            $table->text('descripcion_es');
            $table->text('descripcion_en')->nullable();
            $table->string('direccion', 255)->nullable();
            $table->string('telefono', 20)->nullable();
            $table->string('email_contacto', 100)->nullable();
            $table->string('web', 255)->nullable();
            $table->string('imagen_principal', 255)->nullable();
            $table->enum('precio_medio', ['€', '€€', '€€€', '€€€€'])->default('€€');
            $table->decimal('latitud', 10, 8)->nullable();
            $table->decimal('longitud', 11, 8)->nullable();
            $table->boolean('destacado')->default(false);
            $table->enum('estado', ['pendiente', 'aprobado', 'suspendido'])->default('pendiente');
            $table->timestamp('created_at')->useCurrent();
            $table->index('plan_id');
            $table->index('destacado');
            $table->index('nombre');
        });

        // 5. caracteristicas (sin dependencias)
        Schema::create('caracteristicas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_es', 50);
            $table->string('nombre_en', 50);
            $table->string('icono', 50)->nullable();
        });

        // 6. negocio_caracteristicas (pivote N:M)
        Schema::create('negocio_caracteristicas', function (Blueprint $table) {
            $table->foreignId('negocio_id')->constrained('negocios')->cascadeOnDelete();
            $table->foreignId('caracteristica_id')->constrained('caracteristicas')->cascadeOnDelete();
            $table->primary(['negocio_id', 'caracteristica_id']);
        });

        // 7. horarios
        Schema::create('horarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('negocio_id')->constrained('negocios')->cascadeOnDelete();
            $table->enum('dia_semana', ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']);
            $table->time('hora_apertura')->nullable();
            $table->time('hora_cierre')->nullable();
            $table->boolean('cerrado')->default(false);
        });

        // 8. imagenes_negocio
        Schema::create('imagenes_negocio', function (Blueprint $table) {
            $table->id();
            $table->foreignId('negocio_id')->constrained('negocios')->cascadeOnDelete();
            $table->string('url_imagen', 255);
            $table->string('titulo', 100)->nullable();
            $table->integer('orden')->default(0);
        });

        // 9. redes_sociales
        Schema::create('redes_sociales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('negocio_id')->constrained('negocios')->cascadeOnDelete();
            $table->enum('plataforma', ['Instagram', 'Facebook', 'Twitter', 'TikTok', 'TripAdvisor', 'LinkedIn', 'YouTube']);
            $table->string('url', 255);
        });

        // 10. reservas
        Schema::create('reservas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->cascadeOnDelete();
            $table->foreignId('negocio_id')->constrained('negocios')->cascadeOnDelete();
            $table->date('fecha_reserva');
            $table->time('hora_reserva');
            $table->integer('num_personas')->default(2);
            $table->enum('estado', ['pendiente', 'confirmada', 'cancelada', 'finalizada'])->default('pendiente');
            $table->text('observaciones')->nullable();
            $table->text('motivo_cancelacion')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->index('fecha_reserva');
        });

        // 11. resenas
        Schema::create('resenas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->cascadeOnDelete();
            $table->foreignId('negocio_id')->constrained('negocios')->cascadeOnDelete();
            $table->tinyInteger('puntuacion')->nullable();
            $table->text('comentario')->nullable();
            $table->boolean('validado')->default(true);
            $table->timestamp('fecha')->useCurrent();
        });

        // 12. favoritos (pivote N:M)
        Schema::create('favoritos', function (Blueprint $table) {
            $table->foreignId('usuario_id')->constrained('usuarios')->cascadeOnDelete();
            $table->foreignId('negocio_id')->constrained('negocios')->cascadeOnDelete();
            $table->timestamp('fecha_guardado')->useCurrent();
            $table->primary(['usuario_id', 'negocio_id']);
        });

        // 13. ofertas
        Schema::create('ofertas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('negocio_id')->constrained('negocios')->cascadeOnDelete();
            $table->string('titulo_es', 100);
            $table->string('titulo_en', 100)->nullable();
            $table->text('descripcion')->nullable();
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->string('codigo_promo', 50)->nullable();
            $table->boolean('activo')->default(true);
        });

        // 14. mensajes_contacto
        Schema::create('mensajes_contacto', function (Blueprint $table) {
            $table->id();
            $table->foreignId('negocio_id')->constrained('negocios')->cascadeOnDelete();
            $table->string('nombre_remitente', 100);
            $table->string('email_remitente', 100);
            $table->text('mensaje');
            $table->boolean('leido')->default(false);
            $table->timestamp('fecha_envio')->useCurrent();
        });

        // 15. eventos
        Schema::create('eventos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('negocio_id')->nullable()->constrained('negocios')->nullOnDelete();
            $table->string('titulo_es', 150);
            $table->string('titulo_en', 150)->nullable();
            $table->text('descripcion_es')->nullable();
            $table->text('descripcion_en')->nullable();
            $table->dateTime('fecha_inicio');
            $table->dateTime('fecha_fin')->nullable();
            $table->string('ubicacion', 255)->nullable();
            $table->decimal('precio', 6, 2)->default(0.00);
            $table->string('imagen_url', 255)->nullable();
            $table->index('fecha_inicio');
        });

        // 16. noticias
        Schema::create('noticias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('autor_id')->constrained('usuarios')->cascadeOnDelete();
            $table->string('titulo_es', 200);
            $table->string('titulo_en', 200)->nullable();
            $table->text('contenido_es');
            $table->text('contenido_en')->nullable();
            $table->timestamp('fecha_publicacion')->useCurrent();
            $table->string('imagen_url', 255)->nullable();
        });

        // 17. notificaciones
        Schema::create('notificaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->cascadeOnDelete();
            $table->string('titulo', 100);
            $table->text('mensaje');
            $table->enum('tipo', ['info', 'reserva', 'sistema', 'alerta'])->default('info');
            $table->boolean('leido')->default(false);
            $table->timestamp('fecha_envio')->useCurrent();
            $table->string('link_accion', 255)->nullable();
        });

        // 18. auditoria
        Schema::create('auditoria', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->nullable()->constrained('usuarios')->nullOnDelete();
            $table->string('accion', 255);
            $table->timestamp('fecha')->useCurrent();
            $table->string('ip_origen', 45)->nullable();
        });

        // 19. reportes_calidad
        Schema::create('reportes_calidad', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->cascadeOnDelete();
            $table->foreignId('negocio_id')->constrained('negocios')->cascadeOnDelete();
            $table->enum('tipo_problema', ['Información Incorrecta', 'Negocio Cerrado', 'Fotos Inapropiadas', 'Duplicado']);
            $table->text('descripcion')->nullable();
            $table->enum('estado', ['pendiente', 'resuelto', 'descartado'])->default('pendiente');
            $table->timestamp('fecha_reporte')->useCurrent();
        });

        // 20. password_resets
        Schema::create('password_resets', function (Blueprint $table) {
            $table->string('email', 100);
            $table->string('token', 255);
            $table->timestamp('created_at')->useCurrent();
            $table->index(['email', 'token']);
        });

        // 21. playas
        Schema::create('playas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->string('municipio', 50)->default('Marbella');
            $table->enum('bandera', ['Verde', 'Amarilla', 'Roja', 'Negra', 'Medusas'])->default('Verde');
            $table->enum('estado_mar', ['Calma', 'Rizado', 'Marejada', 'Fuerte Marejada'])->default('Calma');
            $table->enum('ocupacion', ['Baja', 'Media', 'Alta', 'Completo'])->default('Media');
            $table->decimal('temperatura_agua', 3, 1)->nullable();
            $table->decimal('latitud', 10, 8)->nullable();
            $table->decimal('longitud', 11, 8)->nullable();
            $table->timestamp('ultima_actualizacion')->useCurrent()->useCurrentOnUpdate();
        });

        // 22. transporte_lineas
        Schema::create('transporte_lineas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 50);
            $table->enum('tipo', ['Bus Urbano', 'Bus Turístico', 'Barco'])->default('Bus Urbano');
            $table->time('horario_inicio')->nullable();
            $table->time('horario_fin')->nullable();
            $table->integer('frecuencia_minutos')->nullable();
            $table->decimal('precio_billete', 4, 2)->nullable();
            $table->string('color_hex', 7)->nullable();
        });

        // 23. transporte_paradas
        Schema::create('transporte_paradas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('linea_id')->constrained('transporte_lineas')->cascadeOnDelete();
            $table->string('nombre_parada', 100);
            $table->decimal('latitud', 10, 8);
            $table->decimal('longitud', 11, 8);
            $table->integer('orden');
        });

        // 24. espacios_publicitarios
        Schema::create('espacios_publicitarios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 50);
            $table->string('slug', 50)->nullable()->unique();
            $table->integer('ancho_px');
            $table->integer('alto_px');
            $table->decimal('precio_diario', 6, 2)->default(0.00);
        });

        // 25. campanas_banners
        Schema::create('campanas_banners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('espacio_id')->constrained('espacios_publicitarios')->cascadeOnDelete();
            $table->foreignId('negocio_id')->nullable()->constrained('negocios')->nullOnDelete();
            $table->string('cliente_externo', 100)->nullable();
            $table->string('titulo', 100);
            $table->string('imagen_url', 255);
            $table->string('link_destino', 255);
            $table->dateTime('fecha_inicio');
            $table->dateTime('fecha_fin');
            $table->integer('clicks_actuales')->default(0);
            $table->integer('impresiones_actuales')->default(0);
            $table->integer('max_impresiones')->nullable();
            $table->boolean('activo')->default(true);
            $table->index(['fecha_inicio', 'fecha_fin']);
        });

        // Sanctum personal_access_tokens
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campanas_banners');
        Schema::dropIfExists('espacios_publicitarios');
        Schema::dropIfExists('transporte_paradas');
        Schema::dropIfExists('transporte_lineas');
        Schema::dropIfExists('playas');
        Schema::dropIfExists('password_resets');
        Schema::dropIfExists('reportes_calidad');
        Schema::dropIfExists('auditoria');
        Schema::dropIfExists('notificaciones');
        Schema::dropIfExists('noticias');
        Schema::dropIfExists('eventos');
        Schema::dropIfExists('mensajes_contacto');
        Schema::dropIfExists('ofertas');
        Schema::dropIfExists('favoritos');
        Schema::dropIfExists('resenas');
        Schema::dropIfExists('reservas');
        Schema::dropIfExists('redes_sociales');
        Schema::dropIfExists('imagenes_negocio');
        Schema::dropIfExists('horarios');
        Schema::dropIfExists('negocio_caracteristicas');
        Schema::dropIfExists('caracteristicas');
        Schema::dropIfExists('negocios');
        Schema::dropIfExists('usuarios');
        Schema::dropIfExists('categorias');
        Schema::dropIfExists('planes');
        Schema::dropIfExists('personal_access_tokens');
    }
};
