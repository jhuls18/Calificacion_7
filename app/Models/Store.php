<?php
declare(strict_types=1);

final class Store
{
    public static function boot(): void
    {
        if (!is_dir(DATA_PATH)) {
            mkdir(DATA_PATH, 0775, true);
        }

        // Inicializar esquema de base de datos (SQLite o PostgreSQL)
        Database::initSchema();

        // Detectar si es un arranque fresco (base de datos vacía)
        $isFreshBoot = self::isEmpty();

        // Inicializar datos por defecto si es necesario
        if ($isFreshBoot) {
            self::ensure('config', self::defaultConfig());
            self::seedUsers();
        }

        // AUTO-RESTAURAR desde Google Sheets si el contenedor arrancó fresco
        if ($isFreshBoot) {
            self::restoreFromSheets();
        }
    }

    private static function isEmpty(): bool
    {
        try {
            $db = Database::connect();
            $stmt = $db->query("SELECT COUNT(*) as count FROM users");
            $count = $stmt->fetch()['count'];
            return $count == 0;
        } catch (\Throwable $e) {
            return true;
        }
    }

    public static function path(string $name): string
    {
        return DATA_PATH . '/' . $name . '.json';
    }

    public static function read(string $name)
    {
        try {
            return self::readFromSQLite($name);
        } catch (\Throwable $e) {
            error_log("Error reading from database: " . $e->getMessage());
            // Fallback a JSON si la base de datos falla
            $file = self::path($name);
            if (!is_file($file)) {
                return [];
            }
            $h = fopen($file, 'rb');
            if (!$h) {
                return [];
            }
            flock($h, LOCK_SH);
            $raw = stream_get_contents($h);
            flock($h, LOCK_UN);
            fclose($h);
            $data = json_decode((string)$raw, true);
            return $data === null ? [] : $data;
        }
    }

