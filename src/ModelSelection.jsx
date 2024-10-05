import React, { useState } from 'react';

const ModelSelection = () => {
  const [selectedModel, setSelectedModel] = useState(null);

  const [formDataWine, setFormDataWine] = useState({
    volatileAcidity: '',
    density: '',
    alcohol: ''
  });

  const [formDataAvocado, setFormDataAvocado] = useState({
    total_volume: '',
    year: '',
    month: '',
    day: '',
    region: ''
  });

  const [formDataCars, setFormDataCars] = useState({
    year: '',
    presentPrice: '',
    kms_driven: '',
    fuel_type: '',
    seller_type: '',
    transmission: '',
    owner: ''
  });

  const [formDataHepatitis, setFormDataHepatitis] = useState({

    alb: '',
    alp: '',
    alt: '',
    ast: '',
    bil: '',
    che: '',
    chol: '',
    crea: '',
    ggt: '',
    prot: ''
  });

  const [prediction, setPrediction] = useState(null); // Estado para la predicción

  const models = [
    { id: 1, name: 'Modelo Calidad Vino' },
    { id: 2, name: 'Modelo Precio Aguacate' },
    { id: 3, name: 'Modelo Precio Autos' },
    { id: 4, name: 'Modelo Predictor Hepatitis C'}
    
  ];

  const handleModelSelection = (model) => {
    setSelectedModel(model);
    setPrediction(''); // Limpiar la predicción cuando se selecciona un nuevo modelo
  };

  const handleInputChangeWine = (e) => {
    setFormDataWine({
      ...formDataWine,
      [e.target.name]: e.target.value
    });
  };

  const handleInputChangeAvocado = (e) =>{
    setFormDataAvocado({
      ...formDataAvocado,
      [e.target.name]: e.target.value
    });
  };

  const handleInputChangeCars = (e) => {
    setFormDataCars({
      ...formDataCars,
      [e.target.name]: e.target.value
    });
  };

  const handleInputChangeHepatitis = (e) =>{
    setFormDataHepatitis({
      ...formDataHepatitis,
      [e.target.name]: e.target.value
    });
  };


  const fetchAvocadoPrediction = async (total_volume, year, month, day, region) => {
    try {
        const response = await fetch(`http://localhost:5000/aguacate_prediction?Total_Volume=${total_volume}&year=${year}&Month=${month}&Day=${day}&region=${region}`, {
            params: {
                total_volume: total_volume,
                year: year,
                month: month,
                day: day,
                region: region
            }
        });
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
      const response = await fetch(`http://localhost:5000/wine_prediction?volatile_acidity=${volatile_acidity}&density=${density}&alcohol=${alcohol}`);
      if (!response.ok) {
        throw new Error(`Error fetching Wine prediction: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Prediction:", data);
      setPrediction(data.prediction); // Actualiza el estado de la predicción
    } catch (error) {
      console.error("Error fetching Wine prediction:", error);
      setPrediction("Error en la predicción"); // Manejo de errores
    }
  };

  const fetchCarsPrediction = async (year, presentPrice, kms_driven, fuel_type, seller_type, transmission,owner) =>{
    try{
      const response = await fetch(`http://localhost:5000/cars_prediction?year=${year}&presentPrice=${presentPrice}&kms_driven=${kms_driven}&fuel_type=${fuel_type}&seller_type=${seller_type}&transmission=${transmission}&owner=${owner}`);
      const data = await response.json();
      console.log("Prediction:", data); 
      setPrediction(data.prediction); 
    }catch (error){
      console.error("Error fetching Cars prediction:", error);
      setPrediction("Error en la predicción"); // Manejo de errores
    }
  }

  const fetchHepatitisPrediction = async (alb, alp, alt, ast, bil, che, chol, crea, ggt, prot) =>{
    try{
      const response = await fetch(`http://localhost:5000/hepatitis_prediction?alb=${alb}&alp=${alp}&alt=${alt}&ast=${ast}&bil=${bil}&che=${che}&chol=${chol}&crea=${crea}&ggt=${ggt}&prot=${prot}`)
      const data = await response.json();
      console.log("Prediction:", data); 
      setPrediction(data.prediction); 
    } catch(error){
      console.error("Error fetching Hepatitis prediction:", error);
      setPrediction("Error en la predicción"); // Manejo de errores
    }
  }

  return (
    <div>
      <h1>Selecciona un Modelo de IA</h1>
      <ul>
        {models.map((model) => (
          <li key={model.id}>
            <button onClick={() => handleModelSelection(model)}>
              {model.name}
            </button>
          </li>
        ))}
      </ul>

      {/* Mostrar el formulario si el modelo "vino" está seleccionado */}
      {selectedModel?.name === 'Modelo Calidad Vino' && (
        <form
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

          <label>
            Volatile Acidity:
            <input
              type="text"
              name="volatileAcidity"
              value={formDataWine.volatileAcidity}
              onChange={handleInputChangeWine}
              required
            />
          </label>
          <br />

          <label>
            Density:
            <input
              type="text"
              name="density"
              value={formDataWine.density}
              onChange={handleInputChangeWine}
              required
            />
          </label>
          <br />

          <label>
            Alcohol:
            <input
              type="text"
              name="alcohol"
              value={formDataWine.alcohol}
              onChange={handleInputChangeWine}
              required
            />
          </label>
          <br />

          <button type="submit">Enviar</button>
        </form>
      )}

      {selectedModel?.name === 'Modelo Precio Aguacate' && (
        <form
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

          <label>
            Total Volume:
            <input
              type="text"
              name="total_volume"
              value={formDataAvocado.total_volume}
              onChange={handleInputChangeAvocado}
              required
            />
          </label>
          <br />

          <label>
            Year:
            <input
              type="text"
              name="year"
              value={formDataAvocado.year}
              onChange={handleInputChangeAvocado}
              required
            />
          </label>
          <br />

          <label>
            Month:
            <input
              type="text"
              name="month"
              value={formDataAvocado.month}
              onChange={handleInputChangeAvocado}
              required
            />
          </label>
          <br />

          <label>
            Day:
            <input
              type="text"
              name="day"
              value={formDataAvocado.day}
              onChange={handleInputChangeAvocado}
              required
            />
          </label>
          <br />

          <label>
            Region:
            <input
              type="text"
              name="region"
              value={formDataAvocado.region}
              onChange={handleInputChangeAvocado}
              required
            />
          </label>
          <br />

          <button type="submit">Enviar</button>
        </form>
      )}

      {selectedModel?.name === 'Modelo Precio Autos' && (
        <form
        onSubmit={(e) =>{
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
          )
        }}
        >
          <h2>Modelo predicción del precio de un auto</h2>
          <label>
            Year:
            <input 
            type="text" 
            name='year'
            value={formDataCars.year}
            onChange={handleInputChangeCars}
            required
            />
          </label>
          <br />
          <label>
            Present price:
            <input 
            type="text" 
            name='presentPrice'
            value={formDataCars.presentPrice}
            onChange={handleInputChangeCars}
            required
            />
          </label>
          <br />
          <label>
            Kms driven:
            <input 
            type="text" 
            name='kms_driven'
            value={formDataCars.kms_driven}
            onChange={handleInputChangeCars}
            required
            />
          </label>
          <br />
          <label>
            Fuel Type:
            <input 
            type="text" 
            name='fuel_type'
            value={formDataCars.fuel_type}
            onChange={handleInputChangeCars}
            required
            />
          </label>
          <br />
          <label>
            Seller Type:
            <input 
            type="text" 
            name='seller_type'
            value={formDataCars.seller_type}
            onChange={handleInputChangeCars}
            required
            />
          </label>
          <br />
          <label>
            Transmission:
            <input 
            type="text" 
            name='transmission'
            value={formDataCars.transmission}
            onChange={handleInputChangeCars}
            required
            />
          </label>
          <br />
          <label>
            Owner:
            <input 
            type="text" 
            name='owner'
            value={formDataCars.owner}
            onChange={handleInputChangeCars}
            required
            />
          </label>
          <br />
          <button type='submit'>Enviar</button>
        </form>
      )}

    {selectedModel?.name === 'Modelo Predictor Hepatitis C' && (
      <form
      onSubmit={(e) =>{
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
        )
      }}
      >

        <h2>Modelo predicción de Hepatitis</h2>
         
          <label>
            ALB (Albúmina):
            <input 
            type="text" 
            name='alb'
            value={formDataHepatitis.alb}
            onChange={handleInputChangeHepatitis}
            required
            />
          </label>
          <br />
          <label>
            ALP (Fosfatasa Alcalina):
            <input 
            type="text" 
            name='alp'
            value={formDataHepatitis.alp}
            onChange={handleInputChangeHepatitis}
            required
            />
          </label>
          <br />
          <label>
            ALT (alanina aminotransferasa):
            <input 
            type="text" 
            name='alt'
            value={formDataHepatitis.alt}
            onChange={handleInputChangeHepatitis}
            required
            />
          </label>
          <br />
          <label>
            AST (Aspartato aminotransferasa):
            <input 
            type="text" 
            name='ast'
            value={formDataHepatitis.ast}
            onChange={handleInputChangeHepatitis}
            required
            />
          </label>
          <br />
          <label>
            BIL (Bilirrubina):
            <input 
            type="text" 
            name='bil'
            value={formDataHepatitis.bil}
            onChange={handleInputChangeHepatitis}
            required
            />
          </label>
          <br />
          <label>
            CHE (Colinesterasa):
            <input 
            type="text" 
            name='che'
            value={formDataHepatitis.che}
            onChange={handleInputChangeHepatitis}
            required
            />
          </label>
          <br />
          <label>
            CHOL (Colesterol):
            <input 
            type="text" 
            name='chol'
            value={formDataHepatitis.chol}
            onChange={handleInputChangeHepatitis}
            required
            />
          </label>
          <br />
          <label>
            CREA (Creatina):
            <input 
            type="text" 
            name='crea'
            value={formDataHepatitis.crea}
            onChange={handleInputChangeHepatitis}
            required
            />
          </label>
          <br />
          <label>
            GGT (gamma-glutamil):
            <input 
            type="text" 
            name='ggt'
            value={formDataHepatitis.ggt}
            onChange={handleInputChangeHepatitis}
            required
            />
          </label>
          <br />
          <label>
            PROT (Proteínas):
            <input 
            type="text" 
            name='prot'
            value={formDataHepatitis.prot}
            onChange={handleInputChangeHepatitis}
            required
            />
          </label>
          <br />
          <button type='submit'>Enviar</button>
      </form>
    )}

      {/* Mostrar la predicción para el modelo seleccionado */}
      {prediction && (
        <div>
          <h3>Predicción: {prediction}</h3>
        </div>
      )}

      
    </div>
  )
};

export default ModelSelection;
