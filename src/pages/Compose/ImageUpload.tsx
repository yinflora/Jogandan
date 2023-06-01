import {
  StorageReference,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import React from 'react';
import { CiCircleInfo } from 'react-icons/ci';
import styled from 'styled-components';
import Button from '../../components/Button/Button';

type ImageUploadProps = {
  storageRef: StorageReference;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  imageContainerRef: React.RefObject<HTMLDivElement>;
  setDraggingIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

const UploadContainer = styled.div`
  width: 30%;
  height: 100%;
  padding: 20px;
  background-color: rgba(141, 156, 164, 0.5);
`;

const InvisibleInput = styled.input`
  display: none;
`;

const RemindWrapper = styled.div`
  display: flex;
  height: 30px;
  gap: 5px;
  justify-content: center;
  align-items: center;

  & > .info {
    color: #fff;
    stroke-width: 0.25px;
  }
`;

const Remind = styled.span`
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: #fff;
`;

const ImageWrapper = styled.div`
  display: grid;
  width: 100%;
  height: calc(100% - 80px);
  padding-top: 10px;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  align-content: start;
  grid-gap: 10px;
  overflow-y: scroll;
`;

const Image = styled.img`
  max-width: 100%;
  aspect-ratio: attr(width) / attr(height);
  object-fit: cover;
  cursor: grab;
`;

const ImageUpload = ({
  storageRef,
  images,
  setImages,
  imageContainerRef,
  setDraggingIndex,
}: ImageUploadProps) => {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;

    if (!files) return;

    const uploadedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageRef = ref(storageRef, `${file.name}`);

      const snapshot = await uploadBytes(imageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      uploadedFiles.push(url);
    }

    setImages([...uploadedFiles, ...images]);
  };

  const handleSelectImage = () => {
    const uploadImage = document.getElementById('uploadImage');
    if (uploadImage) uploadImage.click();
  };

  return (
    <UploadContainer>
      <InvisibleInput
        id="uploadImage"
        type="file"
        accept="image/*"
        onChange={(e) => handleFileUpload(e)}
        multiple
      />
      <label htmlFor="uploadImage">
        <Button width="100%" buttonType="normal" onClick={handleSelectImage}>
          選擇照片
        </Button>
      </label>
      <RemindWrapper>
        <CiCircleInfo className="info" />
        <Remind>請拖拉照片至格子調整</Remind>
      </RemindWrapper>
      <ImageWrapper ref={imageContainerRef}>
        {images.map((item, index) => (
          <Image
            key={index}
            src={item}
            draggable
            onDragStart={() => setDraggingIndex(index)}
            onDragEnd={() => setDraggingIndex(null)}
          />
        ))}
      </ImageWrapper>
    </UploadContainer>
  );
};

export default ImageUpload;
