import { useEffect, useState, useRef } from 'react';
import { getProcessedItems } from '../../utils/firebase';
import styled from 'styled-components';

import Gallery from './Gallery';
import Report from './Report';
import Level from './Level';

const Title = styled.h1`
  font-size: 4rem;
`;

function Achievement() {
  const [galleryMode, setGalleryMode] = useState<boolean>(true);
  const [items, setItems] = useState<Array<any> | null>(null);
  const [years, setYears] = useState<[] | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(() =>
    new Date().getFullYear()
  );
  const [filteredItems, setFilteredItems] = useState<[]>([]);

  useEffect(() => {
    async function fetchData() {
      const processedItems = await getProcessedItems();
      const sortedItems = processedItems.sort(
        (a, b) => a.processedDate.seconds - b.processedDate.seconds
      );
      setItems(sortedItems);

      const yearsList = Array.from(
        new Set(
          processedItems.map((item) =>
            new Date(item.processedDate.seconds * 1000).getFullYear()
          )
        )
      );
      setYears(yearsList);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!items) return;

    const selectedItems = items.filter(
      (item) =>
        new Date(item.processedDate.seconds * 1000).getFullYear() ===
        selectedYear
    );

    const itemsByMonth = [];
    for (let i = 0; i < 12; i++) {
      const filteredItemsByMonth = selectedItems.filter(
        (item) => new Date(item.processedDate.seconds * 1000).getMonth() === i
      ).length;
      itemsByMonth.push(filteredItemsByMonth);
    }
    // console.log(itemsByMonth);

    setFilteredItems(itemsByMonth);
  }, [items, selectedYear]);

  if (items && years) {
    return (
      <>
        <Title>Achievement</Title>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {years.map((year) => (
            <option key={year} value={year} selected={year === selectedYear}>
              {year}
            </option>
          ))}
        </select>
        <button onClick={() => setGalleryMode(true)}>Gallery</button>
        <button onClick={() => setGalleryMode(false)}>Report</button>
        {galleryMode ? (
          <Gallery items={items} />
        ) : (
          <Report filteredItems={filteredItems} />
        )}
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
