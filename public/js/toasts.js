/**
 * Sistema de Toasts/Alertas Moderno
 * Uso:
 * showToast('success', '¡Éxito!', 'Operación completada correctamente')
 * showToast('error', 'Error', 'Algo salió mal')
 * showToast('warning', 'Advertencia', 'Verifica los datos')
 * showToast('info', 'Información', 'Mensaje informativo')
 */

class ToastSystem {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    // Crear contenedor si no existe
    if (!document.querySelector('.toast-container')) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    } else {
      this.container = document.querySelector('.toast-container');
    }
  }

  show(type, title, message, duration = 4000) {
    const toast = this.createToast(type, title, message, duration);
    this.container.appendChild(toast);

    // Animación de entrada
    requestAnimationFrame(() => {
      toast.style.animation = 'toastSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    // Auto eliminar
    setTimeout(() => {
      this.hide(toast);
    }, duration);

    return toast;
  }

  createToast(type, title, message, duration) {
    const toast = document.createElement('div');
    toast.className = `toast-vuela toast-${type}`;

    const icons = {
      success: 'fa-check',
      error: 'fa-xmark',
      warning: 'fa-triangle-exclamation',
      info: 'fa-info'
    };

    toast.innerHTML = `
      <div class="toast-icon ${type}">
        <i class="fa-solid ${icons[type]}"></i>
      </div>
      <div class="toast-content">
        <div class="toast-title">${this.escapeHtml(title)}</div>
        <div class="toast-message">${this.escapeHtml(message)}</div>
      </div>
      <button class="toast-close" onclick="this.closest('.toast-vuela').remove()">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="toast-progress ${type}" style="animation-duration: ${duration}ms"></div>
    `;

    return toast;
  }

  hide(toast) {
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 350);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Métodos de conveniencia
  success(title, message, duration) {
    return this.show('success', title, message, duration);
  }

  error(title, message, duration) {
    return this.show('error', title, message, duration);
  }

  warning(title, message, duration) {
    return this.show('warning', title, message, duration);
  }

  info(title, message, duration) {
    return this.show('info', title, message, duration);
  }
}

// Instancia global
const toast = new ToastSystem();

// Funciones globales para uso rápido
function showToast(type, title, message, duration) {
  return toast.show(type, title, message, duration);
}

function showSuccess(title, message, duration) {
  return toast.success(title, message, duration);
}

function showError(title, message, duration) {
  return toast.error(title, message, duration);
}

function showWarning(title, message, duration) {
  return toast.warning(title, message, duration);
}

function showInfo(title, message, duration) {
  return toast.info(title, message, duration);
}

// Auto-inicialización cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    toast.init();
  });
} else {
  toast.init();
}
