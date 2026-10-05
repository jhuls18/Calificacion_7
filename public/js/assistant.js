/**
 * Funcionalidad del Botón Asistente
 * Abre el modal de guía cuando se hace clic
 */

document.addEventListener('DOMContentLoaded', function() {
  const btnAssistant = document.getElementById('btnAssistantGuide');
  const modalAssistant = document.getElementById('assistantGuideModal');

  if (btnAssistant && modalAssistant) {
    btnAssistant.addEventListener('click', function() {
      const modal = new bootstrap.Modal(modalAssistant);
      modal.show();
    });
  }

  // Navegación de pestañas del asistente
  const tabs = document.querySelectorAll('.btn-assistant-tab');
  const tabCards = document.querySelectorAll('.assistant-tab-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');

      // Remover active de todos los tabs
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // Ocultar todas las cards
      tabCards.forEach(card => card.classList.add('d-none'));
      tabCards.forEach(card => card.classList.remove('d-block'));

      // Mostrar la card correspondiente
      const targetCard = document.getElementById('tabCard_' + targetTab);
      if (targetCard) {
        targetCard.classList.remove('d-none');
        targetCard.classList.add('d-block');
      }


    });
  });

  // Marcar la pestaña actual
  const currentPage = window.VUELA_CURRENT_PAGE || 'panel';
  const currentTab = document.querySelector(`.btn-assistant-tab[data-tab="${currentPage}"]`);
  const currentBadge = document.getElementById('currentBadge_' + currentPage);

  if (currentTab) {
    currentTab.classList.add('active');
  }
  if (currentBadge) {
    currentBadge.classList.remove('d-none');
  }
});
