/**
 * UI Helpers - Funciones auxiliares para mejorar la experiencia de usuario
 * Animaciones, efectos visuales y micro-interacciones
 */

class UIHelpers {
  /**
   * Muestra un toast de éxito
   */
  static success(message, title = '¡Éxito!') {
    if (typeof showToast !== 'undefined') {
      showToast('success', title, message);
    } else {
      alert(title + ': ' + message);
    }
  }

  /**
   * Muestra un toast de error
   */
  static error(message, title = 'Error') {
    if (typeof showToast !== 'undefined') {
      showToast('error', title, message);
    } else {
      alert(title + ': ' + message);
    }
  }

  /**
   * Muestra un toast de advertencia
   */
  static warning(message, title = 'Advertencia') {
    if (typeof showToast !== 'undefined') {
      showToast('warning', title, message);
    } else {
      alert(title + ': ' + message);
    }
  }

  /**
   * Muestra un toast informativo
   */
  static info(message, title = 'Información') {
    if (typeof showToast !== 'undefined') {
      showToast('info', title, message);
    } else {
      alert(title + ': ' + message);
    }
  }

  /**
   * Agrega animación de entrada a un elemento
   */
  static animateIn(element, animation = 'fade-in-up') {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.classList.remove(animation);
      void element.offsetWidth; // Trigger reflow
      element.classList.add(animation);
    }
  }

  /**
   * Agrega animación de salida a un elemento
   */
  static animateOut(element, callback = null) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.style.opacity = '0';
      element.style.transform = 'translateY(-20px)';
      element.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        if (callback) callback();
      }, 300);
    }
  }

  /**
   * Efecto de confeti para acciones exitosas
   */
  static confetti(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (!element) return;

    const colors = ['#F15A22', '#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '50%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      element.appendChild(confetti);

      setTimeout(() => confetti.remove(), 1000);
    }
  }

  /**
   * Efecto de typing indicator
   */
  static showTyping(container) {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    if (!container) return;

    const typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(typing);
    return typing;
  }

  /**
   * Oculta typing indicator
   */
  static hideTyping(typingElement) {
    if (typingElement) {
      typingElement.remove();
    }
  }

  /**
   * Muestra un loading spinner
   */
  static showLoading(container, message = 'Cargando...') {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    if (!container) return;

    const loading = document.createElement('div');
    loading.className = 'text-center py-4';
    loading.innerHTML = `
      <div class="spinner-vuela mx-auto mb-2"></div>
      <p class="text-muted small">${message}</p>
    `;
    container.appendChild(loading);
    return loading;
  }

  /**
   * Oculta loading spinner
   */
  static hideLoading(loadingElement) {
    if (loadingElement) {
      loadingElement.remove();
    }
  }

  /**
   * Efecto shimmer en elementos
   */
  static addShimmer(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.classList.add('shimmer');
    }
  }

  /**
   * Remueve efecto shimmer
   */
  static removeShimmer(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.classList.remove('shimmer');
    }
  }

  /**
   * Agrega efecto de glow a badges
   */
  static addGlow(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.classList.add('badge-glow');
    }
  }

  /**
   * Smooth scroll a un elemento
   */
  static scrollTo(element, offset = 0) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Debounce function para performance
   */
  static debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function para performance
   */
  static throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Copiar al portapapeles con feedback
   */
  static async copyToClipboard(text, successMessage = '¡Copiado al portapapeles!') {
    try {
      await navigator.clipboard.writeText(text);
      this.success(successMessage);
      return true;
    } catch (err) {
      this.error('No se pudo copiar al portapapeles');
      return false;
    }
  }

  /**
   * Formatear números con separadores de miles
   */
  static formatNumber(num) {
    return new Intl.NumberFormat('es-BO').format(num);
  }

  /**
   * Formatear fecha relativa (hace 2 horas, etc)
   */
  static timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
      año: 31536000,
      mes: 2592000,
      semana: 604800,
      día: 86400,
      hora: 3600,
      minuto: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `hace ${interval} ${unit}${interval > 1 ? 's' : ''}`;
      }
    }

    return 'hace un momento';
  }

  /**
   * Validar formulario con feedback visual
   */
  static validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('is-invalid');
        input.addEventListener('input', () => {
          input.classList.remove('is-invalid');
        }, { once: true });
      } else {
        input.classList.remove('is-invalid');
      }
    });

    if (!isValid) {
      this.warning('Por favor completa todos los campos requeridos');
    }

    return isValid;
  }

  /**
   * Efecto de ripple en botones
   */
  static ripple(event, element) {
    const circle = document.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    const rect = element.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    const ripple = element.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }

    element.appendChild(circle);
  }
}

// Exponer globalmente
window.UI = UIHelpers;

// Auto-inicialización de efectos ripple en botones
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn-micro-interact').forEach(btn => {
    btn.addEventListener('click', (e) => {
      UIHelpers.ripple(e, btn);
    });
  });
});
