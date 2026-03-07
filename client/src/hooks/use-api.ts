import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertRequest, InsertMission, InsertFaq, InsertUser, InsertQuestion } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// === USERS ===
export function useUsers() {
  return useQuery({
    queryKey: [api.users.list.path],
    queryFn: async () => {
      const res = await fetch(api.users.list.path);
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    }
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await fetch(api.users.create.path, {
        method: api.users.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.users.list.path] });
      toast({ title: "Succès", description: "Utilisateur créé avec succès" });
    },
    onError: () => toast({ title: "Erreur", description: "Échec de la création", variant: "destructive" })
  });
}

// === REQUESTS (Leaves, Documents) ===
export function useRequests() {
  return useQuery({
    queryKey: [api.requests.list.path],
    queryFn: async () => {
      const res = await fetch(api.requests.list.path);
      if (!res.ok) throw new Error("Failed to fetch requests");
      return res.json();
    }
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertRequest) => {
      const res = await fetch(api.requests.create.path, {
        method: api.requests.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create request");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.requests.list.path] });
      toast({ title: "Demande envoyée", description: "Votre demande a été soumise." });
    },
    onError: () => toast({ title: "Erreur", description: "Échec de la soumission", variant: "destructive" })
  });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, status, reason }: { id: number, status: string, reason?: string }) => {
      const url = buildUrl(api.requests.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.requests.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reason }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.requests.list.path] });
      toast({ title: "Statut mis à jour", description: "La demande a été traitée." });
    }
  });
}

// === MISSIONS ===
export function useMissions() {
  return useQuery({
    queryKey: [api.missions.list.path],
    queryFn: async () => {
      const res = await fetch(api.missions.list.path);
      if (!res.ok) throw new Error("Failed to fetch missions");
      return res.json();
    }
  });
}

export function useUpdateMissionReport() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, reportText }: { id: number, reportText: string }) => {
      const url = buildUrl(api.missions.updateReport.path, { id });
      const res = await fetch(url, {
        method: api.missions.updateReport.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportText }),
      });
      if (!res.ok) throw new Error("Failed to update report");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.missions.list.path] });
      toast({ title: "Rapport soumis", description: "Le rapport de mission a été enregistré." });
    }
  });
}

// === FAQS ===
export function useFaqs() {
  return useQuery({
    queryKey: [api.faqs.list.path],
    queryFn: async () => {
      const res = await fetch(api.faqs.list.path);
      if (!res.ok) throw new Error("Failed to fetch FAQs");
      return res.json();
    }
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertFaq) => {
      const res = await fetch(api.faqs.create.path, {
        method: api.faqs.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create FAQ");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.faqs.list.path] });
      toast({ title: "FAQ Ajoutée", description: "La question a été ajoutée à la base de connaissances." });
    }
  });
}

// === NOTIFICATIONS ===
export function useNotifications() {
  return useQuery({
    queryKey: [api.notifications.list.path],
    queryFn: async () => {
      const res = await fetch(api.notifications.list.path);
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    }
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.notifications.markRead.path, { id });
      const res = await fetch(url, { method: api.notifications.markRead.method });
      if (!res.ok) throw new Error("Failed to mark as read");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.notifications.list.path] });
    }
  });
}

// === QUESTIONS ===
export function useQuestions() {
  return useQuery({
    queryKey: [api.questions.list.path],
    queryFn: async () => {
      const res = await fetch(api.questions.list.path);
      if (!res.ok) throw new Error("Failed to fetch questions");
      return res.json();
    }
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertQuestion) => {
      const res = await fetch(api.questions.create.path, {
        method: api.questions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create question");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.questions.list.path] });
      toast({ title: "Question envoyée", description: "Votre question a été soumise." });
    },
    onError: () => toast({ title: "Erreur", description: "Échec de la soumission", variant: "destructive" })
  });
}
