import React, { useState, useEffect } from "react";
import "./App.css";

const ModelSelection = () => {
  const [selectedModel, setSelectedModel] = useState(null);

  const [formDataWine, setFormDataWine] = useState({
    volatileAcidity: "", density: "", alcohol: "",
  });

  const [formDataAvocado, setFormDataAvocado] = useState({
    total_volume: "", year: "", month: "", day: "", region: "",
  });

  const [formDataCars, setFormDataCars] = useState({
    year: "", presentPrice: "", kms_driven: "", fuel_type: "", seller_type: "", transmission: "", owner: "",
  });

  const [formDataHepatitis, setFormDataHepatitis] = useState({
    alb: "", alp: "", alt: "", ast: "", bil: "", che: "", chol: "", crea: "", ggt: "", prot: "",
  });

  const [formDataBitcoin, setFormDataBitcoin] = useState({
    date: "",
  });

  const [formDataCasa, setFormDataCasa] = useState({
    structuretaxvaluedollarcnt: "", calculatedfinishedsquarefeet: "", lotsizesquarefeet: "",
    bathroomcnt: "", bedroomcnt: "", yearbuilt: "",
  });

  const [formDataRossman, setFormDataRossman] = useState({
    Store: "", DayOfWeek: "", Promo: "", SchoolHoliday: "", Year: "", Month: "", Day: "", Customers: "",
  });

  const [formLondonCrimes, setFormLondonCrimes] = useState({
    date: "",
  });

  const [formStroke, setFormStroke] = useState({
    gender: 0, age: 0, hypertension: 0, heart_disease: 0, ever_married: 0, work_type: "", Residence_type: "", avg_glucose_level: 0.0,
    bmi: 0.0, smoking_status: "",
  });

  const [formDataStock, setFormDataStock] = useState({
    date: "",
  });

  const [prediction, setPrediction] = useState(null); // Estado para la predicción
  const [speech, setSpeech] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [recordBtnText, setRecordBtnText] = useState("Pulsa para hablar");

  const models = [
    { id: 1, name: "Modelo clasificador de la calidad del vino" },
    { id: 2, name: "Modelo predictor del precio del aguacate" },
    { id: 3, name: "Modelo predictor del precio de autos" },
    { id: 4, name: "Modelo predictor de Hepatitis C" },
    { id: 5, name: "Modelo predictor del precio del Bitcoin" },
    { id: 6, name: "Modelo predictor del precio de una casa" },
    { id: 7, name: "Modelo Predictor de las ventas de la compañia Rossman" },
    { id: 8, name: "Modelo predictor de la cantidad de crímenes por día en Londres" },
    { id: 9, name: "Modelo clasificador de accidente cerebro-vascular" },
    { id: 10, name: "Modelo predictor de las acciones del mercado SP 500" },
  ];

  const phrases = [
    "¿Cuál será el precio del aguacate?",
    "Quiero saber la tasa crímenes de Londres",
    "Predice el precio del Bitcoin",
    "¿Me ayudas con la calidad del vino?",
    "Quisier saber si voy a tener un ACV...",
    "¿Tendré Hepatitis C?",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false); // Ocultar la frase actual

      setTimeout(() => {
        setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length); // Cambiar a la siguiente frase
        setVisible(true); // Mostrar la nueva frase
      }, 1700); // Esperar un segundo antes de cambiar la frase
    }, 7000); // Cambiar frase cada 4 segundos

    return () => clearInterval(interval);
  }, []);

  const handleModelSelection = (model) => {
    setSelectedModel(model);
    setPrediction(""); // Limpiar la predicción cuando se selecciona un nuevo modelo
  };

  const handleInputChangeWine = (e) => {
    setFormDataWine({
      ...formDataWine,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputChangeAvocado = (e) => {
    setFormDataAvocado({
      ...formDataAvocado,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputChangeCars = (e) => {
    setFormDataCars({
      ...formDataCars,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputChangeHepatitis = (e) => {
    setFormDataHepatitis({
      ...formDataHepatitis,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputChangeBitcoin = (e) => {
    setFormDataBitcoin({
      ...formDataBitcoin,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputChangeCasa = (e) => {
    setFormDataCasa({
      ...formDataCasa,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputChangeRossman = (e) => {
    setFormDataRossman({
      ...formDataRossman,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputChangeCrime = (e) => {
    setFormLondonCrimes({
      ...formLondonCrimes,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputChangeStocks = (e) => {
    setFormDataStock({
      ...formDataStock,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputChangeStroke = (e) => {
    setFormStroke({
      ...formStroke,
      [e.target.name]: e.target.value,
    });
  };

  const fetchAvocadoPrediction = async (total_volume, year, month, day, region) => {
    try {
      const response = await fetch(
        `http://localhost:5000/aguacate_prediction?Total_Volume=${total_volume}&year=${year}&Month=${month}&Day=${day}&region=${region}`,
        {
          params: {
            total_volume: total_volume, year: year, month: month, day: day, region: region,
          },
        }
      );
      const data = await response.json();
      console.log("Prediction:", data);
      setPrediction(data.prediction); // Actualiza la predicción en el estado
    } catch (error) {
      console.error("Error fetching Avocado prediction:", error);
      setPrediction("Error en la predicción"); // Manejo de errores
    }
  };

  const fetchWinePrediction = async (volatile_acidity, density, alcohol) => {
    try {
      const response = await fetch(
        `http://localhost:5000/wine_prediction?volatile_acidity=${volatile_acidity}&density=${density}&alcohol=${alcohol}`
      );
      if (!response.ok) {
        throw new Error(
          `Error fetching Wine prediction: ${response.statusText}`
        );
      }
      const data = await response.json();
      console.log("Prediction:", data);
      setPrediction(data.prediction); // Actualiza el estado de la predicción
    } catch (error) {
      console.error("Error fetching Wine prediction:", error);
      setPrediction("Error en la predicción"); // Manejo de errores
    }
  };

  const fetchCarsPrediction = async (year, presentPrice, kms_driven, fuel_type, seller_type, transmission, owner) => {
    try {
      const response = await fetch(
        `http://localhost:5000/cars_prediction?year=${year}&presentPrice=${presentPrice}&kms_driven=${kms_driven}&fuel_type=${fuel_type}&seller_type=${seller_type}&transmission=${transmission}&owner=${owner}`
      );
      const data = await response.json();
      console.log("Prediction:", data);
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error fetching Cars prediction:", error);
      setPrediction("Error en la predicción"); // Manejo de errores
    }
  };

  const fetchHepatitisPrediction = async (alb, alp, alt, ast, bil, che, chol, crea, ggt, prot) => {
    try {
      const response = await fetch(
        `http://localhost:5000/hepatitis_prediction?alb=${alb}&alp=${alp}&alt=${alt}&ast=${ast}&bil=${bil}&che=${che}&chol=${chol}&crea=${crea}&ggt=${ggt}&prot=${prot}`
      );
      const data = await response.json();
      console.log("Prediction:", data);
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error fetching Hepatitis prediction:", error);
      setPrediction("Error en la predicción"); // Manejo de errores
    }
  };

  const fetchBitcoinPrediction = async (date) => {
    try {
      const formattedDate = new Date(date).toISOString().split("T")[0]; // Convierte a 'YYYY-MM-DD'
      const response = await fetch(
        `http://localhost:5000/bitcoin_prediction?date=${formattedDate}`
      );
      const data = await response.json();
      console.log("Prediction:", data);
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error fetching Bitcoin prediction:", error);
      setPrediction("Error en la predicción"); // Manejo de errores
    }
  };

  const fetchPrecioCasaPrediction = async (structuretaxvaluedollarcnt, calculatedfinishedsquarefeet, lotsizesquarefeet, bathroomcnt, bedroomcnt, yearbuilt) => {
    try {
      const response = await fetch(
        `http://localhost:5000/casa_prediction?structuretaxvaluedollarcnt=${structuretaxvaluedollarcnt}&calculatedfinishedsquarefeet=${calculatedfinishedsquarefeet}&lotsizesquarefeet=${lotsizesquarefeet}&bathroomcnt=${bathroomcnt}&bedroomcnt=${bedroomcnt}&yearbuilt=${yearbuilt}`
      );
      const data = await response.json();
      console.log("Prediction:", data);
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error fetching Precio Casa prediction:", error);
      setPrediction("Error en la predicción"); // Manejo de errores
    }
  };

  const fetchVentasRossmanPrediction = async (Store, DayOfWeek, Promo, SchoolHoliday, Year, Month, Day, Customers) => {
    try {
      const response = await fetch(
        `http://localhost:5000/rossman_prediction?Store=${Store}&DayOfWeek=${DayOfWeek}&Promo=${Promo}&SchoolHoliday=${SchoolHoliday}&Year=${Year}&Month=${Month}&Day=${Day}&Customers=${Customers}`
      );
      const data = await response.json();
      console.log("Prediction:", data);
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error fetching Precio Casa prediction:", error);
      setPrediction("Error en la predicción"); // Manejo de errores
    }
  };

  const fetchLondonCrimesPrediction = async (date) => {
    try {
      const response = await fetch(
        `http://localhost:5000/crimes_prediction?date=${date}`
      );
      const data = await response.json();
      console.log("Prediction:", data);
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error fetching London Crimes prediction:", error);
      setPrediction("Error en la predicción"); // Manejo de errores
    }
  };

  const fetchStrokeClasifier = async (gender, age, hypertension, heart_disease, ever_married, work_type, Residence_type, avg_glucose_level, bmi, smoking_status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/stroke_prediction?gender=${gender}&age=${age}&hypertension=${hypertension}&heart_disease=${heart_disease}&ever_married=${ever_married}&work_type=${work_type}&Residence_type=${Residence_type}&avg_glucose_level=${avg_glucose_level}&bmi=${bmi}&smoking_status=${smoking_status}`
      );
      const data = await response.json();
      console.log("Prediction:", data);
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error fetching London Crimes prediction:", error);
      setPrediction("Error en la predicción"); // Manejo de errores
    }
  };

  const fetchStockValuePrediction = async (date) => {
    try {
      const response = await fetch(
        `http://localhost:5000/stockValue_prediction?date=${date}`
      );
      const data = await response.json();
      console.log("Prediction:", data);
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Error fetching London Crimes prediction:", error);
      setPrediction("Error en la predicción"); // Manejo de errores
    }
  };

  function findRespectiveModel(keyword) {
    for (let i = 0; i < models.length; i++) {
      if (models[i].name.toLowerCase().includes(keyword)) {
        return models[i];
      }
    }
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "es-ES"; // Configurar el idioma
  recognition.continuous = false; // Continuar reconociendo tras pausas
  recognition.interimResults = false; // Mostrar solo resultados finales

  function processRecording(transcript) {
    setSpeech(transcript);
    var possibleModel;
    if (transcript.includes("aguacate")) {
      possibleModel = findRespectiveModel("aguacate");
    } else if (transcript.includes("vino")) {
      possibleModel = findRespectiveModel("vino");
    } else if (transcript.includes("autos")) {
      possibleModel = findRespectiveModel("autos");
    } else if (
      transcript.includes("hepatitis") ||
      transcript.includes("hepatitis C") ||
      transcript.includes("hepatitis c")
    ) {
      possibleModel = findRespectiveModel("hepatitis");
    } else if (transcript.includes("bitcoin")) {
      possibleModel = findRespectiveModel("bitcoin");
    } else if (transcript.includes("casa")) {
      possibleModel = findRespectiveModel("casa");
    } else if (
      transcript.includes("compañia") ||
      transcript.includes("compañía") ||
      transcript.includes("roseman") ||
      transcript.includes("Roseman") ||
      transcript.includes("rosman") ||
      transcript.includes("Rosman") ||
      transcript.includes("Rossman")
    ) {
      possibleModel = findRespectiveModel("compañia");
    } else if (
      transcript.includes("crimenes") ||
      transcript.includes("crímenes") ||
      transcript.includes("Londres") ||
      transcript.includes("London")
    ) {
      possibleModel = findRespectiveModel("crímenes");
    } else if (
      transcript.includes("accidente") ||
      transcript.includes("cerebro") ||
      transcript.includes("vascular") ||
      transcript.includes("cerebro vascular") ||
      transcript.includes("cerebrovascular")
    ) {
      possibleModel = findRespectiveModel("accidente");
    } else if (
      transcript.includes("acción") ||
      transcript.includes("accion") ||
      transcript.includes("acciones") ||
      transcript.includes("mercado") ||
      transcript.includes("s y p") ||
      transcript.includes("S y P")
    ) {
      possibleModel = findRespectiveModel("mercado");
    } else {
      setSpeech("Lo siento, no te pude entender... Inténtalo de nuevo. :)");
      possibleModel = null;
    }
    handleModelSelection(possibleModel);
  }

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    console.log(transcript);
    processRecording(transcript);
  };

  recognition.onaudiostart = () => {
    console.log("Some sound is being received");
    setRecordBtnText("Escuchando...");
  };

  recognition.onerror = function (event) {
    console.error("Error de reconocimiento de voz: ", event.error);
    setSpeech("Error de reconocimiento de voz");
  };

  recognition.onspeechend = function () {
    recognition.stop(); // Detener cuando el usuario deja de hablar
    setRecordBtnText("Presiona para hablar");
  };

  function startRecognition() {
    recognition.start();
    console.log("Iniciando reconocimiento de voz...");
  }
  /*
  function stopRecognition() {
    recognition.stop();
    console.log("Reconocimiento de voz detenido.");
  }
  */
  const startRecordingHandler = () => {
    setSpeech("");
    setSelectedModel(null);
    setPrediction(null);
    startRecognition();
  };

  return (
    <div className="container-fluid gradient-background text-center full-height">
      <h1 style={{ color: 'white', margin: '20px' }}>¿Que modelo de IA quieres usar?</h1>

      {/* Solo mostrar la lista de modelos si no hay un formulario seleccionado */}
      {!selectedModel && (
        <div className="d-flex flex-wrap" style={{ padding: "25px", marginLeft: '210px', marginRight: '210px' }} >
          {models.map((model) => (
            <div className="p-2 w-50" key={model.id}>
              <div className=" text-white rounded p-2 card-hover" style={{ minWidth: "150px", textAlign: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" /* Fondo negro con 70% de opacidad */}} >
                <h5>{model.name}</h5>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="row gy-5">
        <button
          className="btn btn-gradiente"
          onClick={startRecordingHandler}
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
        >
          {recordBtnText}
        </button>
      </div>

      <div className="row gy-5">
        <label className={`fade-in-out ${visible ? "show" : ""}`} style={{ color: "white" }}>
          {phrases[currentPhraseIndex]}
        </label>
      </div>

      {speech !== "" && (
        <p style={{ color: 'white', margin: '20px' }}>
          Texto reconocido: <span style={{ color: "white" }}>{speech}</span>
        </p>
      )}

      {/* Mostrar el formulario si el modelo "vino" está seleccionado */}
      {selectedModel?.name === "Modelo clasificador de la calidad del vino" && (
        <form
          className="form-bootstrap"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form data:", formDataWine);
            fetchWinePrediction(
              formDataWine.volatileAcidity,
              formDataWine.density,
              formDataWine.alcohol
            );
          }}
        >
          <h3 style={{ marginBottom: '20px' }}>Modelo de Predicción de Vino</h3> <hr></hr>

          <div className="mb-2 text-start">
            <label className="m-2">Volatile Acidity</label>
            <input
              type="text"
              className="form-control"
              name="volatileAcidity"
              value={formDataWine.volatileAcidity}
              onChange={handleInputChangeWine}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2"> Density </label>
            <input
              type="text"
              className="form-control"
              name="density"
              value={formDataWine.density}
              onChange={handleInputChangeWine}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2"> Alcohol </label>
            <input
              type="text"
              className="form-control"
              name="alcohol"
              value={formDataWine.alcohol}
              onChange={handleInputChangeWine}
              required
            />
          </div>

          <button className="btn btn-primary  m-3" type="submit">
            Consultar
          </button>
        </form>
      )}

      {selectedModel?.name === "Modelo predictor del precio del aguacate" && (
        <form
          className="form-bootstrap"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form data:", formDataAvocado);
            fetchAvocadoPrediction(
              formDataAvocado.total_volume,
              formDataAvocado.year,
              formDataAvocado.month,
              formDataAvocado.day,
              formDataAvocado.region
            );
          }}
        >
          <h3 style={{ marginBottom: '20px' }}>Modelo de predicción del precio del aguacate</h3> <hr></hr>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> Total Volume </label>
            <input
              type="text"
              className="form-control"
              name="total_volume"
              value={formDataAvocado.total_volume}
              onChange={handleInputChangeAvocado}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> Year </label>
            <input
              type="text"
              className="form-control"
              name="year"
              value={formDataAvocado.year}
              onChange={handleInputChangeAvocado}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> Month </label>
            <input
              type="text"
              className="form-control"
              name="month"
              value={formDataAvocado.month}
              onChange={handleInputChangeAvocado}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> Day </label>
            <input
              type="text"
              className="form-control"
              name="day"
              value={formDataAvocado.day}
              onChange={handleInputChangeAvocado}
              required
            />
          </div>
          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> Region </label>
            <input
              type="text"
              className="form-control"
              name="region"
              value={formDataAvocado.region}
              onChange={handleInputChangeAvocado}
              required
            />
          </div>

          <button className="btn btn-primary  m-3" type="submit">
            Consultar
          </button>
        </form>
      )}

      {selectedModel?.name === "Modelo predictor del precio de autos" && (
        <form
          className="form-bootstrap"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form data:", formDataCars);
            fetchCarsPrediction(
              formDataCars.year,
              formDataCars.presentPrice,
              formDataCars.kms_driven,
              formDataCars.fuel_type,
              formDataCars.seller_type,
              formDataCars.transmission,
              formDataCars.owner
            );
          }}
        >
          <h3 style={{ marginBottom: '20px' }}>Modelo predicción del precio de un auto</h3> <hr></hr>

          <div className="mb-2 text-start">
            <label className="m-2 ms-4"> Year </label>
            <input
              type="text"
              className="form-control"
              name="year"
              value={formDataCars.year}
              onChange={handleInputChangeCars}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-4"> Present price </label>
            <input
              type="text"
              className="form-control"
              name="presentPrice"
              value={formDataCars.presentPrice}
              onChange={handleInputChangeCars}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-4"> Kms driven </label>
            <input
              type="text"
              className="form-control"
              name="kms_driven"
              value={formDataCars.kms_driven}
              onChange={handleInputChangeCars}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-4"> Fuel Type </label>
            <input
              type="text"
              className="form-control"
              name="fuel_type"
              value={formDataCars.fuel_type}
              onChange={handleInputChangeCars}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-4"> Seller Type </label>
            <input
              type="text"
              className="form-control"
              name="seller_type"
              value={formDataCars.seller_type}
              onChange={handleInputChangeCars}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-4"> Transmission </label>
            <input
              type="text"
              className="form-control"
              name="transmission"
              value={formDataCars.transmission}
              onChange={handleInputChangeCars}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-4"> Owner </label>
            <input
              type="text"
              className="form-control"
              name="owner"
              value={formDataCars.owner}
              onChange={handleInputChangeCars}
              required
            />
          </div>
          <button className="btn btn-primary m-3" type="submit">
            Consultar
          </button>
        </form>
      )}

      {selectedModel?.name === "Modelo predictor de Hepatitis C" && (
        <form
          className="form-bootstrap"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form data:", formDataHepatitis);
            fetchHepatitisPrediction(
              formDataHepatitis.alb,
              formDataHepatitis.alp,
              formDataHepatitis.alt,
              formDataHepatitis.ast,
              formDataHepatitis.bil,
              formDataHepatitis.che,
              formDataHepatitis.chol,
              formDataHepatitis.crea,
              formDataHepatitis.ggt,
              formDataHepatitis.prot
            );
          }}
        >
          <h3 style={{ marginBottom: '20px' }}>Modelo predicción de Hepatitis</h3> <hr></hr>

          <div className="mb-2 text-start">
            <label className="m-2"> ALB (Albúmina) </label>
            <input
              type="text"
              className="form-control"
              name="alb"
              value={formDataHepatitis.alb}
              onChange={handleInputChangeHepatitis}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2"> ALP (Fosfatasa Alcalina) </label>
            <input
              type="text"
              className="form-control"
              name="alp"
              value={formDataHepatitis.alp}
              onChange={handleInputChangeHepatitis}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2"> ALT (alanina aminotransferasa) </label>
            <input
              type="text"
              className="form-control"
              name="alt"
              value={formDataHepatitis.alt}
              onChange={handleInputChangeHepatitis}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2"> AST (Aspartato aminotransferasa) </label>
            <input
              type="text"
              className="form-control"
              name="ast"
              value={formDataHepatitis.ast}
              onChange={handleInputChangeHepatitis}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2"> BIL (Bilirrubina) </label>
            <input
              type="text"
              className="form-control"
              name="bil"
              value={formDataHepatitis.bil}
              onChange={handleInputChangeHepatitis}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2"> CHE (Colinesterasa) </label>
            <input
              type="text"
              className="form-control"
              name="che"
              value={formDataHepatitis.che}
              onChange={handleInputChangeHepatitis}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2"> CHOL (Colesterol) </label>
            <input
              type="text"
              className="form-control"
              name="chol"
              value={formDataHepatitis.chol}
              onChange={handleInputChangeHepatitis}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2"> CREA (Creatina) </label>
            <input
              type="text"
              className="form-control"
              name="crea"
              value={formDataHepatitis.crea}
              onChange={handleInputChangeHepatitis}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2"> GGT (gamma-glutamil) </label>
            <input
              type="text"
              className="form-control"
              name="ggt"
              value={formDataHepatitis.ggt}
              onChange={handleInputChangeHepatitis}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2"> PROT (Proteínas) </label>
            <input
              type="text"
              className="form-control"
              name="prot"
              value={formDataHepatitis.prot}
              onChange={handleInputChangeHepatitis}
              required
            />
          </div>
          <button className="btn btn-primary m-3" type="submit">
            Consultar
          </button>
        </form>
      )}

      {selectedModel?.name === "Modelo predictor del precio del Bitcoin" && (
        <form
          className="form-bootstrap"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form data:", formDataBitcoin);
            fetchBitcoinPrediction(formDataBitcoin.date, formDataBitcoin.close);
          }}
        >
          <h3 style={{ marginBottom: '20px' }}>Modelo de predicción del precio del bitcoin</h3> <hr></hr>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> Date </label>
            <input
              type="text"
              className="form-control"
              name="date"
              value={formDataBitcoin.date}
              onChange={handleInputChangeBitcoin}
              required
            />
          </div>

          <button className="btn btn-primary m-3" type="submit">
            Consultar
          </button>
        </form>
      )}

      {selectedModel?.name === "Modelo predictor del precio de una casa" && (
        <form
          className="form-bootstrap"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form data:", formDataCasa);
            fetchPrecioCasaPrediction(
              formDataCasa.structuretaxvaluedollarcnt,
              formDataCasa.calculatedfinishedsquarefeet,
              formDataCasa.lotsizesquarefeet,
              formDataCasa.bathroomcnt,
              formDataCasa.bedroomcnt,
              formDataCasa.yearbuilt
            );
          }}
        >
          <h3 style={{ marginBottom: '20px' }}>Modelo predicción del precio de una casa</h3> <hr></hr>

          <div className="mb-2 text-start">
            <label className="m-2 ms-4">  Valor fiscal de la estructura </label>
            <input
              type="text"
              className="form-control"
              name="structuretaxvaluedollarcnt"
              value={formDataCasa.structuretaxvaluedollarcnt}
              onChange={handleInputChangeCasa}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-4"> Superficie total terminada </label>
            <input
              type="text"
              className="form-control"
              name="calculatedfinishedsquarefeet"
              value={formDataCasa.calculatedfinishedsquarefeet}
              onChange={handleInputChangeCasa}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-4"> Tamaño del lote o terreno </label>
            <input
              type="text"
              className="form-control"
              name="lotsizesquarefeet"
              value={formDataCasa.lotsizesquarefeet}
              onChange={handleInputChangeCasa}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-4"> Número de baños </label>
            <input
              type="text"
              className="form-control"
              name="bathroomcnt"
              value={formDataCasa.bathroomcnt}
              onChange={handleInputChangeCasa}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-4"> Número de dormitorios </label>
            <input
              type="text"
              className="form-control"
              name="bedroomcnt"
              value={formDataCasa.bedroomcnt}
              onChange={handleInputChangeCasa}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-4"> Año de construcción de la casa </label>
            <input
              type="text"
              className="form-control"
              name="yearbuilt"
              value={formDataCasa.yearbuilt}
              onChange={handleInputChangeCasa}
              required
            />
          </div>

          <button className="btn btn-primary m-3" type="submit">
            Consultar
          </button>
        </form>
      )}

      {selectedModel?.name === "Modelo Predictor de las ventas de la compañia Rossman" && (
        <form
          className="form-bootstrap"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form data:", formDataRossman);
            fetchVentasRossmanPrediction(
              formDataRossman.Store,
              formDataRossman.DayOfWeek,
              formDataRossman.Promo,
              formDataRossman.SchoolHoliday,
              formDataRossman.Year,
              formDataRossman.Month,
              formDataRossman.Day,
              formDataRossman.Customers
            );
          }}
        >
          <h3 style={{ marginBottom: '20px' }}> Modelo de predicción de las ventas de la compañia Rossman</h3> <hr></hr>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> Identificador de la tienda </label>
            <input
              type="text"
              className="form-control"
              name="Store"
              value={formDataRossman.Store}
              onChange={handleInputChangeRossman}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> Día de la semana (1 = Domingo, 7 = Sábado) </label>
            <input
              type="text"
              className="form-control"
              name="DayOfWeek"
              value={formDataRossman.DayOfWeek}
              onChange={handleInputChangeRossman}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> Hay promoción en ese día sí(1) o no(0) </label>
            <input
              type="text"
              className="form-control"
              name="Promo"
              value={formDataRossman.Promo}
              onChange={handleInputChangeRossman}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> Hay feriada escolar en este día sí(1) o no(0) </label>
            <input
              type="text"
              className="form-control"
              name="SchoolHoliday"
              value={formDataRossman.SchoolHoliday}
              onChange={handleInputChangeRossman}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> Año </label>
            <input
              type="text"
              className="form-control"
              name="Year"
              value={formDataRossman.Year}
              onChange={handleInputChangeRossman}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> Mes </label>
            <input
              type="text"
              className="form-control"
              name="Month"
              value={formDataRossman.Month}
              onChange={handleInputChangeRossman}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> Día </label>
            <input
              type="text"
              className="form-control"
              name="Day"
              value={formDataRossman.Day}
              onChange={handleInputChangeRossman}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> Número de clientes </label>
            <input
              type="text"
              className="form-control"
              name="Customers"
              value={formDataRossman.Customers}
              onChange={handleInputChangeRossman}
              required
            />
          </div>

          <button className="btn btn-primary m-3" type="submit">
            Consultar
          </button>
        </form>
      )}

      {selectedModel?.name === "Modelo predictor de la cantidad de crímenes por día en Londres" && (
        <form
          className="form-bootstrap"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form data:", formLondonCrimes);
            fetchLondonCrimesPrediction(formLondonCrimes.date);
          }}
        >
          <h3 style={{ marginBottom: '20px' }}> Modelo predicción de la cantidad de crímines por día en Londres </h3> <hr></hr>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> ¿Sobre qué día deseas saber? </label>
            <input
              type="text"
              className="form-control"
              name="date"
              value={formLondonCrimes.date}
              onChange={handleInputChangeCrime}
              required
            />
          </div>

          <button className="btn btn-primary m-3" type="submit">
            Consultar
          </button>
        </form>
      )}

      {selectedModel?.name === "Modelo clasificador de accidente cerebro-vascular" && (
        <form
          className="form-bootstrap"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form data:", formStroke);
            fetchStrokeClasifier(
              formStroke.gender,
              formStroke.age,
              formStroke.hypertension,
              formStroke.heart_disease,
              formStroke.ever_married,
              formStroke.work_type,
              formStroke.Residence_type,
              formStroke.avg_glucose_level,
              formStroke.bmi,
              formStroke.smoking_status
            );
          }}
        >
          <h3 style={{ marginBottom: '20px' }}>Modelo de clasificación para accidente cerebrovascular (ACV)</h3> <hr></hr>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> Género </label>
            <select
              id="gender-combobox"
              name="gender"
              className="form-control"
              value={formStroke.gender}
              onChange={handleInputChangeStroke}
              required
            >
              <option defaultValue={0} value="">
                --Seleccione una opción--
              </option>
              <option value="1">Femenino</option>
              <option value="0">Masculino</option>
            </select>
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> Edad </label>
            <input
              type="number"
              className="form-control"
              name="age"
              value={formStroke.age}
              onChange={handleInputChangeStroke}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> ¿Padece hipertensión? </label>
            <select
              id="hypertension-combobox"
              className="form-control"
              name="hypertension"
              value={formStroke.hypertension}
              onChange={handleInputChangeStroke}
              required
            >
              <option defaultValue={0}>--Seleccione una opción--</option>
              <option value="1">Sí</option>
              <option value="0">No</option>
            </select>
          </div>

          <div cclassName="mb-2 text-start">
            <label className="m-2 ms-5"> ¿Padece enfermedades cardiacas? </label>
            <select
              id="heart_disease-combobox"
              className="form-control"
              name="heart_disease"
              value={formStroke.heart_disease}
              onChange={handleInputChangeStroke}
              required
            >
              <option defaultValue={0} value="">
                --Seleccione una opción--
              </option>
              <option value="1">Sí</option>
              <option value="0">No</option>
            </select>
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> ¿El paciente se ha casado alguna vez? </label>
            <select
              id="ever_married-combobox"
              className="form-control"
              name="ever_married"
              value={formStroke.ever_married}
              onChange={handleInputChangeStroke}
              required
            >
              <option value="">--Seleccione una opción--</option>
              <option value="1">Sí</option>
              <option value="0">No</option>
            </select>
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> Tipo de trabajo </label>
            <select
              id="work_type-combobox"
              className="form-control"
              name="work_type"
              value={formStroke.work_type}
              onChange={handleInputChangeStroke}
              required
            >
              <option select value="">
                --Seleccione una opción--
              </option>
              <option value="children">El paciente es un niño</option>
              <option value="Govt_job">Empleado del gobierno</option>
              <option value="Govt_job">Empleado del gobierno</option>
              <option value="Private">Trabaja en el sector privado</option>
              <option value="Self-employed"> Autónomo o trabaja por cuenta propia </option>
            </select>
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> Tipo de residencia </label>
            <select
              type="text"
              className="form-control"
              name="Residence_type"
              value={formStroke.Residence_type}
              onChange={handleInputChangeStroke}
              required
            >
              <option select value=""> --Seleccione una opción-- </option>
              <option value="Urban">Urbana</option>
              <option value="Rura">Rural</option>
            </select>
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> Nivel de glucosa promedio </label>
            <input
              type="number"
              className="form-control"
              name="avg_glucose_level"
              value={formStroke.avg_glucose_level}
              onChange={handleInputChangeStroke}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> Indice de Masa Corporal (IMC) </label>
            <input
              type="number"
              className="form-control"
              name="bmi"
              value={formStroke.bmi}
              onChange={handleInputChangeStroke}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> Hábito de fumar </label>
            <select
              id="smoking_status-combobox"
              className="form-control"
              name="smoking_status"
              value={formStroke.smoking_status}
              onChange={handleInputChangeStroke}
              required>
              <option select value=""> --Seleccione una opción-- </option>
              <option value="formerly smoked">Antes fumaba</option>
              <option value="never smoked">Nunca he fumado</option>
              <option value="smokes">Actualmente fumo</option>
              <option value="Unknown">Desconocido</option>
            </select>
          </div>

          <button className="btn btn-primary m-3" type="submit">
            Consultar
          </button>
        </form>
      )}

      {selectedModel?.name === "Modelo predictor de las acciones del mercado SP 500" && (
        <form
          className="form-bootstrap"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form data:", formDataStock);
            fetchStockValuePrediction(formDataStock.date);
          }}
        >
          <h3 style={{ marginBottom: '20px' }}>Modelo predictor de las acciones del mercado SP 500</h3> <hr></hr>

          <div className="mb-2 text-start">
            <label className="m-2 ms-5"> ¿Sobre qué día deseas saber? </label>
            <input
              type="text"
              className="form-control"
              name="date"
              value={formDataStock.date}
              onChange={handleInputChangeStocks}
              required
            />
          </div>

          <button className="btn btn-primary m-3" type="submit">
            Consultar
          </button>
        </form>
      )}

      {/* Mostrar la predicción para el modelo seleccionado */}
      {prediction && (
        <div style={{ backgroundColor: 'white', marginBottom: '30px', padding: '20px', borderRadius: '10px' }}>
          <h4>Predicción: {prediction}</h4>
        </div>
      )}
    </div>
  );
};

export default ModelSelection;
