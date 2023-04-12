import { useEffect, useState } from 'react';
import { getProcessedItems } from '../../utils/firebase';
import styled from 'styled-components';

import Gallery from './Gallery';
import Report from './Report';
import Level from './Level';

const Title = styled.h1`
  font-size: 4rem;
`;

function Achievement() {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [galleryMode, setGalleryMode] = useState<boolean>(true);
  const [items, setItems] = useState<Array<any> | null>(null);

  useEffect(() => {
    async function fetchData() {
      const processedItems = await getProcessedItems();
      const sortedItems = processedItems.sort(
        (a, b) => a.processedDate.seconds - b.processedDate.seconds
      );
      setItems(sortedItems);
    }
    fetchData();
  }, []);

  if (items) {
    return (
      <>
        <Title>Achievement</Title>
        <select
          value={selectedYear || ''}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">year</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
        <button onClick={() => setGalleryMode(true)}>Gallery</button>
        <button onClick={() => setGalleryMode(false)}>Report</button>
        {galleryMode ? <Gallery items={items} /> : <Report />}
        <Level
          percent={
            items.filter((item) => item.status === '已處理').length / 100
          }
        />
      </>
    );
  }
}

export default Achievement;
