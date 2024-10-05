import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ModelSelection from './ModelSelection'; // Componente de selección de modelo
import FaceRecognition from './FaceRecognition';

function App() {
  return (
    <div>
      <FaceRecognition/>
    </div>
      
    
  );
}

export default App;
