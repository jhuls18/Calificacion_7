# Implementación de SQLite - Guía

## Resumen

El sistema ahora usa **SQLite** como almacenamiento principal. SQLite es una base de datos ligera que se guarda como un archivo dentro del proyecto, lo que garantiza que los datos persistan entre reinicios del servidor.

## Arquitectura de Almacenamiento

### Sistema Dual con SQLite

El sistema mantiene **dos sistemas de almacenamiento** simultáneamente:

1. **SQLite** (Archivo local en `data/database.sqlite`) - Almacenamiento principal
   - Persistente como un archivo en el proyecto
   - No requiere servidor de base de datos
   - Compatible con PHP PDO
   - Rápido y eficiente

2. **Google Sheets** (Backup en la nube) - Backup automático
   - Respaldo en tiempo real
   - Accesible desde cualquier lugar
   - Exportación a Excel directa
   - Ya implementado en el sistema

## Ventajas de SQLite

✅ **Archivo local** - La base de datos es simplemente un archivo en `data/database.sqlite`
✅ **Sin servidor** - No necesitas instalar PostgreSQL ni MySQL
✅ **Persistente** - Los datos se guardan en el archivo, no se borran al reiniciar
✅ **Portable** - Puedes copiar el archivo de base de datos y llevarlo a otro lugar
✅ **Compatible con Excel** - Se mantiene la sincronización con Google Sheets
✅ **Rápido** - SQLite es muy rápido para aplicaciones pequeñas/medianas
✅ **Gratis** - No requiere licencias ni servidores costosos

## Archivos Modificados

1. **app/config.php** - Agregada configuración de SQLite
2. **app/Database.php** - Nueva clase para conexión PDO con SQLite
3. **app/Models/Store.php** - Soporte dual (SQLite + JSON fallback)
4. **app/bootstrap.php** - Inicialización de Database.php

## Ubicación de la Base de Datos

El archivo de base de datos se encuentra en:
```
data/database.sqlite
```

Este archivo se crea automáticamente la primera vez que se ejecuta el sistema.

## Estructura de Tablas

### Tabla: users
```sql
CREATE TABLE users (
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
```

### Tabla: ratings
```sql
CREATE TABLE ratings (
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
```

### Tabla: clients
```sql
CREATE TABLE clients (
    codigo TEXT PRIMARY KEY,
    tipo TEXT,
    visitas INTEGER DEFAULT 1,
    primera_visita TEXT,
    ultima_visita TEXT
)
```

### Tabla: config
```sql
CREATE TABLE config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
)
```

### Tabla: online_users
```sql
CREATE TABLE online_users (
    id TEXT PRIMARY KEY,
    usuario TEXT,
    nombre TEXT,
    rol TEXT,
    last_seen INTEGER,
    ip TEXT
)
```

## Sincronización con Google Sheets/Excel

La sincronización con Google Sheets se mantiene automáticamente:

### Auto-restauración al iniciar
- Si la base de datos está vacía, el sistema intenta restaurar desde Google Sheets
- Preserva las contraseñas locales (por seguridad)
- Restaura usuarios, configuración, clientes y calificaciones

### Backup automático
- Cuando se crean/actualizan usuarios, se sincronizan con Sheets
- Cuando se guarda configuración, se sincroniza con Sheets
- Las calificaciones se envían en tiempo real a Sheets

### Exportación a Excel
- Google Sheets se puede exportar directamente a Excel
- Los datos en Sheets están sincronizados con SQLite

## Cómo Usar

### Primer arranque
1. Inicia el servidor PHP
2. La base de datos `data/database.sqlite` se crea automáticamente
3. Se crean los usuarios por defecto:
   - **admin** / **admin** (Administrador)
   - **atc** / **atc123** (Agente ATC Demo)
   - **ventas** / **ventas123** (Setter de Ventas Demo)

### Backup de la base de datos
Simplemente copia el archivo `data/database.sqlite` a otra ubicación:
```bash
# Windows
copy data\database.sqlite backup\database.sqlite

# Linux/Mac
cp data/database.sqlite backup/database.sqlite
```

### Restaurar desde backup
```bash
# Windows
copy backup\database.sqlite data\database.sqlite

# Linux/Mac
cp backup/database.sqlite data/database.sqlite
```

### Verificar datos con herramientas externas
Puedes abrir el archivo `database.sqlite` con:
- **DB Browser for SQLite** (Windows/Mac/Linux): https://sqlitebrowser.org/
- **DBeaver** (Windows/Mac/Linux): https://dbeaver.io/
- **SQLiteStudio** (Windows/Mac/Linux): https://sqlitestudio.pl/

