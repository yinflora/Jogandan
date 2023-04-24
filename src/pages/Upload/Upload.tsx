import React, { useRef } from 'react';
import { useEffect, useState, useContext } from 'react';
import {
  storage,
  uploadItems,
  getItemById,
  updateItem,
} from '../../utils/firebase';
import {
  ref,
  getDownloadURL,
  uploadBytes,
  uploadString,
} from 'firebase/storage';
import { AuthContext } from '../../context/authContext';
import { useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import photo from './photo.png';
import image from './image.png';
import Chevron from '../../components/Icon/Chevron';
import Button from '../../components/Button/Button';

const Container = styled.div`
  margin: 0 auto;
  padding: 0 250px;
  color: #fff;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: end;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 500;
  letter-spacing: 0.4rem;
  text-transform: uppercase;
`;

const ModeToggler = styled.button<{ isBulkMode: boolean }>`
  margin-left: ${({ isBulkMode }) => (isBulkMode ? '10px' : 'auto')};
  font-size: 1.25rem;
  border-bottom: 1px solid #fff;
  color: #fff;

  &:hover {
    cursor: pointer;
  }
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
  padding: 40px 0;
  gap: 60px;
`;

const ImageWrapper = styled.div``;

const ChangeSlideBtn = styled.button`
  display: flex;
  width: 88px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const BtnWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BulkCountWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
  justify-content: end;
  align-items: center;
`;

const SlideCount = styled.div`
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

// const MainImage = styled.div<{ coverUrl: string }>`
/* background: ${({ coverUrl }) =>
    coverUrl === '' ? 'none' : `center / cover no-repeat url(${coverUrl})`}; */

const MainImage = styled.div`
  /* width: 100%; */
  /* height: 100%; */
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

const RemindWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const Remind = styled.p`
  margin-bottom: 30px;
  color: #fff;
`;

const SubImageContainer = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow-y: scroll;
`;

// const SubImageWrapper = styled.div<{ isShow: boolean }>`
/* display: ${({ isShow }) => (isShow ? 'block' : 'none')}; */

const SubImageWrapper = styled.div`
  position: relative;
  height: calc((100% - 40px) / 4);
  margin: 5px;
  aspect-ratio: 1/1;
  flex-shrink: 0 0 25%;
`;

const CancelBtn = styled.button`
  position: absolute;
  z-index: 2;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  font-size: 1rem;
  text-align: center;
  background-color: rgb(0, 0, 0, 0.6);
  color: #fff;

  &:hover {
    cursor: pointer;
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
  /* background-color: rgba(141, 156, 164, 0.7); */
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
  /* width: 40%; */
  padding: 40px 0;
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
`;

const HalfFieldWrapper = styled(FieldWrapper)`
  width: 50%;
`;

const FiledLabel = styled.label`
  letter-spacing: 0.1rem;
`;

const TextInput = styled.input`
  height: 30px;
  letter-spacing: 0.1rem;
  border-bottom: 1px solid #fff;
  color: #fff;
`;

const BulkTextInput = styled(TextInput)`
  border: none;
`;

const SelectWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

const SelectInput = styled.select`
  height: 30px;
  letter-spacing: 0.1rem;
  border-bottom: 1px solid #fff;
  color: #fff;
`;

const BulkSelectInput = styled(SelectInput)`
  height: 30px;
  letter-spacing: 0.1rem;
  border: none;
  color: #fff;
`;

const Description = styled.textarea`
  padding: 10px;
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
  margin: 40px 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px dashed #fff;
  background-color: rgb(255, 255, 255, 0.2);
  gap: 10px;
`;

const RemindBlack = styled(Remind)`
  color: rgba(0, 0, 0, 0.6);
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

type EditProp = {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit: boolean;
};

type Form = {
  name: string;
  category: string;
  status: string;
  description: string;
  images: string[];
  [key: string]: any;
};

export default function Upload({ isEdit, setIsEdit }: EditProp) {
  const { uid } = useContext(AuthContext);
  const { id } = useParams();

  // const [singleForm, setSingleForm] = useState<Form>({
  //   name: '',
  //   category: '',
  //   status: '',
  //   description: '',
  //   images: [],
  // });

  // const [images, setImages] = useState(Array(10).fill(''));

  const [images, setImages] = useState(Array(8).fill(''));
  const [form, setForm] = useState<Form>({
    name: '',
    category: '',
    status: '',
    description: '',
    images,
  });
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);

  const [isBulkMode, setIsBulkMode] = useState<boolean>(false);
  const [bulkForms, setBulkForms] = useState<Form[] | []>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const BULK_LIMIT = 16;

  useEffect(() => {
    async function getItem() {
      const item = await getItemById(uid, id);
      const { images, name, category, status, description } = item[0];
      setImages(images);
      setForm({
        name,
        category,
        status,
        description,
        images,
      });
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
  }

  function takePhoto() {
    const canvas: any = document.createElement('canvas');

    if (!videoRef.current || !canvas) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas
      .getContext('2d')
      .drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');

    const storageRef = ref(storage, `/${uid}/images/`);
    const imageRef = ref(storageRef, 'test');

    uploadString(imageRef, dataUrl, 'data_url').then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        const emptyIndex = images.indexOf('');
        images[emptyIndex] = url;

        const imageList = [...images];
        imageList[emptyIndex] = url;
        setImages(imageList);
      });
    });

    setShowCamera(false);
    stopCamera();
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

    const storageRef = ref(storage, `/${uid}/images/`);
    const urlList: any = isBulkMode ? [...bulkForms] : []; //!Fixme
    const updateList = [...images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageRef = ref(storageRef, `${file.name}`);

      const snapshot = await uploadBytes(imageRef, file);
      const url = await getDownloadURL(snapshot.ref);

      if (isBulkMode) {
        urlList.push({ images: [url] });
      } else if (isEdit) {
        updateList.push(url);
      } else {
        urlList.push(url);
        const imageList = [...images];
        const startIndex = imageList.findIndex((image) => image === '');
        imageList.splice(startIndex, urlList.length, ...urlList);
        setImages(imageList);
        setForm({ ...form, images: imageList });
      }
    }

    if (isBulkMode) setBulkForms(urlList);
    if (isEdit) setImages(updateList);
  }

  function handleDeleted(index: number) {
    const imageList = [...images];
    imageList.splice(index, 1);
    const list = [...imageList, ''];
    setImages(list);
    setForm({ ...form, images: list });
  }

  async function handleUploadItems(form: Form) {
    const itemId = await uploadItems(uid, form);
    if (itemId) alert('成功加入！');

    if (isBulkMode) {
      setBulkForms([]);
    } else {
      // setImages(Array(10).fill(''));
      setImages(Array(8).fill(''));
      setForm({
        name: '',
        category: '',
        status: '',
        description: '',
        images,
      });
    }
  }

  async function handleUpdateItems() {
    const updatedForm = { ...form, images };
    await updateItem(uid, id, updatedForm);
    setIsEdit(false);
  }

  function handleDragOverImg(
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) {
    e.preventDefault();
    if (draggingIndex !== null && draggingIndex !== index) {
      e.dataTransfer.dropEffect = 'copy';
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, index: number) {
    e.preventDefault();
    if (draggingIndex !== null && draggingIndex !== index) {
      const newImages = [...images];
      [newImages[draggingIndex], newImages[index]] = [
        newImages[index],
        newImages[draggingIndex],
      ];
      setImages(newImages);
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
    // e.preventDefault();
    const uploadImage = document.getElementById('uploadImage');
    if (uploadImage) {
      uploadImage.click();
    }
  }

  return (
    <Container>
      {!isEdit && (
        <TitleWrapper>
          <PageTitle>UPLOAD</PageTitle>
          <ModeToggler
            isBulkMode={isBulkMode && bulkForms.length > 0}
            onClick={() => {
              setIsBulkMode(!isBulkMode);
              setBulkForms([]);
            }}
          >
            {isBulkMode ? '單品上傳' : '批量上傳'}
          </ModeToggler>
          {bulkForms.length > 0 && (
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
                <Button buttonType="light" onClick={handleSelectImage}>
                  選擇照片
                </Button>
              </label>
              <Button
                buttonType="dark"
                onClick={() => bulkForms.map((item) => handleUploadItems(item))}
              >
                確認上傳
              </Button>
            </BulkUploadWrapper>
          )}
        </TitleWrapper>
      )}

      {isBulkMode ? (
        bulkForms.length === 0 && (
          <BulkImageWrapper>
            <ImageIcon src={image} />
            <Remind>選擇照片進行批量上傳</Remind>
            <RemindBlack> 最多只能選擇 16 張</RemindBlack>
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
            <ChangeSlideBtn>
              <Chevron rotateDeg={0} />
            </ChangeSlideBtn>
            <ImageArea>
              <SubImageContainer
                ref={containerRef}
                onDragOver={(e) => handleDragOver(e)}
              >
                {images.map((image, index) => (
                  <SubImageWrapper
                    key={index}
                    onDragOver={(e) => handleDragOverImg(e, index)}
                    onDrop={(e) => image !== '' && handleDrop(e, index)}
                  >
                    <div
                      draggable={images[index] !== ''}
                      onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                        e.currentTarget.style.opacity = '0.01';
                        setDraggingIndex(index);
                      }}
                      onDragEnd={(e: React.DragEvent<HTMLDivElement>) => {
                        e.currentTarget.style.opacity = '1';
                        setDraggingIndex(null);
                      }}
                    >
                      <SubImage imageUrl={image}></SubImage>
                      {images[index] !== '' && (
                        <CancelBtn onClick={() => handleDeleted(index)}>
                          X
                        </CancelBtn>
                      )}
                      {index === 0 && <CoverText>封面</CoverText>}
                    </div>
                    {/* {images[index] === 0 && <CoverText>封面</CoverText>}
                    {images[index] === 0 && <CoverText>封面</CoverText>} */}
                  </SubImageWrapper>
                ))}
              </SubImageContainer>
              {showCamera ? (
                <VideoWrapper>
                  <Video ref={videoRef} autoPlay />
                  <PhotoIcon src={photo} onClick={takePhoto} />
                </VideoWrapper>
              ) : (
                <MainImageWrapper>
                  <MainImage>
                    <RemindWrapper>
                      <ImageIcon src={image} />
                      <Remind>最多上傳 8 張</Remind>
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
                            8 - images.filter((item) => item !== '').length
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
            <BtnWrapper>
              <ChangeSlideBtn>
                <Chevron rotateDeg={180} />
              </ChangeSlideBtn>

              <SlideCount>
                <NowIndex>1</NowIndex>
                <TotalIndex>/8</TotalIndex>
              </SlideCount>
            </BtnWrapper>
          </ImageWrapper>
          <InfoWrapper>
            <FieldWrapper>
              <FiledLabel>名稱</FiledLabel>
              <TextInput
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FieldWrapper>
            <SelectWrapper>
              <HalfFieldWrapper>
                <FiledLabel>分類</FiledLabel>
                <SelectInput
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      selected={option === form.category}
                    >
                      {option}
                    </option>
                  ))}
                </SelectInput>
              </HalfFieldWrapper>
              <HalfFieldWrapper>
                <FiledLabel>狀態</FiledLabel>
                <SelectInput
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option
                      key={option}
                      value={option}
                      selected={option === form.status}
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
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={5}
                cols={33}
              />
            </FieldWrapper>
            <Button
              buttonType="dark"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                isEdit ? handleUpdateItems() : handleUploadItems(form);
              }}
              disabled={
                Object.values(form).includes('') ||
                !images.some((image) => image !== '')
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
            <SlideCount>
              <NowIndex>{bulkForms.length}</NowIndex>
              <TotalIndex>/{BULK_LIMIT}</TotalIndex>
            </SlideCount>
          </BulkCountWrapper>

          <BulkContainer>
            {bulkForms.map((form, index) => (
              <BulkItemWrapper key={index}>
                <BulkImage imageUrl={form.images[0]} />
                <BulkInfoWrapper>
                  <BulkFieldWrapper>
                    <FiledLabel>名稱</FiledLabel>
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
                    <FiledLabel>分類</FiledLabel>
                    <BulkSelectInput
                      // onChange={(e) =>
                      //   setForm({ ...form, category: e.target.value })
                      // }
                      onChange={(e) => {
                        const newForm = [...bulkForms];
                        newForm[index].category = e.target.value;
                        setBulkForms(newForm);
                      }}
                    >
                      {CATEGORY_OPTIONS.map((option) => (
                        <option
                          key={option}
                          value={option}
                          selected={option === form.category}
                        >
                          {option}
                        </option>
                      ))}
                    </BulkSelectInput>
                  </BulkFieldWrapper>
                  <BulkFieldWrapper>
                    <FiledLabel>狀態</FiledLabel>
                    <BulkSelectInput
                      // onChange={(e) =>
                      //   setForm({ ...form, status: e.target.value })
                      // }
                      onChange={(e) => {
                        const newForm = [...bulkForms];
                        newForm[index].status = e.target.value;
                        setBulkForms(newForm);
                      }}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option
                          key={option}
                          value={option}
                          selected={option === form.status}
                        >
                          {option}
                        </option>
                      ))}
                    </BulkSelectInput>
                  </BulkFieldWrapper>
                  <FieldWrapper>
                    <FiledLabel>描述</FiledLabel>
                    <Description
                      value={form.description}
                      // onChange={(e) =>
                      //   setForm({ ...form, description: e.target.value })
                      // }
                      onChange={(e) => {
                        const newForm = [...bulkForms];
                        newForm[index].description = e.target.value;
                        setBulkForms(newForm);
                      }}
                    />
                  </FieldWrapper>
                </BulkInfoWrapper>
              </BulkItemWrapper>
            ))}
          </BulkContainer>
        </>
      )}
    </Container>
  );
}
