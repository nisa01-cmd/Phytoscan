import { useState } from "react";
import { ScanLine, History, TrendingUp, Bug, Sun, BarChart3 } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import PredictionResult, { type PredictionData } from "@/components/PredictionResult";
import DiseaseCard from "@/components/DiseaseCard";
import StatsCard from "@/components/StatsCard";
import heroCrop from "@/assets/hero-crop.jpg";
import { diseaseInfo } from "@/data/diseaseInfo";

const COMMON_DISEASES = [
  {
    name: "Late Blight",
    crop: "Tomato / Potato",
    severity: "high" as const,
    icon: "🍅",
    cause: "Fungal infection",
    treatment: "Apply fungicide, remove infected leaves",
  },
  {
    name: "Powdery Mildew",
    crop: "Wheat / Barley",
    severity: "medium" as const,
    icon: "🌾",
    cause: "Fungal infection",
    treatment: "Use sulfur-based fungicide",
  },
  {
    name: "Leaf Rust",
    crop: "Wheat",
    severity: "medium" as const,
    icon: "🍂",
    cause: "Fungal infection",
    treatment: "Apply rust-resistant fungicide",
  },
  {
    name: "Bacterial Wilt",
    crop: "Tomato / Pepper",
    severity: "high" as const,
    icon: "🫑",
    cause: "Bacterial infection",
    treatment: "Remove infected plants, disinfect soil",
  },
  {
    name: "Rice Blast",
    crop: "Rice",
    severity: "high" as const,
    icon: "🌾",
    cause: "Fungal infection",
    treatment: "Use systemic fungicide",
  },
  {
    name: "Downy Mildew",
    crop: "Grape / Cucumber",
    severity: "low" as const,
    icon: "🍇",
    cause: "Oomycete pathogen",
    treatment: "Improve airflow, apply fungicide",
  },
];

// same imports...

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionData | null>(null);
  
  const formatKey = (name: string) => {
  return name.replace(/ /g, "_").replace(/__/g, "__");
};

  // ✅ ADD THIS
  const [stats, setStats] = useState({
    scansToday: 0,
    diseasesFound: 0,
    accuracy: 0,
    totalScans: 0,
  });
  
  const normalizeKey = (name: string) => {
  const clean = name.toLowerCase().replace(/\s+/g, " ").trim();

  const map: any = {
    "pepper bell healthy": "Pepper_bell__healthy",
    "pepper bell bacterial spot": "Pepper_bell__Bacterial_spot",

    "potato early blight": "Potato_Early_blight",
    "potato late blight": "Potato_Late_blight",
    "potato healthy": "Potato_healthy",

    "tomato early blight": "Tomato_Early_blight",
    "tomato late blight": "Tomato_Late_blight",
    "tomato bacterial spot": "Tomato_Bacterial_spot",
    "tomato leaf mold": "Tomato_Leaf_Mold",
    "tomato septoria leaf spot": "Tomato_Septoria_leaf_spot",
    "tomato spider mites two spotted spider mite":
      "Tomato_Spider_mites_Two_spotted_spider_mite",
    "tomato target spot": "Tomato_Target_Spot",
    "tomato tomato mosaic virus": "Tomato_Tomato_mosaic_virus",
    "tomato mosaic virus": "Tomato_Tomato_mosaic_virus",
    "tomato yellow leaf curl virus":
      "Tomato_Tomato_YellowLeaf_Curl_Virus",
    "tomato healthy": "Tomato_healthy",
  };

  return map[clean] || name.replace(/ /g, "_");
};

    const handleImageSelect = async (file: File) => {
  console.log("API CALL START");

  setResult(null);
  setIsAnalyzing(true);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("https://phytoscan-1.onrender.com/predict", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("API RESPONSE:", data);

    // ✅ FIXED: correct data mapping (NO status dependency)
      const key = normalizeKey(data.prediction); // basic mapping

      const info =
        diseaseInfo[key] ||
        diseaseInfo[key.toLowerCase()] ||
        {
          treatment: ["No treatment data available"],
          prevention: ["No prevention data available"],
          };
          
      setResult({
        disease: data.prediction,
        confidence: Number((data.confidence * 100).toFixed(2)),
        severity: "medium",
        crop: "Leaf",
        description: "Detected using AI model",

        // ✅ dynamic values
        treatments: info.treatment,
        prevention: info.prevention,

        top_predictions: data.top_predictions,
      });

      // ✅ FIXED: stats logic (no status)
      setStats(prev => ({
        scansToday: prev.scansToday + 1,
        totalScans: prev.totalScans + 1,
        diseasesFound: prev.diseasesFound + 1,
        accuracy: Number((data.confidence * 100).toFixed(1)),
      }));

    } catch (err) {
      console.error("ERROR:", err);
    }

    setIsAnalyzing(false);
  };


  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14 px-4 gap-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/logo.png" className="h-16 w-16 object-contain mt-1" />
            </div>
            <span className="font-bold text-lg tracking-tight">PhytoScan</span>
          </div>

          <div className="flex justify-between items-center">
            <nav />

            <button
              onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}
              className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all text-white px-4 py-2 rounded-lg"
            >
              New Scan
            </button>
          </div>

        </div> 
      </header>

      {/* Hero Banner */}
      <section className="relative h-48 sm:h-56 overflow-hidden">
        <img
          src={heroCrop}
          alt="Lush crop field at sunrise"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 container">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
            Crop Disease Prediction
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-lg">
            Upload a photo of your crop and get instant AI-powered disease prediction with treatment recommendations.
          </p>
        </div>
      </section>

      {/* Stats Row */}
      <section className="container px-4 -mt-1 pt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 fade-in-up">
          <StatsCard icon={ScanLine} label="Scans Today" value={stats.scansToday.toString()} />
          <StatsCard icon={Bug} label="Diseases Found" value={stats.diseasesFound.toString()} />
          <StatsCard icon={TrendingUp} label="Accuracy Rate" value={`${stats.accuracy}%`} />
          <StatsCard icon={History} label="Total Scans" value={stats.totalScans.toString()} />
        </div>
      </section>

      {/* Main Content */}
      <main className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Upload + Result */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <ScanLine className="h-5 w-5 text-primary" />
                Analyze Crop Image
              </h2>
              <ImageUploader
                onImageSelect={handleImageSelect}
                isAnalyzing={isAnalyzing}
              />
            </div>

            {result && (
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Analysis Results
                </h2>
                <PredictionResult result={result} />
              </div>
            )}
          </div>

          {/* Right: Common Diseases */}
          <aside className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Bug className="h-5 w-5 text-crop-warning" />
              Common Diseases
            </h2>
            <div className="space-y-2">
              {COMMON_DISEASES.map((d, i) => (
                <div key={d.name} className={`fade-in-up stagger-${Math.min(i + 1, 4)}`}>
                  <DiseaseCard {...d} />
                </div>
              ))}
            </div>

            {/* Quick Tips */}
            <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Sun className="h-4 w-4 text-crop-sun" />
                Quick Tips
              </h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>📸 Photograph the affected leaf up close in natural light</li>
                <li>🔍 Include both healthy and diseased parts for comparison</li>
                <li>💧 Avoid taking photos when leaves are wet</li>
                <li>🌿 Capture images from multiple angles for better accuracy</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-6 mt-8">
        <div className="container px-4 flex items-center justify-between text-xs text-muted-foreground">
          <p>© 2026 PhytoScan · AI-Powered Crop Disease Prediction</p>
          <p>Powered by deep learning</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
