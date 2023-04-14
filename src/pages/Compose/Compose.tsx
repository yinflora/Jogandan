// import Canvas from '../../components/Canvas/Canvas';
import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import AuthContext from '../../context/authContext';
import { storage } from '../../utils/firebase';
import {
  ref,
  listAll,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

const Container = styled.div`
  display: flex;
  height: 100%;
`;

const BackgroundColor = styled.div`
  display: flex;
  width: 70%;
  aspect-ratio: 5/4;
  justify-content: center;
  align-items: center;
  background-color: #fbfbf9;
`;

const ImageUpload = styled.input``;

const ImagesBlock = styled.div`
  width: 30%;
  /* height: 100vh; */
  background-color: #343434;
`;

const ImageWrapper = styled.div`
  /* width: 100%;
  height: 100%; */
  display: flex;
  flex-wrap: wrap;
  /* overflow-y: scroll; */
`;

const Image = styled.img`
  width: 100px;
  /* height: auto; */
`;

const VisionBoard = styled.div`
  display: grid;
  width: 60%;
  aspect-ratio: 1/1;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(14, 1fr);
  grid-gap: 10px;
  grid-template-areas:
    'topLeft topLeft topLeft topRight topRight topRight .'
    'topLeft topLeft topLeft topRight topRight topRight .'
    'topLeft topLeft topLeft middleRightL middleRightL middleRightL middleRightL'
    'topLeft topLeft topLeft middleRightL middleRightL middleRightL middleRightL'
    'middleLeft middleLeft middleLeft middleRightL middleRightL middleRightL middleRightL'
    'middleLeft middleLeft middleLeft middleRightL middleRightL middleRightL middleRightL'
    'middleLeft middleLeft middleLeft middleRightL middleRightL middleRightL middleRightL'
    'middleLeft middleLeft middleLeft middleRightL middleRightL middleRightL middleRightL'
    'middleLeft middleLeft middleLeft middleRightM middleRightM middleRightM middleRightM'
    'middleLeft middleLeft middleLeft middleRightM middleRightM middleRightM middleRightM'
    '. bottomLeft bottomLeft middleRightM middleRightM middleRightM middleRightM'
    '. bottomLeft bottomLeft middleRightM middleRightM middleRightM middleRightM'
    '. bottomLeft bottomLeft bottomRight bottomRight bottomRight bottomRight'
    '. bottomLeft bottomLeft bottomRight bottomRight bottomRight bottomRight';
  background-color: #000;
`;

const TopLeftBlock = styled.div`
  grid-area: topLeft;
  background-color: red;
`;

const MiddleLeftBlock = styled.div`
  grid-area: middleLeft;
  background-color: orange;
`;

const BottomLeftBlock = styled.div`
  grid-area: bottomLeft;
  background-color: yellow;
`;

const TopRightBlock = styled.div`
  grid-area: topRight;
  background-color: green;
`;

const MiddleRightLargeBlock = styled.div`
  grid-area: middleRightL;
  background-color: blue;
`;

const MiddleRightMediumBlock = styled.div`
  grid-area: middleRightM;
  background-color: purple;
`;

const BottomRightBlock = styled.div`
  grid-area: bottomRight;
  display: flex;
  gap: 10px;
  background-color: black;
`;

const ColorBlock = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
`;

export default function Compose() {
  const { uid } = useContext(AuthContext);

  const [isUploaded, setIsUploaded] = useState(false);
  const [images, setImages] = useState<string[] | null>(null);
  const storageRef = ref(storage, `/${uid}/images/`);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await listAll(storageRef);
        const urls = await Promise.all(
          res.items.map((itemRef) => getDownloadURL(itemRef))
        );
        setImages(urls);
      } catch (error) {
        console.log(error);
      }
    };

    fetchImages();
  }, [uid, isUploaded]);

  function handleFileUpload(e) {
    const files = e.target.files;

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
            console.log(url);
            setIsUploaded(!isUploaded);
          });
        }
      );
    }
    return null;
  }

  // return <Canvas />;
  return (
    <Container>
      <ImagesBlock>
        <ImageUpload
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e)}
          multiple
        />
        <button></button>
        <ImageWrapper>
          {images &&
            images.map((item, index) => <Image key={index} src={item} />)}
        </ImageWrapper>
      </ImagesBlock>
      <BackgroundColor>
        <VisionBoard>
          <TopLeftBlock></TopLeftBlock>
          <TopRightBlock></TopRightBlock>
          <MiddleLeftBlock></MiddleLeftBlock>
          <MiddleRightLargeBlock></MiddleRightLargeBlock>
          <MiddleRightMediumBlock></MiddleRightMediumBlock>
          <BottomLeftBlock></BottomLeftBlock>
          <BottomRightBlock>
            <ColorBlock></ColorBlock>
            <ColorBlock></ColorBlock>
            <ColorBlock></ColorBlock>
            <ColorBlock></ColorBlock>
          </BottomRightBlock>
        </VisionBoard>
      </BackgroundColor>
    </Container>
  );
}
