import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // GET endpoint to fetch all FAQ items
  app.get("/api/faq", async (req, res) => {
    try {
      const faqItems = await storage.getAllFaqItems();
      return res.json(faqItems);
    } catch (error) {
      console.error("Error fetching FAQ items:", error);
      return res.status(500).json({ message: "Failed to fetch FAQ items" });
    }
  });

  // GET endpoint to fetch a specific FAQ item by questionId
  app.get("/api/faq/:questionId", async (req, res) => {
    try {
      const { questionId } = req.params;
      const faqItem = await storage.getFaqItemByQuestionId(questionId);
      
      if (!faqItem) {
        return res.status(404).json({ message: "FAQ item not found" });
      }
      
      return res.json(faqItem);
    } catch (error) {
      console.error("Error fetching FAQ item:", error);
      return res.status(500).json({ message: "Failed to fetch FAQ item" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
