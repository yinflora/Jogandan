import { useState } from 'react';
import { storage, uploadItems } from '../../utils/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import styled from 'styled-component';

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
  {
    label: '加入贈物',
    key: 'joinGiveaway',
    option: ['請選擇是否加入', 'YES', 'NO'],
  },
  { label: '備註', key: 'description' },
];

export default function Upload() {
  const [form, setForm] = useState({
    name: '',
    category: '',
    status: '',
    joinGiveaway: '',
    // created: '',
    description: '',
    images: [],
    // isGifted: '',
    // processedDate: '',
  });
  const [urls, setUrls] = useState([]);
  // const [file, setFile] = useState('');

  // // console.log(form);

  // function handlefile(e) {
  //   setFile(e.target.files);
  // }

  // console.log(file);

  // function handleUpload() {
  //   // if (!file) {
  //   //   alert('Please choose a file first!');
  //   // }
  //   const storageRef = ref(storage, `/files/${file.name}`);
  //   const uploadTask = uploadBytesResumable(storageRef, file);

  //   uploadTask.on(
  //     'state_changed',
  //     // (snapshot) => {
  //     //   const percent = Math.round(
  //     //     (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //     //   ); // update progress
  //     //   setPercent(percent);
  //     // },
  //     null,
  //     (err) => console.log(err),
  //     () => {
  //       // download url
  //       getDownloadURL(uploadTask.snapshot.ref).then((url) => {
  //         console.log(url);
  //       });
  //     }
  //   );
  // }

  function handleFileUpload(e) {
    const files = e.target.files;
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
            // setUrls((prevUrls) => [...prevUrls, url]);
            // setForm({ ...form, images: [...form.images, url] });
            urlList.push(url);
            urlList.length === files.length &&
              setForm({ ...form, images: urlList });
          });
        }
      );
    }
  }
  console.log(form);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleFileUpload(e)}
        multiple
      />
      {/* <button onClick={handleUpload}>Upload to Firebase</button> */}
      {urls.map((image) => (
        <img src={image} />
      ))}
      <form>
        {/* {formInputs.map((input) => (
          <div>
            <label key={input.key}>{input.label}</label>
            <input
              value={form[input.key]}
              onChange={(e) =>
                setForm({ ...form, [input.key]: e.target.value })
              }
            />
          </div>
        ))} */}
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
                    <option value={option}>{option}</option>
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
          value="上傳物品"
          disabled={Object.values(form).includes('')}
          onClick={() => uploadItems(null, form)}
        />
      </form>
    </div>
  );
}
