import { AlertTriangle, CheckCircle2, Info, Leaf, Droplets, Sun, Bug } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface PredictionData {
  disease: string;
  confidence: number;
  severity: "low" | "medium" | "high";
  crop: string;
  description: string;
  treatments: string[];
  prevention: string[];
}

interface PredictionResultProps {
  result: PredictionData;
}

const severityConfig = {
  low: { icon: CheckCircle2, label: "Low Severity", class: "disease-severity-low" },
  medium: { icon: AlertTriangle, label: "Medium Severity", class: "disease-severity-medium" },
  high: { icon: AlertTriangle, label: "High Severity", class: "disease-severity-high" },
};

const PredictionResult = ({ result }: PredictionResultProps) => {
  const severity = severityConfig[result.severity];
  const SeverityIcon = severity.icon;

  return (
    <div className="space-y-4 fade-in-up">
      {/* Main result */}
      <Card className="shadow-md border-primary/10 overflow-hidden">
        <div className="h-1.5 bg-primary" />
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Detected Disease
              </p>
              <CardTitle className="text-xl">{result.disease}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Crop: {result.crop}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-primary tabular-nums">
                {result.confidence}%
              </div>
              <p className="text-xs text-muted-foreground">Confidence</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Badge
            variant="outline"
            className={`${severity.class} gap-1.5 px-3 py-1 text-xs font-medium border`}
          >
            <SeverityIcon className="h-3.5 w-3.5" />
            {severity.label}
          </Badge>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {result.description}
          </p>

          {/* Confidence bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Detection confidence</span>
              <span className="tabular-nums">{result.confidence}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Treatments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="shadow-sm stagger-1 fade-in-up">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Droplets className="h-4 w-4 text-primary" />
              Recommended Treatment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.treatments.map((t, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {t}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm stagger-2 fade-in-up">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Leaf className="h-4 w-4 text-crop-healthy" />
              Prevention Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.prevention.map((p, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-crop-healthy mt-0.5">•</span>
                  {p}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PredictionResult;
