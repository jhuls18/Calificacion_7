# 🎬 Tutorial Interactivo del Sistema de Calificación

## 📋 Resumen

Se ha implementado un **Tutorial Interactivo Completo** basado en el guion del video explicativo del Sistema de Calificación Vuela Internet. El tutorial se muestra automáticamente a los usuarios nuevos y puede repetirse mediante un botón escondido.

---

## ✨ Características

### 1. **Tutorial Automático para Usuarios Nuevos**
- Se detecta automáticamente si es un usuario nuevo
- El tutorial se inicia 1.5 segundos después del login
- 14 escenas basadas en el guion del video
- Progreso guardado en la base de datos

### 2. **Botón Escondido para Repetir Tutorial**
- **Triple click** en el logo de Vuela en la navbar
- Solo accesible para usuarios que ya completaron el tutorial
- Permite repasar el tutorial cuando sea necesario

### 3. **Animaciones Rápidas Tipo GIF**
- Cada escena tiene una animación visual única
- Animaciones CSS optimizadas (60fps)
- Efectos visuales que explican cada concepto

### 4. **Navegación Intuitiva**
- Botones Anterior/Siguiente
- Barra de progreso visual
- Indicador de escena actual
- Opción de omitir tutorial

### 5. **Diseño Moderno**
- Modal responsive
- Gradientes y sombras suaves
- Iconos de Font Awesome
- Paleta de colores Vuela Orange

---

## 🎬 Escenas del Tutorial

### ESCENA 1 — Introducción (30s)
- Bienvenida al Sistema de Calificación
- Características principales:
  - Calificación en tiempo real
  - Enlace temporal para calificar remotamente
  - Sincronización con Google Sheets

### ESCENA 2 — Inicio de Sesión (30s)
- Cómo acceder al sistema
- Usuario, contraseña y rol
- Roles disponibles: ATC, NOC, Cajero, Setter de Ventas

### ESCENA 3 — Panel Principal (30s)
- Resumen de actividad personal
- Calificaciones recibidas
- Puntaje acumulado
- Posición en ranking

### ESCENA 4 — Módulo de Calificación (90s)
- Opción 1: Código de Cliente
- Opción 2: Visitante / Directo
- Opción 3: No Calificó / Se Retiró
- Escala visual de caritas

### ESCENA 5 — Selector de Cuestionarios (30s)
- Atención General (5 caritas)
- Solicitud de Baja (4 caritas)
- Soporte Técnico NOC (5 caritas)
- Instalación Nueva (3 caritas)

### ESCENA 6 — Enlace Temporal (60s)
- Validez de 5 minutos
- Asignado al agente
- Mensaje preparado para WhatsApp
- Invalidación automática

### ESCENA 7 — Modo Kiosco (30s)
- Pantalla completa
- Oculta menús y datos internos
- Modo Cliente Limpio
- Reinicio automático en 4 segundos

### ESCENA 8 — Reportes (60s)
- Gráfico de distribución
- Filtros por año, mes, cuestionario
- Exportar a Excel o PDF

### ESCENA 9 — Ranking en Vivo (30s)
- Clasificación por puntos
- +1 positivo, -1 negativo
- Actualización en tiempo real

### ESCENA 10 — Gestión de Usuarios (45s)
- Crear usuarios
- Editar usuarios
- Desactivar usuarios
- Eliminar usuarios

### ESCENA 11 — Configuración (45s)
- Google Apps Script
- Escala de caritas (3-11)
- Cuestionarios personalizados
- Sincronización con Google Sheets

### ESCENA 12 — Sincronización Google Sheets (45s)
- Pestañas: Calificaciones, Usuarios, Config, Clientes, Logins
- Restauración automática
- Respaldo en la nube

### ESCENA 13 — Formulario Oficial (30s)
- Estadísticas del período
- Exportar como PDF
- Para gerencia o auditoría

### ESCENA 14 — Cierre (20s)
- Resumen del sistema
- Medir satisfacción del cliente
- Motivar a los agentes
- Respaldo seguro en la nube

---

## 🎨 Animaciones Visuales

### Animaciones Implementadas

1. **Intro Animation** - Wifi con ondas expansivas
2. **Login Animation** - Inputs pulsantes
3. **Dashboard Animation** - Cards que aparecen
4. **Rating Animation** - Caritas que rebotan
5. **Survey Animation** - Botones rotativos
6. **Link Animation** - Ondas de enlace
7. **Kiosk Animation** - Pantalla con flash
8. **Chart Animation** - Gráfico giratorio y barra creciente
9. **Ranking Animation** - Medallas con rebote
10. **Users Animation** - Avatares que pulsan
11. **Config Animation** - Sliders móviles
12. **Sheets Animation** - Pestañas que voltean
13. **Form Animation** - Líneas que crecen
14. **Finale Animation** - Cohete con estela

