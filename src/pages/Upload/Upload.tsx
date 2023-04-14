import React, { useRef } from 'react';
import { useEffect, useState, useContext } from 'react';
import {
  storage,
  uploadItems,
  getItemById,
  updateItem,
} from '../../utils/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { AuthContext } from '../../context/authContext';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 40px 60px;
  gap: 60px;
  background-color: #f1f2ed;
`;

const ImageWrapper = styled.div`
  width: 40%;
`;

const MainImage = styled.div<{ coverUrl: string }>`
  width: 100%;
  object-fit: cover;
  object-position: center;
  aspect-ratio: 1/1;
  border: 1px solid #acaea9;
  background: ${({ coverUrl }) =>
    coverUrl === '' ? 'none' : `center / cover no-repeat url(${coverUrl})`};
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

const SelectImage = styled.div`
  width: 100px;
  height: 30px;
  background-color: #acaea9;
  border-radius: 5px;
  line-height: 30px;
  text-align: center;
`;

const Remind = styled.p`
  color: #acaea9;
`;

const SubImageContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  margin-top: 10px;
  overflow-x: scroll;
  gap: 10px;
  flex-wrap: nowrap;
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

const SubImageWrapper = styled.div`
  /* display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')}; */
  width: calc((100% - 20px) / 3);
  position: relative;
  flex-shrink: 0;
`;

const UploadBtn = styled.div<{ canAdd: string }>`
  position: absolute;
  top: calc(50% - 20px);
  right: calc(50% - 20px);
  display: ${({ canAdd }) => (canAdd ? 'block' : 'none')};
  width: 40px;
  height: 40px;
  border: 1px solid #acaea9;
  border-radius: 50%;
  font-size: 40px;
  text-align: center;
`;

const CancelBtn = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  font-size: 20px;
`;

const SubImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  object-fit: cover;
  object-position: center;
  aspect-ratio: 1/1;
  border: 1px solid #acaea9;
  background: ${({ imageUrl }) =>
    imageUrl === '' ? 'none' : `center / cover no-repeat url(${imageUrl})`};
`;

const InfoWrapper = styled.div`
  display: flex;
  width: 60%;
  flex-direction: column;
  justify-content: space-between;
  color: #acaea9;
`;

const formInputs = [
  { label: '物品名稱', key: 'name' },
  {
    label: '物品類別',
    key: 'category',
    option: [
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
    ],
  },
  {
    label: '物品狀態',
    key: 'status',
    option: ['請選擇狀態', '保留', '處理中', '已處理'],
  },
  // {
  //   label: '加入贈物',
  //   key: 'joinGiveaway',
  //   option: ['請選擇是否加入', 'YES', 'NO'],
  // },
  { label: '備註', key: 'description' },
];

type EditProp = {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit: boolean;
};

