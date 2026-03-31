// ============================================================================
// GESTION DE LA GALERIE D'IMAGES
// ============================================================================

/**
 * Formate le nom de fichier en texte lisible pour l'affichage
 * @param {string} filename - Nom du fichier à formater
 * @returns {string} Nom formaté
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
 * @param {string} filename - Nom du fichier de l'image à sélectionner
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
