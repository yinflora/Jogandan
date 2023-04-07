import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 50vw;
  height: 40vh;
  margin: 30vh auto;
  padding: 20px;
`;

const ImageWrapper = styled.div`
  width: 40%;
  display: grid;
  /* grid-template-columns: ; */
`;

export default function Popout() {
  return (
    <Container>
      <p>Hihihihihihihihihih</p>
    </Container>
  );
}
