import { useEffect, useState } from 'react';
import {
  storage,
  uploadItems,
  getItemById,
  updateItem,
} from '../../utils/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
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
  display: flex;
  width: 100%;
  margin-top: 10px;
  overflow-x: scroll;
  gap: 10px;
  flex-wrap: nowrap;
`;

const SubImageWrapper = styled.div`
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
  isEdit: boolean;
};

export default function Upload({ isEdit }: EditProp) {
  const { id } = useParams();

  console.log(typeof id, id);

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
  // const [pastIndex, ]

  // console.log(form);
  // console.log(images);

  useEffect(() => {
    async function getItem() {
      const item = await getItemById(id);
      const { images, name, category, status, description } = item[0];
      // console.log(item.images);
      setImages(images);
      setForm({
        name,
        category,
        status,
        description,
        images,
      });
    }
    if (isEdit && id) {
      getItem();
    }
  }, []);

  function handleFileUpload(e, limit) {
    const files = e.target.files;
    if (files.length > limit) {
      alert(`最多只能上傳${limit}張圖片`);
      e.target.value = null;
      return false;
    }

    const storageRef = ref(storage, '/q1khIAOnt2ewvY4SQw1z65roVPD2/images/');
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
        <SubImageContainer>
          {images.map((image, index) => (
            <SubImageWrapper
              key={index}
              onDragEnter={(e) => console.log('onDragEnter')}
              onDragLeave={(e) => console.log('onDragLeave')}
              onDragOver={(e) => {
                e.preventDefault();
                e.clientX && console.log('onDragOver');
              }}
              onDrop={(e) => console.log('onDrop')}
            >
              <div
                draggable={images.some((image) => image !== '') ? true : false}
                onDragStart={(e) => {
                  console.log('onDragStart');
                  e.target.style.opacity = '0.01';
                }}
                onDragEnd={(e) => (e.target.style.opacity = '1')}
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
          <input
            type="button"
            value={isEdit ? '更新物品' : '上傳物品'}
            disabled={
              Object.values(form).includes('') ||
              !images.some((image) => image !== '')
            }
            onClick={() =>
              isEdit ? updateItem(id, form) : uploadItems(null, form)
            }
          />
        </form>
      </InfoWrapper>
    </Container>
  );
}
