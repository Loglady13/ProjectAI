import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Options() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
    // Recuperar el dato del localStorage y convertirlo de vuelta a un objeto
  const storedData = localStorage.getItem('person');

   

  function handleModelSelectionClick() {
    navigate('/ModelSelection');
  }

  function handleGunsAndKnifeClick() {
    navigate('/GunsAndKnifeRec');
  }

  return (
    <div className="container-fluid gradient-backgroundFaceRecognition d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h2>Bienvenido {storedData}</h2> {/* Mostrar la propiedad 'prediccion' directamente */}
        <h2>Select an option</h2>
        <div className="d-flex justify-content-center mt-3">
          <button onClick={handleModelSelectionClick} className="btn btn-primary m-2">
            Models Predictions
          </button>
          <button onClick={handleGunsAndKnifeClick} className="btn btn-primary m-2">
            Guns and Knifes prediction
          </button>
        </div>
      </div>
    </div>
  );
}
