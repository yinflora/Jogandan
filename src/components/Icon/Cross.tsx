type CrossProps = {
  size?: number;
  lineWidth?: number;
  color?: string;
};

export default function Cross({ size, lineWidth, color }: CrossProps) {
  return (
    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   // xmlns:xlink="http://www.w3.org/1999/xlink"
    //   width={size ? size : '60'}
    //   zoomAndPan="magnify"
    //   viewBox="0 0 96 96"
    //   preserveAspectRatio="xMidYMid meet"
    //   version="1.0"
    // >
    //   <path
    //     stroke-linecap="butt"
    //     transform="matrix(0.72101, -0.213969, 0.213374, 0.719007, 15.624019, 57.215668)"
    //     fill="none"
    //     stroke-linejoin="miter"
    //     d="M 0.0000572523 0.498692 L 89.766625 0.498978 "
    //     stroke={color ? color : '#ffffff'}
    //     stroke-width="1"
    //     stroke-opacity="1"
    //     stroke-miterlimit="4"
    //   />
    //   <path
    //     stroke-linecap="butt"
    //     transform="matrix(0.71698, 0.214198, -0.214687, 0.718616, 15.838077, 38.065331)"
    //     fill="none"
    //     stroke-linejoin="miter"
    //     d="M 0.0000976744 0.50156 L 89.214311 0.501405 "
    //     stroke={color ? color : '#ffffff'}
    //     stroke-width="1"
    //     stroke-opacity="1"
    //     stroke-miterlimit="4"
    //   />
    // </svg>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ? size : '60'}
      zoomAndPan="magnify"
      viewBox="0 0 96 96"
      preserveAspectRatio="xMidYMid meet"
      version="1.0"
    >
      <path
        stroke-linecap="butt"
        transform="matrix(0.715842, -0.212435, 0.213374, 0.719007, 9.613281, 58.999345)"
        fill="none"
        stroke-linejoin="miter"
        d="M -0.00176399 0.50021 L 106.478419 0.498845 "
        stroke={color ? color : '#fff'}
        stroke-width={lineWidth ? lineWidth : '1'}
        stroke-opacity="1"
        stroke-miterlimit="4"
      />
      <path
        stroke-linecap="butt"
        transform="matrix(0.719784, 0.215035, -0.214687, 0.718616, 10.082135, 36.280745)"
        fill="none"
        stroke-linejoin="miter"
        d="M 0.00247662 0.500055 L 105.82912 0.501929 "
        stroke={color ? color : '#fff'}
        stroke-width={lineWidth ? lineWidth : '1'}
        stroke-opacity="1"
        stroke-miterlimit="4"
      />
    </svg>
  );
}
