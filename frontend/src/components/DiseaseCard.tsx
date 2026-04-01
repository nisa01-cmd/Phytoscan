import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface DiseaseCardProps {
  name: string;
  crop: string;
  severity: "low" | "medium" | "high";
  icon: string;

  // ✅ ADD THESE
  cause?: string;
  treatment?: string;
}

const severityColors = {
  low: "bg-crop-healthy/10 text-crop-healthy",
  medium: "bg-crop-warning/10 text-crop-warning",
  high: "bg-crop-danger/10 text-crop-danger",
};

const DiseaseCard = ({ name, crop, severity, icon, cause, treatment }: DiseaseCardProps) => {
  const [open, setOpen] = useState(false); // ✅ state added

  return (
    <Card
      onClick={() => setOpen(!open)} // ✅ toggle
      className="shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group active:scale-[0.97]"
    >
      <CardContent className="p-4">
        {/* TOP ROW (unchanged layout) */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
              {name}
            </p>
            <p className="text-xs text-muted-foreground">{crop}</p>
            
          </div>

          <Badge
            variant="outline"
            className={`${severityColors[severity]} text-[10px] border-0 shrink-0`}
          >
            {severity}
          </Badge>
        </div>

        {/* 🔥 DROPDOWN SECTION */}
        {open && (
          <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground space-y-1 animate-fade-in">
            {cause && <p><b>Cause:</b> {cause}</p>}
            {treatment && <p><b>Treatment:</b> {treatment}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiseaseCard;
