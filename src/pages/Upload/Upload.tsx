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
  padding: 0 250px 60px;
  color: #fff;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 500;
  letter-spacing: 0.4rem;
  text-transform: uppercase;
`;

const ModeToggler = styled.button`
  font-size: 1.25rem;
  border-bottom: 1px solid #fff;
  color: #fff;

  &:hover {
    cursor: pointer;
  }
`;

const UploadContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 40px 0;
  gap: 60px;
  /* background-color: #000; */
`;

// const ImageWrapper = styled.div`
//   display: grid;
//   width: 60%;
//   grid-template-columns: repeat(5, 1fr);
//   grid-template-rows: repeat(5, 1fr);
//   grid-template-areas:
//   'previous . . . .'
//   'first '
// ;
// `;

const ImageWrapper = styled.div`
  /* width: 60%; */
`;

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

// const PreviousBtn = styled.button`

// `;

// const NextBtn = styled.button`

// `;

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

const MainImage = styled.div<{ coverUrl: string }>`
  /* width: 100%; */
  /* height: 100%; */
  object-fit: cover;
  object-position: center;
  aspect-ratio: 1/1;
  border: 1px dashed #fff;
  background-color: rgb(255, 255, 255, 0.2);
  /* background: ${({ coverUrl }) =>
    coverUrl === '' ? 'none' : `center / cover no-repeat url(${coverUrl})`}; */
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

// const SelectImage = styled.div`
//   width: 100px;
//   height: 30px;
//   background-color: #acaea9;
//   border-radius: 5px;
//   line-height: 30px;
//   text-align: center;
// `;

const Remind = styled.p`
  margin-bottom: 30px;
  color: #fff;
`;

const SubImageContainer = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  /* margin-top: 10px;
  overflow-x: scroll; */
  /* gap: 10px; */
  /* flex-wrap: nowrap; */
  flex-direction: column;
  overflow-y: scroll;
  /* justify-content: center; */
  /* align-items: stretch; */
`;

// const NextPage = styled.div`
//   position: absolute;
//   top: 0;
//   right: 0;
//   z-index: 1;
//   width: 30px;
//   height: 100%;
//   background-color: #000;
// `;

// const SubImageWrapper = styled.div<{ isShow: boolean }>`
/* display: ${({ isShow }) => (isShow ? 'block' : 'none')}; */

const SubImageWrapper = styled.div`
  position: relative;
  /* width: calc((100% - 20px) / 4);
  flex-shrink: 0; */
  margin: 5px;
  height: calc((100% - 40px) / 4);
  aspect-ratio: 1/1;
  flex-shrink: 0 0 25%;
`;

// const UploadBtn = styled.div<{ canAdd: boolean }>`
//   position: absolute;
//   top: calc(50% - 20px);
//   right: calc(50% - 20px);
//   display: ${({ canAdd }) => (canAdd ? 'block' : 'none')};
//   width: 40px;
//   height: 40px;
//   border: 1px solid #acaea9;
//   border-radius: 50%;
//   font-size: 40px;
//   text-align: center;
// `;

const CancelBtn = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  font-size: 20px;
`;

// const SubImageBlock = styled.div<{ isShow: boolean }>`
//   display: ${({ isShow }) => (isShow ? 'block' : 'none')};
// `;

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
  /* flex: 0 1 calc(50% - 250px); */
  /* flex-direction: column;
  justify-content: space-between; */
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
  /* gap: 10px; */
  border-bottom: 1px solid #fff;
`;

const HalfFieldWrapper = styled(FieldWrapper)`
  width: 50%;
`;

const FiledLabel = styled.label`
  letter-spacing: 0.1rem;
  /* line-height: 30px; */
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

// const BulkContainer = styled.div`
//   display: grid;
//   width: 100%;
//   height: 100%;
//   grid-template-columns: repeat(2, 1fr);
//   grid-template-rows: repeat(10, 250px);
//   /* padding: 20px; */
//   gap: 30px;
//   background-color: #f7f7f7;
// `;

const BulkContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  /* padding: 20px; */
  justify-content: space-between;
  gap: 20px;
  /* background-color: #000; */
`;

const BulkItemWrapper = styled(ItemWrapper)`
  width: calc(50% - 10px);
  /* max-width: 50%; */
  max-width: calc(50% - 10px);
  height: 250px;
  padding: 25px;
  flex: 1;
  gap: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
`;

// const ItemWrapper = styled.div`
//   display: flex;
//   width: 100%;
//   height: 30vh;
//   border: 1px solid black;
// `;

const BulkImage = styled(SubImage)`
  /* width: auto;
  padding-top: 30%; */

  /* object-fit: cover;
  object-position: center;
  aspect-ratio: 1/1;
  border: 1px solid #acaea9; */

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

// const TakePhoto = styled.button`
//   position: absolute;
//   bottom: 10px;
//   right: 10px;
// `;

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

const STATUS_OPTIONS = ['請選擇狀態', '保留', '處理中', '已處理'];

// const formInputs = [
//   { label: '物品名稱', key: 'name' },
//   {
//     label: '物品類別',
//     key: 'category',
//     option: [
//       '請選擇類別',
//       '居家生活',
//       '服飾配件',
//       '美妝保養',
//       '3C產品',
//       '影音產品',
//       '書報雜誌',
//       '體育器材',
//       '寵物用品',
//       '食物及飲料',
//       '興趣及遊戲',
//       '紀念意義',
//       '其他',
//     ],
//   },
//   {
//     label: '物品狀態',
//     key: 'status',
//     option: ['請選擇狀態', '保留', '處理中', '已處理'],
//   },
//   { label: '備註', key: 'description' },
// ];

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
    // joinGiveaway: '',
    // created: '',
    // isGifted: '',
    // processedDate: '',
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
      // e.target.value = null;
      // return false;
      files = null;
    }

    if (!files) return;

    const storageRef = ref(storage, `/${uid}/images/`);
    const urlList: any = []; //!Fixme

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageRef = ref(storageRef, `${file.name}`);

      const snapshot = await uploadBytes(imageRef, file);
      const url = await getDownloadURL(snapshot.ref);

      if (isBulkMode) {
        console.log('批量上傳');
        urlList.push({ images: [url] });
      } else {
        console.log('單品上傳');
        urlList.push(url);
        const imageList = [...images];
        const startIndex = imageList.findIndex((image) => image === '');
        imageList.splice(startIndex, urlList.length, ...urlList);
        setImages(imageList);
        setForm({ ...form, images: imageList });
      }
    }
    setBulkForms(urlList);
  }

  function handleDeleted(index: number) {
    const imageList = [...images];
    imageList.splice(index, 1);
    const list = [...imageList, ''];
    setImages(list);
    setForm({ ...form, images: list });
  }

  async function handleUploadItems(form: Form) {
    await uploadItems(uid, form);
    if (isBulkMode) {
      setBulkForms([]);
    } else {
      setImages(Array(10).fill(''));
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
    await updateItem(uid, id, form);
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
      <TitleWrapper>
        <PageTitle>UPLOAD</PageTitle>
        <ModeToggler onClick={() => setIsBulkMode(!isBulkMode)}>
          {isBulkMode ? '單品上傳' : '批量上傳'}
        </ModeToggler>
      </TitleWrapper>

      {isBulkMode ? (
        <BulkImageWrapper>
          <ImageIcon src={image} />
          <Remind>選擇照片進行批量上傳</Remind>
          <RemindBlack> 最多只能選擇 16 張</RemindBlack>
          <input
            id="uploadImage"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, 10 - bulkForms.length)}
            multiple
            // capture
            style={{ display: 'none' }}
          />
          {/* <label htmlFor="uploadImage">
        <SelectImage>
          選擇照片進行批量上傳
          <br />
          最多只能選擇 16 張
        </SelectImage>
      </label> */}
          <label htmlFor="uploadImage">
            <Button buttonType="dark" onClick={handleSelectImage}>
              選擇照片
            </Button>
          </label>
        </BulkImageWrapper>
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
                    // isVisible={image !== '' || index === images.indexOf('') + 1}
                    // isShow={
                    //   images[index] !== '' ||
                    //   (images.every((image) => image === '') && index < 4) ||
                    //   (images.some((image) => image !== '') &&
                    //     images.indexOf('') === index)
                    // }
                  >
                    <div
                      // draggable={images.some((image) => image !== '') ? true : false}
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
                      {/* <input
                      id="uploadImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload(
                          e,
                          images.filter((item) => item === '').length
                        )
                      }
                      multiple
                      // capture
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="uploadImage">
                      <UploadBtn
                        canAdd={
                          images.findIndex((item) => item === '') === index
                        }
                      >
                        +
                      </UploadBtn>
                    </label> */}
                      {images[index] !== '' && (
                        <CancelBtn onClick={() => handleDeleted(index)}>
                          X
                        </CancelBtn>
                      )}
                    </div>
                  </SubImageWrapper>
                ))}
              </SubImageContainer>
              {showCamera ? (
                <VideoWrapper>
                  <Video ref={videoRef} autoPlay />
                  {/* <TakePhoto onClick={takePhoto}>Take Photo</TakePhoto> */}
                  <PhotoIcon src={photo} onClick={takePhoto} />
                </VideoWrapper>
              ) : (
                <MainImageWrapper>
                  <MainImage coverUrl={images[0]}>
                    {images[0] === '' && (
                      <RemindWrapper>
                        <ImageIcon src={image} />
                        <Remind>最多上傳 8 張</Remind>
                        {!showCamera && (
                          <Button
                            buttonType="normal"
                            onClick={() => setShowCamera(true)}
                          >
                            拍照上傳
                          </Button>
                        )}

                        <input
                          id="uploadImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              images.filter((item) => item === '').length
                            )
                          }
                          multiple
                          capture
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="uploadImage">
                          <Button
                            buttonType="normal"
                            onClick={handleSelectImage}
                          >
                            選擇照片
                          </Button>
                        </label>
                      </RemindWrapper>
                    )}
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

            {/* <input
            type="button"
            value={isEdit ? '更新物品' : '上傳物品'}
            disabled={
              Object.values(form).includes('') ||
              !images.some((image) => image !== '')
            }
            onClick={() =>
              isEdit ? handleUpdateItems() : handleUploadItems(form)
            }
          /> */}
            <Button
              buttonType="dark"
              onClick={() =>
                isEdit ? handleUpdateItems() : handleUploadItems(form)
              }
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
      <input
        id="uploadImage"
        type="file"
        accept="image/*"
        onChange={(e) => handleFileUpload(e, 10 - bulkForms.length)}
        multiple
        // capture
        style={{ display: 'none' }}
      />
      {/* <label htmlFor="uploadImage">
        <SelectImage>
          選擇照片進行批量上傳
          <br />
          最多只能選擇 16 張
        </SelectImage>
      </label> */}
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
      <SlideCount>
        <NowIndex>1</NowIndex>
        <TotalIndex>/8</TotalIndex>
      </SlideCount>
      {/* <Container> */}
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
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </BulkFieldWrapper>
              <BulkFieldWrapper>
                <FiledLabel>分類</FiledLabel>
                <BulkSelectInput
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
                </BulkSelectInput>
              </BulkFieldWrapper>
              <BulkFieldWrapper>
                <FiledLabel>狀態</FiledLabel>
                <BulkSelectInput
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
                </BulkSelectInput>
              </BulkFieldWrapper>
              <FieldWrapper>
                <FiledLabel>描述</FiledLabel>
                <Description
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </FieldWrapper>
            </BulkInfoWrapper>
          </BulkItemWrapper>
        ))}
      </BulkContainer>
      {/* </Container> */}
    </Container>
  );
}
