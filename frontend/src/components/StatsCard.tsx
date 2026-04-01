import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
}

const StatsCard = ({ icon: Icon, label, value, trend }: StatsCardProps) => (
  <Card className="shadow-sm hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer">
    <CardContent className="p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="flex items-baseline gap-1.5">
          <p className="text-lg font-bold tabular-nums">{value}</p>
          {trend && (
            <span className="text-xs text-crop-healthy font-medium">{trend}</span>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default StatsCard;