export default function Upload({ isEdit, setIsEdit }: EditProp) {
  const { uid } = useContext(AuthContext);
  const { id } = useParams();

  const [images, setImages] = useState(Array(10).fill(''));
  const [form, setForm] = useState({
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

  const containerRef = useRef(null);

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

  // useEffect(() => {
  //   if(!isEdit){

  //   }
  // },[isEdit]);

  function handleFileUpload(e, limit) {
    const files = e.target.files;
    if (files.length > limit) {
      alert(`最多只能上傳${limit}張圖片`);
      e.target.value = null;
      return false;
    }

    const storageRef = ref(storage, `/${uid}/images/`);
    const urlList: string[] | [] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageRef = ref(storageRef, `${file.name}`);
      const uploadTask = uploadBytesResumable(imageRef, file);

      uploadTask.on(
        'state_changed',
        null,
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            urlList.push(url);
            const imageList = [...images];
            const startIndex = imageList.findIndex((image) => image === '');
            imageList.splice(startIndex, urlList.length, ...urlList);
            setImages(imageList);
            setForm({ ...form, images: imageList });
          });
        }
      );
    }
    return null;
  }

  function handleDeleted(index) {
    const imageList = [...images];
    imageList.splice(index, 1);
    const list = [...imageList, ''];
    setImages(list);
    setForm({ ...form, images: list });
  }

  async function handleUploadItems() {
    await uploadItems(uid, form);
    setImages(Array(10).fill(''));
    setForm({
      name: '',
      category: '',
      status: '',
      description: '',
      images,
    });
  }

  async function handleUpdateItems() {
    await updateItem(uid, id, form);
    setIsEdit(false);
  }

  function handleDragOverImg(e, index) {
    e.preventDefault();
    if (draggingIndex !== null && draggingIndex !== index) {
      e.dataTransfer.dropEffect = 'copy';
    }
  }

  function handleDrop(e, index) {
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

  function handleDragOver(e) {
    e.preventDefault();
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const containerLeft = rect.x - rect.width;
    const containerRight = rect.x + rect.width;
    if (e.clientX > containerRight - 10) {
      container.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'end',
      });
    } else if (e.clientX < containerLeft - 10) {
      container.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
    // rest of the code
  }

  return (
    <Container>
      <ImageWrapper>
        <MainImage coverUrl={images[0]}>
          {images[0] === '' && (
            <RemindWrapper>
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
                style={{ display: 'none' }}
              />
              <label htmlFor="uploadImage">
                <SelectImage>選擇照片</SelectImage>
              </label>
              <Remind>最多只能上傳 10 張</Remind>
            </RemindWrapper>
          )}
        </MainImage>
        <SubImageContainer
          ref={containerRef}
          onDragOver={(e) => handleDragOver(e)}
        >
          {images.map((image, index) => (
            <SubImageWrapper
              key={index}
              onDragOver={(e) => handleDragOverImg(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              // isVisible={image !== '' || index === images.indexOf('') + 1}
            >
              <div
                draggable={images.some((image) => image !== '') ? true : false}
                onDragStart={(e) => {
                  e.target.style.opacity = '0.01';
                  setDraggingIndex(index);
                }}
                onDragEnd={(e) => {
                  e.target.style.opacity = '1';
                  setDraggingIndex(null);
                }}
              >
                <SubImage imageUrl={image}></SubImage>
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
                  style={{ display: 'none' }}
                />
                <label htmlFor="uploadImage">
                  <UploadBtn
                    canAdd={images.findIndex((item) => item === '') === index}
                  >
                    +
                  </UploadBtn>
                </label>
                {images[index] !== '' && (
                  <CancelBtn onClick={() => handleDeleted(index)}>X</CancelBtn>
                )}
              </div>
            </SubImageWrapper>
          ))}
        </SubImageContainer>
      </ImageWrapper>
      <InfoWrapper>
        <form>
          {formInputs.map((input) => {
            if (input.option) {
              return (
                <div>
                  <label key={input.key}>{input.label}</label>
                  <select
                    onChange={(e) =>
                      setForm({ ...form, [input.key]: e.target.value })
                    }
                  >
                    {input.option.map((option) => (
                      <option
                        value={option}
                        selected={option === form[input.key]}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              );
            } else if (input.key === 'description') {
              return (
                <div>
                  <label key={input.key}>{input.label}</label>
                  <textarea
                    value={form[input.key]}
                    onChange={(e) =>
                      setForm({ ...form, [input.key]: e.target.value })
                    }
                    // onKeyDown={(e) =>
                    //   e.key === 'Enter' &&
                    //   setForm({ ...form, [input.key]: form[input.key] + ' ' })
                    // }
                  />
                </div>
              );
            }
            return (
              <div>
                <label key={input.key}>{input.label}</label>
                <input
                  value={form[input.key]}
                  onChange={(e) =>
                    setForm({ ...form, [input.key]: e.target.value })
                  }
                />
              </div>
            );
          })}
          <div>
            <span>備註</span>
            <div
              style={{
                width: '100px',
                height: '100px',
                border: '1px solid black',
              }}
              contentEditable="true"
              onInput={(e) => {
                const description = e.target.innerText.replace('\n', '<br/>');
                setForm({
                  ...form,
                  description,
                });
              }}
            />
          </div>

          <input
            type="button"
            value={isEdit ? '更新物品' : '上傳物品'}
            disabled={
              Object.values(form).includes('') ||
              !images.some((image) => image !== '')
            }
            onClick={() => (isEdit ? handleUpdateItems() : handleUploadItems())}
          />
        </form>
      </InfoWrapper>
    </Container>
  );
}
