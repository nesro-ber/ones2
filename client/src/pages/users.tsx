import { useAuth } from "@/store/use-auth";
import { useUsers } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCog, Mail, Briefcase } from "lucide-react";
import type { User } from "@shared/schema";

export function UsersPage() {
  const { role } = useAuth();
  const { data: users, isLoading } = useUsers();

  if (role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">Accès Refusé</h2>
          <p className="text-slate-500">Seul l'administrateur peut accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const mockUsers: User[] = [
    { id: 1, username: 'a.benali', password: '***', role: 'agent', fullName: 'Ahmed Benali', department: 'Département IT' },
    { id: 2, username: 'k.safir', password: '***', role: 'manager', fullName: 'Karim Safir', department: 'Département IT' },
    { id: 3, username: 's.djeffal', password: '***', role: 'hr', fullName: 'Samira Djeffal', department: 'Ressources Humaines' },
  ];

  const displayUsers = users?.length ? users : mockUsers;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Gestion des Employés</h1>
        <p className="text-muted-foreground mt-1">
          Annuaire du personnel et gestion des accès au portail.
        </p>
      </div>

      <Card className="enterprise-shadow border-none rounded-2xl">
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
          <CardDescription>Employés enregistrés dans le système</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border overflow-hidden">
            <div className="grid grid-cols-12 bg-slate-50 p-4 border-b text-sm font-semibold text-slate-600">
              <div className="col-span-4">Employé</div>
              <div className="col-span-3">Département</div>
              <div className="col-span-3">Nom d'utilisateur</div>
              <div className="col-span-2">Rôle</div>
            </div>
            <div className="divide-y">
              {displayUsers.map(u => (
                <div key={u.id} className="grid grid-cols-12 p-4 items-center bg-white hover:bg-slate-50 transition-colors">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center font-bold text-slate-600">
                      {u.fullName.charAt(0)}
                    </div>
                    <span className="font-medium text-slate-900">{u.fullName}</span>
                  </div>
                  <div className="col-span-3 flex items-center gap-2 text-sm text-slate-600">
                    <Briefcase className="h-4 w-4 text-slate-400" /> {u.department || 'N/A'}
                  </div>
                  <div className="col-span-3 flex items-center gap-2 text-sm text-slate-600">
                    <UserCog className="h-4 w-4 text-slate-400" /> {u.username}
                  </div>
                  <div className="col-span-2">
                    <Badge variant="secondary" className="capitalize rounded-lg bg-slate-100 text-slate-700">
                      {u.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
