<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NegocioController;
use App\Http\Controllers\Api\PlayaController;
use App\Http\Controllers\Api\TransporteController;
use App\Http\Controllers\Api\ReservaController;
use App\Http\Controllers\Api\ResenaController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\CaracteristicaController;
use App\Http\Controllers\Api\PlanController;
use App\Http\Controllers\Api\EventoController;
use App\Http\Controllers\Api\NoticiaController;
use App\Http\Controllers\Api\NotificacionController;
use App\Http\Controllers\Api\MensajeContactoController;
use App\Http\Controllers\Api\CampanaBannerController;
use App\Http\Controllers\Api\FavoritoController;
use App\Http\Controllers\Api\ChatIaController;
use App\Http\Controllers\Api\ReservaExtendidaController;
use App\Http\Controllers\Api\PuntosController;
use App\Http\Controllers\Api\RecompensasController;
use App\Http\Controllers\Api\TiposReservaController;
use App\Http\Controllers\Api\SlotsDisponibilidadController;
use App\Http\Controllers\Api\NegocioStatsController;

// ── Chat IA ───────────────────────────────────────────
Route::post('/chat', [ChatIaController::class, 'chat'])->middleware('throttle:30,1');

// ── Auth ──────────────────────────────────────────────
Route::post('/auth/login',    [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);
});

// ── Rutas públicas ────────────────────────────────────
Route::get('/negocios',           [NegocioController::class, 'index']);
Route::get('/negocios/{id}',      [NegocioController::class, 'show']);

Route::get('/categorias',         [CategoriaController::class, 'index']);
Route::get('/caracteristicas',    [CaracteristicaController::class, 'index']);
Route::get('/planes',             [PlanController::class, 'index']);

Route::get('/playas',             [PlayaController::class, 'index']);
Route::get('/playas/{id}',        [PlayaController::class, 'show']);

Route::get('/transporte/lineas',                    [TransporteController::class, 'lineas']);
Route::get('/transporte/paradas/{linea_id}',        [TransporteController::class, 'paradas']);

Route::get('/eventos',            [EventoController::class, 'index']);
Route::get('/noticias',           [NoticiaController::class, 'index']);

Route::get('/resenas/{negocio_id}', [ResenaController::class, 'index']);

Route::post('/mensajes',          [MensajeContactoController::class, 'store']);

Route::get('/banners/{slug}',     [CampanaBannerController::class, 'getActivo']);
Route::post('/banners/{id}/click',[CampanaBannerController::class, 'registrarClick']);

// ── Sistema de Puntos y Recompensas (público) ────────
Route::get('/recompensas',         [RecompensasController::class, 'index']);
Route::get('/niveles',             [PuntosController::class, 'niveles']);

// ── Tipos de reserva y slots (público) ───────────────
Route::get('/negocios/{id}/tipos-reserva',           [TiposReservaController::class, 'index']);
Route::get('/negocios/{id}/slots-disponibilidad',    [SlotsDisponibilidadController::class, 'index']);

