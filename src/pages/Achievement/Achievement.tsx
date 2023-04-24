import { useContext, useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import { getProcessedItems } from '../../utils/firebase';
import styled, { css } from 'styled-components';
import AuthContext from '../../context/authContext';

const NUM_OF_STYLES = 8;

const Background = styled.div`
  position: absolute;
  top: 175px;
  z-index: -1;
  width: 100vw;
  height: 65vh;
  background-color: #e6e6e6;
`;

const PageTitle = styled.h1`
  margin-left: 125px;
  font-size: 3rem;
  font-weight: 500;
  letter-spacing: 0.4rem;
  text-transform: uppercase;
  color: #000;
`;

const ScrollSection = styled.div`
  position: relative;
  display: flex;
  width: 100vw;
  height: 65vh;
  overflow-x: scroll;
`;

// const Image = styled.img`
//   flex-shrink: 0;
//   filter: grayscale(100%);
//   transition: all 0.2s ease-in-out;
//   object-fit: cover;
//   object-position: center;
//   opacity: 0.8;

//   &:hover {
//     filter: none;
//     opacity: 1;
//     cursor: pointer;
//   }

//   &:nth-of-type(1) {
//     z-index: 1;
//     width: 27vh;
//     height: 36vh;
//     margin-top: 5%;
//     margin-left: 30px;
//   }

//   &:nth-of-type(2) {
//     width: 39vh;
//     height: 52vh;
//     margin-top: 3%;
//     margin-left: -60px;
//   }

//   &:nth-of-type(3) {
//     z-index: 2;
//     width: 20vh;
//     height: 15vh;
//     margin-top: 7%;
//     margin-left: -120px;
//   }

//   &:nth-of-type(4) {
//     z-index: 1;
//     width: 27vh;
//     height: 36vh;
//     margin-top: 10%;
//     margin-left: -90px;
//   }

//   &:nth-of-type(5) {
//     z-index: 2;
//     width: 36vh;
//     height: 27vh;
//     margin-top: 8%;
//     margin-left: -30px;
//   }

//   &:nth-of-type(6) {
//     width: 39vh;
//     height: 52vh;
//     margin-top: 3%;
//     margin-left: -60px;
//   }

//   &:nth-of-type(7) {
//     z-index: 1;
//     width: 15vh;
//     height: 20vh;
//     margin-top: 12%;
//     margin-left: -60px;
//   }

//   &:nth-of-type(8) {
//     width: 36vh;
//     height: 27vh;
//     margin-top: 5%;
//     margin-left: -30px;
//   }
// `;

const Image = styled.img<{ index: number }>`
  flex-shrink: 0;
  filter: grayscale(100%);
  transition: all 0.2s ease-in-out;
  object-fit: cover;
  object-position: center;
  opacity: 0.8;

  &:hover {
    filter: none;
    opacity: 1;
    cursor: pointer;
  }

  ${({ index }) => {
    switch (index % NUM_OF_STYLES) {
      case 0:
        return css`
          z-index: 1;
          width: 27vh;
          height: 36vh;
          margin-top: 5%;
          margin-left: 30px;
        `;
      case 1:
        return css`
          width: 39vh;
          height: 52vh;
          margin-top: 3%;
          margin-left: -60px;
        `;
      case 2:
        return css`
          z-index: 2;
          width: 20vh;
          height: 15vh;
          margin-top: 7%;
          margin-left: -120px;
        `;
      case 3:
        return css`
          z-index: 1;
          width: 27vh;
          height: 36vh;
          margin-top: 10%;
          margin-left: -90px;
        `;
      case 4:
        return css`
          z-index: 2;
          width: 36vh;
          height: 27vh;
          margin-top: 8%;
          margin-left: -30px;
        `;
      case 5:
        return css`
          width: 39vh;
          height: 52vh;
          margin-top: 3%;
          margin-left: -60px;
        `;
      case 6:
        return css`
          z-index: 1;
          width: 15vh;
          height: 20vh;
          margin-top: 12%;
          margin-left: -60px;
        `;
      case 7:
        return css`
          width: 36vh;
          height: 27vh;
          margin-top: 5%;
          margin-left: -30px;
        `;
      default:
        return css``;
    }
  }}
`;

const TEST = [
  'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2FFZREFYiz7oHMzh0X8FHf?alt=media&token=e2d305d6-5f00-40bb-ae2a-5e112628cc13',
  'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2Fbailey-alexander-K6Lcwxkt9Vw-unsplash.jpeg?alt=media&token=7652e7ff-da85-43fa-916d-390d0bae70b0',
  'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2Fandrea-davis-kroxgnt9Uzw-unsplash.jpeg?alt=media&token=5aaf6781-019b-4867-8b24-b2f21fd3d8ae',
  'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2Fcd958b9b8b46d0f31e9779afac60585f.jpeg?alt=media&token=39cccf1e-6431-4450-93e9-e0b46b180538',
  'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2F8fc103d2fa521ea28693e5ca558e1bf4.jpeg?alt=media&token=d74570c4-ec0b-40a5-afb6-a79d3e58f06c',
  'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2Ftest?alt=media&token=658afb30-c335-4d4d-b77c-ad8aa460edd7',
  'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2Fkatja-rooke-77JACslA8G0-unsplash.jpeg?alt=media&token=595522d4-4216-4cc3-b84f-db12290a140d',
  'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2Fsarah-brown-oa7pqZmmhuA-unsplash.jpeg?alt=media&token=7c76d3ae-f95c-4c84-bfcf-25f7d9faa3cd',
  'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2FIMG_0150.JPG?alt=media&token=7d317374-d566-4685-9d53-e428fe1e182c',
  'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2Fsamantha-gades-BlIhVfXbi9s-unsplash.jpeg?alt=media&token=f717bb9e-b34b-42d4-b48e-75beeba0037a',
  'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2Fval-stoker-ggeI8TyPeZM-unsplash.jpeg?alt=media&token=7b4f441c-09da-4918-98d7-0e9d5a89df45',
  'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2Ff7fcbefcae9380411b301fea29e4079e.jpeg?alt=media&token=0deeb8c8-bc76-445c-9a52-f9c10ed971f8',
  'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2Fe34cc7b93c0a82e785c76e272fa228a4.jpeg?alt=media&token=1edcd8fa-6f8e-4ac7-8c7a-8c1231b5158e',
  'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2Fca6fe7475dd59d9830db67dc9d71b56a.jpeg?alt=media&token=f24e49c9-d925-4784-b498-261e2c8fcd09',
];

function Achievement() {
  const { uid } = useContext(AuthContext);
  const [items, setItems] = useState<Array<any> | null>(null);

  useEffect(() => {
    if (!uid) return;
    async function fetchData() {
      const processedItems = await getProcessedItems(uid);
      const sortedItems = processedItems.sort(
        (a, b) => a.processedDate.seconds - b.processedDate.seconds
      );
      setItems(sortedItems);
    }
    fetchData();
  }, [uid]);

  if (items) {
    return (
      <>
        <PageTitle>Achievement</PageTitle>
        {/* {items &&
          items.map((item) =>
            item.images.map(
              (image: string, index: number) =>
                image !== '' && (
                  <Link to={`/inventory/${item.id}`}>
                    <Image key={index} src={image} />
                  </Link>
                )
            )
          )} */}
        <ScrollSection>
          {TEST.map((item, index) => (
            <Image src={item} index={index} />
          ))}
        </ScrollSection>

        <Background />
      </>
    );
  }
  return null;
}

export default Achievement;
