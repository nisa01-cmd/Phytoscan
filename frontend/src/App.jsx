import { useState } from "react";
import axios from "axios";

function App() {

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [topPredictions, setTopPredictions] = useState([]);
  const [gradcam, setGradcam] = useState("");

  const graphs = [
    "accuracy.png",
    "loss.png",
    "confusion_matrix.png",
    "histogram.png",
    "correlation_matrix.png"
  ];

  const remedies = {
    "Tomato Early Blight": "Remove infected leaves and apply fungicide.",
    "Tomato Late Blight": "Use copper-based sprays and avoid moisture.",
    "Potato Healthy": "No disease detected. Maintain proper care.",
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const predictImage = async () => {
    if (!image) return alert("Upload image first");

    try {
      const formData = new FormData();
      formData.append("file", image);

      const res = await axios.post("http://127.0.0.1:8000/predict", formData);

      setPrediction(res.data.prediction);
      setConfidence(res.data.confidence);
      setTopPredictions(res.data.top_predictions);
      setGradcam(res.data.gradcam_url);

    } catch (err) {
      console.error(err);
      alert("Prediction failed");
    }
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      color: "white",
      minHeight: "100vh",
      padding: "30px",
      fontFamily: "Arial"
    }}>

      <h1 style={{ textAlign: "center", fontSize: "40px" }}>
        🌿 PhytoScan
      </h1>

      <p style={{ textAlign: "center", opacity: 0.8 }}>
        AI-Powered Crop Disease Prediction
      </p>

      {/* Upload Card */}
      <div style={card}>
        <input type="file" onChange={handleImage} />

        {preview && (
          <>
            <img src={preview} style={{ width: "250px", marginTop: "15px", borderRadius: "10px" }} />
            <br />
            <button style={btn} onClick={predictImage}>Analyze</button>
          </>
        )}
      </div>

      {/* Prediction Card */}
      {prediction && (
        <div style={card}>
          <h2>{prediction}</h2>

          <p>Confidence: {(confidence * 100).toFixed(2)}%</p>

          <div style={progress}>
            <div style={{
              ...progressFill,
              width: `${confidence * 100}%`
            }} />
          </div>

          <p style={{ marginTop: "10px", fontStyle: "italic" }}>
            {remedies[prediction] || "No remedy available"}
          </p>
        </div>
      )}

      {/* Top 3 Predictions */}
      {topPredictions.length > 0 && (
        <div style={card}>
          <h3>Top Predictions</h3>

          {topPredictions.map((p, i) => (
            <div key={i} style={{ margin: "10px 0" }}>
              {p.class} — {(p.confidence * 100).toFixed(2)}%
            </div>
          ))}
        </div>
      )}

      {/* Grad-CAM */}
      {gradcam && (
        <div style={card}>
          <h3>Model Attention (Grad-CAM)</h3>
          <img src={gradcam} style={{ width: "300px", borderRadius: "10px" }} />
        </div>
      )}

      {/* Graphs */}
      <div style={{ marginTop: "40px" }}>
        <h2 style={{ textAlign: "center" }}>📊 Model Insights</h2>

        <div style={grid}>
          {graphs.map((g, i) => (
            <img
              key={i}
              src={`http://127.0.0.1:8000/models/${g}`}
              style={graph}
            />
          ))}
        </div>
      </div>

    </div>
  );
}

/* ---------------- STYLES ---------------- */

const card = {
  background: "rgba(255,255,255,0.08)",
  padding: "20px",
  borderRadius: "15px",
  margin: "20px auto",
  width: "320px",
  textAlign: "center",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
};

const btn = {
  marginTop: "10px",
  padding: "10px 20px",
  background: "#4CAF50",
  border: "none",
  color: "white",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px"
};

const progress = {
  background: "#333",
  height: "10px",
  borderRadius: "10px",
  overflow: "hidden"
};

const progressFill = {
  height: "100%",
  background: "limegreen"
};

const grid = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};

const graph = {
  width: "350px",
  margin: "10px",
  borderRadius: "10px"
};

export default App;