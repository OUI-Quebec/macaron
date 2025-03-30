let cropper;
let currentStep = 1;
let uploadedImage = null;
const TARGET_SIZE_CM = 4.13766;
const SPACING_CM = 0.27;
const ROWS = 6;
const COLS = 4;

// Guides de diamètre en cm
const DIAMETER_GUIDES = [
  {
    size: 2.921,
    sizeInch: 1.15,
    color: "#FF0000",
    description: "Zone pour imprimer la face du macaron.",
  }, // Rouge
  {
    size: 3.175,
    sizeInch: 1.25,
    color: "#00FF00",
    description: "Limite de la face du macaron.",
  }, // Vert
  {
    size: 3.556,
    sizeInch: 1.4,
    color: "#999999",
    description: "Rebord du macaron.",
  }, // Gris
  {
    size: 4.13766,
    sizeInch: 1.625,
    color: "#000000",
    description: "Ligne de coupe.",
  }, // Noir
];

// Gestion des étapes
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

  if (newStep === 3 && cropper) {
    updatePreview();
  }

  currentStep = newStep;
}

// Fonction pour mettre à jour la prévisualisation
function updatePreview() {
  if (!cropper) return;

  // Créer un canvas temporaire
  const tempCanvas = cropper.getCroppedCanvas({
    width: 200,
    height: 200,
    fillColor: "#fff",
  });

  // S'assurer que le canvas est prêt
  tempCanvas.toBlob(
    (blob) => {
      const url = URL.createObjectURL(blob);
      const previewGrid = document.getElementById("previewGrid");
      previewGrid.innerHTML = "";

      // Créer 24 cellules (4x6)
      for (let i = 0; i < 24; i++) {
        const cell = document.createElement("div");
        cell.className = "preview-cell";
        cell.style.backgroundImage = `url(${url})`;
        previewGrid.appendChild(cell);
      }
    },
    "image/jpeg",
    0.9
  );
}

function nextStep() {
  if (currentStep < 3) updateSteps(currentStep + 1);
}

function previousStep() {
  if (currentStep > 1) updateSteps(currentStep - 1);
}

// Gestion du drag and drop
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

// Ajouter la légende des guides
const legend = document.createElement("div");
legend.className = "diameter-legend";
legend.innerHTML = DIAMETER_GUIDES.map(
  (guide) =>
    `<div class="legend-item">
    <span class="color-box" style="background-color: ${guide.color}"></span>
    <span>${guide.sizeInch} pouces (${guide.size} cm) - ${guide.description}</span>
  </div>`
).join("");

// Ajouter la légende après le conteneur du cropper
document.getElementById("cropper-container").after(legend);

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

function initCropper(imageSrc) {
  if (cropper) {
    cropper.destroy();
  }

  const container = document.getElementById("cropper-container");
  container.innerHTML = `<img src="${imageSrc}">`;

  cropper = new Cropper(container.querySelector("img"), {
    aspectRatio: 1,
    viewMode: 0, // Mode libre
    autoCropArea: 1, // 100% de la zone
    center: true,
    guides: false,
    zoomable: false,
    ready() {
      // Ajustement automatique initial
      this.cropper.setCropBoxData({
        width: this.cropper.getContainerData().width,
        height: this.cropper.getContainerData().height,
      });

      // Ajouter les guides de diamètre après l'initialisation
      addDiameterGuides();
    },
    crop() {
      // Mettre à jour les guides lors du redimensionnement ou déplacement
      updateDiameterGuides();
    },
  });
}

// Fonction pour ajouter les guides de diamètre
function addDiameterGuides() {
  // Supprimer les guides existants
  const existingGuides = document.querySelectorAll(".diameter-guide");
  existingGuides.forEach((guide) => guide.remove());

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

  // Mettre à jour les positions des guides
  updateDiameterGuides();
}

// Fonction pour mettre à jour les guides de diamètre
function updateDiameterGuides() {
  if (!cropper) return;

  const cropBoxData = cropper.getCropBoxData();
  const { width, height, left, top } = cropBoxData;

  // Le centre du cercle est le centre de la cropBox
  const centerX = left + width / 2;
  const centerY = top + height / 2;

  // La taille maximale (TARGET_SIZE_CM) correspond à la largeur/hauteur de la cropBox
  // Calculons le facteur d'échelle (pixels par cm)
  const pixelsPerCm = width / TARGET_SIZE_CM;

  // Mettre à jour la position et la taille de chaque guide
  document.querySelectorAll(".diameter-guide").forEach((guide) => {
    const sizeCm = parseFloat(guide.dataset.size);
    const sizePixels = sizeCm * pixelsPerCm;

    guide.style.width = `${sizePixels}px`;
    guide.style.height = `${sizePixels}px`;
    guide.style.left = `${centerX - sizePixels / 2}px`;
    guide.style.top = `${centerY - sizePixels / 2}px`;
  });
}

// Génération PDF
async function generatePDF() {
  if (!cropper) return;

  const canvas = cropper.getCroppedCanvas({
    width: 800,
    height: 800,
    fillColor: "#fff",
  });

  // Création du masque circulaire
  const ctx = canvas.getContext("2d");
  ctx.globalCompositeOperation = "destination-in";
  ctx.beginPath();
  ctx.arc(400, 400, 400, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jspdf.jsPDF("p", "cm", "letter");

  const pageWidth = 21.59;
  const pageHeight = 27.94;
  const startX =
    (pageWidth - (COLS * TARGET_SIZE_CM + (COLS - 1) * SPACING_CM)) / 2;
  let currentX = startX;
  let currentY =
    (pageHeight - (ROWS * TARGET_SIZE_CM + (ROWS - 1) * SPACING_CM)) / 2;

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
      TARGET_SIZE_CM
    );
    currentX += TARGET_SIZE_CM + SPACING_CM;

    if (currentY + TARGET_SIZE_CM > pageHeight) {
      pdf.addPage();
      currentY = 0;
    }
  }

  pdf.save("macarons.pdf");
}

function selectPresetImage(filename) {
  // Chemin vers les images haute résolution
  const fullImagePath = `static/img/images-proposees/${filename}`;

  // Simuler le chargement d'un fichier
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