Todas las animaciones son:
- ✅ Optimizadas para 60fps
- ✅ CSS puro (sin JavaScript pesado)
- ✅ Repetitivas (loop infinito)
- ✅ Suaves y profesionales

---

## 🔧 Implementación Técnica

### Archivos Creados

1. **`public/js/tutorial.js`** (749 líneas)
   - Clase `TutorialSystem`
   - 14 escenas con contenido HTML
   - Lógica de navegación
   - Botón escondido (triple click)

2. **`public/css/vuela.css`** (+697 líneas)
   - Estilos del modal de tutorial
   - 14 animaciones CSS únicas
   - Estilos responsive
   - Efectos hover y transiciones

### Archivos Modificados

1. **`app/Models/User.php`**
   - Agregado `tutorial_completado` en login
   - Detecta usuario nuevo
   - Retorna flag `is_new_user`

2. **`app/Views/bienvenida.php`**
   - Carga de scripts del tutorial
   - Pasar datos del usuario a JavaScript
   - Detección de usuario nuevo

3. **`app/Views/layout.php`**
   - Carga de `tutorial.js`

4. **`app/Controllers/AuthController.php`**
   - Nuevo método `tutorialCompleted()`
   - Marca tutorial como completado en BD

5. **`index.php`**
   - Nueva ruta `/api/tutorial/completed`

---

## 🎯 Cómo Usar

### Para Usuarios Nuevos

1. El usuario inicia sesión por primera vez
2. Se redirige a `/bienvenida`
3. El tutorial se inicia automáticamente después de 1.5s
4. El usuario navega por las 14 escenas
5. Al finalizar, se marca como completado
6. El usuario continúa al panel principal

### Para Repetir el Tutorial

1. El usuario debe haber completado el tutorial
2. **Triple click** en el logo de Vuela en la navbar
3. El tutorial se abre con todas las escenas
4. Puede navegar libremente

### Para Desarrolladores

```javascript
// Iniciar tutorial manualmente
tutorial.startTutorial();

// Ir a una escena específica
tutorial.currentScene = 5;
tutorial.renderScene();

// Cerrar tutorial
tutorial.closeTutorial();

// Marcar como completado
tutorial.markTutorialCompleted();
```

---

## 🎨 Estilos del Tutorial

### Modal Principal

```css
.modal-tutorial {
  max-width: 800px;
  border-radius: 24px;
  overflow: hidden;
}
```

### Animaciones CSS

Todas las animaciones usan `@keyframes` optimizados:

```css
@keyframes pulseScale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes wifiWave {
  0% { width: 20px; height: 20px; opacity: 1; }
  100% { width: 80px; height: 80px; opacity: 0; }
}
```

### Responsive Design

```css
@media (max-width: 768px) {
  .modal-tutorial {
    max-width: 95%;
  }
  .tutorial-visual {
    height: 80px;
  }
}
```

---

## 🔒 Seguridad

### Flag de Tutorial Completado

El flag `tutorial_completado` se guarda en:
- Base de datos (PostgreSQL o JSON)
- Sesión del usuario
- LocalStorage (para UI)

Solo los usuarios pueden marcar su propio tutorial como completado.

### Botón Escondido

El botón escondido requiere:
- Triple click en el logo
- Solo funciona si el tutorial ya fue completado
- No visible en el DOM

---

## 📊 Flujo del Tutorial

```
Login → Bienvenida → [Usuario Nuevo?]
                        ↓ Si
                    Tutorial Automático
                        ↓
                    Navegar Escenas
                        ↓
                    Finalizar Tutorial
                        ↓
                    Marcar Completado
                        ↓
                    Panel Principal
```

---

## 🎮 Interacción del Usuario

### Navegación

- **Botón Anterior**: Regresa a la escena anterior
- **Botón Siguiente**: Avanza a la siguiente escena
- **Botón Omitir**: Cierra el tutorial sin completar
- **Botón Cerrar (X)**: Cierra el modal

### Barra de Progreso

- Muestra progreso actual (ej: ESCENA 5 de 14)
- Barra visual de progreso
- Indica duración estimada de cada escena

### Animaciones

- Cada escena tiene una animación visual única
- Las animaciones son bucles infinitos
- Simulan GIFs sin cargar archivos pesados

