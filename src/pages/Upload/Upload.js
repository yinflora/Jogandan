import { useState } from 'react';
import { storage, uploadItems } from '../../utils/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 90%;
  height: 100%;
  padding: 40px 60px;
  gap: 60px;
  background-color: #f1f2ed;
`;

const ImageWrapper = styled.div`
  width: 40%;
`;

const MainImage = styled.div`
  width: 100%;
  /* margin: 5px; */
  object-fit: cover;
  object-position: center;
  aspect-ratio: 1/1;
  border: 1px solid #acaea9;
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

const UploadBtn = styled.div`
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

const SubImage = styled.div`
  /* width: calc((100% - 20px) / 3); */
  width: 100%;
  object-fit: cover;
  object-position: center;
  aspect-ratio: 1/1;
  /* flex-shrink: 0; */
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

export default function Upload() {
  const [images, setImages] = useState(Array(10).fill(''));
  const [form, setForm] = useState({
    name: '',
    category: '',
    status: '',
    // joinGiveaway: '',
    // created: '',
    description: '',
    images,
    // isGifted: '',
    // processedDate: '',
  });

  console.log(images);

  function handleFileUpload(e, limit) {
    const files = e.target.files;
    if (files.length > limit) {
      alert(`最多只能上傳${limit}張圖片`);
      e.target.value = null;
      return false;
    }

    const storageRef = ref(storage, '/q1khIAOnt2ewvY4SQw1z65roVPD2/images/');
    const urlList = [];

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
          });
        }
      );
    }
  }

  function handleDeleted(index) {
    const imageList = [...images];
    imageList.splice(index, 1);
    const list = [...imageList, ''];
    setImages(list);
  }

  return (
    <Container>
      <ImageWrapper>
        <MainImage />
        <SubImageContainer>
          {images.map((image, index) => (
            <SubImageWrapper key={index}>
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
              <CancelBtn onClick={() => handleDeleted(index)}>X</CancelBtn>
            </SubImageWrapper>
          ))}
        </SubImageContainer>
      </ImageWrapper>
      <InfoWrapper></InfoWrapper>
    </Container>
    // <div>
    //   <input
    //     type="file"
    //     accept="image/*"
    //     onChange={(e) => handleFileUpload(e)}
    //     multiple
    //   />
    //   {/* <button onClick={handleUpload}>Upload to Firebase</button> */}
    //   {form.images.map((image) => (
    //     <img src={image} />
    //   ))}
    //   <form>
    //     {/* {formInputs.map((input) => (
    //       <div>
    //         <label key={input.key}>{input.label}</label>
    //         <input
    //           value={form[input.key]}
    //           onChange={(e) =>
    //             setForm({ ...form, [input.key]: e.target.value })
    //           }
    //         />
    //       </div>
    //     ))} */}
    //     {formInputs.map((input) => {
    //       if (input.option) {
    //         return (
    //           <div>
    //             <label key={input.key}>{input.label}</label>
    //             <select
    //               onChange={(e) =>
    //                 setForm({ ...form, [input.key]: e.target.value })
    //               }
    //             >
    //               {input.option.map((option) => (
    //                 <option value={option}>{option}</option>
    //               ))}
    //             </select>
    //           </div>
    //         );
    //       } else if (input.key === 'description') {
    //         return (
    //           <div>
    //             <label key={input.key}>{input.label}</label>
    //             <textarea
    //               value={form[input.key]}
    //               onChange={(e) =>
    //                 setForm({ ...form, [input.key]: e.target.value })
    //               }
    //             />
    //           </div>
    //         );
    //       }
    //       return (
    //         <div>
    //           <label key={input.key}>{input.label}</label>
    //           <input
    //             value={form[input.key]}
    //             onChange={(e) =>
    //               setForm({ ...form, [input.key]: e.target.value })
    //             }
    //           />
    //         </div>
    //       );
    //     })}
    //     <input
    //       type="button"
    //       value="上傳物品"
    //       disabled={Object.values(form).includes('')}
    //       onClick={() => uploadItems(null, form)}
    //     />
    //   </form>
    // </div>
  );
}
