import { useEffect, useState } from "react";
import styles from "./ImageUploader.module.css";

type ImageUploaderProps = {
  onImageSelected: (file: File | null) => void;
};

function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const processFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
      onImageSelected(file);
    } else {
      setImagePreviewUrl(null);
      onImageSelected(null);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  return (
    <div className={styles.fieldset_title}>
      <label htmlFor="announcement-image" className={styles.upload_button}>
        Ajouter une image à l'annonce (Optionnel)
      </label>
      <input
        id="announcement-image"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={processFileSelection}
        className={styles.hidden_file_input}
      />
      {imagePreviewUrl && (
        <img
          src={imagePreviewUrl}
          alt="Aperçu de l'illustration"
          style={{
            marginTop: "10px",
            maxHeight: "150px",
            borderRadius: "8px",
            display: "block",
          }}
        />
      )}
    </div>
  );
}

export default ImageUploader;
