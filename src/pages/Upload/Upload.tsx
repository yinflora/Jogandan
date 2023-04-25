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
  // uploadString,
} from 'firebase/storage';
import { AuthContext } from '../../context/authContext';
import { useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import photo from './photo.png';
import image from './image.png';
import info from './info.png';
import infoBlack from './info-black.png';
// import Chevron from '../../components/Icon/Chevron';
import Button from '../../components/Button/Button';
import Cross from '../../components/Icon/Cross';

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
  padding: 80px 0;
  gap: 60px;
`;

const ImageWrapper = styled.div``;

// const ChangeSlideBtn = styled.button`
//   display: flex;
//   width: 88px;
//   height: 40px;
//   justify-content: center;
//   align-items: center;
// `;

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
`;

const InfoIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const PromptRemind = styled.span<{ color: string }>`
  /* font-size: 0.75rem; */
  letter-spacing: 0.1em;
  color: ${({ color }) => color};
`;

const BulkCountWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
  justify-content: end;
  align-items: center;
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
  /* margin-bottom: 30px; */
  color: #fff;
`;

const SubImageContainer = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow-y: scroll;
`;

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
  /* padding: 40px 0; */
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
  width: calc(100% - 45px);
  height: 30px;
  font-size: 1rem;
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
  margin: 40px 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px dashed #fff;
  background-color: rgb(255, 255, 255, 0.2);
  gap: 10px;
`;

// const RemindBlack = styled(Remind)`
//   color: rgba(0, 0, 0, 0.6);
// `;

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
  const SINGLE_LIMIT = 8;
  const BULK_LIMIT = 16;

  const { uid } = useContext(AuthContext);
  const { id } = useParams();

  const [singleForm, setSingleForm] = useState<Form>({
    name: '',
    category: '',
    status: '',
    description: '',
    images: Array(SINGLE_LIMIT).fill(''),
  });

  // const [images, setImages] = useState(Array(8).fill(''));
  // const [form, setForm] = useState<Form>({
  //   name: '',
  //   category: '',
  //   status: '',
  //   description: '',
  //   images,
  // });

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
      // setImages(images);
      // setForm({
      //   name,
      //   category,
      //   status,
      //   description,
      //   images,
      // });

      console.log('before fill', images);

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
        });
      } else {
        //!Added
        setSingleForm({
          name,
          category,
          status,
          description,
          images,
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

  //!Fixme: 不能直接上傳
  function takePhoto() {
    const canvas: any = document.createElement('canvas');

    if (!videoRef.current || !canvas) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas
      .getContext('2d')
      .drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // const url = canvas.toDataURL('image/png', 1);
    // const url = canvas.toBlob(null, 'image/png', 1);

    // const newSingleForm = { ...singleForm };

    // const startIndex = newSingleForm.images.findIndex((image) => image === '');
    // newSingleForm.images.splice(startIndex, 1, url);

    // setSingleForm(newSingleForm);
    // stopCamera();

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

  //!Fixme: 不能直接上傳
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

    // const storageRef = ref(storage, `/${uid}/images/`);
    // const urlList: any = isBulkMode ? [...bulkForms] : []; //!Fixme
    // const updateList = [...singleForm.images];

    const newBulkForms = [...bulkForms];
    const newSingleForm = { ...singleForm };

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // const imageRef = ref(storageRef, `${file.name}`);

      // const snapshot = await uploadBytes(imageRef, file);
      // const url = await getDownloadURL(snapshot.ref);

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

  function handleDeleted(index: number) {
    //!Added
    // const imageList = [...images];
    // imageList.splice(index, 1);
    // const list = [...imageList, ''];
    // setImages(list);
    // setForm({ ...form, images: list });

    const newImages = [...singleForm.images];
    newImages.splice(index, 1);
    setSingleForm({ ...singleForm, images: [...newImages, ''] });
  }

  async function handleUploadItems(form: Form[] | Form) {
    //!Modified
    // const itemId = await uploadItems(uid, form);
    // if (itemId) alert('成功加入！');

    const storageRef = ref(storage, `/${uid}/images/`);
    const imageRef = ref(storageRef, `${new Date()}`);

    // uploadString(imageRef, dataUrl, 'data_url').then((snapshot) => {
    //   getDownloadURL(snapshot.ref).then((url) => {
    //     const emptyIndex = singleForm.images.indexOf('');
    //     singleForm.images[emptyIndex] = url;

    //     const imageList = [...singleForm.images];
    //     imageList[emptyIndex] = url;
    //     // setImages(imageList);
    //     setSingleForm({ ...singleForm, images: imageList });
    //   });
    // });

    // await uploadItems(uid, form);

    if (isBulkMode) {
      const newForms: any = [...form];

      form.forEach(async (item: any, index: number) => {
        const snapshot = await uploadBytes(imageRef, item.images[0]);
        const url = await getDownloadURL(snapshot.ref);

        // const snapShot = await uploadString(
        //   imageRef,
        //   item.images[0],
        //   'data_url'
        // );
        // const url = await getDownloadURL(snapShot.ref);

        newForms[index].images = [url];
      });

      await uploadItems(uid, newForms);

      setBulkForms([]);
    } else {
      // setImages(Array(8).fill(''));
      // setForm({
      //   name: '',
      //   category: '',
      //   status: '',
      //   description: '',
      //   images,
      // });

      // const newImages = [];
      const newForm: any = { ...form }; //!fixme

      newForm.images.forEach(async (image: any, index: number) => {
        if (image === '') {
          newForm.images[index] = '';
        } else {
          const snapshot = await uploadBytes(imageRef, image);
          const url = await getDownloadURL(snapshot.ref);

          newForm.images[index] = url;
        }
      });

      const itemId = await uploadItems(uid, newForm);

      itemId &&
        setSingleForm({
          name: '',
          category: '',
          status: '',
          description: '',
          images: Array(8).fill(''),
        });
    }
  }

  async function handleUpdateItems() {
    //!Modified
    await updateItem(uid, id, singleForm);
    setIsEdit(false);
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
    //!Modified
    e.preventDefault();
    if (draggingIndex !== null && draggingIndex !== index) {
      // const newImages = [...images];
      const newImages = [...singleForm.images];
      [newImages[draggingIndex], newImages[index]] = [
        newImages[index],
        newImages[draggingIndex],
      ];
      // setImages(newImages);
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
            <BulkRemindWrapper>
              <Remind>選擇照片進行批量上傳</Remind>
              {/* <RemindBlack> 最多只能選擇 {BULK_LIMIT} 張</RemindBlack> */}
              <PromptWrapper>
                <InfoIcon src={infoBlack} />
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
            {/* <ChangeSlideBtn>
              <Chevron rotateDeg={0} />
            </ChangeSlideBtn> */}
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
                          X
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
                      <Remind>最多上傳 {SINGLE_LIMIT} 張</Remind>
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
              {/* <ChangeSlideBtn>
                <Chevron rotateDeg={180} />
              </ChangeSlideBtn> */}
              {singleForm.images.findIndex((image) => image === '') > 1 && (
                <PromptWrapper>
                  <InfoIcon src={info} />
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
              }}
              disabled={
                // Object.values(singleForm).includes('') ||
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
                        <option
                          key={option}
                          value={option}
                          // selected={option === bulkForms[index].category}
                        >
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
                        <option
                          key={option}
                          value={option}
                          // selected={option === bulkForms[index].status}
                        >
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
