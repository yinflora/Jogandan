import React, { useEffect, useRef, useState } from 'react';
import { CiCircleInfo } from 'react-icons/ci';
import { RxCross1 } from 'react-icons/rx';
import styled from 'styled-components';
import { FormInputsType } from '../../types/types';
import Button from '../Button/Button';
import imageIcon from './image.png';
import photo from './photo.png';

type ImageFormProps = {
  singleForm: FormInputsType;
  setSingleForm: React.Dispatch<React.SetStateAction<FormInputsType>>;
};

const ImageInfoWrapper = styled.div`
  display: flex;
  height: 40px;
  justify-content: space-between;
  align-items: center;
`;

const PromptWrapper = styled.div`
  display: flex;
  height: 30px;
  gap: 5px;
  justify-content: center;
  align-items: center;

  & > .info {
    width: 20px;
    height: 20px;
    color: #fff;
    stroke-width: 0.5px;
  }
`;

const PromptRemind = styled.span`
  letter-spacing: 0.1em;
  color: #fff;
`;

const SlideCount = styled.div`
  margin-left: auto;
  color: #fff;
`;

const NowIndex = styled.span`
  font-size: 1.5rem;
  letter-spacing: 0.4rem;
`;

const TotalIndex = styled.span`
  letter-spacing: 0.4rem;
`;

const ImageArea = styled.div`
  display: flex;
  height: 400px;
`;

const UploadInfoWrapper = styled.div`
  height: 100%;
  margin-left: 5px;
  padding: 5px;
  aspect-ratio: 1/1;
`;

const UploadInfo = styled.div`
  object-fit: cover;
  object-position: center;
  aspect-ratio: 1/1;
  border: 1px dashed #fff;
  background-color: rgb(255, 255, 255, 0.2);
`;

const PhotoIcon = styled.img`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  cursor: pointer;
`;

const CancelIcon = styled.button`
  position: absolute;
  top: 20px;
  right: 15px;
  cursor: pointer;

  & .close {
    width: 30px;
    height: 30px;
    color: #fff;
  }
`;

const RemindWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const ImageIcon = styled.img`
  width: 60px;
  height: 60px;
`;

const Remind = styled.p`
  margin-bottom: 30px;
  text-align: center;
  color: #fff;
`;

const InvisibleInput = styled.input`
  display: none;
`;

const SubImageContainer = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow-y: scroll;
`;

const CancelBtn = styled.button`
  position: absolute;
  z-index: 2;
  top: 0;
  right: 0;
  display: none;
  width: 25px;
  height: 25px;
  padding: 0 auto;
  font-size: 1rem;
  text-align: center;
  justify-content: center;
  align-items: center;
  background-color: rgb(0, 0, 0, 0.6);
  color: #fff;

  &:hover {
    cursor: pointer;
  }
`;

const SubImageWrapper = styled.div`
  position: relative;
  height: calc((100% - 40px) / 4);
  margin: 5px;
  aspect-ratio: 1/1;
  flex-shrink: 0 0 25%;

  &:hover ${CancelBtn} {
    display: flex;
  }
`;

const CoverText = styled.p`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 25px;
  font-size: 1rem;
  line-height: 25px;
  text-align: center;
  background-color: rgb(0, 0, 0, 0.6);
  color: #fff;
