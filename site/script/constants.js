// ============================================================================
// CONFIGURATION PDF
// ============================================================================

const TARGET_SIZE_CM = 4.13766; // Taille du macaron en cm
const SPACING_CM = 0.27; // Espacement entre les macarons
const ROWS = 6; // Nombre de lignes
const COLS = 4; // Nombre de colonnes

// ============================================================================
// GUIDES DE DIAMÈTRE
// ============================================================================

const DIAMETER_GUIDES = [
  {
    size: 2.921,
    sizeInch: 1.15,
    color: "#FF0000",
    description: "Zone pour imprimer la face du macaron.",
  },
  {
    size: 3.175,
    sizeInch: 1.25,
    color: "#00FF00",
    description: "Limite de la face du macaron.",
  },
  {
    size: 3.556,
    sizeInch: 1.4,
    color: "#999999",
    description: "Rebord du macaron.",
  },
  {
    size: 4.13766,
    sizeInch: 1.625,
    color: "#000000",
    description: "Ligne de coupe.",
  },
];

// ============================================================================
// IMAGES PRÉDÉFINIES
// ============================================================================

const PRESET_IMAGES = [
  // OUI Québec
  "oui-quebec.png",
  "oui-bleu-fonce.png",
  "oui-bleu-pale.png",
  "oui-jaune.png",
  "oui-mauve.png",
  "oui-orange-fonce.png",
  "oui-orange-pale.png",
  "oui-rose.png",
  "oui-turquoise.png",
  "oui-vert.png",
  
  // Allumettes
  "allumettes-bleu.png",
  "allumettes-rouge.png",
  "allumettes-creme.png",
  "allumettes-jaune.png",
  "allumettes-marron.png",
  
  // Club Pays - Oiseau
  "club-pays-oiseau-vin-rouge.png",
  "club-pays-oiseau-rouge-vin.png",
  "club-pays-oiseau-bleu-vin.png",
  "club-pays-oiseau-mauve-bleu.png",
  "club-pays-oiseau-vin-blanc.png",
  "club-pays-oiseau-vin-mauve.png",
  "club-pays-oiseau-mauve-vin.png",
  "club-pays-oiseau-blanc-mauve.png",
  "club-pays-oiseau-vin-bleu.png",
  "club-pays-oiseau-bleu-bleu.png",
  "club-pays-oiseau-bleu-blanc.png",
  "club-pays-oiseau-blanc-brun.png",
  "club-pays-oiseau-blanc-bleu.png",
  "club-pays-oiseau-mauve-blanc.png",
  "club-pays-oiseau-blanc-rouge.png",
  "club-pays-oiseau-rouge-blanc.png",
  
  // Club Pays - CP
  "club-pays-cp-blanc-rouge.png",
  "club-pays-cp-vin-rouge.png",
  "club-pays-cp-rouge-vin.png",
  "club-pays-cp-marron-bleu.png",
  "club-pays-cp-bleu-vin.png",
  "club-pays-cp-mauve-bleu.png",
  "club-pays-cp-vin-blanc.png",
  "club-pays-cp-vin-mauve.png",
  "club-pays-cp-mauve-vin.png",
  "club-pays-cp-blanc-mauve.png",
  "club-pays-cp-brun-bleu.png",
  "club-pays-cp-vin-bleu.png",
  "club-pays-cp-bleu-bleu.png",
  "club-pays-cp-bleu-blanc.png",
  "club-pays-cp-blanc-vin.png",
  "club-pays-cp-blanc-bleu.png",
  "club-pays-cp-mauve-blanc.png",
  "club-pays-cp-rouge-blanc.png",
];
