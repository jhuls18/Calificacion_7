/**
 * Sistema de Tutorial Interactivo Completo
 * Basado en el guion del video explicativo del Sistema de Calificación Vuela Internet
 * Con versiones para Administrador y Agente
 */

class TutorialSystem {
  constructor() {
    this.currentScene = 0;
    this.isTutorialActive = false;
    this.scenes = this.getScenes();
    this.userRole = window.VUELA_USER_DATA?.rol || 'agente';
    this.init();
  }

  init() {
    // Hacer accesible globalmente inmediatamente
    window.tutorialSystem = this;
    window.tutorial = this;

    // Verificar si es usuario nuevo
    const userData = window.VUELA_USER_DATA || {};
    const isNewUser = userData.is_new_user || !userData.tutorial_completado;

    console.log('Tutorial init - isNewUser:', isNewUser, 'userData:', userData);

    if (isNewUser) {
      console.log('Usuario nuevo detectado, iniciando tutorial en 1.5s');
      setTimeout(() => {
        console.log('Iniciando tutorial automaticamente...');
        this.startTutorial();
      }, 1500);
    }

    // Agregar botón escondido para repetir tutorial
    this.addHiddenButton();
  }

  getScenes() {
    const isAdmin = this.userRole === 'Administrador';

    // Escenas base para todos
    const baseScenes = [
      {
        id: 1,
        title: '🎬 ESCENA 1 — Introducción',
        duration: 30,
        icon: 'fa-play-circle',
        content: `
          <div class="tutorial-scene-content">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation intro-animation">
                <i class="fa-solid fa-wifi text-vuela fs-1"></i>
                <div class="wifi-waves">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">Bienvenidos al Sistema de Calificación de Atención Vuela Internet</h4>
            <p class="text-muted mb-3">Una herramienta diseñada para medir y mejorar la calidad del servicio que brindamos a nuestros clientes.</p>
            <div class="tutorial-highlights">
              <div class="highlight-item">
                <i class="fa-solid fa-check-circle text-success me-2"></i>
                <span>Calificación en tiempo real</span>
              </div>
              <div class="highlight-item">
                <i class="fa-solid fa-check-circle text-success me-2"></i>
                <span>Enlace temporal para calificar remotamente</span>
              </div>
              <div class="highlight-item">
                <i class="fa-solid fa-check-circle text-success me-2"></i>
                <span>Sincronización automática con Google Sheets</span>
              </div>
            </div>
          </div>
        `
      },
      {
        id: 2,
        title: '🎬 ESCENA 2 — Inicio de Sesión',
        duration: 30,
        icon: 'fa-right-to-bracket',
        content: `
          <div class="tutorial-scene-content">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation login-animation">
                <i class="fa-solid fa-user-lock text-vuela fs-1"></i>
                <div class="login-inputs">
                  <div class="input-line"></div>
                  <div class="input-line"></div>
                </div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">Para acceder al sistema</h4>
            <p class="text-muted mb-3">Cada agente debe iniciar sesión con:</p>
            <ul class="tutorial-list">
              <li><i class="fa-solid fa-user me-2 text-vuela"></i>Nombre de usuario</li>
              <li><i class="fa-solid fa-key me-2 text-vuela"></i>Contraseña</li>
              <li><i class="fa-solid fa-id-badge me-2 text-vuela"></i>Rol dentro de la empresa</li>
            </ul>
            <div class="tutorial-roles mt-3">
              <span class="badge badge-vuela me-1">ATC</span>
              <span class="badge badge-vuela me-1">NOC</span>
              <span class="badge badge-vuela me-1">Cajero</span>
              <span class="badge badge-vuela">Setter de Ventas</span>
            </div>
          </div>
        `
      },
      {
        id: 3,
        title: '🎬 ESCENA 3 — Panel Principal',
        duration: 30,
        icon: 'fa-gauge-high',
        content: `
          <div class="tutorial-scene-content">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation dashboard-animation">
                <div class="dashboard-cards">
                  <div class="dash-card"></div>
                  <div class="dash-card"></div>
                  <div class="dash-card"></div>
                  <div class="dash-card"></div>
                </div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">Panel Principal</h4>
            <p class="text-muted mb-3">Resumen rápido de tu actividad:</p>
            <div class="tutorial-stats">
              <div class="stat-item">
                <i class="fa-solid fa-star text-warning me-2"></i>
                <span>Calificaciones recibidas</span>
              </div>
              <div class="stat-item">
                <i class="fa-solid fa-trophy text-vuela me-2"></i>
                <span>Puntaje acumulado</span>
              </div>
            </div>
            <div class="tutorial-instruction mt-3 p-3 bg-light rounded-3">
              <strong><i class="fa-solid fa-hand-pointer text-vuela me-2"></i>Presiona aquí:</strong>
              <p class="mb-0 small">El botón <strong>Panel</strong> en la barra de navegación (resaltado en naranja)</p>
            </div>
          </div>
        `
      },
              </div>
              <div class="stat-item">
                <i class="fa-solid fa-ranking-star text-success me-2"></i>
                <span>Posición en ranking</span>
              </div>
            </div>
            <p class="text-muted small mt-3">Acceso rápido a: Calificar, Atención, Reportes, Usuarios y Configuración.</p>
          </div>
        `
      },
      {
        id: 4,
        title: '🎬 ESCENA 4 — Módulo de Calificación',
        duration: 90,
        icon: 'fa-face-smile',
        content: `
          <div class="tutorial-scene-content">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation rating-animation">
                <div class="rating-faces">
                  <span class="face sad">😠</span>
                  <span class="face neutral">😐</span>
                  <span class="face happy">😊</span>
                </div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">Módulo de Calificación</h4>
            <p class="text-muted mb-3">El corazón del sistema donde el cliente califica la atención.</p>
            <div class="tutorial-options">
              <div class="option-card">
                <span class="option-number">1</span>
                <strong>Código de Cliente</strong>
                <small>Ingresa código o cédula. Detecta automáticamente si es cliente recurrente.</small>
              </div>
              <div class="option-card">
                <span class="option-number">2</span>
                <strong>Visitante / Directo</strong>
                <small>Para clientes sin código. Atención anónima.</small>
              </div>
              <div class="option-card">
                <span class="option-number">3</span>
                <strong>No Calificó / Se Retiró</strong>
                <small>Cliente se fue sin calificar. No afecta puntos del agente.</small>
              </div>
            </div>
            <div class="tutorial-spectrum mt-3">
              <p class="small text-muted mb-2">Escala visual: Rojo (desfavorable) → Verde (excelente)</p>
              <div class="spectrum-bar-mini">
                <div class="spectrum-fill-mini"></div>
              </div>
            </div>
            <div class="tutorial-instruction mt-3 p-3 bg-light rounded-3">
              <strong><i class="fa-solid fa-hand-pointer text-vuela me-2"></i>Presiona aquí:</strong>
              <p class="mb-0 small">El botón <strong>Calificar</strong> en la barra de navegación (resaltado en naranja)</p>
            </div>
          </div>
        `
      },
      {
        id: 5,
        title: '🎬 ESCENA 5 — Selector de Cuestionarios',
        duration: 30,
        icon: 'fa-list-check',
        content: `
          <div class="tutorial-scene-content">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation survey-animation">
                <div class="survey-buttons">
                  <div class="survey-btn">1</div>
                  <div class="survey-btn">2</div>
                  <div class="survey-btn">3</div>
                </div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">Múltiples Cuestionarios</h4>
            <p class="text-muted mb-3">Cada cuestionario tiene su propia pregunta y escala de caritas:</p>
            <div class="tutorial-surveys">
              <div class="survey-item">
                <i class="fa-solid fa-headset text-vuela me-2"></i>
                <span>Atención General (5 caritas)</span>
              </div>
              <div class="survey-item">
                <i class="fa-solid fa-file-excel text-warning me-2"></i>
                <span>Solicitud de Baja (4 caritas)</span>
              </div>
              <div class="survey-item">
                <i class="fa-solid fa-wrench text-info me-2"></i>
                <span>Soporte Técnico NOC (5 caritas)</span>
              </div>
              <div class="survey-item">
                <i class="fa-solid fa-bolt text-success me-2"></i>
                <span>Instalación Nueva (3 caritas)</span>
              </div>
            </div>
            <p class="text-muted small mt-3">El administrador puede crear y personalizar cuestionarios desde la configuración.</p>
            <div class="tutorial-instruction mt-3 p-3 bg-light rounded-3">
              <strong><i class="fa-solid fa-hand-pointer text-vuela me-2"></i>Presiona aquí:</strong>
              <p class="mb-0 small">El botón <strong>Atención</strong> en la barra de navegación (resaltado en naranja)</p>
            </div>
          </div>
        `
      },
      {
        id: 6,
        title: '🎬 ESCENA 6 — Enlace Temporal',
        duration: 60,
        icon: 'fa-link',
        content: `
          <div class="tutorial-scene-content">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation link-animation">
                <i class="fa-solid fa-link text-vuela fs-1"></i>
                <div class="link-waves">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">Enlace Temporal de Calificación</h4>
            <p class="text-muted mb-3">Envía un link por WhatsApp para que el cliente califique desde su celular.</p>
            <div class="tutorial-link-features">
              <div class="feature-item">
                <i class="fa-solid fa-clock text-vuela me-2"></i>
                <strong>Validez de 5 minutos</strong>
                <small>El enlace expira automáticamente</small>
              </div>
              <div class="feature-item">
                <i class="fa-solid fa-user-tag text-success me-2"></i>
                <strong>Asignado al agente</strong>
                <small>La calificación se asigna a quien generó el link</small>
              </div>
              <div class="feature-item">
                <i class="fa-solid fa-whatsapp text-success me-2"></i>
                <strong>Mensaje preparado</strong>
                <small>Texto listo para copiar y enviar</small>
              </div>
            </div>
            <div class="alert alert-info mt-3">
              <i class="fa-solid fa-info-circle me-2"></i>
              <small>Una vez usado, el enlace se invalida automáticamente.</small>
            </div>
          </div>
        `
      },
      {
        id: 7,
        title: '🎬 ESCENA 7 — Modo Kiosco',
        duration: 30,
        icon: 'fa-expand',
        content: `
          <div class="tutorial-scene-content">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation kiosk-animation">
                <i class="fa-solid fa-tablet-screen-button text-vuela fs-1"></i>
                <div class="kiosk-screen">
                  <div class="kiosk-content"></div>
                </div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">Modo Kiosco / Pantalla Completa</h4>
            <p class="text-muted mb-3">Ideal para tablet o pantalla de atención al público.</p>
            <div class="tutorial-kiosk-features">
              <div class="kiosk-feature">
                <i class="fa-solid fa-eye-slash text-warning me-2"></i>
                <span>Oculta menús y datos internos</span>
              </div>
              <div class="kiosk-feature">
                <i class="fa-solid fa-face-smile text-success me-2"></i>
                <span>Muestra solo las caritas de calificación</span>
              </div>
              <div class="kiosk-feature">
                <i class="fa-solid fa-rotate text-info me-2"></i>
                <span>Reinicio automático en 4 segundos</span>
              </div>
            </div>
            <div class="tutorial-clean-mode mt-3">
              <span class="badge badge-vuela">Modo Cliente Limpio</span>
              <small class="text-muted ms-2">Oculta nombre del agente y selector de cuestionario</small>
            </div>
          </div>
        `
      },
      {
        id: 8,
        title: '🎬 ESCENA 8 — Reportes',
        duration: 60,
        icon: 'fa-chart-pie',
        content: `
          <div class="tutorial-scene-content">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation chart-animation">
                <div class="chart-pie"></div>
                <div class="chart-bar"></div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">Panel de Reportes</h4>
            <p class="text-muted mb-3">Vista completa de todas las calificaciones.</p>
            <div class="tutorial-reports">
              <div class="report-item">
                <i class="fa-solid fa-chart-pie text-vuela me-2"></i>
                <strong>Gráfico de distribución</strong>
                <small>Por etiqueta: Excelente, Buena, Regular, Muy Mala</small>
              </div>
              <div class="report-item">
                <i class="fa-solid fa-filter text-info me-2"></i>
                <strong>Filtros disponibles</strong>
                <small>Año, Mes, Tipo de cuestionario, Rango de fechas</small>
              </div>
              <div class="report-item">
                <i class="fa-solid fa-file-export text-success me-2"></i>
                <strong>Exportar datos</strong>
                <small>Excel o PDF para informes externos</small>
              </div>
            </div>
          </div>
        `
      },
      {
        id: 9,
        title: '🎬 ESCENA 9 — Ranking en Vivo',
        duration: 30,
        icon: 'fa-ranking-star',
        content: `
          <div class="tutorial-scene-content">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation ranking-animation">
                <div class="ranking-list">
                  <div class="rank-item gold">🥇</div>
                  <div class="rank-item silver">🥈</div>
                  <div class="rank-item bronze">🥉</div>
                </div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">Ranking de Agentes en Vivo</h4>
            <p class="text-muted mb-3">Clasificación según puntos acumulados.</p>
            <div class="tutorial-ranking-rules">
              <div class="rule-item positive">
                <i class="fa-solid fa-plus-circle text-success me-2"></i>
                <span>Calificación positiva: +1 punto</span>
              </div>
              <div class="rule-item negative">
                <i class="fa-solid fa-minus-circle text-danger me-2"></i>
                <span>Calificación negativa: -1 punto</span>
              </div>
              <div class="rule-item neutral">
                <i class="fa-solid fa-circle text-muted me-2"></i>
                <span>Calificación neutra: No afecta</span>
              </div>
            </div>
            <div class="alert alert-success mt-3">
              <i class="fa-solid fa-bolt me-2"></i>
              <small>Actualización en tiempo real</small>
            </div>
          </div>
        `
      },
      {
        id: 10,
        title: '🎬 ESCENA 10 — Gestión de Usuarios',
        duration: 45,
        icon: 'fa-users',
        content: `
          <div class="tutorial-scene-content">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation users-animation">
                <i class="fa-solid fa-users text-vuela fs-1"></i>
                <div class="user-avatars">
                  <div class="avatar"></div>
                  <div class="avatar"></div>
                  <div class="avatar"></div>
                </div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">Gestión de Usuarios</h4>
            <p class="text-muted mb-3">El administrador puede:</p>
            <div class="tutorial-user-actions">
              <div class="action-item">
                <i class="fa-solid fa-user-plus text-success me-2"></i>
                <span>Crear nuevos usuarios</span>
              </div>
              <div class="action-item">
                <i class="fa-solid fa-user-pen text-info me-2"></i>
                <span>Editar usuarios existentes</span>
              </div>
              <div class="action-item">
                <i class="fa-solid fa-user-slash text-warning me-2"></i>
                <span>Desactivar usuarios</span>
              </div>
              <div class="action-item">
                <i class="fa-solid fa-user-xmark text-danger me-2"></i>
                <span>Eliminar usuarios</span>
              </div>
            </div>
            <div class="alert alert-warning mt-3">
              <i class="fa-solid fa-shield-halved me-2"></i>
              <small>El usuario administrador principal está protegido.</small>
            </div>
          </div>
        `
      },
      {
        id: 11,
        title: '🎬 ESCENA 11 — Configuración',
        duration: 45,
        icon: 'fa-sliders',
        content: `
          <div class="tutorial-scene-content">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation config-animation">
                <i class="fa-solid fa-sliders text-vuela fs-1"></i>
                <div class="config-sliders">
                  <div class="slider"></div>
                  <div class="slider"></div>
                  <div class="slider"></div>
                </div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">Configuración del Sistema</h4>
            <p class="text-muted mb-3">En esta sección puedes:</p>
            <div class="tutorial-config-items">
              <div class="config-item">
                <i class="fa-brands fa-google text-vuela me-2"></i>
                <span>Configurar Google Apps Script</span>
              </div>
              <div class="config-item">
                <i class="fa-solid fa-face-smile text-warning me-2"></i>
                <span>Ajustar escala de caritas (3-11 niveles)</span>
              </div>
              <div class="config-item">
                <i class="fa-solid fa-plus-circle text-success me-2"></i>
                <span>Crear cuestionarios personalizados</span>
              </div>
              <div class="config-item">
                <i class="fa-solid fa-database text-info me-2"></i>
                <span>Sincronizar desde Google Sheets</span>
              </div>
            </div>
            <p class="text-muted small mt-3">La configuración se guarda localmente y en Google Sheets.</p>
          </div>
        `
      },
      {
        id: 12,
        title: '🎬 ESCENA 12 — Sincronización Google Sheets',
        duration: 45,
        icon: 'fa-table-cells',
        content: `
          <div class="tutorial-scene-content">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation sheets-animation">
                <i class="fa-solid fa-table-cells text-success fs-1"></i>
                <div class="sheets-tabs">
                  <div class="tab"></div>
                  <div class="tab"></div>
                  <div class="tab"></div>
                </div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">Sincronización con Google Sheets</h4>
            <p class="text-muted mb-3">Los datos se envían automáticamente a la hoja de cálculo.</p>
            <div class="tutorial-sheets-tabs">
              <div class="sheets-tab">
                <i class="fa-solid fa-star text-warning me-2"></i>
                <span>Calificaciones</span>
              </div>
              <div class="sheets-tab">
                <i class="fa-solid fa-users text-info me-2"></i>
                <span>Usuarios</span>
              </div>
              <div class="sheets-tab">
                <i class="fa-solid fa-gear text-vuela me-2"></i>
                <span>Config</span>
              </div>
              <div class="sheets-tab">
                <i class="fa-solid fa-user text-success me-2"></i>
                <span>Clientes</span>
              </div>
              <div class="sheets-tab">
                <i class="fa-solid fa-right-to-bracket text-primary me-2"></i>
                <span>Logins</span>
              </div>
            </div>
            <div class="alert alert-success mt-3">
              <i class="fa-solid fa-cloud-arrow-up me-2"></i>
              <small>Si el servidor se reinicia, los datos se restauran automáticamente.</small>
            </div>
          </div>
        `
      },
      {
        id: 13,
        title: '🎬 ESCENA 13 — Formulario Oficial',
        duration: 30,
        icon: 'fa-file-contract',
        content: `
          <div class="tutorial-scene-content">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation form-animation">
                <i class="fa-solid fa-file-pdf text-danger fs-1"></i>
                <div class="form-lines">
                  <div class="line"></div>
                  <div class="line"></div>
                  <div class="line"></div>
                </div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">Formulario Oficial de Evaluación</h4>
            <p class="text-muted mb-3">Genera un formulario profesional en formato PDF.</p>
            <div class="tutorial-form-features">
              <div class="form-feature">
                <i class="fa-solid fa-chart-line text-vuela me-2"></i>
                <span>Resumen de estadísticas del período</span>
              </div>
              <div class="form-feature">
                <i class="fa-solid fa-file-pdf text-danger me-2"></i>
                <span>Exportar como PDF</span>
              </div>
              <div class="form-feature">
                <i class="fa-solid fa-building text-info me-2"></i>
                <span>Ideal para gerencia o auditoría</span>
              </div>
            </div>
          </div>
        `
      },
      {
        id: 14,
        title: '🎬 ESCENA 14 — Cierre',
        duration: 20,
        icon: 'fa-flag-checkered',
        content: `
          <div class="tutorial-scene-content text-center">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation finale-animation">
                <i class="fa-solid fa-rocket text-vuela fs-1"></i>
                <div class="rocket-trail"></div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">¡Recorrido Completo!</h4>
            <p class="text-muted mb-3">El Sistema de Calificación de Atención Vuela Internet permite:</p>
            <div class="tutorial-finale">
              <div class="finale-item">
                <i class="fa-solid fa-heart text-danger me-2"></i>
                <span>Medir la satisfacción del cliente</span>
              </div>
              <div class="finale-item">
                <i class="fa-solid fa-trophy text-warning me-2"></i>
                <span>Motivar a los agentes con ranking</span>
              </div>
              <div class="finale-item">
                <i class="fa-solid fa-cloud text-success me-2"></i>
                <span>Respaldo seguro en la nube</span>
              </div>
            </div>
            <div class="tutorial-brand mt-4">
              <h3 class="fw-extrabold text-vuela">Vuela Internet</h3>
              <p class="text-muted">Internet de verdad</p>
            </div>
          </div>
        `
      }
    ];

    // Escenas específicas para administrador (Reportes, Ranking, Usuarios, Config, Formulario)
    const adminScenes = [
      {
        id: 8,
        title: '🎬 ESCENA 8 — Reportes',
        duration: 60,
        icon: 'fa-chart-pie',
        content: `
          <div class="tutorial-scene-content">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation chart-animation">
                <i class="fa-solid fa-chart-pie text-vuela fs-1"></i>
                <div class="chart-segments">
                  <div class="segment"></div>
                  <div class="segment"></div>
                  <div class="segment"></div>
                </div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">Panel de Administración: Reportes</h4>
            <p class="text-muted mb-3">Vista completa de todas las calificaciones:</p>
            <ul class="tutorial-list">
              <li><i class="fa-solid fa-chart-line me-2 text-vuela"></i>Gráfico de distribución por etiqueta</li>
              <li><i class="fa-solid fa-filter me-2 text-vuela"></i>Filtrar por año, mes, cuestionario o fechas</li>
              <li><i class="fa-solid fa-table me-2 text-vuela"></i>Tabla detallada de cada calificación</li>
              <li><i class="fa-solid fa-file-export me-2 text-vuela"></i>Exportar a Excel o PDF</li>
            </ul>
          </div>
        `
      },
      {
        id: 9,
        title: '🎬 ESCENA 9 — Ranking de Agentes',
        duration: 30,
        icon: 'fa-ranking-star',
        content: `
          <div class="tutorial-scene-content">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation ranking-animation">
                <i class="fa-solid fa-medal text-warning fs-1"></i>
                <div class="rank-items">
                  <div class="rank-item"></div>
                  <div class="rank-item"></div>
                  <div class="rank-item"></div>
                </div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">Ranking de Agentes en Vivo</h4>
            <p class="text-muted mb-3">Clasificación según puntos acumulados:</p>
            <ul class="tutorial-list">
              <li><i class="fa-solid fa-plus me-2 text-success"></i>Calificación positiva: +1 punto</li>
              <li><i class="fa-solid fa-minus me-2 text-danger"></i>Calificación negativa: -1 punto</li>
              <li><i class="fa-solid fa-sync me-2 text-vuela"></i>Actualización en tiempo real</li>
            </ul>
          </div>
        `
      },
      {
        id: 10,
        title: '🎬 ESCENA 10 — Gestión de Usuarios',
        duration: 45,
        icon: 'fa-users',
        content: `
          <div class="tutorial-scene-content">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation users-animation">
                <i class="fa-solid fa-users text-vuela fs-1"></i>
                <div class="user-avatars">
                  <div class="avatar"></div>
                  <div class="avatar"></div>
                  <div class="avatar"></div>
                </div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">Gestión de Usuarios</h4>
            <p class="text-muted mb-3">El administrador puede:</p>
            <ul class="tutorial-list">
              <li><i class="fa-solid fa-user-plus me-2 text-success"></i>Crear nuevos usuarios</li>
              <li><i class="fa-solid fa-user-edit me-2 text-vuela"></i>Editar usuarios existentes</li>
              <li><i class="fa-solid fa-user-minus me-2 text-danger"></i>Desactivar o eliminar usuarios</li>
              <li><i class="fa-solid fa-shield me-2 text-warning"></i>Admin principal protegido</li>
            </ul>
          </div>
        `
      },
      {
        id: 11,
        title: '🎬 ESCENA 11 — Configuración',
        duration: 45,
        icon: 'fa-sliders',
        content: `
          <div class="tutorial-scene-content">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation config-animation">
                <i class="fa-solid fa-sliders text-vuela fs-1"></i>
                <div class="slider-controls">
                  <div class="slider"></div>
                  <div class="slider"></div>
                </div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">Configuración del Sistema</h4>
            <p class="text-muted mb-3">En Configuración puedes:</p>
            <ul class="tutorial-list">
              <li><i class="fa-brands fa-google me-2 text-success"></i>Configurar Google Apps Script</li>
              <li><i class="fa-solid fa-face-smile me-2 text-vuela"></i>Ajustar escala de caritas (3-11 niveles)</li>
              <li><i class="fa-solid fa-clipboard-list me-2 text-vuela"></i>Crear cuestionarios personalizados</li>
              <li><i class="fa-solid fa-database me-2 text-vuela"></i>Probar conexión y sincronizar</li>
            </ul>
          </div>
        `
      },
      {
        id: 12,
        title: '🎬 ESCENA 12 — Sincronización Google Sheets',
        duration: 45,
        icon: 'fa-table',
        content: `
          <div class="tutorial-scene-content">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation sheets-animation">
                <i class="fa-solid fa-table text-success fs-1"></i>
                <div class="sheet-tabs">
                  <div class="tab"></div>
                  <div class="tab"></div>
                  <div class="tab"></div>
                </div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">Sincronización con Google Sheets</h4>
            <p class="text-muted mb-3">Backup automático en la nube:</p>
            <ul class="tutorial-list">
              <li><i class="fa-solid fa-star me-2 text-vuela"></i>Calificaciones</li>
              <li><i class="fa-solid fa-users me-2 text-vuela"></i>Usuarios</li>
              <li><i class="fa-solid fa-cog me-2 text-vuela"></i>Configuración</li>
              <li><i class="fa-solid fa-user me-2 text-vuela"></i>Clientes</li>
              <li><i class="fa-solid fa-history me-2 text-vuela"></i>Historial de logins</li>
            </ul>
          </div>
        `
      },
      {
        id: 13,
        title: '🎬 ESCENA 13 — Formulario Oficial',
        duration: 30,
        icon: 'fa-file-contract',
        content: `
          <div class="tutorial-scene-content">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation form-animation">
                <i class="fa-solid fa-file-pdf text-danger fs-1"></i>
                <div class="form-lines">
                  <div class="line"></div>
                  <div class="line"></div>
                  <div class="line"></div>
                </div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">Formulario Oficial de Evaluación</h4>
            <p class="text-muted mb-3">Documento profesional para gerencia:</p>
            <ul class="tutorial-list">
              <li><i class="fa-solid fa-chart-pie me-2 text-vuela"></i>Gráfica de dona integrada</li>
              <li><i class="fa-solid fa-print me-2 text-vuela"></i>Impresión limpia o exportación PDF</li>
              <li><i class="fa-solid fa-briefcase me-2 text-vuela"></i>Para presentaciones y auditoría</li>
            </ul>
          </div>
        `
      },
      {
        id: 14,
        title: '🎬 ESCENA 14 — Cierre',
        duration: 20,
        icon: 'fa-flag-checkered',
        content: `
          <div class="tutorial-scene-content text-center">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation finale-animation">
                <i class="fa-solid fa-rocket text-vuela fs-1"></i>
                <div class="rocket-trail"></div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">¡Recorrido Completo!</h4>
            <p class="text-muted mb-3">El Sistema de Calificación de Atención Vuela Internet permite:</p>
            <div class="tutorial-finale">
              <div class="finale-item">
                <i class="fa-solid fa-heart text-danger me-2"></i>
                <span>Medir la satisfacción del cliente</span>
              </div>
              <div class="finale-item">
                <i class="fa-solid fa-trophy text-warning me-2"></i>
                <span>Motivar a los agentes con ranking</span>
              </div>
              <div class="finale-item">
                <i class="fa-solid fa-cloud text-success me-2"></i>
                <span>Respaldo seguro en la nube</span>
              </div>
            </div>
            <div class="tutorial-brand mt-4">
              <h3 class="fw-extrabold text-vuela">Vuela Internet</h3>
              <p class="text-muted">Internet de verdad</p>
            </div>
          </div>
        `
      }
    ];

    // Si es administrador, devuelve todas las escenas
    // Si es agente, solo las primeras 7 (módulos que puede usar)
    if (isAdmin) {
      return [...baseScenes, ...adminScenes];
    } else {
      // Agente: escenas 1-7 + cierre modificado
      const agentFinale = {
        id: 8,
        title: '🎬 ESCENA 8 — Cierre',
        duration: 20,
        icon: 'fa-flag-checkered',
        content: `
          <div class="tutorial-scene-content text-center">
            <div class="tutorial-visual mb-4">
              <div class="tutorial-animation finale-animation">
                <i class="fa-solid fa-rocket text-vuela fs-1"></i>
                <div class="rocket-trail"></div>
              </div>
            </div>
            <h4 class="fw-bold mb-3">¡Tutorial Completado!</h4>
            <p class="text-muted mb-3">Como agente de Vuela Internet, puedes:</p>
            <div class="tutorial-finale">
              <div class="finale-item">
                <i class="fa-solid fa-star text-warning me-2"></i>
                <span>Calificar la atención de clientes</span>
              </div>
              <div class="finale-item">
                <i class="fa-solid fa-history text-vuela me-2"></i>
                <span>Ver tu historial de atención</span>
              </div>
              <div class="finale-item">
                <i class="fa-solid fa-gauge text-vuela me-2"></i>
                <span>Monitorear tu rendimiento en el panel</span>
              </div>
            </div>
            <div class="tutorial-brand mt-4">
              <h3 class="fw-extrabold text-vuela">Vuela Internet</h3>
              <p class="text-muted">Internet de verdad</p>
            </div>
          </div>
        `
      };
      return [...baseScenes, agentFinale];
    }
  }

  startTutorial() {
    console.log('=== Iniciando tutorial ===');
    console.log('Escenas disponibles:', this.scenes.length);
    this.isTutorialActive = true;
    this.currentScene = 0;
    this.showModal();
    this.highlightElement();
  }

  highlightElement() {
    // Remover highlight anterior
    const prevHighlight = document.querySelector('.tutorial-highlight');
    if (prevHighlight) {
      prevHighlight.remove();
    }

    // Definir elementos a resaltar según la escena
    const elements = {
      3: '.navbar-nav a[href="/panel"]', // Panel
      4: '.navbar-nav a[href="/calificar"]', // Calificar
      5: '.navbar-nav a[href="/atencion"]', // Atención
      8: '.navbar-nav a[href="/admin/reportes"]', // Reportes (admin)
      9: '.navbar-nav a[href="/admin/ranking"]', // Ranking (admin)
      10: '.navbar-nav a[href="/admin/usuarios"]', // Usuarios (admin)
      11: '.navbar-nav a[href="/admin/config"]', // Config (admin)
      12: '.navbar-nav a[href="/admin/formulario"]', // Formulario (admin)
    };

    const selector = elements[this.currentScene + 1];
    if (selector) {
      const element = document.querySelector(selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        const highlight = document.createElement('div');
        highlight.className = 'tutorial-highlight';
        highlight.style.cssText = `
          position: fixed;
          top: ${rect.top - 5}px;
          left: ${rect.left - 5}px;
          width: ${rect.width + 10}px;
          height: ${rect.height + 10}px;
          border: 3px solid #F15A22;
          border-radius: 8px;
          z-index: 10001;
          pointer-events: none;
          animation: highlightPulse 1.5s ease-in-out infinite;
          box-shadow: 0 0 20px rgba(241, 90, 34, 0.5);
        `;
        document.body.appendChild(highlight);

        // Scroll al elemento si está fuera de vista
        if (rect.top < 0 || rect.top > window.innerHeight) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }

  showModal() {
    // Crear modal si no existe
    if (!document.getElementById('tutorialModal')) {
      this.createModal();
    }
    this.renderScene();
    document.getElementById('tutorialModal').classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  createModal() {
    const modal = document.createElement('div');
    modal.id = 'tutorialModal';
    modal.className = 'modal fade';
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered modal-lg modal-tutorial">
        <div class="modal-content border-0 shadow-lg" style="border-radius: 24px; overflow: hidden;">
          <div class="modal-header bg-gradient-to-r from-vuela to-vuela-dark text-white p-4">
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-3">
                <div class="tutorial-header-icon">
                  <i class="fa-solid fa-play-circle fs-3"></i>
                </div>
                <div>
                  <h5 class="fw-bold mb-0" id="tutorialTitle">Tutorial Interactivo</h5>
                  <small class="text-white-50" id="tutorialProgress">ESCENA 1 de 14</small>
                </div>
              </div>
              <button type="button" class="btn-close btn-close-white" onclick="tutorial.closeTutorial()"></button>
            </div>
          </div>
          <div class="modal-body p-4 p-md-5" id="tutorialContent">
            <!-- Contenido dinámico -->
          </div>
          <div class="modal-footer bg-light p-4 border-top">
            <div class="d-flex align-items-center justify-content-between">
              <div class="tutorial-nav">
                <button class="btn btn-outline-secondary btn-sm me-2" onclick="tutorial.prevScene()" id="btnPrev" disabled>
                  <i class="fa-solid fa-arrow-left me-1"></i> Anterior
                </button>
                <button class="btn btn-vuela btn-sm" onclick="tutorial.nextScene()" id="btnNext">
                  Siguiente <i class="fa-solid fa-arrow-right ms-1"></i>
                </button>
              </div>
              <div class="tutorial-actions">
                <button class="btn btn-link text-muted text-decoration-none btn-sm" onclick="tutorial.skipTutorial()">
                  Omitir tutorial
                </button>
              </div>
            </div>
            <div class="tutorial-progress-bar mt-3">
              <div class="progress" style="height: 6px;">
                <div class="progress-bar bg-vuela" id="tutorialProgressBar" style="width: 0%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  renderScene() {
    const scene = this.scenes[this.currentScene];
    const progress = ((this.currentScene + 1) / this.scenes.length) * 100;

    document.getElementById('tutorialTitle').textContent = scene.title;
    document.getElementById('tutorialProgress').textContent = `ESCENA ${this.currentScene + 1} de ${this.scenes.length} · ${scene.duration}s`;
    document.getElementById('tutorialContent').innerHTML = scene.content;
    document.getElementById('tutorialProgressBar').style.width = `${progress}%`;

    // Actualizar botones
    document.getElementById('btnPrev').disabled = this.currentScene === 0;
    const nextBtn = document.getElementById('btnNext');
    if (this.currentScene === this.scenes.length - 1) {
      nextBtn.innerHTML = '<i class="fa-solid fa-check me-1"></i> Finalizar Tutorial';
      nextBtn.onclick = () => this.completeTutorial();
    } else {
      nextBtn.innerHTML = 'Siguiente <i class="fa-solid fa-arrow-right ms-1"></i>';
      nextBtn.onclick = () => this.nextScene();
    }

    // Animar entrada
    const content = document.getElementById('tutorialContent');
    content.classList.remove('fade-in-up');
    void content.offsetWidth;
    content.classList.add('fade-in-up');

    // Resaltar elemento correspondiente
    this.highlightElement();

    // Navegar a la página correspondiente
    this.navigateToScene();
  }

  navigateToScene() {
    const scene = this.scenes[this.currentScene];
    const routes = {
      3: '/panel',
      4: '/calificar',
      5: '/atencion',
      8: '/admin/reportes',
      9: '/admin/ranking',
      10: '/admin/usuarios',
      11: '/admin/config',
      12: '/admin/formulario'
    };

    const route = routes[this.currentScene + 1];
    if (route && window.location.pathname !== route) {
      console.log('Navegando a:', route);
      window.location.href = route;
    }
  }

  nextScene() {
    if (this.currentScene < this.scenes.length - 1) {
      this.currentScene++;
      this.renderScene();
      this.highlightElement();
    }
  }

  prevScene() {
    if (this.currentScene > 0) {
      this.currentScene--;
      this.renderScene();
      this.highlightElement();
    }
  }

  skipTutorial() {
    this.closeTutorial();
  }

  completeTutorial() {
    // Marcar tutorial como completado
    this.markTutorialCompleted();
    this.closeTutorial();
    if (typeof UI !== 'undefined') {
      UI.success('¡Tutorial completado!', 'Ya puedes usar el sistema como experto');
      UI.confetti(document.body);
    }
  }

  closeTutorial() {
    this.isTutorialActive = false;
    const modal = document.getElementById('tutorialModal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }
    document.body.style.overflow = '';
  }

  markTutorialCompleted() {
    // Enviar solicitud al servidor para marcar tutorial como completado
    fetch('/api/tutorial/completed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: true })
    }).catch(err => console.log('Error marking tutorial completed:', err));
  }

  addHiddenButton() {
    // Botón escondido para repetir tutorial (triple click en logo)
    const logo = document.querySelector('.navbar-brand img');
    if (logo) {
      let clickCount = 0;
      let clickTimer;

      logo.addEventListener('click', () => {
        clickCount++;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
          clickCount = 0;
        }, 500);

        if (clickCount === 3) {
          this.startTutorial();
          clickCount = 0;
        }
      });
    }
  }
}

// Inicializar tutorial globalmente
let tutorial;
document.addEventListener('DOMContentLoaded', () => {
  tutorial = new TutorialSystem();
  window.tutorial = tutorial;
});
