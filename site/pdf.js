// ============================================================================
// GÉNÉRATION DE PDF
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
