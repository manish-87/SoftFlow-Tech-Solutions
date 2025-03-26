import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { 
  insertBlogPostSchema, 
  insertPartnerSchema, 
  insertMessageSchema, 
  insertCareerSchema, 
  insertApplicationSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // Blog posts endpoints
  app.get("/api/blogs", async (req, res) => {
    try {
      const blogs = await storage.getBlogPosts();
      // Filter for published blogs if not in admin
      if (!req.user?.isAdmin) {
        const publishedBlogs = blogs.filter(blog => blog.published);
        return res.json(publishedBlogs);
      }
      res.json(blogs);
    } catch (error) {
      console.error("Error getting blogs:", error);
      res.status(500).json({ message: "Failed to get blogs" });
    }
  });

  app.get("/api/blogs/:slug", async (req, res) => {
    try {
      const blog = await storage.getBlogPostBySlug(req.params.slug);
      if (!blog) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      // Check if blog is published or user is admin
      if (!blog.published && !req.user?.isAdmin) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(blog);
    } catch (error) {
      console.error("Error getting blog:", error);
      res.status(500).json({ message: "Failed to get blog post" });
    }
  });

  // Admin blog management endpoints
  app.post("/api/admin/blogs", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const blog = await storage.createBlogPost(validatedData);
      res.status(201).json(blog);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid blog data", errors: error.errors });
      }
      console.error("Error creating blog:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put("/api/admin/blogs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const blog = await storage.updateBlogPost(id, validatedData);
      
      if (!blog) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(blog);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid blog data", errors: error.errors });
      }
      console.error("Error updating blog:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blogs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBlogPost(id);
      
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting blog:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Partners endpoints
  app.get("/api/partners", async (req, res) => {
    try {
      const partners = await storage.getPartners();
      res.json(partners);
    } catch (error) {
      console.error("Error getting partners:", error);
      res.status(500).json({ message: "Failed to get partners" });
    }
  });

  // Admin partner management endpoints
  app.post("/api/admin/partners", async (req, res) => {
    try {
      const validatedData = insertPartnerSchema.parse(req.body);
      const partner = await storage.createPartner(validatedData);
      res.status(201).json(partner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid partner data", errors: error.errors });
      }
      console.error("Error creating partner:", error);
      res.status(500).json({ message: "Failed to create partner" });
    }
  });

  app.put("/api/admin/partners/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPartnerSchema.partial().parse(req.body);
      const partner = await storage.updatePartner(id, validatedData);
      
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      
      res.json(partner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid partner data", errors: error.errors });
      }
      console.error("Error updating partner:", error);
      res.status(500).json({ message: "Failed to update partner" });
    }
  });

  app.delete("/api/admin/partners/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePartner(id);
      
      if (!success) {
        return res.status(404).json({ message: "Partner not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting partner:", error);
      res.status(500).json({ message: "Failed to delete partner" });
    }
  });

  // Messages endpoints
  app.post("/api/messages", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Admin message management endpoints
  app.get("/api/admin/messages", async (req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error getting messages:", error);
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  app.put("/api/admin/messages/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.markMessageAsRead(id);
      
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.json(message);
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  app.delete("/api/admin/messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMessage(id);
      
      if (!success) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ message: "Failed to delete message" });
    }
  });

  // Career endpoints
  app.get("/api/careers", async (req, res) => {
    try {
      const careers = await storage.getCareers();
      // Filter for published careers if not in admin
      if (!req.user?.isAdmin) {
        const publishedCareers = careers.filter(career => career.published);
        return res.json(publishedCareers);
      }
      res.json(careers);
    } catch (error) {
      console.error("Error getting careers:", error);
      res.status(500).json({ message: "Failed to get careers" });
    }
  });

  app.get("/api/careers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const career = await storage.getCareer(id);
      
      if (!career) {
        return res.status(404).json({ message: "Career not found" });
      }
      
      // Check if career is published or user is admin
      if (!career.published && !req.user?.isAdmin) {
        return res.status(404).json({ message: "Career not found" });
      }
      
      res.json(career);
    } catch (error) {
      console.error("Error getting career:", error);
      res.status(500).json({ message: "Failed to get career" });
    }
  });

  // Admin career management endpoints
  app.post("/api/admin/careers", async (req, res) => {
    try {
      const validatedData = insertCareerSchema.parse(req.body);
      const career = await storage.createCareer(validatedData);
      res.status(201).json(career);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid career data", errors: error.errors });
      }
      console.error("Error creating career:", error);
      res.status(500).json({ message: "Failed to create career" });
    }
  });

  app.put("/api/admin/careers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCareerSchema.partial().parse(req.body);
      const career = await storage.updateCareer(id, validatedData);
      
      if (!career) {
        return res.status(404).json({ message: "Career not found" });
      }
      
      res.json(career);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid career data", errors: error.errors });
      }
      console.error("Error updating career:", error);
      res.status(500).json({ message: "Failed to update career" });
    }
  });

  app.delete("/api/admin/careers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCareer(id);
      
      if (!success) {
        return res.status(404).json({ message: "Career not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting career:", error);
      res.status(500).json({ message: "Failed to delete career" });
    }
  });

  // Job applications endpoints
  app.post("/api/careers/:id/apply", async (req, res) => {
    try {
      const careerId = parseInt(req.params.id);
      const career = await storage.getCareer(careerId);
      
      if (!career || !career.published) {
        return res.status(404).json({ message: "Career not found" });
      }
      
      const validatedData = insertApplicationSchema.parse({
        ...req.body,
        careerId
      });
      
      const application = await storage.createApplication(validatedData);
      res.status(201).json({ message: "Application submitted successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      console.error("Error creating application:", error);
      res.status(500).json({ message: "Failed to submit application" });
    }
  });

  // Admin applications management endpoints
  app.get("/api/admin/applications", async (req, res) => {
    try {
      const careerId = req.query.careerId ? parseInt(req.query.careerId as string) : undefined;
      const applications = await storage.getApplications(careerId);
      res.json(applications);
    } catch (error) {
      console.error("Error getting applications:", error);
      res.status(500).json({ message: "Failed to get applications" });
    }
  });

  app.put("/api/admin/applications/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["pending", "reviewed", "interviewing", "rejected", "hired"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const application = await storage.updateApplicationStatus(id, status);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      res.json(application);
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({ message: "Failed to update application status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
