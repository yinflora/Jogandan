import { useState } from 'react';
import styled from 'styled-components';

import Gallery from './Gallery';
import Report from './Report';

const Title = styled.h1`
  font-size: 4rem;
`;

function Achievement() {
  const [period, setPeriod] = useState({ start: '', end: '' });
  const [galleryMode, setGalleryMode] = useState(true);

  return (
    <>
      <Title>Achievement</Title>
      <input
        type="date"
        id="start"
        value={period.start}
        onChange={(e) => setPeriod({ ...period, start: e.target.value })}
      />
      <input
        type="date"
        id="end"
        value={period.end}
        onChange={(e) => setPeriod({ ...period, end: e.target.value })}
      />
      <button onClick={() => setGalleryMode(true)}>Gallery</button>
      <button onClick={() => setGalleryMode(false)}>Report</button>
      {galleryMode ? <Gallery /> : <Report />}
    </>
  );
}

export default Achievement;
