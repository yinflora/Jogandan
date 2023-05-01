import React, { useRef } from 'react';
import { useEffect, useState, useContext } from 'react';
import {
  storage,
  uploadItems,
  getItemById,
  updateItem,
} from '../../utils/firebase';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { Timestamp } from 'firebase/firestore';
import { AuthContext } from '../../context/authContext';
import { useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import photo from './photo.png';
import image from './image.png';
import Button from '../../components/Button/Button';
import Cross from '../../components/Icon/Cross';
import { v4 as uuidv4 } from 'uuid';
import { CiCircleInfo } from 'react-icons/ci';
import { RxCross1 } from 'react-icons/rx';

import Alert from '../../components/Alert/Alert';

const Container = styled.div<{ isEdit: boolean }>`
  margin: ${({ isEdit }) => (isEdit ? 0 : '150px auto 0')};
  padding: ${({ isEdit }) => (isEdit ? 0 : '0 250px')};
  color: #fff;
`;

const TitleWrapper = styled.div<{ isBulkMode: boolean }>`
  display: flex;
  margin-bottom: ${({ isBulkMode }) => (isBulkMode ? 0 : '80px')};
  justify-content: space-between;
  align-items: end;
`;

const PageTitle = styled.h1`
  margin-right: 20px;
  font-size: 3rem;
  font-weight: 500;
  letter-spacing: 0.4rem;
  text-transform: uppercase;
`;

const ModeToggler = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const ModeText = styled.span`
  letter-spacing: 0.1rem;
`;

const SingleMode = styled(ModeText)<{ isBulkMode: boolean }>`
  color: ${({ isBulkMode }) =>
    isBulkMode ? 'rgba(255, 255, 255, 0.4)' : '#fff'};
  font-weight: ${({ isBulkMode }) => (isBulkMode ? 400 : 500)};
`;

const BulkMode = styled(ModeText)<{ isBulkMode: boolean }>`
  color: ${({ isBulkMode }) =>
    isBulkMode ? '#fff' : 'rgba(255, 255, 255, 0.4)'};
  font-weight: ${({ isBulkMode }) => (isBulkMode ? 500 : 400)};
`;

const SwitchContainer = styled.div`
  display: inline-block;
  position: relative;
  width: 48px;
  height: 24px;
`;

const Slider = styled.div<{ checked: boolean }>`
  background-color: #ccc;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 24px;
  transition: all 0.3s;
  background-color: ${({ checked }) =>
    checked ? 'rgb(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.4)'};

  &:before {
    position: absolute;
    content: '';
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    border-radius: 50%;
    transition: all 0.3s;

    transform: translateX(${({ checked }) => (checked ? '24px' : '0px')});
  }

  &:hover {
    cursor: pointer;
  }
`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const BulkUploadWrapper = styled.div`
  display: flex;
  margin-left: auto;
  gap: 20px;
`;

const UploadContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  gap: 60px;
`;

const ImageWrapper = styled.div``;

const ImageInfoWrapper = styled.div`
  display: flex;
  height: 40px;
  justify-content: space-between;
  align-items: center;
`;

const PromptWrapper = styled.div<{ isBulkMode: boolean }>`
  display: flex;
  height: 30px;
  gap: 5px;
  justify-content: center;
  align-items: center;

  & > .info {
    width: 20px;
    height: 20px;
    color: ${({ isBulkMode }) => (isBulkMode ? '#000' : '#fff')};
    stroke-width: 0.5px;
  }
`;

const PromptRemind = styled.span<{ color: string }>`
  letter-spacing: 0.1em;
  color: ${({ color }) => color};
`;

const BulkCountWrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 20px 0 10px;
  justify-content: end;
  align-items: flex-end;
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

const MainImageWrapper = styled.div`
  height: 100%;
  margin-left: 5px;
  padding: 5px;
  aspect-ratio: 1/1;
`;

const MainImage = styled.div`
  object-fit: cover;
  object-position: center;
  aspect-ratio: 1/1;
  border: 1px dashed #fff;
  background-color: rgb(255, 255, 255, 0.2);
`;

const ImageIcon = styled.img`
  width: 60px;
  height: 60px;
`;

const PhotoIcon = styled.img`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
`;

const CancelIcon = styled.button`
  position: absolute;
  top: 0;
  right: 15px;
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

const BulkRemindWrapper = styled.div`
  display: flex;
  margin-bottom: 30px;
  flex-direction: column;
  gap: 10px;
`;

const Remind = styled.p`
  text-align: center;
  color: #fff;
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

const SubImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  object-fit: cover;
  object-position: center;
  aspect-ratio: 1/1;
  border: 1px solid #fff;
  background: ${({ imageUrl }) =>
    imageUrl === '' ? 'none' : `center / cover no-repeat url(${imageUrl})`};
`;

const InfoWrapper = styled.form`
  display: flex;
  padding: 5px 0 45px;
  flex-grow: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const BulkInfoWrapper = styled(InfoWrapper)`
  display: flex;
  padding: 0;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BulkFieldWrapper = styled(FieldWrapper)`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid #fff;
  gap: 0;
`;

const HalfFieldWrapper = styled(FieldWrapper)`
  width: 50%;
`;

const FiledLabel = styled.label`
  letter-spacing: 0.1rem;
`;

const BulkFiledLabel = styled(FiledLabel)`
  width: 45px;
  line-height: 30px;
`;

const TextInput = styled.input`
  width: 100%;
  height: 30px;
  padding-left: 5px;
  font-size: 1rem;
  letter-spacing: 0.1rem;
  border-bottom: 1px solid #fff;
  color: #fff;
`;

const BulkTextInput = styled(TextInput)`
  width: calc(100% - 45px);
  border: none;
`;

const SelectWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

const SelectInput = styled.select`
  height: 30px;
  font-size: 1rem;
  letter-spacing: 0.1rem;
  border-bottom: 1px solid #fff;
  color: #fff;
`;

const BulkSelectInput = styled(SelectInput)`
  width: calc(100% - 45px);
  height: 30px;
  letter-spacing: 0.1rem;
  border: none;
  color: #fff;
`;

const Description = styled.textarea`
  width: 100%;
  padding: 10px;
  font-family: 'TT Norms Pro', sans-serif;
  font-size: 1rem;
  resize: none;
  border: 1px solid #fff;
  outline: none;
  background-color: transparent;
  color: #fff;
`;

const ItemWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 30vh;
  border: 1px solid black;
`;

const BulkImageWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 500px;
  margin: 40px 0 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px dashed #fff;
  background-color: rgb(255, 255, 255, 0.2);
  gap: 10px;
`;

const BulkContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
`;

const BulkItemWrapper = styled(ItemWrapper)`
  position: relative;
  width: calc(50% - 10px);
  max-width: calc(50% - 10px);
  height: 250px;
  padding: 25px;
  flex: 1;
  gap: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
`;

const BulkImage = styled(SubImage)`
  width: 200px;
  height: 200px;
`;

const BulkCancelBtn = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  width: 25px;
  height: 25px;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  color: #000;

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
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
`;

const CATEGORY_OPTIONS = [
  '請選擇類別',
  '居家生活',
  '服飾配件',
  '美妝保養',
  '3C產品',
  '影音產品',
  '書報雜誌',
  '體育器材',
  '寵物用品',
  '食物及飲料',
  '興趣及遊戲',
  '紀念意義',
  '其他',
];

const STATUS_OPTIONS = ['請選擇狀態', '保留', '待處理', '已處理'];

type Item = {
  id?: string;
  name: string;
  status: string;
  category: string;
  created?: Timestamp;
  processedDate?: string;
  description: string;
  images: string[];
};

type EditProp = {
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItem: Item | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<Item | null>>;
};

type Form = {
  name: string;
  category: string;
  status: string;
  description: string;
  images: string[];
  [key: string]: any;
  created?: Timestamp;
  id?: string;
  processedDate?: string;
};

export default function Upload({
  isEdit,
  setIsEdit,
  setSelectedItem,
}: EditProp) {
  const SINGLE_LIMIT = 8;
  const BULK_LIMIT = 16;

  const { uid, isPopout, setIsPopout } = useContext(AuthContext);
  const { id } = useParams();

  const [singleForm, setSingleForm] = useState<Form>({
    name: '',
    category: '',
    status: '',
    description: '',
    images: Array(SINGLE_LIMIT).fill(''),
  });

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);

  const [isBulkMode, setIsBulkMode] = useState<boolean>(false);
  const [bulkForms, setBulkForms] = useState<Form[] | []>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    async function getItem() {
      const item = await getItemById(uid, id);
      const {
        images,
        name,
        category,
        status,
        description,
        created,
        processedDate,
      } = item[0];

      if (images.length < SINGLE_LIMIT) {
        const filledImages = new Array(SINGLE_LIMIT)
          .fill('')
          .map((_, i) => images[i] || '');

        setSingleForm({
          name,
          category,
          status,
          description,
          images: filledImages,
          created,
          id: item[0].id,
          processedDate,
        });
      } else {
        setSingleForm({
          name,
          category,
          status,
          description,
          images,
          created,
          id: item[0].id,
          processedDate,
        });
      }
    }
    if (isEdit && id) getItem();
  }, []);

  useEffect(() => {
    if (!showCamera) return;

    async function startCamera() {
      if (!videoRef.current) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.log(err);
      }
    }
    startCamera();
  }, [showCamera]);

  function stopCamera() {
    if (!videoRef.current) return;

    const stream = videoRef.current.srcObject as MediaStream; //!Fixme
    const tracks = stream && stream.getTracks();

    if (tracks && tracks.length > 0) {
      tracks.forEach((track: MediaStreamTrack) => {
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  }

  function takePhoto() {
    const canvas: any = document.createElement('canvas');

    if (!videoRef.current || !canvas) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas
      .getContext('2d')
      .drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob: any) => {
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
  }

  async function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    limit: number
  ) {
    let files: FileList | null = e.target.files;

    if (!files) return;

    if (files.length > limit) {
      alert(`最多只能上傳${limit}張圖片`);
      files = null;
    }

    if (!files) return;

    const newBulkForms = [...bulkForms];
    const newSingleForm = { ...singleForm };

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);

      if (isBulkMode) {
        newBulkForms.push({
          name: '',
          category: '',
          status: '',
          description: '',
          images: [url],
        });
      } else {
        const startIndex = newSingleForm.images.findIndex(
          (image) => image === ''
        );
        newSingleForm.images.splice(startIndex, 1, url);
      }
    }

    if (isBulkMode) {
      setBulkForms(newBulkForms);
    } else {
      setSingleForm(newSingleForm);
    }
  }

  async function handleUploadItems(form: Form) {
    const newForm = { ...form };

    await Promise.all(
      newForm.images.map(async (image: any, index: number) => {
        if (image === '') {
          newForm.images[index] = '';
        } else {
          const res = await fetch(image);
          const blobImage = await res.blob();

          const storageRef = ref(storage, `/${uid}/images/${uuidv4()}`);
          const snapshot = await uploadBytes(storageRef, blobImage);
          const url = await getDownloadURL(snapshot.ref);

          newForm.images[index] = url;
        }
      })
    );

    const itemId = await uploadItems(uid, newForm);

    !isBulkMode &&
      itemId &&
      setSingleForm({
        name: '',
        category: '',
        status: '',
        description: '',
        images: Array(8).fill(''),
      });
  }

  async function handleUpdateItems() {
    const newForm = { ...singleForm };

    await Promise.all(
      newForm.images.map(async (image: any, index: number) => {
        if (image === '') {
          newForm.images[index] = '';
        } else {
          const res = await fetch(image);
          const blobImage = await res.blob();

          const storageRef = ref(storage, `/${uid}/images/${uuidv4()}`);
          const snapshot = await uploadBytes(storageRef, blobImage);
          const url = await getDownloadURL(snapshot.ref);

          newForm.images[index] = url;
        }
      })
    );

    await updateItem(uid, id, newForm);
    setSelectedItem(newForm);
  }

  function handleDeleted(index: number) {
    const newImages = [...singleForm.images];
    newImages.splice(index, 1);
    setSingleForm({ ...singleForm, images: [...newImages, ''] });
  }

  function handleBulkDelete(index: number) {
    const newForms = [...bulkForms];
    newForms.splice(index, 1);
    setBulkForms(newForms);
  }

  function handleDragOverImg(
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) {
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
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, index: number) {
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
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
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
  }

  function handleSelectImage() {
    const uploadImage = document.getElementById('uploadImage');
    if (uploadImage) {
      uploadImage.click();
    }
  }

  return (
    <Container isEdit={isEdit}>
      {isEdit
        ? isPopout && (
            <Alert
              url={`/inventory/${id}`}
              setIsEdit={setIsEdit}
              isEdit={isEdit}
            />
          )
        : isPopout && <Alert url="/inventory" />}

      {!isEdit && (
        <TitleWrapper isBulkMode={isBulkMode}>
          <PageTitle>UPLOAD</PageTitle>

          <ModeToggler>
            <SingleMode isBulkMode={isBulkMode}>單品</SingleMode>
            <SwitchContainer>
              <Input
                id="switchUpload"
                type="checkbox"
                checked={isBulkMode}
                onChange={() => {
                  setIsBulkMode(!isBulkMode);
                  setSingleForm({
                    name: '',
                    category: '',
                    status: '',
                    description: '',
                    images: Array(SINGLE_LIMIT).fill(''),
                  });
                  setBulkForms([]);
                }}
              />
              <label htmlFor="switchUpload">
                <Slider checked={isBulkMode} />
              </label>
            </SwitchContainer>
            <BulkMode isBulkMode={isBulkMode}>批量</BulkMode>
          </ModeToggler>
        </TitleWrapper>
      )}

      {isBulkMode ? (
        bulkForms.length === 0 && (
          <BulkImageWrapper>
            <ImageIcon src={image} />
            <BulkRemindWrapper>
              <Remind>選擇照片進行批量上傳</Remind>
              <PromptWrapper isBulkMode={isBulkMode}>
                <CiCircleInfo className="info" />
                <PromptRemind color="#000">
                  最多只能選擇 {BULK_LIMIT} 張
                </PromptRemind>
              </PromptWrapper>
            </BulkRemindWrapper>

            <input
              id="uploadImage"
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileUpload(e, BULK_LIMIT - bulkForms.length)
              }
              multiple
              style={{ display: 'none' }}
            />
            <label htmlFor="uploadImage">
              <Button buttonType="dark" onClick={handleSelectImage}>
                選擇照片
              </Button>
            </label>
          </BulkImageWrapper>
        )
      ) : (
        <UploadContainer>
          <ImageWrapper>
            <ImageArea>
              <SubImageContainer
                ref={containerRef}
                onDragOver={(e) => handleDragOver(e)}
              >
                {singleForm.images.map((image, index) => (
                  <SubImageWrapper
                    key={index}
                    onDragOver={(e) => handleDragOverImg(e, index)}
                    onDrop={(e) => image !== '' && handleDrop(e, index)}
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
                      <SubImage imageUrl={image} />
                      {singleForm.images[index] !== '' && (
                        <CancelBtn onClick={() => handleDeleted(index)}>
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
                  <PhotoIcon src={photo} onClick={takePhoto} />
                  <CancelIcon onClick={stopCamera}>
                    <Cross size={50} lineWidth={3} />
                  </CancelIcon>
                </VideoWrapper>
              ) : (
                <MainImageWrapper>
                  <MainImage>
                    <RemindWrapper>
                      <ImageIcon src={image} />
                      <Remind style={{ marginBottom: 30 }}>
                        最多上傳 {SINGLE_LIMIT} 張
                      </Remind>
                      <Button
                        buttonType="normal"
                        onClick={() => setShowCamera(true)}
                      >
                        拍照上傳
                      </Button>
                      <input
                        id="uploadImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(
                            e,
                            SINGLE_LIMIT -
                              singleForm.images.filter((item) => item !== '')
                                .length
                          )
                        }
                        multiple
                        capture
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="uploadImage">
                        <Button buttonType="normal" onClick={handleSelectImage}>
                          選擇照片
                        </Button>
                      </label>
                    </RemindWrapper>
                  </MainImage>
                </MainImageWrapper>
              )}
            </ImageArea>
            <ImageInfoWrapper>
              {singleForm.images.findIndex((image) => image === '') > 1 && (
                <PromptWrapper isBulkMode={isBulkMode}>
                  <CiCircleInfo className="info" />
                  <PromptRemind color="#fff">拖拉照片調整位置</PromptRemind>
                </PromptWrapper>
              )}

              <SlideCount>
                <NowIndex>
                  {singleForm.images.filter((image) => image !== '').length}
                </NowIndex>
                <TotalIndex>/{singleForm.images.length}</TotalIndex>
              </SlideCount>
            </ImageInfoWrapper>
          </ImageWrapper>
          <InfoWrapper>
            <FieldWrapper>
              <FiledLabel>名稱</FiledLabel>
              <TextInput
                type="text"
                value={singleForm.name}
                onChange={(e) =>
                  setSingleForm({ ...singleForm, name: e.target.value })
                }
              />
            </FieldWrapper>
            <SelectWrapper>
              <HalfFieldWrapper>
                <FiledLabel>分類</FiledLabel>
                <SelectInput
                  onChange={(e) =>
                    setSingleForm({ ...singleForm, category: e.target.value })
                  }
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      selected={option === singleForm.category}
                    >
                      {option}
                    </option>
                  ))}
                </SelectInput>
              </HalfFieldWrapper>
              <HalfFieldWrapper>
                <FiledLabel>狀態</FiledLabel>
                <SelectInput
                  onChange={(e) =>
                    setSingleForm({ ...singleForm, status: e.target.value })
                  }
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      selected={option === singleForm.status}
                    >
                      {option}
                    </option>
                  ))}
                </SelectInput>
              </HalfFieldWrapper>
            </SelectWrapper>
            <FieldWrapper>
              <FiledLabel>描述</FiledLabel>
              <Description
                value={singleForm.description}
                onChange={(e) =>
                  setSingleForm({ ...singleForm, description: e.target.value })
                }
                rows={5}
                cols={33}
              />
            </FieldWrapper>
            <Button
              buttonType="dark"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                isEdit ? handleUpdateItems() : handleUploadItems(singleForm);
                setIsPopout(!isPopout);
              }}
              disabled={
                singleForm.name === '' ||
                singleForm.category === '' ||
                singleForm.status === '' ||
                !singleForm.images.some((image) => image !== '')
              }
            >
              {isEdit ? '確認更新' : '確認上傳'}
            </Button>
          </InfoWrapper>
        </UploadContainer>
      )}

      {bulkForms.length > 0 && (
        <>
          <BulkCountWrapper>
            <SlideCount style={{ margin: 0 }}>
              <NowIndex>{bulkForms.length}</NowIndex>
              <TotalIndex>/{BULK_LIMIT}</TotalIndex>
            </SlideCount>

            <BulkUploadWrapper>
              <input
                id="uploadImage"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileUpload(e, BULK_LIMIT - bulkForms.length)
                }
                multiple
                style={{ display: 'none' }}
              />
              <label htmlFor="uploadImage">
                <Button
                  buttonType="light"
                  onClick={handleSelectImage}
                  disabled={bulkForms.length === BULK_LIMIT}
                >
                  選擇照片
                </Button>
              </label>
              <Button
                buttonType="dark"
                onClick={() =>
                  Promise.all(
                    bulkForms.map((item) => handleUploadItems(item))
                  ).then(() => setIsPopout(!isPopout))
                }
                disabled={
                  !bulkForms
                    .map((form) => {
                      const { name, category, status } = form;
                      return name !== '' && category !== '' && status !== '';
                    })
                    .every(Boolean)
                }
              >
                確認上傳
              </Button>
            </BulkUploadWrapper>
          </BulkCountWrapper>

          <BulkContainer>
            {bulkForms.map((form, index) => (
              <BulkItemWrapper key={index}>
                <BulkCancelBtn onClick={() => handleBulkDelete(index)}>
                  <RxCross1 />
                </BulkCancelBtn>
                <BulkImage imageUrl={form.images[0]} />
                <BulkInfoWrapper>
                  <BulkFieldWrapper>
                    <BulkFiledLabel>名稱</BulkFiledLabel>
                    <BulkTextInput
                      type="text"
                      value={form.name}
                      onChange={(e) => {
                        const newForm = [...bulkForms];
                        newForm[index].name = e.target.value;
                        setBulkForms(newForm);
                      }}
                    />
                  </BulkFieldWrapper>
                  <BulkFieldWrapper>
                    <BulkFiledLabel>分類</BulkFiledLabel>
                    <BulkSelectInput
                      onChange={(e) => {
                        const newForm = [...bulkForms];
                        newForm[index].category = e.target.value;
                        setBulkForms(newForm);
                      }}
                    >
                      {CATEGORY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </BulkSelectInput>
                  </BulkFieldWrapper>
                  <BulkFieldWrapper>
                    <BulkFiledLabel>狀態</BulkFiledLabel>
                    <BulkSelectInput
                      onChange={(e) => {
                        const newForm = [...bulkForms];
                        newForm[index].status = e.target.value;
                        setBulkForms(newForm);
                      }}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </BulkSelectInput>
                  </BulkFieldWrapper>
                  <div>
                    <BulkFiledLabel>描述</BulkFiledLabel>
                    <Description
                      value={form.description}
                      onChange={(e) => {
                        const newForm = [...bulkForms];
                        newForm[index].description = e.target.value;
                        setBulkForms(newForm);
                      }}
                    />
                  </div>
                </BulkInfoWrapper>
              </BulkItemWrapper>
            ))}
          </BulkContainer>
        </>
      )}
    </Container>
  );
}
