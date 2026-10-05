<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Desactivar Cache en Navegador -->
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <title><?= e($title ?? 'Calificar Atención - Vuela Internet') ?></title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="<?= e(asset('css/vuela.css')) ?>">
  <style>
    body {
      background: linear-gradient(135deg, #fffaf6 0%, #fff0e8 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .public-card {
      max-width: 650px;
      width: 100%;
      border-radius: 28px;
      box-shadow: 0 25px 80px rgba(241, 90, 34, 0.18);
      background: #ffffff;
      border: 1px solid rgba(241, 90, 34, 0.12);
    }
    body.fullscreen-mode {
      background: #fffaf6;
    }
    body.fullscreen-mode .public-card {
      max-width: 800px;
    }
  </style>
</head>
<body>

<div class="public-card p-4 p-md-5 bounce-in">
  <div class="text-center mb-4">
    <img src="<?= e(asset('img/logo-vuela.png')) ?>" height="54" alt="Vuela Internet" class="mb-2">
    <h3 class="fw-extrabold text-dark mb-1">Encuesta de Calificación</h3>
    <?php if (!empty($isVisitorMode)): ?>
      <p class="text-muted small mb-0">Modo Visitante Público - Calificación Directa</p>
    <?php else: ?>
      <p class="text-muted small mb-0">Atendido por: <b class="text-dark"><?= e($agentName) ?></b> <span class="badge badge-vuela ms-1"><?= e($agentRol) ?></span></p>
    <?php endif; ?>
  </div>

  <?php if (!empty($error)): ?>
    <div class="alert alert-danger alert-vuela mb-3"><i class="fa-solid fa-circle-exclamation me-1"></i><?= e($error) ?></div>
  <?php endif; ?>

  <?php if (!empty($isVisitorMode) && !empty($cuestionarios) && count($cuestionarios) > 1): ?>
    <!-- Selector de Cuestionarios para modo visitante -->
    <div class="mb-4">
      <label class="form-label fw-bold text-dark small mb-2">Tipo de Calificación:</label>
      <div class="d-flex flex-wrap gap-2">
        <?php foreach ($cuestionarios as $c): ?>
          <button type="button" class="btn btn-sm btn-survey-type <?= ($c['titulo'] ?? '') === ($encuesta_tipo ?? 'Atención General') ? 'btn-vuela active' : 'btn-outline-secondary' ?>"
                  data-tipo="<?= e($c['titulo'] ?? '') ?>"
                  data-pregunta="<?= e($c['pregunta'] ?? '') ?>"
                  data-escala="<?= (int)($c['escala'] ?? 5) ?>">
            <i class="fa-solid <?= e($c['icono'] ?? 'fa-headset') ?> me-1"></i>
            <?= e($c['titulo'] ?? '') ?>
          </button>
        <?php endforeach; ?>
      </div>
    </div>
  <?php endif; ?>

  <form id="form-calificar-public" method="post" action="<?= e($isVisitorMode ? url('/calificar/publico') : url('/calificar/link')) ?>">
    <?= csrf_field() ?>
    <?php if (!empty($token)): ?>
      <input type="hidden" name="token" value="<?= e($token['token'] ?? '') ?>">
    <?php endif; ?>
    <input type="hidden" name="tipo" id="tipo" value="visitante">
    <input type="hidden" name="score" id="score" value="">
    <input type="hidden" name="score_max" id="score_max" value="<?= (int)$max ?>">
    <input type="hidden" name="codigo" value="DIRECTO">
    <input type="hidden" name="encuesta_tipo" id="encuesta_tipo" value="<?= e($encuesta_tipo ?? 'Atención General') ?>">

    <!-- Rating spectrum caritas -->
    <div class="rating-box-wrap p-4 rounded-4 bg-white border text-center mb-4 shadow-sm">
      <h5 class="fw-bold text-dark mb-2" id="pregunta-encuesta-titulo"><?= e($pregunta) ?></h5>
      <p class="text-muted small mb-4">Haz clic en la carita que mejor represente tu atención:</p>

      <div class="rating-spectrum-container my-3">
        <div class="faces" id="caritas-container" style="justify-content: space-around;">
          <?php foreach ($niveles as $n): 
            $shortLabel = $n['etiqueta'] ?? null;
            if (!$shortLabel) {
              if ($n['n'] == 1) $shortLabel = 'Malo';
              elseif ($n['n'] == 2) $shortLabel = 'Regular';
              elseif ($n['n'] == 3) $shortLabel = 'Aceptable';
              elseif ($n['n'] == 4) $shortLabel = 'Bueno';
              elseif ($n['n'] == 5) $shortLabel = 'Excelente';
              else $shortLabel = 'Nivel ' . $n['n'];
            }
          ?>
            <div class="face-wrap">
              <button type="button" class="face-btn face-card-btn" style="background:<?= e($n['color']) ?>"
                data-score="<?= (int)$n['n'] ?>" data-msg="<?= e($n['mensaje']) ?>" data-icon="<?= e($n['icon']) ?>">
                <i class="fa-solid <?= e($n['icon']) ?>"></i>
              </button>
              <div class="face-label-sub mt-2">
                <span class="badge rounded-pill text-bg-light border fw-bold px-2 py-1"><?= (int)$n['n'] ?></span>
                <small class="d-block text-dark fw-bold mt-1 fs-8"><?= e($shortLabel) ?></small>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    </div>

    <div id="feedback-dinamico" class="alert alert-success text-center d-none fw-bold fs-6 mb-4"></div>

    <div class="d-grid gap-2">
      <button class="btn btn-vuela btn-lg py-3 fs-5 shadow-lg fw-bold d-flex align-items-center justify-content-center gap-2" type="submit" id="btnSubmit">
        <i class="fa-solid fa-paper-plane"></i>
        <span>Enviar Mi Calificación</span>
      </button>
      <button type="button" class="btn btn-outline-secondary btn-lg py-3 fs-5 d-flex align-items-center justify-content-center gap-2" onclick="toggleFullscreen()">
        <i class="fa-solid fa-expand"></i>
        <span id="fullscreenBtnText">Modo Pantalla Completa</span>
      </button>
    </div>

    <div class="text-center mt-4">
      <a href="<?= e(url('/login')) ?>" class="btn btn-outline-secondary btn-sm px-4 py-2">
        <i class="fa-solid fa-arrow-left me-1"></i> Volver al Login
      </a>
    </div>
  </form>
</div>

<script>
window.VUELA_MAX_CURRENT = <?= (int)$max ?>;
window.VUELA_NIVELES_ALL = <?= json_encode($niveles_all) ?>;

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.log('Error al entrar en pantalla completa:', err);
    });
    document.body.classList.add('fullscreen-mode');
    var btnText = document.getElementById('fullscreenBtnText');
    if (btnText) btnText.textContent = 'Salir de Pantalla Completa';
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    document.body.classList.remove('fullscreen-mode');
    var btnText = document.getElementById('fullscreenBtnText');
    if (btnText) btnText.textContent = 'Modo Pantalla Completa';
  }
}

