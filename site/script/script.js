// ============================================================================
// VARIABLES D'ÉTAT
// ============================================================================

let cropper;
let currentStep = 1;
let uploadedImage = null;

// ============================================================================
// GALERIE D'IMAGES
// ============================================================================

/**
 * Formate le nom de fichier en texte lisible pour l'affichage
 */
function formatImageName(filename) {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  return nameWithoutExt
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Charge dynamiquement les images prédéfinies dans la galerie
 */
function loadGalleryImages() {
  const gallery = document.getElementById("galleryGrid");

  PRESET_IMAGES.forEach((filename) => {
    const galleryItem = document.createElement("div");
    galleryItem.className = "gallery-item";
    galleryItem.onclick = () => selectPresetImage(filename);

    const img = document.createElement("img");
    img.src = `static/img/images-proposees/${filename}`;
    img.alt = formatImageName(filename);

    galleryItem.appendChild(img);
    gallery.appendChild(galleryItem);
  });
}

/**
 * Sélectionne et charge une image prédéfinie depuis la galerie
 */
function selectPresetImage(filename) {
  const fullImagePath = `static/img/images-proposees/${filename}`;

  fetch(fullImagePath)
    .then((res) => res.blob())
    .then((blob) => {
      handleImage(new File([blob], filename, { type: blob.type }));
    });

  // Désélectionner toutes les miniatures
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.classList.remove("selected");
  });

  // Marquer la miniature sélectionnée
  event.currentTarget.classList.add("selected");
}

// ============================================================================
// GESTION DES ÉTAPES
// ============================================================================

/**
 * Met à jour l'affichage pour passer à une nouvelle étape
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

function nextStep() {
  if (currentStep < 2) updateSteps(currentStep + 1);
}

function previousStep() {
  if (currentStep > 1) updateSteps(currentStep - 1);
}

// ============================================================================
// CHARGEMENT D'IMAGE (Upload & Drag-Drop)
// ============================================================================

/**
 * Configure la zone de drag-and-drop pour l'upload d'images
 */
function setupUploadArea() {
  const uploadArea = document.querySelector(".upload-area");
  const fileInput = document.getElementById("fileInput");

  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.classList.add("dragover");
  });

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragover");
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("dragover");
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImage(files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      handleImage(e.target.files[0]);
    }
  });
}

/**
 * Traite une image uploadée et prépare la navigation vers l'étape de rognage
 */
function handleImage(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImage = e.target.result;

    // Afficher la prévisualisation
    const preview = document.getElementById("previewImage");
    preview.src = uploadedImage;
    preview.style.display = "block";

    // Activer le bouton suivant ET passer à l'étape 2 automatiquement
    document.getElementById("nextStep1").disabled = false;
    nextStep();
  };
  reader.readAsDataURL(file);
}

// ============================================================================
// CROPPER - Initialisation et Guides
// ============================================================================

/**
 * Initialise le cropper avec l'image source
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

// ============================================================================
// GÉNÉRATION PDF
// ============================================================================

/**
 * Génère un PDF avec 24 macarons disposés en grille (6 rangées × 4 colonnes)
 */
async function generatePDF() {
  if (!cropper) return;

  // Créer le canvas avec l'image rognée
  const canvas = cropper.getCroppedCanvas({
    width: 800,
    height: 800,
    fillColor: "#fff",
  });

  // Appliquer un masque circulaire
  const ctx = canvas.getContext("2d");
  ctx.globalCompositeOperation = "destination-in";
  ctx.beginPath();
  ctx.arc(400, 400, 400, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();

  // Créer le PDF
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jspdf.jsPDF("p", "cm", "letter");

  const pageWidth = 21.59;
  const pageHeight = 27.94;
  const startX =
    (pageWidth - (COLS * TARGET_SIZE_CM + (COLS - 1) * SPACING_CM)) / 2;
  let currentX = startX;
  let currentY =
    (pageHeight - (ROWS * TARGET_SIZE_CM + (ROWS - 1) * SPACING_CM)) / 2;

  // Disposer les macarons en grille
  for (let i = 0; i < ROWS * COLS; i++) {
    if (i !== 0 && i % COLS === 0) {
      currentY += TARGET_SIZE_CM + SPACING_CM;
      currentX = startX;
    }

    pdf.addImage(
      imgData,
      "PNG",
      currentX,
      currentY,
      TARGET_SIZE_CM,
      TARGET_SIZE_CM,
    );
    currentX += TARGET_SIZE_CM + SPACING_CM;

    if (currentY + TARGET_SIZE_CM > pageHeight) {
      pdf.addPage();
      currentY = 0;
    }
  }

  pdf.save("macarons.pdf");
}

// ============================================================================
// INITIALISATION
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
