import { useState } from "react";
import axios from "axios";

function App() {

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState("");

  const handleImage = (e) => {

    const file = e.target.files[0];

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const predictImage = async () => {

    const formData = new FormData();
    formData.append("file", image);

    const response = await axios.post(
      "http://127.0.0.1:8000/predict",
      formData
    );

    setPrediction(response.data.prediction);
  };

  return (
    <div style={{textAlign:"center",padding:"40px"}}>

      <h1>🌿 PhytoScan</h1>
      <p>AI Fruit & Vegetable Disease Detection</p>

      <input type="file" onChange={handleImage} />

      {preview && (
        <div>
          <img
            src={preview}
            alt="preview"
            style={{width:"300px",marginTop:"20px"}}
          />

          <br/>

          <button onClick={predictImage}>
            Analyze Image
          </button>
        </div>
      )}

      {prediction && (
        <h2>Prediction: {prediction}</h2>
      )}

    </div>
  );
}

export default App;