(function() {
  var form = document.getElementById('form-calificar-public');
  var scoreInput = document.getElementById('score');
  var feedback = document.getElementById('feedback-dinamico');
  var caritasContainer = document.getElementById('caritas-container');
  var preguntaTitulo = document.getElementById('pregunta-encuesta-titulo');
  var encuestaTipoInput = document.getElementById('encuesta_tipo');
  var scoreMaxInput = document.getElementById('score_max');
  var currentMaxScale = window.VUELA_MAX_CURRENT || 5;

  function getShortLabel(n, max) {
    var labels11 = [
      'Muy Malo', 'Malo', 'Deficiente', 'Regular', 'Aceptable',
      'Bueno', 'Muy Bueno', 'Destacado', 'Excelente', 'Sobresaliente', 'Wooow!'
    ];
    if (max === 3) {
      if (n === 1) return 'Malo';
      if (n === 2) return 'Regular';
      if (n === 3) return 'Excelente';
    } else if (max === 4) {
      if (n === 1) return 'Malo';
      if (n === 2) return 'Regular';
      if (n === 3) return 'Bueno';
      if (n === 4) return 'Excelente';
    } else if (max === 5) {
      if (n === 1) return 'Malo';
      if (n === 2) return 'Regular';
      if (n === 3) return 'Aceptable';
      if (n === 4) return 'Bueno';
      if (n === 5) return 'Excelente';
    }
    var idx = labels11.length > 1 ? Math.round((n - 1) * (labels11.length - 1) / Math.max(1, max - 1)) : 0;
    return labels11[idx] || ('Opción ' + n);
  }

  function renderCaritasForScale(targetScale) {
    if (!caritasContainer) return;
    targetScale = Math.max(3, Math.min(11, parseInt(targetScale, 10) || 5));
    currentMaxScale = targetScale;
    scoreInput.value = '';
    if (scoreMaxInput) scoreMaxInput.value = targetScale;
    if (feedback) feedback.classList.add('d-none');

    var allNiveles = window.VUELA_NIVELES_ALL || [];
    var html = '';

    for (var i = 1; i <= targetScale; i++) {
      var idx = allNiveles.length > 1 ? Math.round((i - 1) * (allNiveles.length - 1) / (targetScale - 1)) : 0;
      var nDef = allNiveles[idx] || null;

      var color = nDef ? nDef.color : '#f59e0b';
      var icon = nDef ? nDef.icon : 'fa-smile';
      var msg = nDef ? nDef.mensaje : ('Calificación ' + i);
      var label = getShortLabel(i, targetScale);

      html += '<div class="face-wrap">' +
        '<button type="button" class="face-btn face-card-btn" style="background:' + color + '" ' +
        'data-score="' + i + '" data-max="' + targetScale + '" ' +
        'data-msg="' + msg + '" data-icon="' + icon + '" data-label="' + label + '">' +
        '<i class="fa-solid ' + icon + '"></i>' +
        '</button>' +
        '<div class="face-label-sub mt-2">' +
        '<span class="badge rounded-pill text-bg-light border fw-bold px-2 py-1">' + i + '</span>' +
        '<small class="d-block text-dark fw-bold mt-1 fs-8">' + label + '</small>' +
        '</div>' +
        '</div>';
    }

    caritasContainer.innerHTML = html;
    caritasContainer.classList.remove('bounce-in');
    void caritasContainer.offsetWidth;
    caritasContainer.classList.add('bounce-in');

    attachFaceListeners();
  }

  function attachFaceListeners() {
    document.querySelectorAll('.face-card-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.face-card-btn').forEach(function(b) {
          b.classList.remove('selected', 'anim-happy', 'anim-sad');
        });
        btn.classList.add('selected');
        var score = btn.getAttribute('data-score');
        var msg = btn.getAttribute('data-msg');
        var icon = btn.getAttribute('data-icon');
        scoreInput.value = score;
        if (feedback) {
          feedback.classList.remove('d-none');
          feedback.innerHTML = '<i class="fa-solid ' + (icon || 'fa-star') + ' me-2"></i>' + msg;
        }
      });
    });
  }

  // Selector de Cuestionarios
  document.querySelectorAll('.btn-survey-type').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.btn-survey-type').forEach(function(b) {
        b.classList.remove('btn-vuela', 'active');
        b.classList.add('btn-outline-secondary');
      });
      tab.classList.remove('btn-outline-secondary');
      tab.classList.add('btn-vuela', 'active');

      var tipoVal = tab.getAttribute('data-tipo');
      var pregVal = tab.getAttribute('data-pregunta');
      var escalaVal = parseInt(tab.getAttribute('data-escala'), 10) || currentMaxScale;

      if (encuestaTipoInput) encuestaTipoInput.value = tipoVal;
      if (preguntaTitulo && pregVal) {
        preguntaTitulo.classList.remove('bounce-in');
        void preguntaTitulo.offsetWidth;
        preguntaTitulo.textContent = pregVal;
        preguntaTitulo.classList.add('bounce-in');
      }

      renderCaritasForScale(escalaVal);
    });
  });

  attachFaceListeners();

  if (form) {
    form.addEventListener('submit', function(ev) {
      if (!scoreInput.value) {
        ev.preventDefault();
        var errBox = document.getElementById('public-err-msg');
        if (!errBox) {
          errBox = document.createElement('div');
          errBox.id = 'public-err-msg';
          errBox.className = 'alert alert-danger text-center fw-bold mb-3 bounce-in';
          form.insertBefore(errBox, form.firstChild);
        }
        errBox.textContent = '⚠️ Por favor selecciona una carita para calificar.';
        errBox.style.display = 'block';
        setTimeout(function() { errBox.style.display = 'none'; }, 3500);
        return;
      }
      document.querySelectorAll('.face-card-btn').forEach(function(b) {
        b.classList.remove('selected', 'anim-happy', 'anim-sad');
      });
    });
  }

  // Bloqueo estricto del botón "Volver atrás" del navegador
  if (window.history && window.history.pushState) {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, null, window.location.href);
    };
  }

  window.addEventListener('pageshow', function (event) {
    if (event.persisted || (window.performance && (window.performance.navigation.type === 2 || (window.performance.getEntriesByType && window.performance.getEntriesByType('navigation')[0] && window.performance.getEntriesByType('navigation')[0].type === 'back_forward')))) {
      window.location.reload();
    }
  });
})();
</script>
</body>
</html>
