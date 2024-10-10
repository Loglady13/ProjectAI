import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const FaceRecognition = () => {
  const [result, setResult] = useState(null);
  const Navigate = useNavigate();
  const handleRecognize = async () => {
    try {
      const response = await fetch("http://localhost:5000/recognize", {
        method: "POST",
      });
      const data = await response.json();
      setResult(data.message + (data.name ? `: ${data.name}` : ""));
      Navigate("/ModelSelection");
    } catch (error) {
      console.error("Error:", error);
      setResult("Error recognizing the face");
    }
  };

  return (
    <div className="container-fluid gradient-backgroundFaceRecognition text-center full-height">
      <button
        className="btn-gradienteFaceRecognition"
        style={{
          border: "none",
          color: "#fff", // Color del texto
          fontSize: "16px",
          fontWeight: "bold",
          padding: "15px 30px", // Ajusta el padding según sea necesario
          borderRadius: "30px", // Para hacer el botón redondo
          cursor: "pointer",
          position: "relative",
          overflow: "hidden", // Para que el gradiente no sobresalga del botón
          zIndex: 1,
          textAlign: "center",
        }}
        onClick={handleRecognize}
      >
        Start Face Recognition
      </button>
      {result && <p>{result}</p>}
    </div>
  );
};

export default FaceRecognition;
