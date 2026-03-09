import { useState } from "react";
import { useAuth } from "@/store/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, FileText, Calendar, Heart, Droplet, Building2, Edit2, Lock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const correctionFields = [
  { value: 'firstName', label: 'Prénom' },
  { value: 'lastName', label: 'Nom de famille' },
  { value: 'email', label: 'Email' },
  { value: 'hireDate', label: "Date d'embauche" },
  { value: 'familialStatus', label: 'Situation familiale' },
  { value: 'bloodType', label: 'Type de sang' },
];

export function ProfilePage() {
  const { user } = useAuth();
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [selectedField, setSelectedField] = useState('');
  const [newValue, setNewValue] = useState('');

  const userInfo = {
    nom: user.fullName?.split(' ').slice(1).join(' ') || 'N/A',
    prenom: user.fullName?.split(' ')[0] || 'N/A',
    matricule: 'AG001',
    email: 'ahmed.benali@sonatrach.dz',
    dateEmbauche: '15 janvier 2020',
    situationFamiliale: 'Marié(e)',
    typeSang: 'O+',
    service: user.department || 'N/A',
  };

  const handleCorrectionSubmit = () => {
    if (selectedField && newValue) {
      console.log('Correction request:', { field: selectedField, newValue });
      setCorrectionOpen(false);
      setSelectedField('');
      setNewValue('');
    }
  };

  const handlePasswordSubmit = () => {
    console.log('Password change request submitted');
    setPasswordOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Mon Profil</h1>
        <p className="text-muted-foreground mt-1">
          Consultez et gérez vos informations personnelles.
        </p>
      </div>

      <Card className="border-slate-200 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Informations Personnelles</CardTitle>
          <CardDescription>Vos détails professionnels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-slate-400 mt-1" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Prénom</p>
                <p className="text-lg font-semibold text-slate-900">{userInfo.prenom}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-slate-400 mt-1" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nom</p>
                <p className="text-lg font-semibold text-slate-900">{userInfo.nom}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-slate-400 mt-1" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Matricule</p>
                <p className="text-lg font-semibold text-slate-900">{userInfo.matricule}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-slate-400 mt-1" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</p>
                <p className="text-lg font-semibold text-slate-900">{userInfo.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-slate-400 mt-1" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Date d'embauche</p>
                <p className="text-lg font-semibold text-slate-900">{userInfo.dateEmbauche}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-slate-400 mt-1" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Situation familiale</p>
                <p className="text-lg font-semibold text-slate-900">{userInfo.situationFamiliale}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Droplet className="h-5 w-5 text-slate-400 mt-1" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Type de sang</p>
                <p className="text-lg font-semibold text-slate-900">{userInfo.typeSang}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-slate-400 mt-1" />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Service</p>
                <p className="text-lg font-semibold text-slate-900">{userInfo.service}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-slate-200 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit2 className="h-5 w-5" /> Correction d'informations
            </CardTitle>
            <CardDescription>Demander une correction de vos informations</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={correctionOpen} onOpenChange={setCorrectionOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold">
                  <Edit2 className="h-4 w-4 mr-2" /> Faire une demande
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Demande de Correction</DialogTitle>
                  <DialogDescription>
                    Sélectionnez le champ à corriger et entrez la nouvelle valeur.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-5 py-4">
                  <div className="space-y-2.5">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Champ à corriger</label>
                    <Select value={selectedField} onValueChange={setSelectedField}>
                      <SelectTrigger className="w-full rounded-xl h-12 border-slate-200 focus:ring-primary/20">
                        <SelectValue placeholder="Sélectionnez un champ" />
                      </SelectTrigger>
                      <SelectContent>
                        {correctionFields.map(field => (
                          <SelectItem key={field.value} value={field.value} className="font-medium">
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Nouvelle valeur</label>
                    <Textarea 
                      placeholder="Entrez la nouvelle valeur..."
                      className="min-h-[100px] rounded-xl resize-none border-slate-200 focus:ring-primary/20 p-4 font-medium"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setCorrectionOpen(false)} className="rounded-xl">Annuler</Button>
                  <Button onClick={handleCorrectionSubmit} className="bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold">
                    Soumettre
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="border-slate-200 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" /> Changement de mot de passe
            </CardTitle>
            <CardDescription>Demander un changement de mot de passe</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold">
                  <Lock className="h-4 w-4 mr-2" /> Faire une demande
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Demande de Changement de Mot de Passe</DialogTitle>
                  <DialogDescription>
                    L'administrateur devra approuver votre demande de changement de mot de passe.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-900">
                      Une demande de changement de mot de passe sera envoyée à l'administrateur. Vous serez notifié une fois la demande traitée.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setPasswordOpen(false)} className="rounded-xl">Annuler</Button>
                  <Button onClick={handlePasswordSubmit} className="bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold">
                    Confirmer la demande
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
