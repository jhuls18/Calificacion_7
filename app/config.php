<?php
declare(strict_types=1);

define('ROOT_PATH', dirname(__DIR__));
define('APP_PATH', ROOT_PATH . '/app');
define('DATA_PATH', ROOT_PATH . '/data');
define('PUBLIC_PATH', ROOT_PATH . '/public');
define('BASE_URL', '');

define('APP_NAME', 'Vuela Internet');
define('APP_TAGLINE', 'Internet de verdad');
define('APP_TITLE', 'Sistema de Calificación de Atención');

define('SESSION_NAME', 'vuela_calif');
define('CSRF_KEY', '_csrf');

// Configuración de Base de Datos
// En Render usa PostgreSQL automáticamente si DATABASE_URL está configurado
// En local usa SQLite por defecto
define('DB_USE_SQLITE', !getenv('DATABASE_URL'));
define('DB_PATH', DATA_PATH . '/database.sqlite');

// Configuración de PostgreSQL (se usa automáticamente en Render)
define('DB_HOST', getenv('DB_HOST') ?: getenv('POSTGRES_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: getenv('POSTGRES_DB') ?: 'sis_calif');
define('DB_USER', getenv('DB_USER') ?: getenv('POSTGRES_USER') ?: 'postgres');
define('DB_PASS', getenv('DB_PASS') ?: getenv('POSTGRES_PASSWORD') ?: '');
define('DB_PORT', getenv('DB_PORT') ?: getenv('POSTGRES_PORT') ?: '5432');
define('DATABASE_URL', getenv('DATABASE_URL') ?: null);

define('ROLES', [
    'Administrador',
    'ATC',
    'NOC',
    'Setter de Ventas',
    'Cajero / Caja',
    'Soporte Técnico',
    'Cobranzas',
    'Supervisor',
    'Freelancer',
]);

define('VUELA_ORANGE', '#F15A22');
define('VUELA_ORANGE_DARK', '#D94A12');