## Configuración

### Activar/Desactivar SQLite
En `app/config.php`:
```php
define('DB_USE_SQLITE', true);  // true = usar SQLite, false = usar JSON
```

### Cambiar ubicación de la base de datos
En `app/config.php`:
```php
define('DB_PATH', DATA_PATH . '/database.sqlite');
```

## Solución de Problemas

### La base de datos no se crea
- Verifica que el directorio `data/` tenga permisos de escritura
- Verifica que PHP tenga la extensión `pdo_sqlite` habilitada
- Revisa los logs de PHP para errores

### Los datos no se guardan
- Verifica que el archivo `data/database.sqlite` exista
- Verifica permisos de escritura en el directorio `data/`
- Revisa los logs de PHP para errores de PDO

### Errores de SQLite
```php
// Verificar que SQLite está disponible
if (!extension_loaded('pdo_sqlite')) {
    die('La extensión pdo_sqlite no está habilitada en PHP');
}
```

### Los datos se pierden al reiniciar
- Asegúrate de que `DB_USE_SQLITE` esté en `true` en `config.php`
- Verifica que el archivo `database.sqlite` no esté en un directorio temporal
- Si usas Docker, asegúrate de montar el volumen `data/`

## Exportación a Excel

### Método 1: Via Google Sheets
1. Configura Google Sheets en `/admin/config`
2. Los datos se sincronizan automáticamente
3. Exporta el Google Sheet a Excel desde Google Docs

### Método 2: Directo desde SQLite
1. Abre `database.sqlite` con DB Browser for SQLite
2. Selecciona la tabla (ej: users, ratings)
3. File > Export > Export to CSV
4. Abre el CSV en Excel

## Verificación

### Verificar que SQLite está activo
```php
// Agrega esto temporalmente en cualquier controlador
public function testDatabase()
{
    $usingSqlite = DB_USE_SQLITE;
    $db = Database::connect();
    $stmt = $db->query("SELECT COUNT(*) as count FROM users");
    $count = $stmt->fetch()['count'];
    
    return [
        'using_sqlite' => $usingSqlite,
        'users_count' => $count,
        'db_path' => DB_PATH,
    ];
}
```

### Verificar el archivo de base de datos
```bash
# Verificar que el archivo existe
ls -la data/database.sqlite

# Ver tamaño del archivo
du -h data/database.sqlite
```

## Migración desde JSON a SQLite

Si tienes datos en archivos JSON antiguos:

1. El sistema mantendrá compatibilidad con JSON como fallback
2. Para migrar datos manualmente:
   - Lee los archivos JSON de `data/`
   - Usa `Store::write()` para guardar en SQLite
   - Los datos se convertirán automáticamente

## Rendimiento

SQLite es muy rápido para:
- Hasta 100,000 registros por tabla
- Consultas simples con índices
- Operaciones CRUD básicas

Si necesitas más rendimiento:
- Los índices ya están creados en las tablas principales
- Considera usar VACUUM ocasionalmente para optimizar
- Considera migrar a PostgreSQL para bases de datos muy grandes

## Seguridad

### Contraseñas
- Las contraseñas se guardan hasheadas con `password_hash()`
- SQLite no tiene encriptación nativa de archivos
- Para encriptar el archivo, considera usar:
  - SQLite Encryption Extension (SEE)
  - O cifrar el archivo a nivel de sistema operativo

### Permisos
- Asegúrate que el archivo `database.sqlite` tenga permisos restringidos
- Solo el usuario del servidor web debería tener acceso de escritura
- Considera usar chown/chmod en Linux:
```bash
chmod 640 data/database.sqlite
chown www-data:www-data data/database.sqlite
```

## Resumen de Ventajas

✅ **Datos persistentes** - Archivo local que no se borra
✅ **Sin servidor** - No necesitas PostgreSQL ni MySQL
✅ **Fácil backup** - Solo copia el archivo
✅ **Portable** - Lleva la base de datos donde quieras
✅ **Compatible con Excel** - Sincronización con Google Sheets
✅ **Rápido** - Excelente rendimiento para aplicaciones pequeñas/medianas
✅ **Gratis** - No requiere licencias
✅ **Fallback automático** - Si SQLite falla, usa JSON
✅ **Migración transparente** - Los modelos no cambiaron, solo el almacenamiento

## Soporte

Si tienes problemas:
1. Verifica que la extensión `pdo_sqlite` esté habilitada en PHP
2. Revisa los permisos del directorio `data/`
3. Verifica los logs de PHP
4. Usa DB Browser for SQLite para inspeccionar la base de datos
