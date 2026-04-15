import React, { useState } from 'react';
import QRCode from 'qrcode.react'; // Alternative library

const QRGenerator = () => {
  const [qrValue, setQrValue] = useState(
    'http://localhost:5173/workshop/register?workshop=robotics'
  );

  const downloadQR = () => {
    const canvas = document.getElementById('qr-canvas');
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'workshop-qr.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold mb-4">Workshop QR Code</h2>
      
      {/* QR Code Display */}
      <QRCode
        id="qr-canvas"
        value={qrValue}
        size={300}
        level="H"
        includeMargin={true}
        className="mx-auto mb-4"
      />
      
      {/* Download Button */}
      <button
        onClick={downloadQR}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Download QR Code
      </button>
      
      {/* URL Display */}
      <p className="mt-4 text-sm text-gray-600 break-all">
        {qrValue}
      </p>
    </div>
  );
};

export default QRGenerator;