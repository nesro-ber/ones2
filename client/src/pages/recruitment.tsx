import { useAuth } from "@/store/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileUser, ExternalLink } from "lucide-react";

export function RecruitmentPage() {
  const { role } = useAuth();

  if (role !== 'hr' && role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">Accès Refusé</h2>
          <p className="text-slate-500">Seul le département RH peut accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Recrutement</h1>
        <p className="text-muted-foreground mt-1">
          Gestion des offres d'emploi et suivi des candidats (Mockup).
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="enterprise-shadow border-none rounded-2xl">
          <CardHeader className="pb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <FileUser className="h-6 w-6" />
            </div>
            <CardTitle>Ingénieur Forage Senior</CardTitle>
            <CardDescription>Ouvert il y a 3 jours • Hassi Messaoud</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm font-medium text-slate-600">
                12 Candidatures reçues
              </div>
              <Button variant="outline" className="rounded-xl">Voir Candidats</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="enterprise-shadow border-none rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border-dashed border-2 border-slate-200 flex flex-col items-center justify-center p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="font-semibold text-lg text-slate-700">Nouvelle Offre</h3>
          <p className="text-sm text-slate-500 mt-1">Créer et publier une nouvelle annonce sur le portail</p>
        </Card>
      </div>
    </div>
  );
}
