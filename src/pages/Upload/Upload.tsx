import { useState } from 'react';
import { storage } from '../../utils/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// import styled from 'styled-component';

const formInputs = [
  { label: '物品名稱', key: 'name' },
  {
    label: '物品類別',
    key: 'category',
    option: [
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
  { label: '物品狀態', key: 'status', option: ['保留', '處理中', '已處理'] },
  { label: '加入贈物', key: 'joinGiveaway', option: ['YES', 'NO'] },
];

export default function Upload() {
  const [form, setForm] = useState({
    name: '',
    category: '',
    status: '',
    joinGiveaway: '',
    // created: '',
    // description: '',
    // images: [],
    // isGifted: '',
    // processedDate: '',
  });
  const [file, setFile] = useState('');
  // const [input, setInput] = useState({});

  function handlefile(e) {
    setFile(e.target.files[0]);
  }

  function handleUpload() {
    if (!file) {
      alert('Please choose a file first!');
    }
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      // (snapshot) => {
      //   const percent = Math.round(
      //     (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      //   ); // update progress
      //   setPercent(percent);
      // },
      null,
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
        });
      }
    );
  }

  console.log(file);
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handlefile(e)}
        multiple
      />
      <button onClick={handleUpload}>Upload to Firebase</button>
      <form>
        {formInputs.map((input) => (
          <div>
            <label key={input.key}>{input.label}</label>
            <input
              value={form[input.key]}
              onChange={(e) =>
                setForm({ ...form, [input.key]: e.target.value })
              }
            />
          </div>
        ))}
        {/* <input
          type="button"
          value="Send Message"
          disabled={Object.values(form).includes('')}
          onClick={handleSendMessage}
        /> */}
      </form>
    </div>
  );
}
