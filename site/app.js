// ============================================================================
// POINT D'ENTRÉE ET INITIALISATION DE L'APPLICATION
// ============================================================================

/**
 * Initialise l'application au chargement de la page
 */
function init() {
  loadGalleryImages();
  setupUploadArea();
  setupDiameterLegend();
}

// Lancer l'initialisation
document.addEventListener("DOMContentLoaded", init);
