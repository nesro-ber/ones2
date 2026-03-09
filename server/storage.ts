import { 
  type User, type InsertUser,
  type Request, type InsertRequest,
  type Mission, type InsertMission,
  type Faq, type InsertFaq,
  type Notification, type InsertNotification,
  type Question, type InsertQuestion,
  type ProfileCorrection, type InsertProfileCorrection,
  type PasswordChangeRequest, type InsertPasswordChangeRequest,
  type RecruitmentRequest, type InsertRecruitmentRequest
} from "@shared/schema";

export interface IStorage {
  // Users
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Requests
  getRequests(): Promise<Request[]>;
  createRequest(request: InsertRequest): Promise<Request>;
  updateRequestStatus(id: number, status: string, reason?: string): Promise<Request | undefined>;

  // Missions
  getMissions(): Promise<Mission[]>;
  updateMissionReport(id: number, reportText: string): Promise<Mission | undefined>;

  // FAQs
  getFaqs(): Promise<Faq[]>;
  createFaq(faq: InsertFaq): Promise<Faq>;

  // Notifications
  getNotifications(): Promise<Notification[]>;
  markNotificationRead(id: number): Promise<Notification | undefined>;

  // Questions
  getQuestions(): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;

  // Profile Corrections
  getProfileCorrections(): Promise<ProfileCorrection[]>;
  createProfileCorrection(correction: InsertProfileCorrection): Promise<ProfileCorrection>;
  updateProfileCorrectionStatus(id: number, status: string, reason?: string): Promise<ProfileCorrection | undefined>;

  // Password Change Requests
  getPasswordChangeRequests(): Promise<PasswordChangeRequest[]>;
  createPasswordChangeRequest(request: InsertPasswordChangeRequest): Promise<PasswordChangeRequest>;
  updatePasswordChangeRequestStatus(id: number, status: string, reason?: string): Promise<PasswordChangeRequest | undefined>;

  // Recruitment Requests
  getRecruitmentRequests(): Promise<RecruitmentRequest[]>;
  createRecruitmentRequest(request: InsertRecruitmentRequest): Promise<RecruitmentRequest>;
  updateRecruitmentRequestStatus(id: number, status: string, reason?: string): Promise<RecruitmentRequest | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private requests: Map<number, Request>;
  private missions: Map<number, Mission>;
  private faqs: Map<number, Faq>;
  private notifications: Map<number, Notification>;
  private questions: Map<number, Question>;
  private profileCorrections: Map<number, ProfileCorrection>;
  private passwordChangeRequests: Map<number, PasswordChangeRequest>;
  private recruitmentRequests: Map<number, RecruitmentRequest>;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.requests = new Map();
    this.missions = new Map();
    this.faqs = new Map();
    this.notifications = new Map();
    this.questions = new Map();
    this.profileCorrections = new Map();
    this.passwordChangeRequests = new Map();
    this.recruitmentRequests = new Map();
    this.currentId = { users: 1, requests: 1, missions: 1, faqs: 1, notifications: 1, questions: 1, profileCorrections: 1, passwordChangeRequests: 1, recruitmentRequests: 1 };

    // Seed mock data
    this.createUser({ 
      username: "agent1", password: "pwd", role: "agent", fullName: "Ahmed Benali", 
      firstName: "Ahmed", lastName: "Benali", matricule: "AG001", 
      email: "ahmed.benali@sonatrach.dz", hireDate: "2020-01-15",
      familialStatus: "married", bloodType: "O+", department: "IT" 
    });
    this.createUser({ username: "manager1", password: "pwd", role: "manager", fullName: "Karim Responsable", department: "IT" });
    this.createUser({ username: "hr1", password: "pwd", role: "hr", fullName: "Nadia RH", department: "HR" });
    this.createUser({ username: "admin1", password: "pwd", role: "admin", fullName: "Admin System", department: "Administration" });

    this.createFaq({ question: "Comment demander un congé?", answer: "Allez dans la section Congés et cliquez sur 'Nouvelle demande'." });
    this.createFaq({ question: "Où trouver mes fiches de paie?", answer: "Dans la section Documents, demandez un Relevé des émoluments." });

    // Add active missions
    this.missions.set(this.currentId.missions, {
      id: this.currentId.missions++,
      userId: 1,
      title: "Visite site Hassi Messaoud",
      description: "Inspection des installations de forage.",
      status: "active",
      reportText: null,
      createdAt: new Date()
    });

    this.missions.set(this.currentId.missions, {
      id: this.currentId.missions++,
      userId: 1,
      title: "Réunion avec Partenaires Internationaux",
      description: "Négociation des nouveaux contrats pour Q2 2026.",
      status: "active",
      reportText: null,
      createdAt: new Date()
    });

    // Add completed missions with reports
    this.missions.set(this.currentId.missions, {
      id: this.currentId.missions++,
      userId: 1,
      title: "Audit Site Skikda",
      description: "Vérification de conformité des équipements de sécurité.",
      status: "completed",
      reportText: "Audit complété avec succès. Tous les équipements conformes aux normes internationales. Rapport détaillé en annexe.",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    });

