import { useState } from "react";
import { useAuth } from "@/store/use-auth";
import { useMissions, useUpdateMissionReport } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { Briefcase, MapPin, Edit3, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Mission } from "@shared/schema";

export function MissionsPage() {
  const { role, user } = useAuth();
  const { data: missions } = useMissions();

  const displayMissions = missions || [];
  const visibleMissions = role === 'agent' 
    ? displayMissions.filter(m => m.userId === user.id)
    : displayMissions;

  const activeMissions = visibleMissions.filter(m => m.status === 'active');
  const missionHistory = visibleMissions.filter(m => m.status === 'completed');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Missions & Déplacements</h1>
        <p className="text-muted-foreground mt-1">
          Suivi des missions et soumission des rapports.
        </p>
      </div>

      <div className="space-y-6">
        {activeMissions.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Missions En Cours</h2>
            <div className="space-y-3">
              {activeMissions.map(mission => (
                <MissionCard key={mission.id} mission={mission} role={role} />
              ))}
            </div>
          </div>
        )}

        {missionHistory.length > 0 && (
          <div>
            {activeMissions.length > 0 && <Separator className="my-6" />}
            <h2 className="text-lg font-semibold text-foreground mb-4">Historique des Missions</h2>
            <div className="space-y-3">
              {missionHistory.map(mission => (
                <MissionCard key={mission.id} mission={mission} role={role} />
              ))}
            </div>
          </div>
        )}

        {activeMissions.length === 0 && missionHistory.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune mission pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MissionCard({ mission, role }: { mission: Mission, role: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reportText, setReportText] = useState(mission.reportText || '');
  const { mutate, isPending } = useUpdateMissionReport();

  const handleSubmit = () => {
    mutate({ id: mission.id, reportText }, {
      onSuccess: () => setIsOpen(false)
    });
  };

  return (
    <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${mission.status === 'active' ? 'bg-primary/10' : 'bg-green-100'}`}>
        <Briefcase className={`h-5 w-5 ${mission.status === 'active' ? 'text-primary' : 'text-green-600'}`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-slate-900 truncate">{mission.title}</h3>
          <Badge variant="outline" className={`flex-shrink-0 text-xs ${mission.status === 'active' ? 'bg-primary/10 text-primary border-primary/30' : 'bg-green-50 text-green-700 border-green-200'}`}>
            {mission.status === 'active' ? 'En cours' : 'Terminée'}
          </Badge>
        </div>
        <p className="text-sm text-slate-600 mb-2">{mission.description}</p>
        
        {mission.reportText && (
          <p className="text-xs text-slate-500 italic mb-3">Rapport: {mission.reportText.substring(0, 60)}...</p>
        )}
      </div>
    </div>
  );
}