    public static function write(string $name, $data): void
    {
        try {
            self::writeToSQLite($name, $data);
            return;
        } catch (\Throwable $e) {
            error_log("Error writing to database: " . $e->getMessage());
            // Fallback a JSON si la base de datos falla
            $file = self::path($name);
            $h = fopen($file, 'c+b');
            if (!$h) {
                throw new RuntimeException('No se pudo escribir ' . $name);
            }
            flock($h, LOCK_EX);
            ftruncate($h, 0);
            rewind($h);
            fwrite($h, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            fflush($h);
            flock($h, LOCK_UN);
            fclose($h);
        }
    }

    private static function readFromSQLite(string $name)
    {
        try {
            $db = Database::connect();

            switch ($name) {
                case 'users':
                    $stmt = $db->query("SELECT * FROM users ORDER BY creado DESC");
                    $rows = $stmt->fetchAll();
                    // Convertir booleanos de SQLite (0/1) a PHP true/false
                    foreach ($rows as &$row) {
                        $row['activo'] = (bool)$row['activo'];
                        $row['protegido'] = (bool)$row['protegido'];
                    }
                    return $rows;

                case 'ratings':
                    $stmt = $db->query("SELECT * FROM ratings ORDER BY fecha DESC");
                    $rows = $stmt->fetchAll();
                    foreach ($rows as &$row) {
                        $row['positivo'] = (bool)$row['positivo'];
                    }
                    return $rows;

                case 'clients':
                    $stmt = $db->query("SELECT * FROM clients");
                    return $stmt->fetchAll();

                case 'config':
                    $stmt = $db->query("SELECT * FROM config");
                    $rows = $stmt->fetchAll();
                    $config = [];
                    foreach ($rows as $row) {
                        $config[$row['key']] = json_decode($row['value'], true);
                    }
                    return $config;

                case 'online':
                    $stmt = $db->query("SELECT * FROM online_users");
                    $rows = $stmt->fetchAll();
                    $online = [];
                    foreach ($rows as $row) {
                        $online[$row['id']] = $row;
                    }
                    return $online;

                case 'tokens':
                    $stmt = $db->query("SELECT * FROM tokens ORDER BY created_at DESC");
                    $rows = $stmt->fetchAll();
                    $tokens = [];
                    foreach ($rows as $row) {
                        $row['usado'] = (bool)$row['usado'];
                        $tokens[] = $row;
                    }
                    return $tokens;

                default:
                    return [];
            }
        } catch (\Throwable $e) {
            error_log("Error reading from SQLite: " . $e->getMessage());
            return [];
        }
    }

    private static function writeToSQLite(string $name, $data): void
    {
        try {
            $db = Database::connect();
            $db->beginTransaction();

            switch ($name) {
                case 'users':
                    $db->exec("DELETE FROM users");
                    $stmt = $db->prepare("
                        INSERT INTO users (id, usuario, nombre, password, rol, foto, activo, protegido, nombre_sesion, creado, last_login, last_ip)
                        VALUES (:id, :usuario, :nombre, :password, :rol, :foto, :activo, :protegido, :nombre_sesion, :creado, :last_login, :last_ip)
                    ");
                    foreach ($data as $u) {
                        $stmt->execute([
                            ':id' => $u['id'] ?? '',
                            ':usuario' => $u['usuario'] ?? '',
                            ':nombre' => $u['nombre'] ?? '',
                            ':password' => $u['password'] ?? '',
                            ':rol' => $u['rol'] ?? '',
                            ':foto' => $u['foto'] ?? '',
                            ':activo' => isset($u['activo']) ? (int)$u['activo'] : 1,
                            ':protegido' => isset($u['protegido']) ? (int)$u['protegido'] : 0,
                            ':nombre_sesion' => $u['nombre_sesion'] ?? '',
                            ':creado' => $u['creado'] ?? date('Y-m-d H:i:s'),
                            ':last_login' => $u['last_login'] ?? null,
                            ':last_ip' => $u['last_ip'] ?? null,
                        ]);
                    }
                    break;

                case 'ratings':
                    $db->exec("DELETE FROM ratings");
                    $stmt = $db->prepare("
                        INSERT INTO ratings (id, fecha, anio, mes, codigo, tipo, visita_nro, score, score_max, etiqueta, mensaje, icono, color, puntos, positivo, encuesta_tipo, agente_id, agente_usuario, agente_nombre, rol, ip)
                        VALUES (:id, :fecha, :anio, :mes, :codigo, :tipo, :visita_nro, :score, :score_max, :etiqueta, :mensaje, :icono, :color, :puntos, :positivo, :encuesta_tipo, :agente_id, :agente_usuario, :agente_nombre, :rol, :ip)
                    ");
                    foreach ($data as $r) {
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
                            ':positivo' => isset($r['positivo']) ? (int)$r['positivo'] : 0,
                            ':encuesta_tipo' => $r['encuesta_tipo'] ?? '',
                            ':agente_id' => $r['agente_id'] ?? '',
                            ':agente_usuario' => $r['agente_usuario'] ?? '',
                            ':agente_nombre' => $r['agente_nombre'] ?? '',
                            ':rol' => $r['rol'] ?? '',
                            ':ip' => $r['ip'] ?? '',
                        ]);
                    }
                    break;

                case 'clients':
                    $db->exec("DELETE FROM clients");
                    $stmt = $db->prepare("
                        INSERT INTO clients (codigo, tipo, visitas, primera_visita, ultima_visita)
                        VALUES (:codigo, :tipo, :visitas, :primera_visita, :ultima_visita)
                    ");
                    foreach ($data as $c) {
                        $stmt->execute([
                            ':codigo' => $c['codigo'] ?? '',
                            ':tipo' => $c['tipo'] ?? '',
                            ':visitas' => $c['visitas'] ?? 1,
                            ':primera_visita' => $c['primera_visita'] ?? null,
                            ':ultima_visita' => $c['ultima_visita'] ?? null,
                        ]);
                    }
                    break;

                case 'config':
                    $db->exec("DELETE FROM config");
                    $stmt = $db->prepare("INSERT INTO config (key, value) VALUES (:key, :value)");
                    foreach ($data as $key => $value) {
                        $stmt->execute([
                            ':key' => $key,
                            ':value' => json_encode($value),
                        ]);
                    }
                    break;

                case 'online':
                    $db->exec("DELETE FROM online_users");
                    $stmt = $db->prepare("
                        INSERT INTO online_users (id, usuario, nombre, rol, last_seen, ip)
                        VALUES (:id, :usuario, :nombre, :rol, :last_seen, :ip)
                    ");
                    foreach ($data as $item) {
                        $stmt->execute([
                            ':id' => $item['id'] ?? '',
                            ':usuario' => $item['usuario'] ?? '',
                            ':nombre' => $item['nombre'] ?? '',
                            ':rol' => $item['rol'] ?? '',
                            ':last_seen' => $item['last_seen'] ?? time(),
                            ':ip' => $item['ip'] ?? '',
                        ]);
                    }
                    break;

                case 'tokens':
                    $db->exec("DELETE FROM tokens");
                    $stmt = $db->prepare("
                        INSERT INTO tokens (token, agente_id, agente_usuario, agente_nombre, agente_rol, encuesta_tipo, created_at, expires_at, usado, used_at)
                        VALUES (:token, :agente_id, :agente_usuario, :agente_nombre, :agente_rol, :encuesta_tipo, :created_at, :expires_at, :usado, :used_at)
                    ");
                    foreach ($data as $item) {
                        $stmt->execute([
                            ':token' => $item['token'] ?? '',
                            ':agente_id' => $item['agente_id'] ?? '',
                            ':agente_usuario' => $item['agente_usuario'] ?? '',
                            ':agente_nombre' => $item['agente_nombre'] ?? '',
                            ':agente_rol' => $item['agente_rol'] ?? '',
                            ':encuesta_tipo' => $item['encuesta_tipo'] ?? '',
                            ':created_at' => $item['created_at'] ?? time(),
                            ':expires_at' => $item['expires_at'] ?? time(),
                            ':usado' => isset($item['usado']) ? (int)$item['usado'] : 0,
                            ':used_at' => $item['used_at'] ?? null,
                        ]);
                    }
                    break;
            }

            $db->commit();
        } catch (\Throwable $e) {
            if ($db->inTransaction()) {
                $db->rollBack();
            }
            throw new RuntimeException('Error writing to SQLite: ' . $e->getMessage());
        }
    }

    /**
     * Restaurar todos los datos desde Google Sheets al arrancar fresco.
     * Mantiene passwords locales (Sheets no las almacena por seguridad).
     */
    public static function restoreFromSheets(): void
    {
        if (!Sheets::enabled()) {
            return;
        }

        try {
            $data = Sheets::fullRestore();
            if (!$data || empty($data['ok'])) {
                return;
            }

            // Restaurar configuración (preservar google_script_url local)
            if (!empty($data['config']) && is_array($data['config'])) {
                $localCfg = self::read('config');
                $remoteCfg = $data['config'];
                // Preservar la URL del script que ya tenemos configurada
                $remoteCfg['google_script_url'] = $localCfg['google_script_url'] ?? '';
                $remoteCfg['google_sheet_view_url'] = $localCfg['google_sheet_view_url'] ?? ($remoteCfg['google_sheet_view_url'] ?? '');
                // Asegurar que niveles_caritas sea int
                if (isset($remoteCfg['niveles_caritas'])) {
                    $remoteCfg['niveles_caritas'] = (int)$remoteCfg['niveles_caritas'];
                }
                self::write('config', array_merge(self::defaultConfig(), $remoteCfg));
            }

            // Restaurar usuarios (merge con locales para mantener passwords)
            if (!empty($data['users']) && is_array($data['users'])) {
                $localUsers = self::read('users');
                $localById = [];
                foreach ($localUsers as $u) {
                    $localById[$u['id'] ?? ''] = $u;
                }

                $restored = [];
                foreach ($data['users'] as $remoteUser) {
                    $id = (string)($remoteUser['id'] ?? '');
                    if (isset($localById[$id])) {
                        // Mantener password local, actualizar el resto
                        $merged = array_merge($remoteUser, [
                            'password' => $localById[$id]['password'],
                        ]);
                        $restored[] = $merged;
                        unset($localById[$id]);
                    } else {
                        // Usuario nuevo desde Sheets (sin password - ponemos default)
                        $remoteUser['password'] = $remoteUser['password'] ?? password_hash('vuela2024', PASSWORD_DEFAULT);
                        $remoteUser['activo'] = true;
                        $restored[] = $remoteUser;
                    }
                }
                // Agregar usuarios locales que no estaban en Sheets
                foreach ($localById as $u) {
                    $restored[] = $u;
                }
                if (!empty($restored)) {
                    self::write('users', $restored);
                }
            }

            // Restaurar calificaciones
            if (!empty($data['ratings']) && is_array($data['ratings'])) {
                $formatted = [];
                foreach ($data['ratings'] as $r) {
                    if (empty($r['fecha'])) continue;
                    $score = (int)($r['score'] ?? 0);
                    $max = (int)($r['score_max'] ?? 5);
                    if ($max < 3) $max = 5;
                    $puntos = (int)($r['puntos'] ?? puntos_por_score($score, $max));
                    $formatted[] = [
                        'id' => (string)($r['id'] ?? ('r-' . uuid())),
                        'fecha' => (string)($r['fecha'] ?? now()),
                        'anio' => (string)($r['anio'] ?? date('Y', strtotime((string)($r['fecha'] ?? 'now')))),
                        'mes' => (string)($r['mes'] ?? date('Y-m', strtotime((string)($r['fecha'] ?? 'now')))),
                        'codigo' => (string)($r['codigo'] ?? 'VISITANTE'),
                        'tipo' => (string)($r['tipo'] ?? 'cliente'),
                        'visita_nro' => (int)($r['visita_nro'] ?? 1),
                        'score' => $score,
                        'score_max' => $max,
                        'etiqueta' => (string)($r['etiqueta'] ?? etiqueta_score($score, $max)),
                        'mensaje' => (string)($r['mensaje'] ?? ''),
                        'icono' => (string)($r['icono'] ?? 'fa-star'),
                        'color' => (string)($r['color'] ?? '#F15A22'),
                        'puntos' => $puntos,
                        'positivo' => $puntos >= 0,
                        'encuesta_tipo' => (string)($r['encuesta_tipo'] ?? 'Atención General'),
                        'agente_id' => (string)($r['agente_id'] ?? ''),
                        'agente_usuario' => (string)($r['agente_usuario'] ?? ''),
                        'agente_nombre' => (string)($r['agente_nombre'] ?? 'Agente'),
                        'rol' => (string)($r['rol'] ?? 'ATC'),
                        'ip' => (string)($r['ip'] ?? '0.0.0.0'),
                    ];
                }
                if (!empty($formatted)) {
                    self::write('ratings', $formatted);
                }
            }

            // Restaurar clientes
            if (!empty($data['clients']) && is_array($data['clients'])) {
                self::write('clients', $data['clients']);
            }

        } catch (\Throwable $e) {
            // No bloquear el arranque si Sheets falla
        }
    }

    /**
     * Hacer backup completo a Google Sheets (usuarios, config, clientes)
     */
    public static function syncToSheets(): void
    {
        if (!Sheets::enabled()) return;
        try {
            Sheets::fullSync(
                self::read('users'),
                self::read('config'),
                self::read('clients')
            );
        } catch (\Throwable $e) {}
    }

    private static function ensure(string $name, $default): void
    {
        $data = self::read($name);
        if (empty($data)) {
            self::write($name, $default);
        }
    }

    private static function defaultConfig(): array
    {
        return [
            'google_script_url' => '',
            'google_sheet_view_url' => '',
            'niveles_caritas' => 5,
            'empresa' => 'Vuela Internet',
            'mensajes_custom' => [],
            'permitir_visitante' => true,
            'cuestionarios' => [
                [
                    'id' => 'cuest-general',
                    'titulo' => 'Atención General',
                    'pregunta' => '¿Cómo califica la atención recibida hoy en caja u oficina?',
                    'escala' => 5,
                    'icono' => 'fa-headset',
                ],
                [
                    'id' => 'cuest-baja',
                    'titulo' => 'Solicitud de Baja',
                    'pregunta' => '¿Cómo evalúa la atención durante su trámite de baja de servicio?',
                    'escala' => 4,
                    'icono' => 'fa-file-excel',
                ],
                [
                    'id' => 'cuest-noc',
                    'titulo' => 'Soporte Técnico NOC',
                    'pregunta' => '¿Cómo califica la atención y solución brindada por Soporte Técnico?',
                    'escala' => 5,
                    'icono' => 'fa-wrench',
                ],
                [
                    'id' => 'cuest-instalacion',
                    'titulo' => 'Instalación Nueva',
                    'pregunta' => '¿Qué tan satisfecho quedó con la instalación de su servicio Vuela?',
                    'escala' => 3,
                    'icono' => 'fa-bolt',
                ],
            ],
        ];
    }

    private static function seedUsers(): void
    {
        $users = self::read('users');
        if (!empty($users)) {
            $changed = false;
            foreach ($users as &$u) {
                if (!empty($u['password']) && !str_starts_with((string)$u['password'], '$2y$')) {
                    $u['password'] = password_hash((string)$u['password'], PASSWORD_DEFAULT);
                    $changed = true;
                }
            }
            unset($u);
            if ($changed) {
                self::write('users', $users);
            }
            $users = self::read('users');
            $prot = false;
            foreach ($users as &$u) {
                if (($u['id'] ?? '') === 'u-admin' || mb_strtolower((string)($u['usuario'] ?? '')) === 'admin') {
                    if (empty($u['protegido'])) {
                        $u['protegido'] = true;
                        $prot = true;
                    }
                }
            }
            unset($u);
            if ($prot) {
                self::write('users', $users);
            }
            return;
        }
        $seed = [
            [
                'id' => 'u-admin',
                'usuario' => 'admin',
                'nombre' => 'Administrador Vuela',
                'password' => password_hash('admin', PASSWORD_DEFAULT),
                'protegido' => true,
                'rol' => 'Administrador',
                'activo' => true,
                'creado' => now(),
                'last_login' => null,
                'last_ip' => null,
            ],
            [
                'id' => 'u-atc',
                'usuario' => 'atc',
                'nombre' => 'Agente ATC Demo',
                'password' => password_hash('atc123', PASSWORD_DEFAULT),
                'rol' => 'ATC',
                'activo' => true,
                'creado' => now(),
                'last_login' => null,
                'last_ip' => null,
            ],
            [
                'id' => 'u-ventas',
                'usuario' => 'ventas',
                'nombre' => 'Setter de Ventas Demo',
                'password' => password_hash('ventas123', PASSWORD_DEFAULT),
                'rol' => 'Setter de Ventas',
                'activo' => true,
                'creado' => now(),
                'last_login' => null,
                'last_ip' => null,
            ],
        ];
        self::write('users', $seed);
    }
}
