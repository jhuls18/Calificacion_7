<?php
declare(strict_types=1);

final class Database
{
    private static ?PDO $instance = null;

    public static function connect(): PDO
    {
        if (self::$instance !== null) {
            return self::$instance;
        }

        // Verificar si hay PostgreSQL configurado (Render)
        $databaseUrl = defined('DATABASE_URL') ? DATABASE_URL : null;
        $usePostgres = !empty($databaseUrl);

        if ($usePostgres) {
            // Usar PostgreSQL en Render
            $dsn = $databaseUrl;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            try {
                self::$instance = new PDO($dsn, null, null, $options);
                return self::$instance;
            } catch (PDOException $e) {
                error_log('Error de conexión a PostgreSQL: ' . $e->getMessage());
                // Fallback a SQLite si PostgreSQL falla
            }
        }

        // Usar SQLite como fallback o en local
        if (!DB_USE_SQLITE) {
            throw new RuntimeException('SQLite no está configurado y PostgreSQL no está disponible.');
        }

        // Asegurar que el directorio de datos existe
        if (!is_dir(DATA_PATH)) {
            mkdir(DATA_PATH, 0775, true);
        }

        $dsn = 'sqlite:' . DB_PATH;

        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        try {
            self::$instance = new PDO($dsn, null, null, $options);
            // Habilitar claves foráneas en SQLite
            self::$instance->exec('PRAGMA foreign_keys = ON');
            return self::$instance;
        } catch (PDOException $e) {
            throw new RuntimeException('Error de conexión a SQLite: ' . $e->getMessage());
        }
    }

    public static function isConnected(): bool
    {
        return DB_USE_SQLITE && self::$instance !== null;
    }

    public static function initSchema(): void
    {
        $db = self::connect();
        $isPostgres = defined('DATABASE_URL') && !empty(DATABASE_URL);

        // Tabla de usuarios
        if ($isPostgres) {
            $db->exec("
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    usuario TEXT UNIQUE NOT NULL,
                    nombre TEXT NOT NULL,
                    password TEXT NOT NULL,
                    rol TEXT NOT NULL,
                    foto TEXT,
                    activo INTEGER DEFAULT 1,
                    protegido INTEGER DEFAULT 0,
                    nombre_sesion TEXT,
                    creado TEXT DEFAULT CURRENT_TIMESTAMP,
                    last_login TEXT,
                    last_ip TEXT
                )
            ");
        } else {
            $db->exec("
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    usuario TEXT UNIQUE NOT NULL,
                    nombre TEXT NOT NULL,
                    password TEXT NOT NULL,
                    rol TEXT NOT NULL,
                    foto TEXT,
                    activo INTEGER DEFAULT 1,
                    protegido INTEGER DEFAULT 0,
                    nombre_sesion TEXT,
                    creado TEXT DEFAULT CURRENT_TIMESTAMP,
                    last_login TEXT,
                    last_ip TEXT
                )
            ");
        }

        // Tabla de calificaciones
        $db->exec("
            CREATE TABLE IF NOT EXISTS ratings (
                id TEXT PRIMARY KEY,
                fecha TEXT NOT NULL,
                anio TEXT,
                mes TEXT,
                codigo TEXT,
                tipo TEXT,
                visita_nro INTEGER DEFAULT 1,
                score INTEGER NOT NULL,
                score_max INTEGER DEFAULT 5,
                etiqueta TEXT,
                mensaje TEXT,
                icono TEXT,
                color TEXT,
                puntos INTEGER DEFAULT 0,
                positivo INTEGER DEFAULT 0,
                encuesta_tipo TEXT,
                agente_id TEXT,
                agente_usuario TEXT,
                agente_nombre TEXT,
                rol TEXT,
                ip TEXT
            )
        ");

        // Tabla de clientes
        $db->exec("
            CREATE TABLE IF NOT EXISTS clients (
                codigo TEXT PRIMARY KEY,
                tipo TEXT,
                visitas INTEGER DEFAULT 1,
                primera_visita TEXT,
                ultima_visita TEXT
            )
        ");

        // Tabla de configuración
        $db->exec("
            CREATE TABLE IF NOT EXISTS config (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )
        ");

        // Tabla de usuarios online (sesiones activas)
        $db->exec("
            CREATE TABLE IF NOT EXISTS online_users (
                id TEXT PRIMARY KEY,
                usuario TEXT,
                nombre TEXT,
                rol TEXT,
                last_seen INTEGER,
                ip TEXT
            )
        ");

        // Tabla de tokens de enlaces temporales
        $db->exec("
            CREATE TABLE IF NOT EXISTS tokens (
                token TEXT PRIMARY KEY,
                agente_id TEXT,
                agente_usuario TEXT,
                agente_nombre TEXT,
                agente_rol TEXT,
                encuesta_tipo TEXT,
                created_at INTEGER,
                expires_at INTEGER,
                usado INTEGER DEFAULT 0,
                used_at INTEGER
            )
        ");

        // Crear índices para mejor rendimiento
        $db->exec("CREATE INDEX IF NOT EXISTS idx_ratings_fecha ON ratings(fecha)");
        $db->exec("CREATE INDEX IF NOT EXISTS idx_ratings_agente ON ratings(agente_id)");
        $db->exec("CREATE INDEX IF NOT EXISTS idx_ratings_codigo ON ratings(codigo)");
        $db->exec("CREATE INDEX IF NOT EXISTS idx_ratings_anio_mes ON ratings(anio, mes)");
        $db->exec("CREATE INDEX IF NOT EXISTS idx_tokens_expires ON tokens(expires_at)");
    }
}
