import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const FaceRecognition = () => {
  const [result, setResult] = useState(null);
  const Navigate = useNavigate();
  const handleRecognize = async () => {
    try {
      const response = await fetch('http://localhost:5000/recognize', {
        method: 'POST',
      });
      const data = await response.json();
      setResult(data.message + (data.name ? `: ${data.name}` : ''));
      Navigate('/ModelSelection');
    } catch (error) {
      console.error("Error:", error);
      setResult("Error recognizing the face");
    }
  };


  return (
    <div>
      <button onClick={handleRecognize}>Start Face Recognition</button>
      {result && <p>{result}</p>}
    </div>
  );
};

export default FaceRecognition;
