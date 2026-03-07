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
  const { data: missions, isLoading } = useMissions();

  const mockMissions: Mission[] = [
    { id: 1, userId: 1, title: 'Inspection Site Hassi Messaoud', description: 'Vérification annuelle des équipements de forage.', status: 'active', reportText: null, createdAt: new Date() },
    { id: 2, userId: 1, title: 'Réunion Partenaires Alger', description: 'Négociation des contrats Q4.', status: 'completed', reportText: 'Contrats signés avec succès. Détails joints dans le drive.', createdAt: new Date(Date.now() - 500000000) },
  ];

  const displayMissions = missions?.length ? missions : mockMissions;
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
          Suivi des missions sur sites et soumission des rapports.
        </p>
      </div>

      {role === 'agent' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Missions En Cours</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeMissions.length ? (
                activeMissions.map(mission => (
                  <MissionCard key={mission.id} mission={mission} role={role} />
                ))
              ) : (
                <p className="text-muted-foreground col-span-full">Aucune mission en cours.</p>
              )}
            </div>
          </div>

          {missionHistory.length > 0 && (
            <div>
              <Separator className="my-6" />
              <h2 className="text-lg font-semibold text-foreground mb-4">Historique des Missions</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {missionHistory.map(mission => (
                  <MissionCard key={mission.id} mission={mission} role={role} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {role !== 'agent' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleMissions.map(mission => (
            <MissionCard key={mission.id} mission={mission} role={role} />
          ))}
        </div>
      )}
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
    <Card className="enterprise-shadow rounded-2xl overflow-hidden flex flex-col hover:border-primary/30 transition-colors">
      <div className={`h-2 w-full ${mission.status === 'active' ? 'bg-primary' : 'bg-green-500'}`} />
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className={`${mission.status === 'active' ? 'text-primary border-primary/30' : 'text-green-600 border-green-200 bg-green-50'}`}>
            {mission.status === 'active' ? 'En cours' : 'Terminée'}
          </Badge>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardTitle className="text-xl leading-tight">{mission.title}</CardTitle>
        <CardDescription className="line-clamp-2">{mission.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto pt-0 space-y-4">
        {mission.reportText ? (
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm text-slate-700">
            <p className="font-semibold text-xs text-slate-500 mb-1 uppercase tracking-wider">Rapport Soumis</p>
            <p className="line-clamp-3 italic">"{mission.reportText}"</p>
          </div>
        ) : (
          <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100/50 text-sm text-slate-600 flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-primary" /> Aucun rapport soumis
          </div>
        )}

        {(role === 'agent' || role === 'manager') && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant={mission.status === 'active' ? "default" : "outline"} className="w-full rounded-xl mt-2">
                {mission.reportText ? "Modifier le rapport" : "Rédiger le rapport"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-2xl">
              <DialogHeader>
                <DialogTitle>Rapport de Mission</DialogTitle>
                <DialogDescription>
                  {mission.title}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Textarea 
                  placeholder="Décrivez les résultats de votre mission..."
                  className="min-h-[150px] rounded-xl resize-none"
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl">Annuler</Button>
                <Button onClick={handleSubmit} disabled={isPending || !reportText} className="bg-primary rounded-xl">
                  {isPending ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}

