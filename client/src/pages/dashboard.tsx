import { useAuth } from "@/store/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Briefcase, Clock, CheckCircle2, Palmtree, AlertCircle, FileText } from "lucide-react";
import { useRequests, useMissions, useUsers, useNotifications } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function Dashboard() {
  const { role, user } = useAuth();
  
  const { data: requests, isLoading: loadingReqs } = useRequests();
  const { data: missions, isLoading: loadingMissions } = useMissions();
  const { data: usersData, isLoading: loadingUsers } = useUsers();
  const { data: notifications } = useNotifications();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const getStats = () => {
    if (role === 'agent') {
      return [
        {
          title: "Solde de Congés",
          value: `${user.leaveBalance} jours`,
          icon: Palmtree,
          trend: `${user.usedLeaves} jours utilisés`,
          loading: false,
          color: "bg-green-50 text-green-600"
        },
        {
          title: "Demandes Validées",
          value: requests?.filter(r => r.status === 'approved').length || 0,
          icon: CheckCircle2,
          trend: "Dernière il y a 2j",
          loading: loadingReqs,
          color: "bg-blue-50 text-blue-600"
        },
        {
          title: "Demandes en attente",
          value: requests?.filter(r => r.status === 'pending').length || 0,
          icon: Clock,
          trend: "En cours de traitement",
          loading: loadingReqs,
          color: "bg-orange-50 text-orange-600"
        },
        {
          title: "Mission Active",
          value: missions?.filter(m => m.status === 'active').length || 0,
          icon: Briefcase,
          trend: "1 mission terrain",
          loading: loadingMissions,
          color: "bg-primary/10 text-primary"
        }
      ];
    }
    
    return [
      {
        title: role === 'admin' ? "Total Employés" : "Demandes en cours",
        value: role === 'admin' ? (usersData?.length || 0) : (requests?.filter(r => r.status === 'pending').length || 0),
        icon: role === 'admin' ? Users : Clock,
        trend: "+12% ce mois",
        loading: role === 'admin' ? loadingUsers : loadingReqs,
        color: "bg-blue-50 text-blue-600"
      },
      {
        title: "Missions Globales",
        value: missions?.length || 0,
        icon: Briefcase,
        trend: "Stable",
        loading: loadingMissions,
        color: "bg-orange-50 text-primary"
      },
      {
        title: "Demandes Approuvées",
        value: requests?.filter(r => r.status === 'approved').length || 0,
        icon: CheckCircle2,
        trend: "+5% ce mois",
        loading: loadingReqs,
        color: "bg-green-50 text-green-600"
      },
      {
        title: "Notifications",
        value: notifications?.length || 0,
        icon: AlertCircle,
        trend: "Alertes système",
        loading: false,
        color: "bg-purple-50 text-purple-600"
      }
    ];
  };

  const stats = getStats();

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Bonjour, {user.fullName}</h1>
        <p className="text-muted-foreground text-lg">Voici un aperçu de votre espace RH aujourd'hui.</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, idx) => (
          <motion.div key={idx} variants={item}>
            <MetricCard 
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              loading={stat.loading}
              color={stat.color}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 enterprise-shadow rounded-2xl border-none">
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>Vos dernières actions sur le portail</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {requests?.slice(0, 3).map((req) => (
                <div key={req.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${req.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Demande de {req.type === 'leave' ? 'congé' : 'document'}</p>
                    <p className="text-sm text-muted-foreground">Status: <span className="capitalize">{req.status}</span> - {req.description}</p>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(req.createdAt!), { addSuffix: true, locale: fr })}
                  </div>
                </div>
              ))}
              {(!requests || requests.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">Aucune activité récente</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 enterprise-shadow rounded-2xl border-none bg-gradient-to-br from-[#FF6600] to-[#FF8533] text-white">
          <CardHeader>
            <CardTitle className="text-white">Notifications Récentes</CardTitle>
            <CardDescription className="text-white/80">Alertes et mises à jour</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications?.slice(0, 2).map((n) => (
              <div key={n.id} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                <h4 className="font-semibold mb-1">Mise à jour</h4>
                <p className="text-sm text-white/90">{n.message}</p>
              </div>
            ))}
            {(!notifications || notifications.length === 0) && (
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                <p className="text-sm text-white/90">Aucune notification récente</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, trend, loading, color }: any) {
  return (
    <Card className="enterprise-shadow rounded-2xl border-none overflow-hidden group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
          )}
          <span className="text-xs text-muted-foreground font-medium">{trend}</span>
        </div>
      </CardContent>
    </Card>
  );
}
