<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web:      __DIR__.'/../routes/web.php',
        api:      __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health:   '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // CORS - Permitir peticiones del frontend React
        $middleware->prepend(\Illuminate\Http\Middleware\HandleCors::class);

        // Excluir las rutas API del middleware CSRF (usan Bearer tokens de Sanctum)
        $middleware->validateCsrfTokens(except: ['api/*']);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Responder con JSON para las rutas API
        $exceptions->shouldRenderJsonWhen(fn(Request $request) => $request->is('api/*'));
    })->create();
