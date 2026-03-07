import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Users
  app.get(api.users.list.path, async (req, res) => {
    const users = await storage.getUsers();
    res.json(users);
  });

  app.get(api.users.get.path, async (req, res) => {
    const user = await storage.getUser(Number(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  });

  app.post(api.users.create.path, async (req, res) => {
    try {
      const input = api.users.create.input.parse(req.body);
      const user = await storage.createUser(input);
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Requests
  app.get(api.requests.list.path, async (req, res) => {
    const requests = await storage.getRequests();
    res.json(requests);
  });

  app.post(api.requests.create.path, async (req, res) => {
    try {
      const input = api.requests.create.input.parse(req.body);
      const request = await storage.createRequest(input);
      res.status(201).json(request);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.patch(api.requests.updateStatus.path, async (req, res) => {
    try {
      const input = api.requests.updateStatus.input.parse(req.body);
      const request = await storage.updateRequestStatus(Number(req.params.id), input.status, input.reason);
      if (!request) return res.status(404).json({ message: "Request not found" });
      res.json(request);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Missions
  app.get(api.missions.list.path, async (req, res) => {
    const missions = await storage.getMissions();
    res.json(missions);
  });

  app.patch(api.missions.updateReport.path, async (req, res) => {
    try {
      const input = api.missions.updateReport.input.parse(req.body);
      const mission = await storage.updateMissionReport(Number(req.params.id), input.reportText);
      if (!mission) return res.status(404).json({ message: "Mission not found" });
      res.json(mission);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // FAQs
  app.get(api.faqs.list.path, async (req, res) => {
    const faqs = await storage.getFaqs();
    res.json(faqs);
  });

  app.post(api.faqs.create.path, async (req, res) => {
    try {
      const input = api.faqs.create.input.parse(req.body);
      const faq = await storage.createFaq(input);
      res.status(201).json(faq);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Notifications
  app.get(api.notifications.list.path, async (req, res) => {
    const notifications = await storage.getNotifications();
    res.json(notifications);
  });

  app.patch(api.notifications.markRead.path, async (req, res) => {
    const notification = await storage.markNotificationRead(Number(req.params.id));
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json(notification);
  });

  // Questions
  app.get(api.questions.list.path, async (req, res) => {
    const questions = await storage.getQuestions();
    res.json(questions);
  });

  app.post(api.questions.create.path, async (req, res) => {
    try {
      const input = api.questions.create.input.parse(req.body);
      const question = await storage.createQuestion(input);
      res.status(201).json(question);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  return httpServer;
}
