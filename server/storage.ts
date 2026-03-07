import { 
  type User, type InsertUser,
  type Request, type InsertRequest,
  type Mission, type InsertMission,
  type Faq, type InsertFaq,
  type Notification, type InsertNotification,
  type Question, type InsertQuestion
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private requests: Map<number, Request>;
  private missions: Map<number, Mission>;
  private faqs: Map<number, Faq>;
  private notifications: Map<number, Notification>;
  private questions: Map<number, Question>;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.requests = new Map();
    this.missions = new Map();
    this.faqs = new Map();
    this.notifications = new Map();
    this.questions = new Map();
    this.currentId = { users: 1, requests: 1, missions: 1, faqs: 1, notifications: 1, questions: 1 };

    // Seed mock data
    this.createUser({ username: "agent1", password: "pwd", role: "agent", fullName: "Ahmed Benali", department: "IT" });
    this.createUser({ username: "manager1", password: "pwd", role: "manager", fullName: "Karim Responsable", department: "IT" });
    this.createUser({ username: "hr1", password: "pwd", role: "hr", fullName: "Nadia RH", department: "HR" });
    this.createUser({ username: "admin1", password: "pwd", role: "admin", fullName: "Admin System", department: "Administration" });

    this.createFaq({ question: "Comment demander un congé?", answer: "Allez dans la section Congés et cliquez sur 'Nouvelle demande'." });
    this.createFaq({ question: "Où trouver mes fiches de paie?", answer: "Dans la section Documents, demandez un Relevé des émoluments." });

    this.missions.set(this.currentId.missions, {
      id: this.currentId.missions++,
      userId: 1,
      title: "Visite site Hassi Messaoud",
      description: "Inspection des installations.",
      status: "active",
      reportText: null,
      createdAt: new Date()
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
}

export const storage = new MemStorage();
