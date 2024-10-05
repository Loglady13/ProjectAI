import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import './index.css';
import App from './App';
import FaceRecognition from './FaceRecognition';
import ModelSelection from './ModelSelection';
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
  {
    path:"/",
    element:(
      <App/>
    ),
  },
  {
    path: "FaceRecognition",
    element:(
      <FaceRecognition/>
    ),
  },
  {
    path: "ModelSelection",
    element:(
      <ModelSelection/>
    )
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router}/>
);


