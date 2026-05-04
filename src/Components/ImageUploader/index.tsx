import { useRef, useState } from "react";

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

interface Image {
    url: string;
}

interface Props {
    images: Image[];
    onChange: (images: Image[]) => void;
    maxImages?: number;
}

const ImageUploader = ({ images, onChange, maxImages = 5 }: Props) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const removeImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        onChange(updatedImages);
    };

    const handleUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = e.target.files;
        if (!files) return;

        if (images.length + files.length > maxImages) {
            alert(`Max ${maxImages} images allowed`);
            return;
        }

        setIsUploading(true);

        try {
            const uploads = Array.from(files).map((file: File) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", UPLOAD_PRESET);

                return fetch(CLOUDINARY_URL, {
                    method: "POST",
                    body: formData,
                }).then((res) => res.json() as Promise<{ secure_url: string }>);
            });

            const results = await Promise.all(uploads);

            const newImages: Image[] = results.map((r) => ({
                url: r.secure_url,
            }));

            onChange([...images, ...newImages]);
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="image-uploader">
            {/* Hidden input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                style={{ display: "none" }}
            />

            {/* Styled button */}
            <button
                type="button"
                onClick={triggerFileSelect}
                className="button button--emeraldGreen--primary"
                disabled={isUploading}
            >
                {isUploading ? "Uploading..." : "Add Images"}
            </button>

            <div className="image-grid">
                {images.map((img, i) => (
                    <div key={i} className="image-item">
                        <div
                            className="image-preview"
                            style={{ backgroundImage: `url(${img.url})` }}
                        />

                        <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="button button--emeraldGreen--secondary image-uploader__remove-btn"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUploader;