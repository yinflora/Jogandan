import styled from 'styled-components';

// import Gallery from './Gallery';
import Report from './Report';

const Title = styled.h1`
  font-size: 4rem;
`;

function Achievement() {
  return (
    <>
      <Title>Achievement</Title>
      <button>Gallery</button>
      <button>Report</button>
      {/* <Gallery /> */}
      <Report />
    </>
  );
}

export default Achievement;
