import { useState } from 'react';
import { storage } from '../../utils/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// import styled from 'styled-component';

export default function Upload() {
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
      <input type="file" accept="image/*" onChange={(e) => handlefile(e)} />
      <button onClick={handleUpload}>Upload to Firebase</button>
    </div>
  );
}