    this.missions.set(this.currentId.missions, {
      id: this.currentId.missions++,
      userId: 1,
      title: "Formation Équipe Maintenance",
      description: "Formation sur les nouveaux protocoles de maintenance.",
      status: "completed",
      reportText: "Formation dispensée à 15 participants. Tous les objectifs atteints.",
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    });

    this.missions.set(this.currentId.missions, {
      id: this.currentId.missions++,
      userId: 1,
      title: "Visite Client Alger",
      description: "Présentation des services et signature de contrat.",
      status: "completed",
      reportText: "Contrat signé avec succès. Client satisfait des propositions.",
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    });

    // Seed some requests with new status flow
    this.createRequest({ userId: 1, type: 'leave', status: 'submitted', description: 'Congé annuel', reason: null });
    this.createRequest({ userId: 1, type: 'document', status: 'validated_manager', description: 'Attestation de travail', reason: null });
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getRequests(): Promise<Request[]> {
    return Array.from(this.requests.values());
  }

  async createRequest(insertRequest: InsertRequest): Promise<Request> {
    const id = this.currentId.requests++;
    const request: Request = { ...insertRequest, id, createdAt: new Date() };
    this.requests.set(id, request);
    return request;
  }

  async updateRequestStatus(id: number, status: string, reason?: string): Promise<Request | undefined> {
    const request = this.requests.get(id);
    if (!request) return undefined;
    
    const updated = { ...request, status, reason: reason || null };
    this.requests.set(id, updated);
    return updated;
  }

  async getMissions(): Promise<Mission[]> {
    return Array.from(this.missions.values());
  }

  async updateMissionReport(id: number, reportText: string): Promise<Mission | undefined> {
    const mission = this.missions.get(id);
    if (!mission) return undefined;

    const updated = { ...mission, reportText, status: "completed" };
    this.missions.set(id, updated);
    return updated;
  }

  async getFaqs(): Promise<Faq[]> {
    return Array.from(this.faqs.values());
  }

  async createFaq(insertFaq: InsertFaq): Promise<Faq> {
    const id = this.currentId.faqs++;
    const faq: Faq = { ...insertFaq, id };
    this.faqs.set(id, faq);
    return faq;
  }

  async getNotifications(): Promise<Notification[]> {
    return Array.from(this.notifications.values());
  }

  async markNotificationRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;

    const updated = { ...notification, isRead: true };
    this.notifications.set(id, updated);
    return updated;
  }

  async getQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values());
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.currentId.questions++;
    const question: Question = { ...insertQuestion, id, createdAt: new Date() };
    this.questions.set(id, question);
    return question;
  }

  async getProfileCorrections(): Promise<ProfileCorrection[]> {
    return Array.from(this.profileCorrections.values());
  }

  async createProfileCorrection(insertCorrection: InsertProfileCorrection): Promise<ProfileCorrection> {
    const id = this.currentId.profileCorrections++;
    const correction: ProfileCorrection = { ...insertCorrection, id, createdAt: new Date() };
    this.profileCorrections.set(id, correction);
    return correction;
  }

  async updateProfileCorrectionStatus(id: number, status: string, reason?: string): Promise<ProfileCorrection | undefined> {
    const correction = this.profileCorrections.get(id);
    if (!correction) return undefined;
    
    const updated = { ...correction, status, reason: reason || null };
    this.profileCorrections.set(id, updated);
    return updated;
  }

  async getPasswordChangeRequests(): Promise<PasswordChangeRequest[]> {
    return Array.from(this.passwordChangeRequests.values());
  }

  async createPasswordChangeRequest(insertRequest: InsertPasswordChangeRequest): Promise<PasswordChangeRequest> {
    const id = this.currentId.passwordChangeRequests++;
    const request: PasswordChangeRequest = { ...insertRequest, id, createdAt: new Date() };
    this.passwordChangeRequests.set(id, request);
    return request;
  }

  async updatePasswordChangeRequestStatus(id: number, status: string, reason?: string): Promise<PasswordChangeRequest | undefined> {
    const request = this.passwordChangeRequests.get(id);
    if (!request) return undefined;
    
    const updated = { ...request, status, reason: reason || null };
    this.passwordChangeRequests.set(id, updated);
    return updated;
  }

  async getRecruitmentRequests(): Promise<RecruitmentRequest[]> {
    return Array.from(this.recruitmentRequests.values());
  }

  async createRecruitmentRequest(insertRequest: InsertRecruitmentRequest): Promise<RecruitmentRequest> {
    const id = this.currentId.recruitmentRequests++;
    const request: RecruitmentRequest = { ...insertRequest, id, createdAt: new Date() };
    this.recruitmentRequests.set(id, request);
    return request;
  }

  async updateRecruitmentRequestStatus(id: number, status: string, reason?: string): Promise<RecruitmentRequest | undefined> {
    const request = this.recruitmentRequests.get(id);
    if (!request) return undefined;
    
    const updated = { ...request, status, reason: reason || null };
    this.recruitmentRequests.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
