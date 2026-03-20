<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Tabla tipos_reserva
        Schema::create('tipos_reserva', function (Blueprint $table) {
            $table->id();
            $table->foreignId('negocio_id')->constrained('negocios')->cascadeOnDelete();
            $table->string('nombre', 100);
            $table->text('descripcion')->nullable();
            $table->integer('duracion_minutos')->default(60);
            $table->integer('capacidad_maxima')->default(10);
            $table->boolean('requiere_aprobacion')->default(true);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        // 2. Tabla slots_disponibilidad
        Schema::create('slots_disponibilidad', function (Blueprint $table) {
            $table->id();
            $table->foreignId('negocio_id')->constrained('negocios')->cascadeOnDelete();
            $table->foreignId('tipo_reserva_id')->nullable()->constrained('tipos_reserva')->cascadeOnDelete();
            $table->enum('dia_semana', ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']);
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->integer('capacidad_maxima')->default(10);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        // 3. Tabla historial_puntos
        Schema::create('historial_puntos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->cascadeOnDelete();
            $table->integer('puntos');
            $table->enum('tipo', ['ganado', 'canjeado', 'ajuste']);
            $table->string('concepto', 255);
            $table->string('referencia_tipo', 50)->nullable(); // reserva, resena, recompensa
            $table->unsignedBigInteger('referencia_id')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        // 4. Tabla reglas_puntos
        Schema::create('reglas_puntos', function (Blueprint $table) {
            $table->id();
            $table->enum('accion', ['reserva_completada', 'resena_creada', 'registro', 'check_in']);
            $table->integer('puntos');
            $table->string('descripcion');
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        // 5. Tabla niveles_usuario
        Schema::create('niveles_usuario', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->integer('puntos_minimos');
            $table->integer('puntos_maximos')->nullable();
            $table->string('icono', 50)->default('🏖️');
            $table->text('descripcion_beneficios')->nullable();
            $table->integer('orden')->default(0);
            $table->timestamps();
        });

        // 6. Tabla recompensas
        Schema::create('recompensas', function (Blueprint $table) {
            $table->id();
            $table->string('titulo', 200);
            $table->text('descripcion');
            $table->integer('puntos_necesarios');
            $table->enum('tipo', ['descuento', 'regalo', 'experiencia']);
            $table->string('valor', 100); // ej: "10%", "Regalo especial", etc.
            $table->integer('stock')->nullable();
            $table->string('imagen_url')->default('default_reward.png');
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        // 7. Tabla canjes_recompensas
        Schema::create('canjes_recompensas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->cascadeOnDelete();
            $table->foreignId('recompensa_id')->constrained('recompensas')->cascadeOnDelete();
            $table->integer('puntos_gastados');
            $table->enum('estado', ['pendiente', 'entregado', 'cancelado'])->default('pendiente');
            $table->string('codigo_canje', 20)->unique();
            $table->timestamp('fecha_canje')->useCurrent();
            $table->timestamp('fecha_entrega')->nullable();
            $table->timestamps();
        });

        // 8. Modificar tabla reservas
        Schema::table('reservas', function (Blueprint $table) {
            $table->foreignId('tipo_reserva_id')->nullable()->after('negocio_id')->constrained('tipos_reserva')->nullOnDelete();
            $table->integer('puntos_otorgados')->default(0)->after('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revertir modificación de reservas
        Schema::table('reservas', function (Blueprint $table) {
            $table->dropForeign(['tipo_reserva_id']);
            $table->dropColumn(['tipo_reserva_id', 'puntos_otorgados']);
        });

        // Eliminar tablas en orden inverso
        Schema::dropIfExists('canjes_recompensas');
        Schema::dropIfExists('recompensas');
        Schema::dropIfExists('niveles_usuario');
        Schema::dropIfExists('reglas_puntos');
        Schema::dropIfExists('historial_puntos');
        Schema::dropIfExists('slots_disponibilidad');
        Schema::dropIfExists('tipos_reserva');
    }
};
