// ============================================================================
// CROPPER ET GUIDES DE DIAMÈTRE
// ============================================================================

/**
 * Initialise le cropper avec l'image source
 * @param {string} imageSrc - URL ou data URL de l'image source
 */
function initCropper(imageSrc) {
  if (cropper) {
    cropper.destroy();
  }

  const container = document.getElementById("cropper-container");
  container.innerHTML = `<img src="${imageSrc}">`;

  cropper = new Cropper(container.querySelector("img"), {
    aspectRatio: 1,
    viewMode: 0,
    autoCropArea: 1,
    center: true,
    guides: false,
    zoomable: false,
    background: false,
    ready() {
      this.cropper.setCropBoxData({
        width: this.cropper.getContainerData().width,
        height: this.cropper.getContainerData().height,
      });

      addDiameterGuides();
    },
    crop() {
      updateDiameterGuides();
    },
  });
}

/**
 * Ajoute les cercles guides de diamètre sur le cropper
 */
function addDiameterGuides() {
  // Supprimer les guides existants
  document.querySelectorAll(".diameter-guide").forEach((guide) => guide.remove());

  // Créer un conteneur pour les guides
  const guidesContainer = document.createElement("div");
  guidesContainer.className = "diameter-guides-container";

  // Ajouter les cercles guides
  DIAMETER_GUIDES.forEach((guide) => {
    const guideEl = document.createElement("div");
    guideEl.className = "diameter-guide";
    guideEl.dataset.size = guide.size;
    guideEl.style.border = `2px solid ${guide.color}`;
    guidesContainer.appendChild(guideEl);
  });

  // Ajouter le conteneur au document
  const cropperContainer = document.querySelector(".cropper-container");
  cropperContainer.appendChild(guidesContainer);

  updateDiameterGuides();
}

/**
 * Met à jour la position et la taille des guides en fonction du crop box
 */
function updateDiameterGuides() {
  if (!cropper) return;

  const cropBoxData = cropper.getCropBoxData();
  const { width, height, left, top } = cropBoxData;

  const centerX = left + width / 2;
  const centerY = top + height / 2;
  const pixelsPerCm = width / TARGET_SIZE_CM;

  document.querySelectorAll(".diameter-guide").forEach((guide) => {
    const sizeCm = parseFloat(guide.dataset.size);
    const sizePixels = sizeCm * pixelsPerCm;

    guide.style.width = `${sizePixels}px`;
    guide.style.height = `${sizePixels}px`;
    guide.style.left = `${centerX - sizePixels / 2}px`;
    guide.style.top = `${centerY - sizePixels / 2}px`;
  });
}

/**
 * Crée la légende des guides de diamètre
 */
function setupDiameterLegend() {
  const legend = document.createElement("div");
  legend.className = "diameter-legend";
  legend.innerHTML = DIAMETER_GUIDES.map(
    (guide) =>
      `<div class="legend-item">
        <span class="color-box" style="background-color: ${guide.color}"></span>
        <span>${guide.sizeInch} pouces (${guide.size} cm) - ${guide.description}</span>
      </div>`,
  ).join("");

  document.getElementById("cropper-container").after(legend);
}
