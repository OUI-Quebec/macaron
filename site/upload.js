// ============================================================================
// UPLOAD ET GESTION D'IMAGES
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
 * @param {File} file - Fichier image à traiter
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
