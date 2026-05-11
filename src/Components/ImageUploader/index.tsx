import { useRef, useState } from "react";

import "./index.scss";
import { Button } from "../../stories";

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

interface Image {
  url: string;
  public_id?: string;
}

interface Props {
  images?: Image[];
  onChange: (images: Image[]) => void;
  maxImages?: number;
}

const ImageUploader = ({ images, onChange, maxImages = 3 }: Props) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const safeImages = images ?? [];

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    const updated = safeImages.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (safeImages.length + files.length > maxImages) {
      alert(`Max ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);

    try {
      const uploads = Array.from(files).map((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        return fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        }).then(
          (res) =>
            res.json() as Promise<{
              secure_url: string;
              public_id: string;
            }>,
        );
      });

      const results = await Promise.all(uploads);

      const newImages: Image[] = results.map((r) => ({
        url: r.secure_url,
        public_id: r.public_id,
      }));

      onChange([...safeImages, ...newImages]);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="image-uploader">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        style={{ display: "none" }}
      />

      <Button
        type="button"
        handleClick={triggerFileSelect}
        customStyle="button button--emeraldGreen--primary"
        isDisabled={isUploading || safeImages.length >= maxImages}
        text={isUploading ? "Uploading..." : "Add Images"}
      />

      <div className="image-grid">
        {safeImages.map((img, i) => (
          <div key={i} className="image-item">
            <img src={img.url} alt={`upload-${i}`} className="image-preview" />

            <Button
              type="button"
              handleClick={() => removeImage(i)}
              customStyle="button button--emeraldGreen--secondary image-uploader__remove-btn"
              text="Remove"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