`;

const SubImage = styled.div<{ $url: string }>`
  width: 100%;
  object-fit: cover;
  object-position: center;
  aspect-ratio: 1/1;
  border: 1px solid #fff;
  background: ${({ $url }) =>
    $url === '' ? 'none' : `center / cover no-repeat url(${$url})`};

  &:hover {
    cursor: ${({ $url }) => ($url === '' ? 'default' : 'grab')};
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  height: 100%;
  margin-left: 5px;
  padding: 5px;
  aspect-ratio: 1/1;
`;

const Video = styled.video`
  width: 100%;
  object-fit: cover;
  object-position: center;
  aspect-ratio: 1/1;
  border: 1px solid #fff;
`;

export const ImageForm = ({ singleForm, setSingleForm }: ImageFormProps) => {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const SINGLE_LIMIT = 8;

  useEffect(() => {
    if (!showCamera) return;

    const startCamera = async () => {
      if (!videoRef.current) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        throw new Error(String(error));
      }
    };
    startCamera();
  }, [showCamera]);

  const dragOverContainer = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const container = containerRef.current;

    if (!container) return;

    const rect = container.getBoundingClientRect();
    const containerLeft = rect.x - rect.width;
    const containerRight = rect.x + rect.width;
    if (e.clientX > containerRight - 50) {
      container.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'end',
      });
    } else if (e.clientX < containerLeft - 50) {
      container.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  };

  const dragOverImage = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (
      draggingIndex !== null &&
      draggingIndex !== index &&
      singleForm.images[index]
    ) {
      e.dataTransfer.dropEffect = 'copy';
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };

  const dropImage = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggingIndex !== null && draggingIndex !== index) {
      const newImages = [...singleForm.images];
      [newImages[draggingIndex], newImages[index]] = [
        newImages[index],
        newImages[draggingIndex],
      ];
      setSingleForm({ ...singleForm, images: newImages });
    }
    setDraggingIndex(null);
  };

  const deleteImage = (index: number) => {
    const newImages = [...singleForm.images];
    newImages.splice(index, 1);
    setSingleForm({ ...singleForm, images: [...newImages, ''] });
  };

  const stopCamera = () => {
    if (!videoRef.current) return;

    const stream = videoRef.current.srcObject as MediaStream;
    const tracks = stream && stream.getTracks();

    if (tracks && tracks.length > 0) {
      tracks.forEach((track: MediaStreamTrack) => {
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const takePhoto = () => {
    const canvas: HTMLCanvasElement | null = document.createElement('canvas');

    if (!videoRef.current || !canvas) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas
      ?.getContext('2d')
      ?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob: Blob | null) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);

        const newSingleForm = { ...singleForm };
        const startIndex = newSingleForm.images.findIndex(
          (image) => image === ''
        );
        newSingleForm.images.splice(startIndex, 1, url);
        setSingleForm(newSingleForm);

        stopCamera();
      },
      'image/png',
      1
    );
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    limit: number
  ) => {
    let files: FileList | null = e.target.files;

    if (!files) return;

    if (files.length > limit) {
      alert(`最多只能上傳${limit}張圖片`);
      files = null;
    }

    if (!files) return;

    const newSingleForm = { ...singleForm };

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);

      const startIndex = newSingleForm.images.findIndex(
        (image) => image === ''
      );
      newSingleForm.images.splice(startIndex, 1, url);
    }

    setSingleForm(newSingleForm);
  };

  const handleSelectImage = () => {
    const uploadImage = document.getElementById('uploadImage');
    if (uploadImage) {
      uploadImage.click();
    }
  };

  return (
    <div>
      <ImageArea>
        <SubImageContainer
          ref={containerRef}
          onDragOver={(e) => dragOverContainer(e)}
        >
          {singleForm.images.map((image, index) => (
            <SubImageWrapper
              key={index}
              onDragOver={(e) => dragOverImage(e, index)}
              onDrop={(e) => image !== '' && dropImage(e, index)}
            >
              <div
                draggable={singleForm.images[index] !== ''}
                onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                  e.currentTarget.style.opacity = '0.01';
                  setDraggingIndex(index);
                }}
                onDragEnd={(e: React.DragEvent<HTMLDivElement>) => {
                  e.currentTarget.style.opacity = '1';
                  setDraggingIndex(null);
                }}
              >
                <SubImage $url={image} />
                {singleForm.images[index] !== '' && (
                  <CancelBtn onClick={() => deleteImage(index)}>
                    <RxCross1 />
                  </CancelBtn>
                )}
                {index === 0 && <CoverText>封面</CoverText>}
              </div>
            </SubImageWrapper>
          ))}
        </SubImageContainer>
        {showCamera ? (
          <VideoWrapper>
            <Video ref={videoRef} autoPlay />
            <PhotoIcon
              src={photo}
              alt="Photo button: Click this button to take a photo."
              onClick={takePhoto}
            />
            <CancelIcon onClick={stopCamera}>
              <RxCross1 className="close" />
            </CancelIcon>
          </VideoWrapper>
        ) : (
          <UploadInfoWrapper>
            <UploadInfo>
              <RemindWrapper>
                <ImageIcon src={imageIcon} alt="Image Icon" />
                <Remind>最多上傳 {SINGLE_LIMIT} 張</Remind>
                <Button buttonType="normal" onClick={() => setShowCamera(true)}>
                  拍照上傳
                </Button>
                <InvisibleInput
                  id="uploadImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileUpload(
                      e,
                      SINGLE_LIMIT -
                        singleForm.images.filter((item) => item !== '').length
                    )
                  }
                  multiple
                  capture
                />
                <label htmlFor="uploadImage">
                  <Button buttonType="normal" onClick={handleSelectImage}>
                    選擇照片
                  </Button>
                </label>
              </RemindWrapper>
            </UploadInfo>
          </UploadInfoWrapper>
        )}
      </ImageArea>

      <ImageInfoWrapper>
        {singleForm.images.findIndex((image) => image === '') > 1 && (
          <PromptWrapper>
            <CiCircleInfo className="info" />
            <PromptRemind>拖拉照片調整位置</PromptRemind>
          </PromptWrapper>
        )}

        <SlideCount>
          <NowIndex>
            {singleForm.images.filter((image) => image !== '').length}
          </NowIndex>
          <TotalIndex>/{singleForm.images.length}</TotalIndex>
        </SlideCount>
      </ImageInfoWrapper>
    </div>
  );
};
