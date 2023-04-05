import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getProcessedItems } from '../../utils/firebase';

import Gallery from './Gallery';
import Report from './Report';

const Title = styled.h1`
  font-size: 4rem;
`;

function Achievement() {
  const [period, setPeriod] = useState({ start: '', end: '' });
  const [galleryMode, setGalleryMode] = useState(true);
  const [items, setItems] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const processedItems = await getProcessedItems();
      // console.log(processedItems);
      const sortedItems = processedItems.sort(
        (a, b) => a.processedDate.seconds - b.processedDate.seconds
      );
      // console.log(sortedItems);
      setItems(sortedItems);
    }
    fetchData();
  }, []);

  if (items) {
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
        {galleryMode ? <Gallery items={items} /> : <Report />}
      </>
    );
  }
}

export default Achievement;
