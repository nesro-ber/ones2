import { useState } from "react";
import { useAuth } from "@/store/use-auth";
import { useRequests, useCreateRequest, useUpdateRequestStatus } from "@/hooks/use-api";
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
import { FileText, Plus, Check, X, Clock, CalendarIcon, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Request } from "@shared/schema";

const STEPS = [
  { id: 'submitted', label: 'Soumise', color: 'bg-blue-500' },
  { id: 'validated_manager', label: 'Validée par Responsable', color: 'bg-indigo-500' },
  { id: 'approved_hr', label: 'Approuvée RH', color: 'bg-emerald-500' },
  { id: 'completed', label: 'Complétée', color: 'bg-slate-500' },
];

export function RequestsPage() {
  const { role, user } = useAuth();
  const { data: requests, isLoading } = useRequests();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const displayRequests = requests || [];
  
  const visibleRequests = role === 'agent' 
    ? displayRequests.filter(r => r.userId === user.id)
    : displayRequests;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Demandes & Documents</h1>
          <p className="text-muted-foreground mt-1">
            {role === 'agent' ? "Gérez vos demandes et absences." : "Validation et traitement des demandes."}
          </p>
        </div>

        {role === 'agent' && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 gap-2">
                <Plus className="h-4 w-4" /> Nouvelle Demande
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-2xl">
              <CreateRequestForm onSuccess={() => setIsCreateOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="enterprise-shadow border-none rounded-2xl">
        <CardHeader>
          <CardTitle>Historique des demandes</CardTitle>
          <CardDescription>Suivez l'état d'avancement de vos demandes à travers les 4 étapes de validation.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground text-sm font-medium animate-pulse">Chargement des données...</div>
            ) : visibleRequests.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center">
                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Aucune demande</h3>
                <p className="text-slate-500">Vous n'avez aucune demande pour le moment.</p>
              </div>
            ) : (
              visibleRequests.map((req) => (
                <RequestItem key={req.id} request={req} role={role} />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RequestItem({ request, role }: { request: Request, role: string }) {
  const { mutate: updateStatus, isPending } = useUpdateRequestStatus();
  
  const currentStepIndex = STEPS.findIndex(s => s.id === request.status);
  const isRejected = request.status === 'rejected';

  const getIcon = (type: string) => {
    return type === 'leave' ? <CalendarIcon className="h-5 w-5 text-blue-500" /> : <FileText className="h-5 w-5 text-purple-500" />;
  };

  const handleAction = (newStatus: string) => {
    updateStatus({ id: request.id, status: newStatus });
  };

  const handleReject = () => {
    const reason = window.prompt("Motif du refus ?");
    if (reason) updateStatus({ id: request.id, status: 'rejected', reason });
  };

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl border border-slate-100 bg-white hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:scale-110 transition-transform duration-300">
          {getIcon(request.type)}
        </div>
        
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-bold text-slate-900 capitalize text-lg">
              {request.type === 'leave' ? 'Demande de Congé' : 'Demande de Document'}
            </h4>
            {isRejected && <Badge variant="destructive" className="rounded-full px-3 py-1 font-bold">Refusée</Badge>}
            {!isRejected && request.status === 'completed' && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none rounded-full px-3 py-1 font-bold">Terminée</Badge>}
          </div>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">{request.description}</p>
          <div className="flex items-center gap-4 text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {request.createdAt ? format(new Date(request.createdAt), 'dd MMM yyyy', { locale: fr }) : 'Récent'}</span>
            {role !== 'agent' && <span className="text-slate-500">Employé ID: {request.userId}</span>}
          </div>
        </div>

        {((role === 'manager' && request.status === 'submitted') || 
          (role === 'hr' && request.status === 'validated_manager')) && !isRejected && (
          <div className="flex items-center gap-2 shrink-0 self-center">
            <Button 
              size="sm" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold px-4"
              onClick={() => handleAction(role === 'manager' ? 'validated_manager' : 'approved_hr')}
              disabled={isPending}
            >
              <Check className="h-4 w-4 mr-1.5" /> {role === 'manager' ? 'Valider' : 'Approuver'}
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-xl font-bold px-4"
              onClick={handleReject}
              disabled={isPending}
            >
              <X className="h-4 w-4 mr-1.5" /> Refuser
            </Button>
          </div>
        )}

        {role === 'hr' && request.status === 'approved_hr' && (
          <Button 
            size="sm" 
            className="bg-slate-700 hover:bg-slate-800 text-white rounded-xl font-bold px-4 self-center"
            onClick={() => handleAction('completed')}
            disabled={isPending}
          >
            <Check className="h-4 w-4 mr-1.5" /> Marquer comme complétée
          </Button>
        )}
      </div>

      {!isRejected && (
        <div className="pt-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Étape actuelle: {currentStepIndex >= 0 ? STEPS[currentStepIndex].label : 'Inconnu'}</span>
            <span className="text-xs font-bold text-primary">{currentStepIndex + 1} / 4</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {STEPS.map((step, index) => {
              const isPast = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <div key={step.id} className="flex-1 flex items-center gap-1 sm:gap-2">
                  <div className="relative flex-1">
                    <div className={`h-2 w-full rounded-full transition-colors duration-500 ${isPast || isCurrent ? step.color : 'bg-slate-100'}`} />
                    {isCurrent && (
                      <div className={`absolute -top-1 left-0 h-4 w-4 rounded-full border-2 border-white ring-2 ${step.color} animate-pulse`} />
                    )}
                  </div>
                  {index < STEPS.length - 1 && (
                    <ChevronRight className={`h-3 w-3 shrink-0 transition-colors ${index < currentStepIndex ? 'text-slate-400' : 'text-slate-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-4 gap-1 mt-3">
            {STEPS.map((step, index) => (
              <span key={step.id} className={`text-[9px] sm:text-[10px] text-center font-bold leading-tight ${index <= currentStepIndex ? 'text-slate-600' : 'text-slate-300'}`}>
                {step.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {isRejected && (
        <div className="mt-2 p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 items-start animate-in fade-in zoom-in duration-300">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold text-red-900 text-sm uppercase tracking-wider">Demande Refusée</h5>
            <p className="text-sm text-red-700 font-medium">{request.reason || "Aucun motif spécifié."}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function CreateRequestForm({ onSuccess }: { onSuccess: () => void }) {
  const [type, setType] = useState('leave');
  const [desc, setDesc] = useState('');
  const { user } = useAuth();
  const { mutate, isPending } = useCreateRequest();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      userId: user.id,
      type,
      description: desc,
      status: 'submitted',
    }, {
      onSuccess: () => onSuccess()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold tracking-tight">Nouvelle Demande</DialogTitle>
        <DialogDescription className="text-base font-medium">
          Remplissez le formulaire ci-dessous pour soumettre votre demande. Elle passera par 4 étapes de validation.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5">
        <div className="space-y-2.5">
          <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Type de demande</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full rounded-xl h-12 border-slate-200 focus:ring-primary/20">
              <SelectValue placeholder="Sélectionnez un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="leave" className="font-medium">Congé / Absence</SelectItem>
              <SelectItem value="document" className="font-medium">Attestation / Document</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2.5">
          <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Description détaillée</label>
          <Textarea 
            required 
            placeholder={type === 'leave' ? "Ex: Congé annuel du 10 au 15 Novembre..." : "Ex: Attestation de travail pour dossier bancaire..."}
            className="min-h-[120px] rounded-xl resize-none border-slate-200 focus:ring-primary/20 p-4 font-medium"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
      </div>

      <DialogFooter className="gap-2">
        <Button type="button" variant="ghost" onClick={onSuccess} className="rounded-xl font-bold">Annuler</Button>
        <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-white rounded-xl font-bold px-8 h-12 shadow-lg shadow-primary/20">
          {isPending ? "Envoi..." : "Soumettre la demande"}
        </Button>
      </DialogFooter>
    </form>
  );
}

import { AlertCircle } from "lucide-react";
