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

const ImageToolBar = styled.div`
  width: 30%;
  background-color: #343434;
  overflow-y: scroll;
`;

const ImageWrapper = styled.div`
  display: flex;
  height: 100%;
  max-height: 500px;
  flex-wrap: wrap;
  overflow-y: scroll;
  gap: 10px;
`;

const Image = styled.img`
  height: 100px;
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

const ImageBlock = styled.div<ComposeProp>`
  background: ${({ url }) => `center / cover no-repeat url(${url})`};
`;

const TopLeftBlock = styled(ImageBlock)`
  grid-area: topLeft;
  /* background-color: red; */
  /* background: ${({ url }) => `center / cover no-repeat url(${url})`}; */
`;

const TopRightBlock = styled(ImageBlock)`
  grid-area: topRight;
  /* background-color: green; */
`;

const MiddleLeftBlock = styled(ImageBlock)`
  grid-area: middleLeft;
  /* background-color: orange; */
`;

const MiddleRightLargeBlock = styled(ImageBlock)`
  grid-area: middleRightL;
  /* background-color: blue; */
`;

const MiddleRightMediumBlock = styled.div`
  grid-area: middleRightM;
  background-color: purple;
`;

const BottomLeftBlock = styled(ImageBlock)`
  grid-area: bottomLeft;
  /* background-color: yellow; */
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

type ComposeProp = {
  url: string;
};

export default function Compose() {
  const { uid } = useContext(AuthContext);

  const [images, setImages] = useState<string[] | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [data, setData] = useState([
    { position: 'topLeft', url: '' },
    { position: 'topRight', url: '' },
    { position: 'middleLeft', url: '' },
    { position: 'middleRightL', url: '' },
    { position: 'middleRightM', url: '' },
    { position: 'bottomLeft', url: '' },
    { position: 'bottomRight', url: '' },
  ]);

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
          getDownloadURL(uploadTask.snapshot.ref).then(() => {
            setIsUploaded(!isUploaded);
          });
        }
      );
    }
    return null;
  }

  // function handleDrop(e, id) {
  //   e.preventDefault();
  //   const fileUrl = e.dataTransfer.getData('text');
  //   const fileName = record[fileUrl];
  //   const img = new Image();
  //   img.src = fileUrl;
  //   const canvas = document.getElementById(id) as HTMLCanvasElement;
  //   const ctx = canvas.getContext('2d');
  //   img.onload = function () {
  //     ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
  //   };
  // }

  // function handleDrop(e: React.DragEvent<HTMLDivElement>, position: string) {
  //   e.preventDefault();

  //   if (draggingIndex !== null) {
  //     console.log(`Dropped image at ${position}, index=${draggingIndex}`);

  //     // TODO: 在 VisionBoard 上显示被拖动的图像

  //     setDraggingIndex(null);
  //   }
  // }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, position: string) {
    e.preventDefault();

    if (draggingIndex !== null) {
      const imageUrl = images && images[draggingIndex];
      const newData = [...data];
      newData.find((item) => item.position === position)!.url = imageUrl!;
      setData(newData);
      setDraggingIndex(null);
      console.log(
        `Dropped image at ${position}, index=${draggingIndex}, url=${imageUrl}`
      );
    }
  }

  // return <Canvas />;
  return (
    <Container>
      <ImageToolBar>
        <ImageUpload
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e)}
          multiple
        />
        <ImageWrapper>
          {images &&
            images.map((item, index) => (
              <Image
                key={index}
                src={item}
                draggable
                onDragStart={() => {
                  console.log(index);
                  setDraggingIndex(index);
                }}
                onDragEnd={() => setDraggingIndex(null)}
              />
            ))}
        </ImageWrapper>
      </ImageToolBar>
      <BackgroundColor>
        <VisionBoard>
          <TopLeftBlock
            url={data[0].url}
            onDrop={(e) => handleDrop(e, 'topLeft')}
            onDragOver={(e) => e.preventDefault()}
          />
          <TopRightBlock
            url={data[1].url}
            onDrop={(e) => handleDrop(e, 'topRight')}
            onDragOver={(e) => e.preventDefault()}
          />
          <MiddleLeftBlock
            url={data[2].url}
            onDrop={(e) => handleDrop(e, 'middleLeft')}
            onDragOver={(e) => e.preventDefault()}
          />
          <MiddleRightLargeBlock
            url={data[3].url}
            onDrop={(e) => handleDrop(e, 'middleRightL')}
            onDragOver={(e) => e.preventDefault()}
          />
          <MiddleRightMediumBlock></MiddleRightMediumBlock>
          <BottomLeftBlock
            url={data[5].url}
            onDrop={(e) => handleDrop(e, 'bottomLeft')}
            onDragOver={(e) => e.preventDefault()}
          />
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
