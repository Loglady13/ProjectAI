import React, { useState, useEffect } from "react";
import "./App.css";

const ModelSelection = () => {
  const [selectedModel, setSelectedModel] = useState(null);

  const [formDataWine, setFormDataWine] = useState({
    volatileAcidity: "",
    density: "",
    alcohol: "",
  });

  const [formDataAvocado, setFormDataAvocado] = useState({
    total_volume: "",
    year: "",
    month: "",
    day: "",
    region: "",
  });

  const [formDataCars, setFormDataCars] = useState({
    year: "",
    presentPrice: "",
    kms_driven: "",
    fuel_type: "",
    seller_type: "",
    transmission: "",
    owner: "",
  });

  const [formDataHepatitis, setFormDataHepatitis] = useState({
    alb: "",
    alp: "",
    alt: "",
    ast: "",
    bil: "",
    che: "",
    chol: "",
    crea: "",
    ggt: "",
    prot: "",
  });

  const [formDataBitcoin, setFormDataBitcoin] = useState({
    date: "",
  });

  const [formDataCasa, setFormDataCasa] = useState({
    structuretaxvaluedollarcnt: "",
    calculatedfinishedsquarefeet: "",
    lotsizesquarefeet: "",
    bathroomcnt: "",
    bedroomcnt: "",
    yearbuilt: "",
  });

  const [formDataRossman, setFormDataRossman] = useState({
    Store: "",
    DayOfWeek: "",
    Promo: "",
    SchoolHoliday: "",
    Year: "",
    Month: "",
    Day: "",
    Customers: "",
  });

  const [formLondonCrimes, setFormLondonCrimes] = useState({
    date: "",
  });

  const [formStroke, setFormStroke] = useState({
    gender: 0,
    age: 0,
    hypertension: 0,
    heart_disease: 0,
    ever_married: 0,
    work_type: "",
    Residence_type: "",
    avg_glucose_level: 0.0,
    bmi: 0.0,
    smoking_status: "",
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
    { id: 1, name: "Modelo Calidad Vino" },
    { id: 2, name: "Modelo Precio Aguacate" },
    { id: 3, name: "Modelo Precio Autos" },
    { id: 4, name: "Modelo Predictor Hepatitis C" },
    { id: 5, name: "Modelo Predictor Precio del Bitcoin" },
    { id: 6, name: "Modelo Predictor Precio Casa" },
    { id: 7, name: "Modelo Predictor de las ventas de la compañia Rossman" },
    {
      id: 8,
      name: "Modelo Predictor de la cantidad de crímenes por día en Londres",
    },
    { id: 9, name: "Modelo clasificador de accidente cerebro-vascular" },
    { id: 10, name: "Modelo Predictor de las acciones del mercado SP 500" },
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

  const fetchAvocadoPrediction = async (
    total_volume,
    year,
    month,
    day,
    region
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/aguacate_prediction?Total_Volume=${total_volume}&year=${year}&Month=${month}&Day=${day}&region=${region}`,
        {
          params: {
            total_volume: total_volume,
            year: year,
            month: month,
            day: day,
            region: region,
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

  const fetchCarsPrediction = async (
    year,
    presentPrice,
    kms_driven,
    fuel_type,
    seller_type,
    transmission,
    owner
  ) => {
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

  const fetchHepatitisPrediction = async (
    alb,
    alp,
    alt,
    ast,
    bil,
    che,
    chol,
    crea,
    ggt,
    prot
  ) => {
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

  const fetchPrecioCasaPrediction = async (
    structuretaxvaluedollarcnt,
    calculatedfinishedsquarefeet,
    lotsizesquarefeet,
    bathroomcnt,
    bedroomcnt,
    yearbuilt
  ) => {
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

  const fetchVentasRossmanPrediction = async (
    Store,
    DayOfWeek,
    Promo,
    SchoolHoliday,
    Year,
    Month,
    Day,
    Customers
  ) => {
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

  const fetchStrokeClasifier = async (
    gender,
    age,
    hypertension,
    heart_disease,
    ever_married,
    work_type,
    Residence_type,
    avg_glucose_level,
    bmi,
    smoking_status
  ) => {
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
    startRecognition();
  };

  return (
    <div className="container-fluid gradient-background text-center full-height">
      <h1>Selecciona un Modelo de IA</h1>

      {/* Solo mostrar la lista de modelos si no hay un formulario seleccionado */}
      {!selectedModel && (
        <div
          className="d-flex flex-wrap justify-content-center"
          style={{ padding: "20px" }}
        >
          {models.map((model) => (
            <div className="p-3" key={model.id}>
              <div
                className="bg-transparent text-dark rounded p-3 card-hover"
                style={{
                  minWidth: "150px",
                  textAlign: "center",
                  backdropFilter: "blur(10px)",
                }}
              >
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
        <label className={`fade-in-out ${visible ? "show" : ""}`}>
          {phrases[currentPhraseIndex]}
        </label>
      </div>

      {speech !== "" && (
        <p>
          Texto reconocido: <span>{speech}</span>
        </p>
      )}

      {/* Mostrar el formulario si el modelo "vino" está seleccionado */}
      {selectedModel?.name === "Modelo Calidad Vino" && (
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
          <h2>Modelo de Predicción de Vino</h2>

          <div className="mb-2">
            <label className="form-label">Volatile Acidity:</label>
            <input
              type="text"
              className="form-control"
              name="volatileAcidity"
              value={formDataWine.volatileAcidity}
              onChange={handleInputChangeWine}
              required
            />
          </div>

          <div className="mb-2">
            <label>
              Density:
              <input
                type="text"
                className="form-control"
                name="density"
                value={formDataWine.density}
                onChange={handleInputChangeWine}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Alcohol:
              <input
                type="text"
                className="form-control"
                name="alcohol"
                value={formDataWine.alcohol}
                onChange={handleInputChangeWine}
                required
              />
            </label>
          </div>

          <button className="btn btn-primary" type="submit">
            Enviar
          </button>
        </form>
      )}

      {selectedModel?.name === "Modelo Precio Aguacate" && (
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
          <h2>Modelo de predicción del precio del aguacate</h2>

          <div className="mb-2">
            <label>
              Total Volume:
              <input
                type="text"
                className="form-control"
                name="total_volume"
                value={formDataAvocado.total_volume}
                onChange={handleInputChangeAvocado}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Year:
              <input
                type="text"
                className="form-control"
                name="year"
                value={formDataAvocado.year}
                onChange={handleInputChangeAvocado}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Month:
              <input
                type="text"
                className="form-control"
                name="month"
                value={formDataAvocado.month}
                onChange={handleInputChangeAvocado}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Day:
              <input
                type="text"
                className="form-control"
                name="day"
                value={formDataAvocado.day}
                onChange={handleInputChangeAvocado}
                required
              />
            </label>
          </div>
          <div className="mb-2">
            <label>
              Region:
              <input
                type="text"
                className="form-control"
                name="region"
                value={formDataAvocado.region}
                onChange={handleInputChangeAvocado}
                required
              />
            </label>
          </div>

          <button className="btn btn-primary" type="submit">
            Enviar
          </button>
        </form>
      )}

      {selectedModel?.name === "Modelo Precio Autos" && (
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
          <h2>Modelo predicción del precio de un auto</h2>

          <div className="mb-2">
            <label>
              Year:
              <input
                type="text"
                className="form-control"
                name="year"
                value={formDataCars.year}
                onChange={handleInputChangeCars}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Present price:
              <input
                type="text"
                className="form-control"
                name="presentPrice"
                value={formDataCars.presentPrice}
                onChange={handleInputChangeCars}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Kms driven:
              <input
                type="text"
                className="form-control"
                name="kms_driven"
                value={formDataCars.kms_driven}
                onChange={handleInputChangeCars}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Fuel Type:
              <input
                type="text"
                className="form-control"
                name="fuel_type"
                value={formDataCars.fuel_type}
                onChange={handleInputChangeCars}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Seller Type:
              <input
                type="text"
                className="form-control"
                name="seller_type"
                value={formDataCars.seller_type}
                onChange={handleInputChangeCars}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Transmission:
              <input
                type="text"
                className="form-control"
                name="transmission"
                value={formDataCars.transmission}
                onChange={handleInputChangeCars}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Owner:
              <input
                type="text"
                className="form-control"
                name="owner"
                value={formDataCars.owner}
                onChange={handleInputChangeCars}
                required
              />
            </label>
          </div>
          <button className="btn btn-primary" type="submit">
            Enviar
          </button>
        </form>
      )}

      {selectedModel?.name === "Modelo Predictor Hepatitis C" && (
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
          <h2>Modelo predicción de Hepatitis</h2>

          <div className="form-group">
            <label>
              ALB (Albúmina):
              <input
                type="text"
                className="form-control"
                name="alb"
                value={formDataHepatitis.alb}
                onChange={handleInputChangeHepatitis}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              ALP (Fosfatasa Alcalina):
              <input
                type="text"
                className="form-control"
                name="alp"
                value={formDataHepatitis.alp}
                onChange={handleInputChangeHepatitis}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              ALT (alanina aminotransferasa):
              <input
                type="text"
                className="form-control"
                name="alt"
                value={formDataHepatitis.alt}
                onChange={handleInputChangeHepatitis}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              AST (Aspartato aminotransferasa):
              <input
                type="text"
                className="form-control"
                name="ast"
                value={formDataHepatitis.ast}
                onChange={handleInputChangeHepatitis}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              BIL (Bilirrubina):
              <input
                type="text"
                className="form-control"
                name="bil"
                value={formDataHepatitis.bil}
                onChange={handleInputChangeHepatitis}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              CHE (Colinesterasa):
              <input
                type="text"
                className="form-control"
                name="che"
                value={formDataHepatitis.che}
                onChange={handleInputChangeHepatitis}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              CHOL (Colesterol):
              <input
                type="text"
                className="form-control"
                name="chol"
                value={formDataHepatitis.chol}
                onChange={handleInputChangeHepatitis}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              CREA (Creatina):
              <input
                type="text"
                className="form-control"
                name="crea"
                value={formDataHepatitis.crea}
                onChange={handleInputChangeHepatitis}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              GGT (gamma-glutamil):
              <input
                type="text"
                className="form-control"
                name="ggt"
                value={formDataHepatitis.ggt}
                onChange={handleInputChangeHepatitis}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              PROT (Proteínas):
              <input
                type="text"
                className="form-control"
                name="prot"
                value={formDataHepatitis.prot}
                onChange={handleInputChangeHepatitis}
                required
              />
            </label>
          </div>
          <button className="btn btn-primary" type="submit">
            Enviar
          </button>
        </form>
      )}

      {selectedModel?.name === "Modelo Predictor Precio del Bitcoin" && (
        <form
          className="form-bootstrap"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form data:", formDataBitcoin);
            fetchBitcoinPrediction(formDataBitcoin.date, formDataBitcoin.close);
          }}
        >
          <h2>Modelo de predicción del precio del bitcoin</h2>

          <div className="mb-2">
            <label>
              Date:
              <input
                type="text"
                className="form-control"
                name="date"
                value={formDataBitcoin.date}
                onChange={handleInputChangeBitcoin}
                required
              />
            </label>
          </div>

          <button className="btn btn-primary" type="submit">
            Enviar
          </button>
        </form>
      )}

      {selectedModel?.name === "Modelo Predictor Precio Casa" && (
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
          <h2>Modelo predicción del precio de una casa</h2>

          <div className="mb-2">
            <label>
              Valor fiscal de la estructura:
              <input
                type="text"
                className="form-control"
                name="structuretaxvaluedollarcnt"
                value={formDataCasa.structuretaxvaluedollarcnt}
                onChange={handleInputChangeCasa}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Superficie total terminada:
              <input
                type="text"
                className="form-control"
                name="calculatedfinishedsquarefeet"
                value={formDataCasa.calculatedfinishedsquarefeet}
                onChange={handleInputChangeCasa}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Tamaño del lote o terreno:
              <input
                type="text"
                className="form-control"
                name="lotsizesquarefeet"
                value={formDataCasa.lotsizesquarefeet}
                onChange={handleInputChangeCasa}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Número de baños:
              <input
                type="text"
                className="form-control"
                name="bathroomcnt"
                value={formDataCasa.bathroomcnt}
                onChange={handleInputChangeCasa}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Número de dormitorios:
              <input
                type="text"
                className="form-control"
                name="bedroomcnt"
                value={formDataCasa.bedroomcnt}
                onChange={handleInputChangeCasa}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Año de construcción de la casa:
              <input
                type="text"
                className="form-control"
                name="yearbuilt"
                value={formDataCasa.yearbuilt}
                onChange={handleInputChangeCasa}
                required
              />
            </label>
          </div>

          <button className="btn btn-primary" type="submit">
            Enviar
          </button>
        </form>
      )}

      {selectedModel?.name ===
        "Modelo Predictor de las ventas de la compañia Rossman" && (
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
          <h2>Modelo de predicción de las ventas de la compañia Rossman</h2>

          <div className="mb-2">
            <label>
              Identificador de la tienda
              <input
                type="text"
                className="form-control"
                name="Store"
                value={formDataRossman.Store}
                onChange={handleInputChangeRossman}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Día de la semana (1 = Domingo, 7 = Sábado):
              <input
                type="text"
                className="form-control"
                name="DayOfWeek"
                value={formDataRossman.DayOfWeek}
                onChange={handleInputChangeRossman}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Hay promoción en ese día sí(1) o no(0):
              <input
                type="text"
                className="form-control"
                name="Promo"
                value={formDataRossman.Promo}
                onChange={handleInputChangeRossman}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Hay feriada escolar en este día sí(1) o no(0):
              <input
                type="text"
                className="form-control"
                name="SchoolHoliday"
                value={formDataRossman.SchoolHoliday}
                onChange={handleInputChangeRossman}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Año:
              <input
                type="text"
                className="form-control"
                name="Year"
                value={formDataRossman.Year}
                onChange={handleInputChangeRossman}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Mes:
              <input
                type="text"
                className="form-control"
                name="Month"
                value={formDataRossman.Month}
                onChange={handleInputChangeRossman}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Día:
              <input
                type="text"
                className="form-control"
                name="Day"
                value={formDataRossman.Day}
                onChange={handleInputChangeRossman}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Número de clientes:
              <input
                type="text"
                className="form-control"
                name="Customers"
                value={formDataRossman.Customers}
                onChange={handleInputChangeRossman}
                required
              />
            </label>
          </div>

          <button className="btn btn-primary" type="submit">
            Enviar
          </button>
        </form>
      )}

      {selectedModel?.name ===
        "Modelo Predictor de la cantidad de crímenes por día en Londres" && (
        <form
          className="form-bootstrap"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form data:", formLondonCrimes);
            fetchLondonCrimesPrediction(formLondonCrimes.date);
          }}
        >
          <h2>
            Modelo predicción de la cantidad de crímines por día en Londres
          </h2>

          <div className="mb-2">
            <label>
              ¿Sobre qué día deseas saber?
              <input
                type="text"
                className="form-control"
                name="date"
                value={formLondonCrimes.date}
                onChange={handleInputChangeCrime}
                required
              />
            </label>
          </div>

          <button className="btn btn-primary" type="submit">
            Consultar
          </button>
        </form>
      )}

      {selectedModel?.name ===
        "Modelo clasificador de accidente cerebro-vascular" && (
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
          <h2>Modelo de clasificación para accidente cerebrovascular (ACV)</h2>

          <div className="mb-2">
            <label>
              Género
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
            </label>
          </div>

          <div className="mb-2">
            <label>
              Edad
              <input
                type="number"
                className="form-control"
                name="age"
                value={formStroke.age}
                onChange={handleInputChangeStroke}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              ¿Padece hipertensión?
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
            </label>
          </div>

          <div className="mb-2">
            <label>
              ¿Padece enfermedades cardiacas?
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
            </label>
          </div>

          <div className="mb-2">
            <label>
              ¿El paciente se ha casado alguna vez?
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
            </label>
          </div>

          <div className="mb-2">
            <label>
              Tipo de trabajo
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
                <option value="Self-employed">
                  Autónomo o trabaja por cuenta propia
                </option>
              </select>
            </label>
          </div>

          <div className="mb-2">
            <label>
              Tipo de residencia:
              <select
                type="text"
                className="form-control"
                name="Residence_type"
                value={formStroke.Residence_type}
                onChange={handleInputChangeStroke}
                required
              >
                <option select value="">
                  --Seleccione una opción--
                </option>
                <option value="Urban">Urbana</option>
                <option value="Rura">Rural</option>
              </select>
            </label>
          </div>

          <div className="mb-2">
            <label>
              Nivel de glucosa promedio
              <input
                type="number"
                className="form-control"
                name="avg_glucose_level"
                value={formStroke.avg_glucose_level}
                onChange={handleInputChangeStroke}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Indice de Masa Corporal (IMC)
              <input
                type="number"
                className="form-control"
                name="bmi"
                value={formStroke.bmi}
                onChange={handleInputChangeStroke}
                required
              />
            </label>
          </div>

          <div className="mb-2">
            <label>
              Hábito de fumar
              <select
                id="smoking_status-combobox"
                className="form-control"
                name="smoking_status"
                value={formStroke.smoking_status}
                onChange={handleInputChangeStroke}
                required
              >
                <option select value="">
                  --Seleccione una opción--
                </option>
                <option value="formerly smoked">Antes fumaba</option>
                <option value="never smoked">Nunca he fumado</option>
                <option value="smokes">Actualmente fumo</option>
                <option value="Unknown">Desconocido</option>
              </select>
            </label>
          </div>

          <button className="btn btn-primary" type="submit">
            Consultar
          </button>
        </form>
      )}

      {selectedModel?.name ===
        "Modelo Predictor de las acciones del mercado SP 500" && (
        <form
          className="form-bootstrap"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form data:", formDataStock);
            fetchStockValuePrediction(formDataStock.date);
          }}
        >
          <h2>Modelo predictor de las acciones del mercado SP 500</h2>

          <div className="mb-2">
            <label>
              ¿Sobre qué día deseas saber?:
              <input
                type="text"
                className="form-control"
                name="date"
                value={formDataStock.date}
                onChange={handleInputChangeStocks}
                required
              />
            </label>
          </div>

          <button className="btn btn-primary" type="submit">
            Consultar
          </button>
        </form>
      )}

      {/* Mostrar la predicción para el modelo seleccionado */}
      {prediction && (
        <div>
          <h3>Predicción: {prediction}</h3>
        </div>
      )}
    </div>
  );
};

export default ModelSelection;
