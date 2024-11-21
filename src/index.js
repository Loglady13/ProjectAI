import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import FaceRecognition from "./FaceRecognition";
import ModelSelection from "./ModelSelection";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import Options from "./Options";
import GundAndKnifeRec from "./GunsAndKnifeRec";
import { ButtonRecognitionText } from "./ButtonRecognitionText";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "FaceRecognition",
    element: <FaceRecognition />,
  },
  {
    path: "ModelSelection",
    element: <ModelSelection />,
  },
  {
    path: "Options",
    element: <Options/>
  },
  {
    path: "GunsAndKnifeRec",
    element: <GundAndKnifeRec/>
  },
  {
    path: "ButtonRecognitionText",
    element: <ButtonRecognitionText/>
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
