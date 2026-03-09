import { useState } from "react";
import { useAuth } from "@/store/use-auth";
import { useUsers } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, Plus, FileText, User } from "lucide-react";

const contractTypes = [
  { value: 'CDI', label: 'Contrat à Durée Indéterminée (CDI)' },
  { value: 'CDD', label: 'Contrat à Durée Déterminée (CDD)' },
  { value: 'Stage', label: 'Stage' },
];

const departments = [
  { value: 'IT', label: 'Informatique' },
  { value: 'HR', label: 'Ressources Humaines' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Operations', label: 'Opérations' },
];

export function RecruitmentPage() {
  const { role } = useAuth();
  const { data: users } = useUsers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contractType: 'CDI',
    proposedPosition: '',
    department: 'IT',
    salary: '',
    description: '',
  });

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

  const handleSubmit = () => {
    console.log('New recruitment request:', formData);
    setIsDialogOpen(false);
    setFormData({
      firstName: '',
      lastName: '',
      contractType: 'CDI',
      proposedPosition: '',
      department: 'IT',
      salary: '',
      description: '',
    });
  };

  const employeeList = users || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Recrutement</h1>
          <p className="text-muted-foreground mt-1">
            Gestion des employés et demandes d'ajout de nouveaux agents.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 gap-2">
              <Plus className="h-4 w-4" /> Ajouter un Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Demande d'ajout d'un nouvel agent</DialogTitle>
              <DialogDescription className="text-base font-medium">
                Remplissez le formulaire ci-dessous pour soumettre une demande d'ajout d'un nouvel agent.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Prénom</label>
                  <Input
                    placeholder="Prénom"
                    className="rounded-xl h-12 border-slate-200 focus:ring-primary/20"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Nom</label>
                  <Input
                    placeholder="Nom"
                    className="rounded-xl h-12 border-slate-200 focus:ring-primary/20"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Type de contrat</label>
                <Select value={formData.contractType} onValueChange={(value) => setFormData({ ...formData, contractType: value })}>
                  <SelectTrigger className="w-full rounded-xl h-12 border-slate-200 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contractTypes.map(ct => (
                      <SelectItem key={ct.value} value={ct.value} className="font-medium">{ct.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Poste proposé</label>
                  <Input
                    placeholder="Ex: Ingénieur Senior"
                    className="rounded-xl h-12 border-slate-200 focus:ring-primary/20"
                    value={formData.proposedPosition}
                    onChange={(e) => setFormData({ ...formData, proposedPosition: e.target.value })}
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Département</label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger className="w-full rounded-xl h-12 border-slate-200 focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept.value} value={dept.value} className="font-medium">{dept.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Salaire proposé (optionnel)</label>
                <Input
                  placeholder="Ex: 80000 DA"
                  className="rounded-xl h-12 border-slate-200 focus:ring-primary/20"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Description (optionnel)</label>
                <Textarea
                  placeholder="Détails supplémentaires sur le poste..."
                  className="min-h-[100px] rounded-xl resize-none border-slate-200 focus:ring-primary/20 p-4 font-medium"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-bold">Annuler</Button>
              <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-white rounded-xl font-bold px-8">
                Soumettre la demande
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-slate-200 rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Liste des employés
          </CardTitle>
          <CardDescription>Tous les employés actuels de l'entreprise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {employeeList.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Aucun employé trouvé</p>
              </div>
            ) : (
              employeeList.map((employee) => (
                <div key={employee.id} className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{employee.fullName}</h3>
                      <Badge variant="outline" className="flex-shrink-0 text-xs bg-blue-50 text-blue-700 border-blue-200">
                        {employee.role}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                      <p>Email: {employee.email || 'N/A'}</p>
                      <p>Service: {employee.department || 'N/A'}</p>
                      {employee.matricule && <p>Matricule: {employee.matricule}</p>}
                      {employee.hireDate && <p>Embauché: {employee.hireDate}</p>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