// ── Rutas autenticadas ────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    // Negocios
    Route::post('/negocios',             [NegocioController::class, 'store']);
    Route::put('/negocios/{id}',         [NegocioController::class, 'update']);
    Route::delete('/negocios/{id}',      [NegocioController::class, 'destroy']);

    // Playas (actualización de estado — socorristas/admin)
    Route::put('/playas/{id}',           [PlayaController::class, 'update']);

    // Reservas
    Route::get('/reservas',              [ReservaController::class, 'index']);
    Route::post('/reservas',             [ReservaController::class, 'store']);
    Route::put('/reservas/{id}/estado',  [ReservaController::class, 'cambiarEstado']);
    Route::put('/reservas/{id}/cancelar',[ReservaController::class, 'cancelarPropia']);
    Route::put('/reservas/{id}/modificar',[ReservaController::class, 'modificarPropia']);

    // Reseñas
    Route::post('/resenas',              [ResenaController::class, 'store']);

    // Favoritos
    Route::get('/favoritos',                        [FavoritoController::class, 'index']);
    Route::post('/favoritos/{negocio_id}/toggle',   [FavoritoController::class, 'toggle']);

    // Notificaciones
    Route::get('/notificaciones',                       [NotificacionController::class, 'index']);
    Route::put('/notificaciones/{id}/leer',             [NotificacionController::class, 'marcarLeida']);
    Route::post('/notificaciones/marcar-todas',         [NotificacionController::class, 'marcarTodasLeidas']);

    // ── Sistema de Puntos ──────────────────────────────
    Route::get('/puntos/mis-puntos',                    [PuntosController::class, 'misPuntos']);
    Route::get('/puntos/historial',                     [PuntosController::class, 'historial']);

    // ── Sistema de Recompensas ─────────────────────────
    Route::post('/recompensas/{id}/canjear',            [RecompensasController::class, 'canjear']);
    Route::get('/recompensas/mis-canjes',               [RecompensasController::class, 'misCanjes']);

    // ── Reservas Extendidas ────────────────────────────
    Route::get('/reservas/mi-historial',                [ReservaExtendidaController::class, 'miHistorial']);
    Route::post('/reservas/verificar-disponibilidad',   [ReservaExtendidaController::class, 'verificarDisponibilidad']);

    // ── Panel de Negocio ───────────────────────────────
    Route::get('/negocio/reservas',                     [ReservaExtendidaController::class, 'reservasNegocio']);
    Route::put('/negocio/reservas/{id}/confirmar',      [ReservaExtendidaController::class, 'confirmarReserva']);
    Route::put('/negocio/reservas/{id}/rechazar',       [ReservaExtendidaController::class, 'rechazarReserva']);
    Route::get('/negocio/estadisticas',                 [NegocioStatsController::class, 'dashboard']);
    Route::get('/negocio/ocupacion',                    [SlotsDisponibilidadController::class, 'ocupacion']);

    // ── Gestión de Tipos de Reserva (empresas) ────────
    Route::post('/negocio/tipos-reserva',               [TiposReservaController::class, 'store']);
    Route::put('/negocio/tipos-reserva/{id}',           [TiposReservaController::class, 'update']);
    Route::delete('/negocio/tipos-reserva/{id}',        [TiposReservaController::class, 'destroy']);

    // ── Gestión de Slots de Disponibilidad (empresas) ─
    Route::post('/negocio/slots-disponibilidad',        [SlotsDisponibilidadController::class, 'store']);
    Route::put('/negocio/slots-disponibilidad/{id}',    [SlotsDisponibilidadController::class, 'update']);
    Route::delete('/negocio/slots-disponibilidad/{id}', [SlotsDisponibilidadController::class, 'destroy']);

    // ── Admin ────────────────────────────────────────
    Route::prefix('admin')->group(function () {
        Route::get('/usuarios',                    [AdminController::class, 'usuarios']);
        Route::post('/usuarios',                   [AdminController::class, 'crearUsuario']);
        Route::put('/usuarios/{id}',               [AdminController::class, 'actualizarUsuario']);
        Route::put('/usuarios/{id}/password',      [AdminController::class, 'cambiarPassword']);
        Route::delete('/usuarios/{id}',            [AdminController::class, 'eliminarUsuario']);
        Route::get('/auditoria',                   [AdminController::class, 'auditoria']);
        Route::get('/reportes',                    [AdminController::class, 'reportes']);
        Route::put('/negocios/{id}/estado',        [AdminController::class, 'toggleNegocio']);

        // Gestión de puntos y canjes
        Route::post('/puntos/otorgar',             [PuntosController::class, 'otorgarPuntos']);
        Route::put('/canjes/{id}/entregar',        [RecompensasController::class, 'marcarEntregado']);
    });
});
