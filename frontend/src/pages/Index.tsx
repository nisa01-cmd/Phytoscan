import { useState, useCallback } from "react";
import { Leaf, ScanLine, History, TrendingUp, Bug, Sun, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/ImageUploader";
import PredictionResult, { type PredictionData } from "@/components/PredictionResult";
import DiseaseCard from "@/components/DiseaseCard";
import StatsCard from "@/components/StatsCard";
import heroCrop from "@/assets/hero-crop.jpg";

const MOCK_RESULT: PredictionData = {
  disease: "Late Blight (Phytophthora infestans)",
  confidence: 94.7,
  severity: "high",
  crop: "Tomato",
  description:
    "Late blight is a devastating disease caused by the oomycete Phytophthora infestans. It produces dark, water-soaked lesions on leaves, stems, and fruit. The pathogen thrives in cool, wet conditions and can destroy an entire crop within days if untreated.",
  treatments: [
    "Apply copper-based fungicide immediately",
    "Remove and destroy all infected plant material",
    "Increase plant spacing for air circulation",
    "Apply chlorothalonil as a preventive spray",
  ],
  prevention: [
    "Use certified disease-free seeds and transplants",
    "Rotate crops on a 3-year cycle",
    "Avoid overhead irrigation in the evening",
    "Monitor weather forecasts for blight-favorable conditions",
  ],
};

const COMMON_DISEASES = [
  { name: "Late Blight", crop: "Tomato / Potato", severity: "high" as const, icon: "🍅" },
  { name: "Powdery Mildew", crop: "Wheat / Barley", severity: "medium" as const, icon: "🌾" },
  { name: "Leaf Rust", crop: "Wheat", severity: "medium" as const, icon: "🍂" },
  { name: "Bacterial Wilt", crop: "Tomato / Pepper", severity: "high" as const, icon: "🫑" },
  { name: "Rice Blast", crop: "Rice", severity: "high" as const, icon: "🌾" },
  { name: "Downy Mildew", crop: "Grape / Cucumber", severity: "low" as const, icon: "🍇" },
];

// same imports...

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionData | null>(null);

  
    const handleImageSelect = async (file: File) => {
  console.log("API CALL START");

  setResult(null);
  setIsAnalyzing(true);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("API RESPONSE:", data);

    setResult({
      disease: data.prediction,
      confidence: 95,
      severity: "low",
      crop: "Leaf",
      description: "Detected using AI model",
      treatments: ["Use proper fertilizer"],
      prevention: ["Maintain plant hygiene"],
    });

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
            <nav className="flex items-center gap-10 text-base">
              <span className="cursor-pointer hover:text-white">Dashboard</span>
              <span className="cursor-pointer hover:text-white">History</span>
              <span className="cursor-pointer hover:text-white">Library</span>
            </nav>

            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
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
          <StatsCard icon={ScanLine} label="Scans Today" value="127" trend="+12%" />
          <StatsCard icon={Bug} label="Diseases Found" value="38" />
          <StatsCard icon={TrendingUp} label="Accuracy Rate" value="94.3%" trend="+2.1%" />
          <StatsCard icon={History} label="Total Scans" value="4,812" />
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
