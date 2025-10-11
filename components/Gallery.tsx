
import React, { useState, useRef } from 'react';
import { Group, GalleryImage } from '../types';
import { Icon } from './common/Icon';
import Modal from './common/Modal';
import { useData } from '../contexts/DataContext';
import { fileToBase64 } from '../utils/file';

interface GalleryProps {
  group: Group;
}

const Gallery: React.FC<GalleryProps> = ({ group }) => {
  const { data, updateGalleryImages } = useData();
  const { galleryImages } = data;
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // FIX: Refactored to use async/await and Promise.all for robust, concurrent file processing.
  // This resolves type errors by explicitly checking if the iterated item is a File object,
  // preventing access to properties on 'unknown' types and ensuring correct types for APIs like FileReader.
  // This also fixes a logical bug where the component state would not update if any file failed to load.
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);

    const newImagesPromises = filesArray.map(async (file) => {
      if (file instanceof File) {
        try {
          const base64Src = await fileToBase64(file);
          const newImage: GalleryImage = {
            id: `${Date.now()}-${file.name}`,
            src: base64Src,
            uploadedAt: new Date().toISOString(),
            groupId: group.id,
          };
          return newImage;
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
          return null;
        }
      }
      return null;
    });

    const results = await Promise.all(newImagesPromises);
    const newImages = results.filter((img): img is GalleryImage => img !== null);

    if (newImages.length > 0) {
      updateGalleryImages([...galleryImages, ...newImages]);
    }
  };
  
  const groupImages = galleryImages
    .filter(img => img.groupId === group.id)
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{group.name} Gallery</h2>
        <button
          onClick={handleUploadClick}
          className="flex items-center gap-2 bg-[var(--accent-color)] text-[var(--primary-color)] font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Icon icon="upload" className="w-5 h-5" />
          Upload
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          multiple
        />
      </div>

      {groupImages.length > 0 ? (
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {groupImages.map((image) => (
            <div key={image.id} className="aspect-square cursor-pointer" onClick={() => setSelectedImage(image)}>
                <img src={image.src} alt="User upload" className="w-full h-full object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"/>
            </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-10 text-white/70">
            <p>No images yet for {group.name}.</p>
            <p>Be the first to upload something!</p>
        </div>
      )}
      
      {selectedImage && (
        <Modal onClose={() => setSelectedImage(null)}>
            <img src={selectedImage.src} alt="Enlarged view" className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-2xl"/>
        </Modal>
      )}
    </div>
  );
};

export default Gallery;
