-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-02-2026 a las 16:39:47
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

CREATE DATABASE IF NOT EXISTS `marbella_facil` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `marbella_facil`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `marbella_facil`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria`
--

CREATE TABLE `auditoria` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `accion` varchar(255) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `ip_origen` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `campanas_banners`
--

CREATE TABLE `campanas_banners` (
  `id` int(11) NOT NULL,
  `espacio_id` int(11) NOT NULL,
  `negocio_id` int(11) DEFAULT NULL,
  `cliente_externo` varchar(100) DEFAULT NULL,
  `titulo` varchar(100) NOT NULL,
  `imagen_url` varchar(255) NOT NULL,
  `link_destino` varchar(255) NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `clicks_actuales` int(11) DEFAULT 0,
  `impresiones_actuales` int(11) DEFAULT 0,
  `max_impresiones` int(11) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `campanas_banners`
--

INSERT INTO `campanas_banners` (`id`, `espacio_id`, `negocio_id`, `cliente_externo`, `titulo`, `imagen_url`, `link_destino`, `fecha_inicio`, `fecha_fin`, `clicks_actuales`, `impresiones_actuales`, `max_impresiones`, `activo`) VALUES
(1, 1, 1, NULL, 'Verano en BiBo', 'banner_bibo.jpg', 'https://bibo.com', '2025-06-01 00:00:00', '2025-09-01 00:00:00', 0, 0, NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `caracteristicas`
--

CREATE TABLE `caracteristicas` (
  `id` int(11) NOT NULL,
  `nombre_es` varchar(50) NOT NULL,
  `nombre_en` varchar(50) NOT NULL,
  `icono` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `caracteristicas`
--

INSERT INTO `caracteristicas` (`id`, `nombre_es`, `nombre_en`, `icono`) VALUES
(1, 'WiFi Gratis', 'Free WiFi', 'fa-wifi'),
(2, 'Terraza', 'Terrace', 'fa-sun');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre_es` varchar(50) NOT NULL,
  `nombre_en` varchar(50) NOT NULL,
  `slug` varchar(60) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `icono` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre_es`, `nombre_en`, `slug`, `descripcion`, `icono`) VALUES
(1, 'Gastronomía', 'Gastronomy', 'gastronomia', NULL, 'fa-utensils'),
(2, 'Hoteles', 'Hotels', 'hoteles', NULL, 'fa-bed');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `espacios_publicitarios`
--

CREATE TABLE `espacios_publicitarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `slug` varchar(50) DEFAULT NULL,
  `ancho_px` int(11) NOT NULL,
  `alto_px` int(11) NOT NULL,
  `precio_diario` decimal(6,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `espacios_publicitarios`
--

INSERT INTO `espacios_publicitarios` (`id`, `nombre`, `slug`, `ancho_px`, `alto_px`, `precio_diario`) VALUES
(1, 'Cabecera Principal', 'home_top', 1200, 300, 50.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE `eventos` (
  `id` int(11) NOT NULL,
  `negocio_id` int(11) DEFAULT NULL,
  `titulo_es` varchar(150) NOT NULL,
  `titulo_en` varchar(150) DEFAULT NULL,
  `descripcion_es` text DEFAULT NULL,
  `descripcion_en` text DEFAULT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `precio` decimal(6,2) DEFAULT 0.00,
  `imagen_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `favoritos`
--

CREATE TABLE `favoritos` (
  `usuario_id` int(11) NOT NULL,
  `negocio_id` int(11) NOT NULL,
  `fecha_guardado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horarios`
--

CREATE TABLE `horarios` (
  `id` int(11) NOT NULL,
  `negocio_id` int(11) NOT NULL,
  `dia_semana` enum('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo') NOT NULL,
  `hora_apertura` time DEFAULT NULL,
  `hora_cierre` time DEFAULT NULL,
  `cerrado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes_negocio`
--

CREATE TABLE `imagenes_negocio` (
  `id` int(11) NOT NULL,
  `negocio_id` int(11) NOT NULL,
  `url_imagen` varchar(255) NOT NULL,
  `titulo` varchar(100) DEFAULT NULL,
  `orden` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes_contacto`
--

CREATE TABLE `mensajes_contacto` (
  `id` int(11) NOT NULL,
  `negocio_id` int(11) NOT NULL,
  `nombre_remitente` varchar(100) NOT NULL,
  `email_remitente` varchar(100) NOT NULL,
  `mensaje` text NOT NULL,
  `leido` tinyint(1) DEFAULT 0,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `negocios`
--

CREATE TABLE `negocios` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `categoria_id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL DEFAULT 1,
  `fecha_inicio_plan` date DEFAULT NULL,
  `fecha_fin_plan` date DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `slug` varchar(120) DEFAULT NULL,
  `descripcion_es` text NOT NULL,
  `descripcion_en` text DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email_contacto` varchar(100) DEFAULT NULL,
  `web` varchar(255) DEFAULT NULL,
  `imagen_principal` varchar(255) DEFAULT NULL,
  `precio_medio` enum('€','€€','€€€','€€€€') DEFAULT '€€',
  `latitud` decimal(10,8) DEFAULT NULL,
  `longitud` decimal(11,8) DEFAULT NULL,
  `destacado` tinyint(1) DEFAULT 0,
  `estado` enum('pendiente','aprobado','suspendido') DEFAULT 'pendiente',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `negocios`
--

INSERT INTO `negocios` (`id`, `usuario_id`, `categoria_id`, `plan_id`, `fecha_inicio_plan`, `fecha_fin_plan`, `nombre`, `slug`, `descripcion_es`, `descripcion_en`, `direccion`, `telefono`, `email_contacto`, `web`, `imagen_principal`, `precio_medio`, `latitud`, `longitud`, `destacado`, `estado`, `created_at`) VALUES
(1, 3, 1, 3, NULL, NULL, 'BiBo Marbella', 'bibo-marbella', 'Brasserie andaluza', NULL, 'Hotel Puente Romano', NULL, NULL, NULL, NULL, '€€', NULL, NULL, 0, 'aprobado', '2025-11-28 18:27:11'),
(2, 1, 1, 1, NULL, NULL, 'La Meridiana', NULL, 'Restaurante de alta cocina mediterránea', NULL, NULL, NULL, NULL, NULL, 'https://picsum.photos/400/300?random=1', '€€€', NULL, NULL, 0, 'aprobado', '2026-02-19 14:15:12'),
(3, 1, 1, 1, NULL, NULL, 'Skina Marbella', NULL, 'Cocina tradicional andaluza renovada', NULL, NULL, NULL, NULL, NULL, 'https://picsum.photos/400/300?random=2', '€€', NULL, NULL, 0, 'aprobado', '2026-02-19 14:15:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `negocio_caracteristicas`
--

CREATE TABLE `negocio_caracteristicas` (
  `negocio_id` int(11) NOT NULL,
  `caracteristica_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `noticias`
--

CREATE TABLE `noticias` (
  `id` int(11) NOT NULL,
  `autor_id` int(11) NOT NULL,
  `titulo_es` varchar(200) NOT NULL,
  `titulo_en` varchar(200) DEFAULT NULL,
  `contenido_es` text NOT NULL,
  `contenido_en` text DEFAULT NULL,
  `fecha_publicacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `imagen_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `mensaje` text NOT NULL,
  `tipo` enum('info','reserva','sistema','alerta') DEFAULT 'info',
  `leido` tinyint(1) DEFAULT 0,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  `link_accion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ofertas`
--

CREATE TABLE `ofertas` (
  `id` int(11) NOT NULL,
  `negocio_id` int(11) NOT NULL,
  `titulo_es` varchar(100) NOT NULL,
  `titulo_en` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `codigo_promo` varchar(50) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(100) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planes`
--

CREATE TABLE `planes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `precio_mensual` decimal(6,2) NOT NULL DEFAULT 0.00,
  `nivel_prioridad` int(11) DEFAULT 0,
  `max_fotos` int(11) DEFAULT 1,
  `permite_videos` tinyint(1) DEFAULT 0,
  `permite_ofertas` tinyint(1) DEFAULT 0,
  `descripcion` text DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `planes`
--

INSERT INTO `planes` (`id`, `nombre`, `precio_mensual`, `nivel_prioridad`, `max_fotos`, `permite_videos`, `permite_ofertas`, `descripcion`, `activo`) VALUES
(1, 'Básico', 0.00, 1, 1, 0, 0, 'Plan gratuito.', 1),
(2, 'Profesional', 29.99, 5, 10, 1, 0, 'Plan standard.', 1),
(3, 'Premium Gold', 59.99, 10, 50, 1, 1, 'Máxima visibilidad.', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `playas`
--

CREATE TABLE `playas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `municipio` varchar(50) DEFAULT 'Marbella',
  `bandera` enum('Verde','Amarilla','Roja','Negra','Medusas') DEFAULT 'Verde',
  `estado_mar` enum('Calma','Rizado','Marejada','Fuerte Marejada') DEFAULT 'Calma',
  `ocupacion` enum('Baja','Media','Alta','Completo') DEFAULT 'Media',
  `temperatura_agua` decimal(3,1) DEFAULT NULL,
  `latitud` decimal(10,8) DEFAULT NULL,
  `longitud` decimal(11,8) DEFAULT NULL,
  `ultima_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `playas`
--

INSERT INTO `playas` (`id`, `nombre`, `municipio`, `bandera`, `estado_mar`, `ocupacion`, `temperatura_agua`, `latitud`, `longitud`, `ultima_actualizacion`) VALUES
(1, 'Playa de Nagüeles', 'Marbella', 'Verde', 'Calma', 'Media', 22.5, 36.50200000, -4.92850000, '2025-11-28 18:27:11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `redes_sociales`
--

CREATE TABLE `redes_sociales` (
  `id` int(11) NOT NULL,
  `negocio_id` int(11) NOT NULL,
  `plataforma` enum('Instagram','Facebook','Twitter','TikTok','TripAdvisor','LinkedIn','YouTube') NOT NULL,
  `url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reportes_calidad`
--

CREATE TABLE `reportes_calidad` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `negocio_id` int(11) NOT NULL,
  `tipo_problema` enum('Información Incorrecta','Negocio Cerrado','Fotos Inapropiadas','Duplicado') NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('pendiente','resuelto','descartado') DEFAULT 'pendiente',
  `fecha_reporte` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resenas`
--

CREATE TABLE `resenas` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `negocio_id` int(11) NOT NULL,
  `puntuacion` tinyint(4) DEFAULT NULL CHECK (`puntuacion` between 1 and 5),
  `comentario` text DEFAULT NULL,
  `validado` tinyint(1) DEFAULT 1,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `negocio_id` int(11) NOT NULL,
  `fecha_reserva` date NOT NULL,
  `hora_reserva` time NOT NULL,
  `num_personas` int(11) NOT NULL DEFAULT 2,
  `estado` enum('pendiente','confirmada','cancelada','finalizada') DEFAULT 'pendiente',
  `observaciones` text DEFAULT NULL,
  `motivo_cancelacion` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `transporte_lineas`
--

CREATE TABLE `transporte_lineas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `tipo` enum('Bus Urbano','Bus Turístico','Barco') DEFAULT 'Bus Urbano',
  `horario_inicio` time DEFAULT NULL,
  `horario_fin` time DEFAULT NULL,
  `frecuencia_minutos` int(11) DEFAULT NULL,
  `precio_billete` decimal(4,2) DEFAULT NULL,
  `color_hex` varchar(7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `transporte_lineas`
--

INSERT INTO `transporte_lineas` (`id`, `nombre`, `tipo`, `horario_inicio`, `horario_fin`, `frecuencia_minutos`, `precio_billete`, `color_hex`) VALUES
(1, 'L1: Centro - Puerto Banús', 'Bus Urbano', NULL, NULL, NULL, 1.20, '#007bff');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `transporte_paradas`
--

CREATE TABLE `transporte_paradas` (
  `id` int(11) NOT NULL,
  `linea_id` int(11) NOT NULL,
  `nombre_parada` varchar(100) NOT NULL,
  `latitud` decimal(10,8) NOT NULL,
  `longitud` decimal(11,8) NOT NULL,
  `orden` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','usuario','empresa') DEFAULT 'usuario',
  `telefono` varchar(15) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `avatar_url` varchar(255) DEFAULT 'default_avatar.png',
  `puntos_fidelidad` int(11) DEFAULT 0,
  `nivel_usuario` varchar(50) DEFAULT 'Turista Novato',
  `acepta_terminos` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_acepta_terminos` timestamp NOT NULL DEFAULT current_timestamp(),
  `marketing_consent` tinyint(1) DEFAULT 0,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol`, `telefono`, `fecha_registro`, `avatar_url`, `puntos_fidelidad`, `nivel_usuario`, `acepta_terminos`, `fecha_acepta_terminos`, `marketing_consent`, `activo`) VALUES
(1, 'Admin', 'admin@marbella.com', '1234', 'admin', NULL, '2025-11-28 18:27:11', 'default_avatar.png', 0, 'Turista Novato', 1, '2025-11-28 18:27:11', 0, 1),
(2, 'Turista Pepe', 'pepe@mail.com', '1234', 'usuario', NULL, '2025-11-28 18:27:11', 'default_avatar.png', 150, 'Turista Novato', 1, '2025-11-28 18:27:11', 0, 1),
(3, 'Dueño BiBo', 'bibo@danigarcia.com', '1234', 'empresa', NULL, '2025-11-28 18:27:11', 'default_avatar.png', 0, 'Turista Novato', 1, '2025-11-28 18:27:11', 0, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `campanas_banners`
--
ALTER TABLE `campanas_banners`
  ADD PRIMARY KEY (`id`),
  ADD KEY `espacio_id` (`espacio_id`),
  ADD KEY `negocio_id` (`negocio_id`),
  ADD KEY `idx_fechas_ads` (`fecha_inicio`,`fecha_fin`);

--
-- Indices de la tabla `caracteristicas`
--
ALTER TABLE `caracteristicas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indices de la tabla `espacios_publicitarios`
--
ALTER TABLE `espacios_publicitarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indices de la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `negocio_id` (`negocio_id`),
  ADD KEY `idx_fechas_evento` (`fecha_inicio`);

--
-- Indices de la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD PRIMARY KEY (`usuario_id`,`negocio_id`),
  ADD KEY `negocio_id` (`negocio_id`);

--
-- Indices de la tabla `horarios`
--
ALTER TABLE `horarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `negocio_id` (`negocio_id`);

--
-- Indices de la tabla `imagenes_negocio`
--
ALTER TABLE `imagenes_negocio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `negocio_id` (`negocio_id`);

--
-- Indices de la tabla `mensajes_contacto`
--
ALTER TABLE `mensajes_contacto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `negocio_id` (`negocio_id`);

--
-- Indices de la tabla `negocios`
--
ALTER TABLE `negocios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `categoria_id` (`categoria_id`),
  ADD KEY `idx_plan` (`plan_id`),
  ADD KEY `idx_destacado` (`destacado`),
  ADD KEY `idx_nombre` (`nombre`);

--
-- Indices de la tabla `negocio_caracteristicas`
--
ALTER TABLE `negocio_caracteristicas`
  ADD PRIMARY KEY (`negocio_id`,`caracteristica_id`),
  ADD KEY `caracteristica_id` (`caracteristica_id`);

--
-- Indices de la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `autor_id` (`autor_id`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `ofertas`
--
ALTER TABLE `ofertas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `negocio_id` (`negocio_id`);

--
-- Indices de la tabla `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `idx_email_token` (`email`,`token`);

--
-- Indices de la tabla `planes`
--
ALTER TABLE `planes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `playas`
--
ALTER TABLE `playas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `redes_sociales`
--
ALTER TABLE `redes_sociales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `negocio_id` (`negocio_id`);

--
-- Indices de la tabla `reportes_calidad`
--
ALTER TABLE `reportes_calidad`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `negocio_id` (`negocio_id`);

--
-- Indices de la tabla `resenas`
--
ALTER TABLE `resenas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `negocio_id` (`negocio_id`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `negocio_id` (`negocio_id`),
  ADD KEY `idx_fecha` (`fecha_reserva`);

--
-- Indices de la tabla `transporte_lineas`
--
ALTER TABLE `transporte_lineas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `transporte_paradas`
--
ALTER TABLE `transporte_paradas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `linea_id` (`linea_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `campanas_banners`
--
ALTER TABLE `campanas_banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `caracteristicas`
--
ALTER TABLE `caracteristicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `espacios_publicitarios`
--
ALTER TABLE `espacios_publicitarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `horarios`
--
ALTER TABLE `horarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `imagenes_negocio`
--
ALTER TABLE `imagenes_negocio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mensajes_contacto`
--
ALTER TABLE `mensajes_contacto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `negocios`
--
ALTER TABLE `negocios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `noticias`
--
ALTER TABLE `noticias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ofertas`
--
ALTER TABLE `ofertas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `planes`
--
ALTER TABLE `planes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `playas`
--
ALTER TABLE `playas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `redes_sociales`
--
ALTER TABLE `redes_sociales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reportes_calidad`
--
ALTER TABLE `reportes_calidad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `resenas`
--
ALTER TABLE `resenas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `transporte_lineas`
--
ALTER TABLE `transporte_lineas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `transporte_paradas`
--
ALTER TABLE `transporte_paradas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD CONSTRAINT `auditoria_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `campanas_banners`
--
ALTER TABLE `campanas_banners`
  ADD CONSTRAINT `campanas_banners_ibfk_1` FOREIGN KEY (`espacio_id`) REFERENCES `espacios_publicitarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `campanas_banners_ibfk_2` FOREIGN KEY (`negocio_id`) REFERENCES `negocios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD CONSTRAINT `eventos_ibfk_1` FOREIGN KEY (`negocio_id`) REFERENCES `negocios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`negocio_id`) REFERENCES `negocios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `horarios`
--
ALTER TABLE `horarios`
  ADD CONSTRAINT `horarios_ibfk_1` FOREIGN KEY (`negocio_id`) REFERENCES `negocios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `imagenes_negocio`
--
ALTER TABLE `imagenes_negocio`
  ADD CONSTRAINT `imagenes_negocio_ibfk_1` FOREIGN KEY (`negocio_id`) REFERENCES `negocios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `mensajes_contacto`
--
ALTER TABLE `mensajes_contacto`
  ADD CONSTRAINT `mensajes_contacto_ibfk_1` FOREIGN KEY (`negocio_id`) REFERENCES `negocios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `negocios`
--
ALTER TABLE `negocios`
  ADD CONSTRAINT `negocios_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `negocios_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`),
  ADD CONSTRAINT `negocios_ibfk_3` FOREIGN KEY (`plan_id`) REFERENCES `planes` (`id`);

--
-- Filtros para la tabla `negocio_caracteristicas`
--
ALTER TABLE `negocio_caracteristicas`
  ADD CONSTRAINT `negocio_caracteristicas_ibfk_1` FOREIGN KEY (`negocio_id`) REFERENCES `negocios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `negocio_caracteristicas_ibfk_2` FOREIGN KEY (`caracteristica_id`) REFERENCES `caracteristicas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD CONSTRAINT `noticias_ibfk_1` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `ofertas`
--
ALTER TABLE `ofertas`
  ADD CONSTRAINT `ofertas_ibfk_1` FOREIGN KEY (`negocio_id`) REFERENCES `negocios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `redes_sociales`
--
ALTER TABLE `redes_sociales`
  ADD CONSTRAINT `redes_sociales_ibfk_1` FOREIGN KEY (`negocio_id`) REFERENCES `negocios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reportes_calidad`
--
ALTER TABLE `reportes_calidad`
  ADD CONSTRAINT `reportes_calidad_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reportes_calidad_ibfk_2` FOREIGN KEY (`negocio_id`) REFERENCES `negocios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `resenas`
--
ALTER TABLE `resenas`
  ADD CONSTRAINT `resenas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `resenas_ibfk_2` FOREIGN KEY (`negocio_id`) REFERENCES `negocios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`negocio_id`) REFERENCES `negocios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `transporte_paradas`
--
ALTER TABLE `transporte_paradas`
  ADD CONSTRAINT `transporte_paradas_ibfk_1` FOREIGN KEY (`linea_id`) REFERENCES `transporte_lineas` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
