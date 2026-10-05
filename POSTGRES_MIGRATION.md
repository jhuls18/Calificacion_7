# Migración a PostgreSQL - Instrucciones

## Resumen

El sistema ahora usa **PostgreSQL** como almacenamiento principal en lugar de archivos JSON. Esto soluciona el problema de que los datos se borraban cada vez que el contenedor de Render se reiniciaba.

## Arquitectura de Almacenamiento

### Dual Storage (Redundancia de Datos)

El sistema mantiene **dos sistemas de almacenamiento** simultáneamente:

1. **PostgreSQL** (Local en Render) - Almacenamiento principal
   - Persistente incluso si el contenedor se reinicia
   - Gratuito en el plan free de Render
   - Base de datos relacional robusta

2. **Google Sheets** (Backup en la nube) - Backup automático
   - Respaldo en tiempo real
   - Accesible desde cualquier lugar
   - Ya implementado en el sistema

## Cambios Realizados

### Archivos Modificados

1. **app/config.php** - Agregada configuración de PostgreSQL
2. **app/Database.php** - Nueva clase para conexión PDO
3. **app/bootstrap.php** - Inicialización de esquema PostgreSQL
4. **app/Models/Store.php** - Soporte dual (PostgreSQL + JSON fallback)
5. **Dockerfile** - Agregada extensión PostgreSQL
6. **render.yaml** - Configuración de base de datos PostgreSQL

### Archivos Nuevos

1. **scripts/migrate_to_postgres.php** - Script de migración de datos

## Despliegue en Render

### Paso 1: Actualizar el repositorio

```bash
git add .
git commit -m "Migración a PostgreSQL para almacenamiento persistente"
git push origin main
```

### Paso 2: Redesplegar en Render

1. Ve a tu dashboard de Render
2. Tu servicio web se redeployará automáticamente
3. Render creará automáticamente la base de datos PostgreSQL gratuita
4. La variable de entorno `DATABASE_URL` se configurará automáticamente

### Paso 3: Verificar el despliegue

1. El sistema detectará automáticamente PostgreSQL y lo usará
2. Si PostgreSQL falla, el sistema fallback a JSON (modo seguro)
3. El esquema de base de datos se crea automáticamente al iniciar

## Migración de Datos Existentes

### Si tienes datos en archivos JSON locales

Ejecuta el script de migración en tu entorno local (con PostgreSQL configurado):

```bash
# Configura las variables de entorno si es necesario
export DB_HOST=localhost
export DB_NAME=sis_calif
export DB_USER=postgres
export DB_PASS=tu_password

# Ejecuta la migración
php scripts/migrate_to_postgres.php
```

### Si tienes datos en Google Sheets

El sistema **restaurará automáticamente** los datos desde Google Sheets cuando:
- El contenedor arranca por primera vez
- La base de datos está vacía
- Google Sheets está configurado

No necesitas hacer nada manualmente.

## Verificación

### Verificar que PostgreSQL está activo

En tu aplicación, puedes agregar un endpoint temporal para verificar:

```php
// Agrega esto en AdminController.php o similar
public function testDatabase()
{
    $usingPostgres = DB_USE_POSTGRES;
    $data = Store::read('users');
    return [
        'using_postgres' => $usingPostgres,
        'users_count' => count($data),
    ];
}
```

### Verificar en Render

1. Ve a la sección "Databases" en Render
2. Verifica que la base de datos "sis-calif-db" esté activa
3. Revisa los logs del servicio web para ver mensajes de conexión PostgreSQL

## Solución de Problemas

### PostgreSQL no se conecta

- Verifica que la variable `DATABASE_URL` esté configurada en Render
- Revisa los logs del servicio web
- El sistema fallback automáticamente a JSON si PostgreSQL falla

### Datos no se muestran después del despliegue

- Si Google Sheets está configurado, el sistema restaurará automáticamente
- Si no, los datos se reiniciarán con los usuarios por defecto (admin, atc, ventas)
- Puedes reconfigurar desde el panel de administración

### Datos perdidos

- Los datos en PostgreSQL persisten entre reinicios
- Google Sheets mantiene un backup adicional
- Si perdiste datos, verifica en Google Sheets

## Configuración de Google Sheets (Opcional pero Recomendado)

Para tener doble respaldo, configura Google Sheets:

1. Crea un Google Sheet
2. Configura el Google Apps Script (incluido en la carpeta `google-apps-script/`)
3. Ve a `/admin/config` en tu aplicación
4. Ingresa la URL del script
5. Prueba la conexión

## Resumen de Ventajas

✅ **Datos persistentes** - No se borran al reiniciar el contenedor
✅ **Base de datos robusta** - PostgreSQL es más confiable que archivos JSON
✅ **Gratis en Render** - Plan free incluye PostgreSQL
✅ **Doble respaldo** - PostgreSQL + Google Sheets
✅ **Fallback automático** - Si PostgreSQL falla, usa JSON
✅ **Migración transparente** - Los modelos no cambiaron, solo el almacenamiento

## Soporte

Si tienes problemas:
1. Revisa los logs en Render
2. Verifica que la base de datos esté activa
3. Contacta al desarrollador
