import { useContext, useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getProcessedItems } from '../../utils/firebase';
import styled, { css } from 'styled-components/macro';
import AuthContext from '../../context/authContext';
// import LocomotiveScroll from 'locomotive-scroll';

import '../../locomotive-scroll.css';

const NUM_OF_STYLES = 8;
// const SCROLL_SPEED = [2, 1, 4, 3, 2, 4, 2, 1];

const Background = styled.div`
  position: absolute;
  top: 175px;
  z-index: -1;
  width: 100vw;
  height: 65vh;
  background-color: #e6e6e6;
`;

const PageTitle = styled.h1`
  margin: 150px 0 0 125px;
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

// const TEST = [
//   'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2F5320a1b9-2e31-4ac4-902a-28e47afbc60d?alt=media&token=d262cf5e-a136-442d-bb2d-daab117debfb',
//   'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2Fe1e00cd8-e5e8-434b-bc6f-b4b5cf64253f?alt=media&token=fc931ccf-1d84-4036-8bc3-7d71931140a3',
//   'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2F2c74d3cb-aa29-4307-82de-e9fa0e01e17b?alt=media&token=fad7d914-4171-45d9-beb8-f178f525ccbc',
//   'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2F8ae4e116-8b68-4021-90b3-b1102600ec7e?alt=media&token=cb8ec601-21a8-4171-a79c-02e6718e5f99',
//   'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2F60f86035-6e31-443d-918f-fed0e3a17e6d?alt=media&token=43e83b9a-dc00-4942-b954-0ee36151bccf',
//   'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2Ff9a1b624-2c0f-4764-a7a9-a7daf9d71db4?alt=media&token=90c57c43-3d64-484e-8def-76b36a4d7688',
//   'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2Fbb323266-5351-43e1-8fe2-fffa1e844e14?alt=media&token=d143556b-54b7-4f84-87a6-5a660f312892',
//   'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2Fe730d2cc-6476-4d4a-b1c4-639350fd56e6?alt=media&token=6479ce8b-84c1-41f0-be0f-7e44e80c6778',
//   'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2F5320a1b9-2e31-4ac4-902a-28e47afbc60d?alt=media&token=d262cf5e-a136-442d-bb2d-daab117debfb',
//   'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2Fe1e00cd8-e5e8-434b-bc6f-b4b5cf64253f?alt=media&token=fc931ccf-1d84-4036-8bc3-7d71931140a3',
//   'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2F2c74d3cb-aa29-4307-82de-e9fa0e01e17b?alt=media&token=fad7d914-4171-45d9-beb8-f178f525ccbc',
//   'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2F8ae4e116-8b68-4021-90b3-b1102600ec7e?alt=media&token=cb8ec601-21a8-4171-a79c-02e6718e5f99',
//   'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2F60f86035-6e31-443d-918f-fed0e3a17e6d?alt=media&token=43e83b9a-dc00-4942-b954-0ee36151bccf',
//   'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2Ff9a1b624-2c0f-4764-a7a9-a7daf9d71db4?alt=media&token=90c57c43-3d64-484e-8def-76b36a4d7688',
//   'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2Fbb323266-5351-43e1-8fe2-fffa1e844e14?alt=media&token=d143556b-54b7-4f84-87a6-5a660f312892',
//   'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/kyZjoKtIpCe0c3ZrItSubP8mAle2%2Fimages%2Fe730d2cc-6476-4d4a-b1c4-639350fd56e6?alt=media&token=6479ce8b-84c1-41f0-be0f-7e44e80c6778',
// ];

function Achievement() {
  // const containerRef = useRef(null);
  const { uid } = useContext(AuthContext);
  const [items, setItems] = useState<Array<any> | null>(null);
  const navigate = useNavigate();

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

  // TEST.map((_, i) => {
  //   console.log(SCROLL_SPEED[i % NUM_OF_STYLES]);
  // });

  // useEffect(() => {
  //   if (!containerRef.current) return;
  //   // eslint-disable-next-line no-unused-vars
  //   const scroll = new LocomotiveScroll({
  //     el: containerRef.current,
  //     direction: 'horizontal',
  //     smooth: true,
  //     lerp: 0.05,
  //   });
  // }, [containerRef]);

  if (items) {
    return (
      <>
        <PageTitle>Achievement</PageTitle>
        <ScrollSection>
          {items &&
            items.map((item, index) => (
              <Image
                key={index}
                src={item.images[0]}
                index={index}
                onClick={() => navigate(`/inventory/${item.id}`)}
              />
            ))}
        </ScrollSection>
        {/* <div data-scroll-container ref={containerRef}>
          <ScrollSection data-scroll-section>
            {TEST.map((item, index) => (
              <Image
                key={index}
                src={item}
                index={index}
                data-scroll
                data-scroll-speed={SCROLL_SPEED[index % NUM_OF_STYLES]}
              />
            ))}
          </ScrollSection>
        </div> */}
        <Background />
      </>
    );
  }
  return null;
}

export default Achievement;
