import React, { useEffect, useRef } from 'react';
import locomotiveScroll from 'locomotive-scroll';

// import './locomotive-scroll.css';

export default function Achievement() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scroll = new locomotiveScroll({
      el: document.querySelector('.container'),
      smooth: true,
    });
  }, []);

  return (
    <div id="container" data-scroll-container>
      <div data-scroll-section>
        <h1 data-scroll>Hey</h1>
        <p data-scroll>👋</p>
      </div>
      <div data-scroll-section>
        <h2 data-scroll data-scroll-speed="1">
          What's up?
        </h2>
        <p data-scroll data-scroll-speed="2">
          😬
        </p>
      </div>
    </div>
  );
}