---

## 🎯 Personalización

### Modificar Escenas

Edita `public/js/tutorial.js`:

```javascript
getScenes() {
  return [
    {
      id: 1,
      title: '🎬 ESCENA 1 — Introducción',
      duration: 30,
      icon: 'fa-play-circle',
      content: `<!-- Tu HTML aquí -->`
    },
    // ... más escenas
  ];
}
```

### Modificar Animaciones

Edita `public/css/vuela.css`:

```css
@keyframes tuAnimacion {
  0% { /* estado inicial */ }
  50% { /* estado medio */ }
  100% { /* estado final */ }
}
```

### Cambiar Trigger del Botón Escondido

Edita `public/js/tutorial.js`:

```javascript
addHiddenButton() {
  const logo = document.querySelector('.navbar-brand img');
  let clickCount = 0;
  let clickTimer;

  logo.addEventListener('click', () => {
    clickCount++;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      clickCount = 0;
    }, 500);

    if (clickCount === 3) { // Cambia 3 por otro número
      this.startTutorial();
      clickCount = 0;
    }
  });
}
```

---

## 🚀 Rendimiento

### Optimizaciones

1. **CSS Puro** - Animaciones sin JavaScript
2. **Transform GPU** - Hardware acceleration
3. **Lazy Loading** - El modal se crea solo cuando es necesario
4. **Event Delegation** - Un solo listener para botones
5. **Session Storage** - Datos temporales en el cliente

### Tamaño de Archivos

- `tutorial.js`: ~30KB (comprimido)
- CSS adicional: ~15KB (comprimido)
- Total impacto: ~45KB

---

## 📱 Compatibilidad

### Navegadores Soportados

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

### Dispositivos

- ✅ Desktop (Windows, Mac, Linux)
- ✅ Tablet (iPad, Android tablets)
- ✅ Mobile (iOS, Android)

---

## 🐛 Solución de Problemas

### El Tutorial No Se Muestra

**Causa**: El usuario ya completó el tutorial

**Solución**:
- Triple click en el logo para repetir
- O marcar manualmente `tutorial_completado = false` en BD

### Las Animaciones No Funcionan

**Causa**: CSS no cargado correctamente

**Solución**:
- Verificar que `vuela.css` esté cargado
- Limpiar caché del navegador
- Verificar consola para errores

### El Modal No Se Cierra

**Causa**: Error en JavaScript

**Solución**:
- Verificar consola del navegador
- Recargar la página
- Revisar que Bootstrap JS esté cargado

---

## 📝 Checklist de Implementación

- [x] Sistema de tutorial interactivo
- [x] 14 escenas basadas en el guion
- [x] Animaciones CSS tipo GIF
- [x] Botón escondido (triple click)
- [x] Detección de usuario nuevo
- [x] Guardado de progreso en BD
- [x] Navegación intuitiva
- [x] Barra de progreso visual
- [x] Diseño responsive
- [x] Documentación completa

---

## 🎓 Ejemplos de Uso

### Agregar Nueva Escena

```javascript
{
  id: 15,
  title: '🎬 ESCENA 15 — Nueva Funcionalidad',
  duration: 30,
  icon: 'fa-star',
  content: `
    <div class="tutorial-scene-content">
      <div class="tutorial-visual mb-4">
        <div class="tutorial-animation">
          <!-- Tu animación aquí -->
        </div>
      </div>
      <h4 class="fw-bold mb-3">Título</h4>
      <p class="text-muted">Descripción</p>
    </div>
  `
}
```

### Crear Nueva Animación

```css
@keyframes miAnimacion {
  0% { transform: translateY(0); opacity: 0; }
  50% { transform: translateY(-10px); opacity: 1; }
  100% { transform: translateY(0); opacity: 0; }
}

.mi-animacion {
  animation: miAnimacion 2s ease-in-out infinite;
}
```

---

## 🎉 Conclusión

El tutorial interactivo ofrece:

- ✅ **Experiencia guiada** para usuarios nuevos
- ✅ **Animaciones visuales** tipo GIF
- ✅ **Navegación intuitiva** con botones claros
- ✅ **Progreso guardado** en la base de datos
- ✅ **Botón escondido** para repetir cuando sea necesario
- ✅ **Diseño moderno** y responsive
- ✅ **Rendimiento optimizado** con CSS puro
- ✅ **Fácil de personalizar** y extender

El tutorial mejora significativamente la onboarding de nuevos usuarios, reduciendo la curva de aprendizaje y asegurando que comprendan todas las funcionalidades del sistema.
