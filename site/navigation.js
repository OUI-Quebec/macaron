// ============================================================================
// NAVIGATION ENTRE LES ÉTAPES
// ============================================================================

/**
 * Met à jour l'affichage pour passer à une nouvelle étape
 * @param {number} newStep - Numéro de l'étape à afficher
 */
function updateSteps(newStep) {
  document.querySelectorAll(".step").forEach((step) => {
    step.classList.remove("active");
    if (parseInt(step.dataset.step) === newStep) {
      step.classList.add("active");
    }
  });

  document.querySelectorAll(".step-content").forEach((content) => {
    content.classList.remove("active");
    if (parseInt(content.dataset.step) === newStep) {
      content.classList.add("active");
    }
  });

  if (newStep === 2 && uploadedImage) {
    initCropper(uploadedImage);
  }

  currentStep = newStep;
}

/**
 * Passe à l'étape suivante
 */
function nextStep() {
  if (currentStep < 2) updateSteps(currentStep + 1);
}

/**
 * Retourne à l'étape précédente
 */
function previousStep() {
  if (currentStep > 1) updateSteps(currentStep - 1);
}
