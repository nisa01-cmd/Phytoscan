import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DiseaseCardProps {
  name: string;
  crop: string;
  severity: "low" | "medium" | "high";
  icon: string;
}

const severityColors = {
  low: "bg-crop-healthy/10 text-crop-healthy",
  medium: "bg-crop-warning/10 text-crop-warning",
  high: "bg-crop-danger/10 text-crop-danger",
};

const DiseaseCard = ({ name, crop, severity, icon }: DiseaseCardProps) => (
  <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group active:scale-[0.97]">
    <CardContent className="p-4 flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
          {name}
        </p>
        <p className="text-xs text-muted-foreground">{crop}</p>
      </div>
      <Badge variant="outline" className={`${severityColors[severity]} text-[10px] border-0 shrink-0`}>
        {severity}
      </Badge>
    </CardContent>
  </Card>
);

export default DiseaseCard;
