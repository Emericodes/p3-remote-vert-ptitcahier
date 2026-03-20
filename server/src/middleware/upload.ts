import fs from "node:fs";
import path from "node:path";
import multer from "multer";

// 1. Définition du chemin de stockage
const announcementImagesDirectory = path.join(
  __dirname,
  "../../../server/public/uploads/announcements",
);

// 2. Création automatique du dossier s'il est manquant (Sécurité anti-crash)
if (!fs.existsSync(announcementImagesDirectory)) {
  fs.mkdirSync(announcementImagesDirectory, { recursive: true });
}

// 3. Configuration de l'emplacement et du nommage
const imageStorageConfiguration = multer.diskStorage({
  destination: (expressRequest, uploadedFile, storageCallback) => {
    storageCallback(null, announcementImagesDirectory);
  },
  filename: (expressRequest, uploadedFile, nameCallback) => {
    // Création d'un nom unique pour éviter d'écraser une image existante
    const uniqueTimeSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = path.extname(uploadedFile.originalname);
    nameCallback(null, `announcement-${uniqueTimeSuffix}${fileExtension}`);
  },
});

// 4. Filtre de sécurité : on n'accepte que les images
const validateImageFormat = (
  expressRequest: Express.Request,
  uploadedFile: Express.Multer.File,
  validationCallback: multer.FileFilterCallback,
) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedMimeTypes.includes(uploadedFile.mimetype)) {
    validationCallback(null, true);
  } else {
    validationCallback(
      new Error(
        "Format d'image non supporté. Veuillez utiliser JPG, PNG ou WEBP.",
      ),
    );
  }
};

// 5. Création du middleware final avec une limite de poids (15 Mo)
const announcementImageUploadMiddleware = multer({
  storage: imageStorageConfiguration,
  fileFilter: validateImageFormat,
  limits: { fileSize: 15 * 1024 * 1024 },
});

export default announcementImageUploadMiddleware;
