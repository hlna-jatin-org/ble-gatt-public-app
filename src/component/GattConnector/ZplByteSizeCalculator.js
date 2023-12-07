import React, { useState, useEffect } from 'react';

const ZplByteSizeCalculator = ({ zplCode }) => {
  const [zplByteSize, setZplByteSize] = useState(0);

  useEffect(() => {
    const calculateByteSize = (str) => {
      const encoder = new TextEncoder('utf-8');
      const data = encoder.encode(str);
      return data.byteLength;
    };

    setZplByteSize(calculateByteSize(zplCode));
  }, [zplCode]);

  return (
      <div>
        {/* <p>ZPL Code:</p> */}
        {/* <pre>{zplCode}</pre> */}
        <p>Byte Size: {zplByteSize} bytes</p>
      </div>
  );
};

export default ZplByteSizeCalculator;
