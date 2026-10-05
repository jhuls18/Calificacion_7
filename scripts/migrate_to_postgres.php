<?php
declare(strict_types=1);

/**
 * Script de migración: Mueve datos desde archivos JSON a PostgreSQL
 * Uso: php scripts/migrate_to_postgres.php
 */

require __DIR__ . '/../app/config.php';
require __DIR__ . '/../app/helpers.php';
require __DIR__ . '/../app/Database.php';

if (!DB_USE_POSTGRES) {
    echo "ERROR: PostgreSQL no está configurado.\n";
    echo "Configura las variables de entorno DB_HOST, DB_NAME, DB_USER, DB_PASS\n";
    exit(1);
}

echo "=== Migración de JSON a PostgreSQL ===\n\n";

try {
    $db = Database::connect();
    Database::initSchema();
    echo "✓ Esquema de base de datos inicializado\n\n";

    // Migrar usuarios
    echo "Migrando usuarios...\n";
    $usersFile = DATA_PATH . '/users.json';
    if (is_file($usersFile)) {
        $users = json_decode(file_get_contents($usersFile), true) ?: [];
        if (!empty($users)) {
            $db->exec("DELETE FROM users");
            $stmt = $db->prepare("
                INSERT INTO users (id, usuario, nombre, password, rol, foto, activo, protegido, nombre_sesion, creado, last_login, last_ip)
                VALUES (:id, :usuario, :nombre, :password, :rol, :foto, :activo, :protegido, :nombre_sesion, :creado, :last_login, :last_ip)
            ");
            foreach ($users as $u) {
                $stmt->execute([
                    ':id' => $u['id'] ?? '',
                    ':usuario' => $u['usuario'] ?? '',
                    ':nombre' => $u['nombre'] ?? '',
                    ':password' => $u['password'] ?? '',
                    ':rol' => $u['rol'] ?? '',
                    ':foto' => $u['foto'] ?? '',
                    ':activo' => $u['activo'] ?? true,
                    ':protegido' => $u['protegido'] ?? false,
                    ':nombre_sesion' => $u['nombre_sesion'] ?? null,
                    ':creado' => $u['creado'] ?? null,
                    ':last_login' => $u['last_login'] ?? null,
                    ':last_ip' => $u['last_ip'] ?? null,
                ]);
            }
            echo "✓ " . count($users) . " usuarios migrados\n";
        } else {
            echo "ℹ No hay usuarios para migrar\n";
        }
    } else {
        echo "ℹ Archivo users.json no encontrado\n";
    }

    // Migrar calificaciones
    echo "\nMigrando calificaciones...\n";
    $ratingsFile = DATA_PATH . '/ratings.json';
    if (is_file($ratingsFile)) {
        $ratings = json_decode(file_get_contents($ratingsFile), true) ?: [];
        if (!empty($ratings)) {
            $db->exec("DELETE FROM ratings");
            $stmt = $db->prepare("
                INSERT INTO ratings (id, fecha, anio, mes, codigo, tipo, visita_nro, score, score_max, etiqueta, mensaje, icono, color, puntos, positivo, encuesta_tipo, agente_id, agente_usuario, agente_nombre, rol, ip)
                VALUES (:id, :fecha, :anio, :mes, :codigo, :tipo, :visita_nro, :score, :score_max, :etiqueta, :mensaje, :icono, :color, :puntos, :positivo, :encuesta_tipo, :agente_id, :agente_usuario, :agente_nombre, :rol, :ip)
            ");
            foreach ($ratings as $r) {
                $stmt->execute([
                    ':id' => $r['id'] ?? '',
                    ':fecha' => $r['fecha'] ?? '',
                    ':anio' => $r['anio'] ?? '',
                    ':mes' => $r['mes'] ?? '',
                    ':codigo' => $r['codigo'] ?? '',
                    ':tipo' => $r['tipo'] ?? '',
                    ':visita_nro' => $r['visita_nro'] ?? 1,
                    ':score' => $r['score'] ?? 0,
                    ':score_max' => $r['score_max'] ?? 5,
                    ':etiqueta' => $r['etiqueta'] ?? '',
                    ':mensaje' => $r['mensaje'] ?? '',
                    ':icono' => $r['icono'] ?? '',
                    ':color' => $r['color'] ?? '',
                    ':puntos' => $r['puntos'] ?? 0,
                    ':positivo' => $r['positivo'] ?? false,
                    ':encuesta_tipo' => $r['encuesta_tipo'] ?? '',
                    ':agente_id' => $r['agente_id'] ?? '',
                    ':agente_usuario' => $r['agente_usuario'] ?? '',
                    ':agente_nombre' => $r['agente_nombre'] ?? '',
                    ':rol' => $r['rol'] ?? '',
                    ':ip' => $r['ip'] ?? '',
                ]);
            }
            echo "✓ " . count($ratings) . " calificaciones migradas\n";
        } else {
            echo "ℹ No hay calificaciones para migrar\n";
        }
    } else {
        echo "ℹ Archivo ratings.json no encontrado\n";
    }

    // Migrar clientes
    echo "\nMigrando clientes...\n";
    $clientsFile = DATA_PATH . '/clients.json';
    if (is_file($clientsFile)) {
        $clients = json_decode(file_get_contents($clientsFile), true) ?: [];
        if (!empty($clients)) {
            $db->exec("DELETE FROM clients");
            $stmt = $db->prepare("
                INSERT INTO clients (codigo, tipo, visitas, primera_visita, ultima_visita)
                VALUES (:codigo, :tipo, :visitas, :primera_visita, :ultima_visita)
            ");
            foreach ($clients as $c) {
                $stmt->execute([
                    ':codigo' => $c['codigo'] ?? '',
                    ':tipo' => $c['tipo'] ?? '',
                    ':visitas' => $c['visitas'] ?? 1,
                    ':primera_visita' => $c['primera_visita'] ?? null,
                    ':ultima_visita' => $c['ultima_visita'] ?? null,
                ]);
            }
            echo "✓ " . count($clients) . " clientes migrados\n";
        } else {
            echo "ℹ No hay clientes para migrar\n";
        }
    } else {
        echo "ℹ Archivo clients.json no encontrado\n";
    }

    // Migrar configuración
    echo "\nMigrando configuración...\n";
    $configFile = DATA_PATH . '/config.json';
    if (is_file($configFile)) {
        $config = json_decode(file_get_contents($configFile), true) ?: [];
        if (!empty($config)) {
            $db->exec("DELETE FROM config");
            $stmt = $db->prepare("INSERT INTO config (key, value) VALUES (:key, :value)");
            foreach ($config as $key => $value) {
                $stmt->execute([
                    ':key' => $key,
                    ':value' => json_encode($value),
                ]);
            }
            echo "✓ " . count($config) . " configuraciones migradas\n";
        } else {
            echo "ℹ No hay configuración para migrar\n";
        }
    } else {
        echo "ℹ Archivo config.json no encontrado\n";
    }

    echo "\n=== Migración completada exitosamente ===\n";
    echo "\nRecomendación: Hace backup de la carpeta data/ antes de eliminarla.\n";
    echo "Los archivos JSON originales aún existen en data/\n";

} catch (Throwable $e) {
    echo "\nERROR: " . $e->getMessage() . "\n";
    exit(1);
}
