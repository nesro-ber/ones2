import { useAuth } from "@/store/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Palmtree, Clock, Calendar, History, Info } from "lucide-react";
import { useRequests } from "@/hooks/use-api";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export function LeavesPage() {
  const { user } = useAuth();
  const { data: requests } = useRequests();
  const leaveRequests = requests?.filter(r => r.type === 'leave') || [];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Gestion des Congés</h1>
        <p className="text-muted-foreground text-lg">Consultez votre solde et l'historique de vos absences.</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-3"
      >
        <motion.div variants={item}>
          <Card className="enterprise-shadow rounded-2xl border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Solde Disponible</CardTitle>
              <Palmtree className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{user.leaveBalance} Jours</div>
              <p className="text-xs text-muted-foreground">Période en cours</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="enterprise-shadow rounded-2xl border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Jours Utilisés</CardTitle>
              <History className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{user.usedLeaves} Jours</div>
              <p className="text-xs text-muted-foreground">Depuis le 1er Janvier</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="enterprise-shadow rounded-2xl border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {leaveRequests.filter(r => r.status === 'pending').length} Demandes
              </div>
              <p className="text-xs text-muted-foreground">En cours de validation</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <Card className="enterprise-shadow rounded-2xl border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Historique des Congés
          </CardTitle>
          <CardDescription>Liste de vos demandes de congés passées et actuelles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 rounded-lg">
                <tr>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold">Date Demande</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaveRequests.map((req) => (
                  <tr key={req.id} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{req.description}</td>
                    <td className="px-6 py-4">{format(new Date(req.createdAt!), 'dd MMMM yyyy', { locale: fr })}</td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        req.status === 'approved' ? 'default' : 
                        req.status === 'rejected' ? 'destructive' : 'secondary'
                      } className="rounded-full px-3">
                        {req.status === 'approved' ? 'Validé' : 
                         req.status === 'rejected' ? 'Refusé' : 'En attente'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-primary hover:underline font-medium">Détails</button>
                    </td>
                  </tr>
                ))}
                {leaveRequests.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Info className="h-8 w-8 text-slate-200" />
                        <p className="text-slate-400">Aucun historique de congés trouvé</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
