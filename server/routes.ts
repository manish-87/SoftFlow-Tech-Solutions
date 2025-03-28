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
  insertApplicationSchema,
  insertServiceSchema,
  insertProjectSchema,
  insertProjectUpdateSchema,
  insertInvoiceSchema,
  insertInvoiceItemSchema,
  insertPaymentSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // Health check for Render deployment
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

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

  // Services endpoints
  app.get("/api/services", async (req, res) => {
    try {
      // By default, return only active services for public users
      const activeOnly = !req.user?.isAdmin;
      const services = await storage.getServices(activeOnly);
      res.json(services);
    } catch (error) {
      console.error("Error getting services:", error);
      res.status(500).json({ message: "Failed to get services" });
    }
  });

  app.get("/api/services/:slug", async (req, res) => {
    try {
      const service = await storage.getServiceBySlug(req.params.slug);
      
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      // Non-admin users can only see active services
      if (!service.active && !req.user?.isAdmin) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json(service);
    } catch (error) {
      console.error("Error getting service:", error);
      res.status(500).json({ message: "Failed to get service" });
    }
  });

  // Admin service management endpoints
  app.post("/api/admin/services", async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      
      // Create a slug if one wasn't provided
      if (!validatedData.slug) {
        validatedData.slug = validatedData.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
      }
      
      console.log("Creating service with data:", validatedData);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid service data", 
          errors: error.errors 
        });
      }
      
      // Handle specific database errors
      if (error.code === '23505' && error.constraint === 'services_slug_unique') {
        return res.status(400).json({ 
          message: "A service with this slug already exists. Please use a different title or slug.",
          error: error.detail
        });
      }
      
      console.error("Error creating service:", error);
      res.status(500).json({ 
        message: "Failed to create service", 
        error: error.message || "Unknown error"
      });
    }
  });

  app.put("/api/admin/services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertServiceSchema.partial().parse(req.body);
      
      // Create a slug if one is provided as title but no slug
      if (validatedData.title && !validatedData.slug) {
        validatedData.slug = validatedData.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
      }
      
      console.log("Updating service with data:", validatedData);
      const service = await storage.updateService(id, validatedData);
      
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid service data", 
          errors: error.errors 
        });
      }
      
      // Handle specific database errors
      if (error.code === '23505' && error.constraint === 'services_slug_unique') {
        return res.status(400).json({ 
          message: "A service with this slug already exists. Please use a different title or slug.",
          error: error.detail
        });
      }
      
      console.error("Error updating service:", error);
      res.status(500).json({ 
        message: "Failed to update service", 
        error: error.message || "Unknown error"
      });
    }
  });

  app.put("/api/admin/services/:id/toggle", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { active } = req.body;
      
      if (typeof active !== 'boolean') {
        return res.status(400).json({ message: "Invalid active status" });
      }
      
      const service = await storage.toggleServiceActive(id, active);
      
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json(service);
    } catch (error) {
      console.error("Error toggling service active status:", error);
      res.status(500).json({ message: "Failed to toggle service status" });
    }
  });

  app.delete("/api/admin/services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteService(id);
      
      if (!success) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // User project endpoints
  app.get("/api/projects", async (req, res) => {
    try {
      // Only authenticated users can access their projects
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const projects = await storage.getProjects(req.user.id);
      res.json(projects);
    } catch (error) {
      console.error("Error getting projects:", error);
      res.status(500).json({ message: "Failed to get projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      // Only authenticated users can access their projects
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Users can only see their own projects unless they are admin
      if (project.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(project);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error getting project:", errorMessage);
      res.status(500).json({ message: "Failed to get project" });
    }
  });

  app.get("/api/projects/:id/updates", async (req, res) => {
    try {
      // Only authenticated users can access project updates
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Users can only see updates for their own projects unless they are admin
      if (project.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updates = await storage.getProjectUpdates(projectId);
      res.json(updates);
    } catch (error) {
      console.error("Error getting project updates:", error);
      res.status(500).json({ message: "Failed to get project updates" });
    }
  });

  // Admin project management endpoints
  // GET all projects (admin endpoint)
  app.get("/api/admin/projects", async (req, res) => {
    try {
      // Ensure user is authenticated and is an admin
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Get all projects from all users
      const projects = [];
      const users = await storage.getAllUsers();
      
      for (const user of users) {
        const userProjects = await storage.getProjects(user.id);
        projects.push(...userProjects);
      }
      
      res.json(projects);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error getting all projects:", errorMessage);
      res.status(500).json({ message: "Failed to get projects" });
    }
  });

  app.post("/api/admin/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/admin/projects/:id", async (req, res) => {
    try {
      // Ensure user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Ensure user is an admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const id = parseInt(req.params.id);
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, validatedData);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/admin/projects/:id", async (req, res) => {
    try {
      // Ensure user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Ensure user is an admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const id = parseInt(req.params.id);
      const success = await storage.deleteProject(id);
      
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  app.post("/api/admin/projects/:id/updates", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const validatedData = insertProjectUpdateSchema.parse({
        ...req.body,
        projectId
      });
      
      const update = await storage.createProjectUpdate(validatedData);
      res.status(201).json(update);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      console.error("Error creating project update:", error);
      res.status(500).json({ message: "Failed to create project update" });
    }
  });

  // Applications tracking endpoint for users
  app.get("/api/user/applications", async (req, res) => {
    try {
      // Check if email query parameter is provided
      const email = req.query.email as string;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const applications = await storage.getUserApplications(email);
      res.json(applications);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error getting user applications:", errorMessage);
      res.status(500).json({ message: "Failed to get applications" });
    }
  });
  
  // Messages tracking endpoint for users
  app.get("/api/user/messages", async (req, res) => {
    try {
      // Check if email query parameter is provided
      const email = req.query.email as string;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // Get messages sent by user
      const messages = await storage.getMessagesByEmail(email);
      res.json(messages);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error getting user messages:", errorMessage);
      res.status(500).json({ message: "Failed to get messages" });
    }
  });
  
  // User profile update endpoint
  app.put("/api/user/profile", async (req, res) => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Only allow updating these specific profile fields
      const allowedFields = ['email', 'phone', 'photo', 'bio', 'githubUrl', 'linkedinUrl', 'portfolioUrl'];
      const updateData = Object.fromEntries(
        Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
      );
      
      // Get current user to check if they are verified
      const currentUser = await storage.getUser(req.user.id);
      
      // If user is verified, they can't update email and phone
      if (currentUser?.isVerified) {
        delete updateData.email;
        delete updateData.phone;
      }
      
      const updatedUser = await storage.updateUser(req.user.id, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error updating user profile:", errorMessage);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  
  // Admin user management endpoints
  app.get("/api/admin/users", async (req, res) => {
    try {
      // Ensure user is authenticated and is an admin
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error getting users:", errorMessage);
      res.status(500).json({ message: "Failed to get users" });
    }
  });
  
  app.put("/api/admin/users/:id/verify", async (req, res) => {
    try {
      // Ensure user is authenticated and is an admin
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const id = parseInt(req.params.id);
      const updatedUser = await storage.verifyUser(id);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error verifying user:", errorMessage);
      res.status(500).json({ message: "Failed to verify user" });
    }
  });
  
  app.put("/api/admin/users/:id/block", async (req, res) => {
    try {
      // Ensure user is authenticated and is an admin
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const id = parseInt(req.params.id);
      const { blocked } = req.body;
      
      if (typeof blocked !== 'boolean') {
        return res.status(400).json({ message: "Blocked status is required" });
      }
      
      // Prevent blocking yourself
      if (req.user.id === id) {
        return res.status(400).json({ message: "You cannot block your own account" });
      }
      
      const updatedUser = await storage.blockUser(id, blocked);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error blocking/unblocking user:", errorMessage);
      res.status(500).json({ message: "Failed to update user block status" });
    }
  });
  
  app.put("/api/admin/users/:id/promote", async (req, res) => {
    try {
      // Ensure user is authenticated and is an admin
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const id = parseInt(req.params.id);
      const { isAdmin } = req.body;
      
      if (typeof isAdmin !== 'boolean') {
        return res.status(400).json({ message: "Admin status is required" });
      }
      
      // Prevent demoting yourself
      if (req.user.id === id && !isAdmin) {
        return res.status(400).json({ message: "You cannot remove your own admin status" });
      }
      
      const updatedUser = await storage.promoteUser(id, isAdmin);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error updating user admin status:", errorMessage);
      res.status(500).json({ message: "Failed to update user admin status" });
    }
  });
  
  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      // Ensure user is authenticated and is an admin
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const id = parseInt(req.params.id);
      
      // Don't allow deleting the current user
      if (req.user.id === id) {
        return res.status(400).json({ message: "You cannot delete your own account" });
      }
      
      const success = await storage.deleteUser(id);
      
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(204).end();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error deleting user:", errorMessage);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Endpoint to get all projects (for admin features like invoice creation)
  app.get("/api/projects/all", async (req, res) => {
    try {
      // Ensure user is authenticated and is an admin
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const projects = await storage.getAllProjects();
      
      // Make sure all projects have valid properties before sending to client
      const validProjects = projects.filter(project => {
        try {
          // Check for valid project structure with extensive validation
          return (
            project && 
            typeof project === 'object' &&
            project.id !== undefined && 
            !isNaN(Number(project.id)) &&
            Number.isInteger(Number(project.id)) && 
            // Allow title or name (handle both project form variations)
            (
              (typeof project.title === 'string' && project.title.trim().length > 0) ||
              (typeof project.name === 'string' && project.name.trim().length > 0)
            )
          );
        } catch (err) {
          console.error("Error filtering project:", err);
          return false;
        }
      });
      
      if (validProjects.length === 0 && projects.length > 0) {
        console.warn(`Filtered out ${projects.length} invalid projects`);
      }
      
      res.json(validProjects);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error getting all projects:", errorMessage);
      res.status(500).json({ message: "Failed to get projects" });
    }
  });
  
  // Endpoint to get all users (for admin features like invoice creation)
  app.get("/api/users", async (req, res) => {
    try {
      // Ensure user is authenticated and is an admin
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error getting all users:', errorMessage);
      res.status(500).json({ message: "Failed to get users" });
    }
  });
  
  // Endpoint to get projects by user ID (for invoice creation)
  app.get("/api/users/:userId/projects", async (req, res) => {
    try {
      // Ensure user is authenticated and is an admin or the user themselves
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = parseInt(req.params.userId);
      
      // Verify userId is a valid number
      if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Only allow admins or the user themselves to access their projects
      if (!req.user.isAdmin && req.user.id !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const projects = await storage.getProjects(userId);
      
      // Filter out any invalid projects but be more lenient with title/name fields
      const validProjects = projects.filter(project => {
        return (
          project && 
          typeof project === 'object' &&
          project.id !== undefined && 
          !isNaN(Number(project.id)) &&
          (
            // If project has name, we're good
            (typeof project.name === 'string' && project.name.trim().length > 0) ||
            // Or if project has title, we're also good
            (typeof project.title === 'string' && project.title.trim().length > 0) ||
            // Even if neither is a valid string, we still include the project
            (project.id > 0) // As long as it has a valid ID, include it
          )
        );
      });
      
      res.json(validProjects);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error getting projects for user ${req.params.userId}:`, errorMessage);
      res.status(500).json({ message: "Failed to get projects" });
    }
  });

  // API endpoint for creating projects for a specific user
  app.post("/api/admin/users/:id/projects", async (req, res) => {
    try {
      // Ensure user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Ensure user is an admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const userId = parseInt(req.params.id);
      
      // Get the user to make sure they exist
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Add userId to project data
      const projectData = { 
        ...req.body,
        userId 
      };
      
      // Validate and create project
      const validatedData = insertProjectSchema.parse(projectData);
      const project = await storage.createProject(validatedData);
      
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error creating project for user:", errorMessage);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Get all invoices (for admin) or user's invoices (for regular users)
  app.get("/api/invoices", async (req, res) => {
    try {
      // Only authenticated users can access invoices
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      let invoices;
      
      if (req.user.isAdmin) {
        // Admin can see all invoices
        invoices = await storage.getAllInvoices();
      } else {
        // Regular users can only see their own invoices
        const userProjects = await storage.getProjects(req.user.id);
        if (!userProjects.length) {
          return res.json([]); // No projects means no invoices
        }
        
        // Get all invoices for user's projects
        const projectIds = userProjects.map(project => project.id);
        invoices = await storage.getUserInvoices(projectIds);
      }
      
      res.json(invoices);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error getting invoices:", errorMessage);
      res.status(500).json({ message: "Failed to get invoices" });
    }
  });

  // Project invoice endpoints
  app.get("/api/projects/:id/invoices", async (req, res) => {
    try {
      // Only authenticated users can access invoices
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Users can only see invoices for their own projects unless they are admin
      if (project.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const invoices = await storage.getProjectInvoices(projectId);
      res.json(invoices);
    } catch (error) {
      console.error("Error getting project invoices:", error);
      res.status(500).json({ message: "Failed to get project invoices" });
    }
  });

  app.get("/api/invoices/:id", async (req, res) => {
    try {
      // Only authenticated users can access invoices
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const invoice = await storage.getInvoice(id);
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      // Get the project to check permissions
      const project = await storage.getProject(invoice.projectId);
      
      // Check if project exists
      if (!project) {
        return res.status(404).json({ message: "Project for this invoice not found" });
      }
      
      // Users can only see invoices for their own projects unless they are admin
      if (project.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      res.json(invoice);
    } catch (error) {
      console.error("Error getting invoice:", error);
      res.status(500).json({ message: "Failed to get invoice" });
    }
  });

  app.get("/api/invoices/:id/items", async (req, res) => {
    try {
      // Only authenticated users can access invoice items
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const invoiceId = parseInt(req.params.id);
      const invoice = await storage.getInvoice(invoiceId);
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      // Get the project to check permissions
      const project = await storage.getProject(invoice.projectId);
      
      // Check if project exists
      if (!project) {
        return res.status(404).json({ message: "Project for this invoice not found" });
      }
      
      // Users can only see invoice items for their own projects unless they are admin
      if (project.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const items = await storage.getInvoiceItems(invoiceId);
      res.json(items);
    } catch (error) {
      console.error("Error getting invoice items:", error);
      res.status(500).json({ message: "Failed to get invoice items" });
    }
  });

  app.get("/api/invoices/:id/payments", async (req, res) => {
    try {
      // Only authenticated users can access invoice payments
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const invoiceId = parseInt(req.params.id);
      const invoice = await storage.getInvoice(invoiceId);
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      // Get the project to check permissions
      const project = await storage.getProject(invoice.projectId);
      
      // Check if project exists
      if (!project) {
        return res.status(404).json({ message: "Project for this invoice not found" });
      }
      
      // Users can only see invoice payments for their own projects unless they are admin
      if (project.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const payments = await storage.getInvoicePayments(invoiceId);
      res.json(payments);
    } catch (error) {
      console.error("Error getting invoice payments:", error);
      res.status(500).json({ message: "Failed to get invoice payments" });
    }
  });

  // Admin invoice management endpoints
  app.post("/api/projects/:id/invoices", async (req, res) => {
    try {
      // Ensure user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Ensure user is an admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Generate a unique invoice number
      const date = new Date();
      const invoiceNumber = `INV-${project.id}-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      const invoiceData = {
        ...req.body,
        projectId,
        invoiceNumber,
        status: req.body.status || "pending"
      };
      
      const validatedData = insertInvoiceSchema.parse(invoiceData);
      const invoice = await storage.createInvoice(validatedData);
      
      res.status(201).json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid invoice data", errors: error.errors });
      }
      
      console.error("Error creating invoice:", error);
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });

  app.post("/api/admin/invoices/:id/items", async (req, res) => {
    try {
      // Ensure user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Ensure user is an admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const invoiceId = parseInt(req.params.id);
      const invoice = await storage.getInvoice(invoiceId);
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      const itemData = {
        ...req.body,
        invoiceId
      };
      
      const validatedData = insertInvoiceItemSchema.parse(itemData);
      const item = await storage.createInvoiceItem(validatedData);
      
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid invoice item data", errors: error.errors });
      }
      
      console.error("Error creating invoice item:", error);
      res.status(500).json({ message: "Failed to create invoice item" });
    }
  });

  app.post("/api/admin/invoices/:id/payments", async (req, res) => {
    try {
      // Ensure user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Ensure user is an admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const invoiceId = parseInt(req.params.id);
      const invoice = await storage.getInvoice(invoiceId);
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      const paymentData = {
        ...req.body,
        invoiceId
      };
      
      const validatedData = insertPaymentSchema.parse(paymentData);
      const payment = await storage.createPayment(validatedData);
      
      // After adding payment, check if invoice is fully paid or partially paid
      try {
        // Get all payments for this invoice
        const payments = await storage.getInvoicePayments(invoiceId);
        
        if (payments && payments.length > 0) {
          // Calculate total amount paid
          const totalPaid = payments.reduce((sum, payment) => {
            return sum + parseFloat(payment.amount);
          }, 0);
          
          // Compare with invoice amount
          const invoiceAmount = parseFloat(invoice.amount);
          
          if (totalPaid >= invoiceAmount) {
            // Mark as fully paid
            await storage.updateInvoiceStatus(invoiceId, "paid");
          } else if (totalPaid > 0) {
            // Mark as partially paid
            await storage.updateInvoiceStatus(invoiceId, "partially_paid");
          }
        }
      } catch (updateError) {
        console.error("Error updating invoice status after payment:", updateError);
        // Continue with the response even if status update fails
      }
      
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid payment data", errors: error.errors });
      }
      
      console.error("Error creating payment:", error);
      res.status(500).json({ message: "Failed to create payment" });
    }
  });

  app.put("/api/admin/invoices/:id/status", async (req, res) => {
    try {
      // Ensure user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Ensure user is an admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["pending", "paid", "partially_paid", "unpaid", "overdue", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const invoice = await storage.updateInvoiceStatus(id, status);
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      res.json(invoice);
    } catch (error) {
      console.error("Error updating invoice status:", error);
      res.status(500).json({ message: "Failed to update invoice status" });
    }
  });

  app.put("/api/admin/invoice-items/:id", async (req, res) => {
    try {
      // Ensure user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Ensure user is an admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const id = parseInt(req.params.id);
      const validatedData = insertInvoiceItemSchema.partial().parse(req.body);
      
      const item = await storage.updateInvoiceItem(id, validatedData);
      
      if (!item) {
        return res.status(404).json({ message: "Invoice item not found" });
      }
      
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid invoice item data", errors: error.errors });
      }
      
      console.error("Error updating invoice item:", error);
      res.status(500).json({ message: "Failed to update invoice item" });
    }
  });

  app.delete("/api/admin/invoices/:id", async (req, res) => {
    try {
      // Ensure user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Ensure user is an admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const id = parseInt(req.params.id);
      const success = await storage.deleteInvoice(id);
      
      if (!success) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      res.status(500).json({ message: "Failed to delete invoice" });
    }
  });

  app.delete("/api/admin/invoice-items/:id", async (req, res) => {
    try {
      // Ensure user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Ensure user is an admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const id = parseInt(req.params.id);
      const success = await storage.deleteInvoiceItem(id);
      
      if (!success) {
        return res.status(404).json({ message: "Invoice item not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting invoice item:", error);
      res.status(500).json({ message: "Failed to delete invoice item" });
    }
  });

  app.delete("/api/admin/payments/:id", async (req, res) => {
    try {
      // Ensure user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Ensure user is an admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const id = parseInt(req.params.id);
      
      // Get the payment first to know which invoice it belongs to
      const payment = await storage.getPayment(id);
      
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      
      // Store the invoiceId before deleting the payment
      const invoiceId = payment.invoiceId;
      
      // Delete the payment
      const success = await storage.deletePayment(id);
      
      if (!success) {
        return res.status(404).json({ message: "Failed to delete payment" });
      }
      
      // After deleting payment, recalculate invoice status
      try {
        const invoice = await storage.getInvoice(invoiceId);
        if (invoice) {
          // Get remaining payments for this invoice
          const payments = await storage.getInvoicePayments(invoiceId);
          
          if (!payments || payments.length === 0) {
            // No payments left, revert to unpaid or pending status
            await storage.updateInvoiceStatus(invoiceId, "unpaid");
          } else {
            // Calculate total amount paid
            const totalPaid = payments.reduce((sum, payment) => {
              return sum + parseFloat(payment.amount);
            }, 0);
            
            // Compare with invoice amount
            const invoiceAmount = parseFloat(invoice.amount);
            
            if (totalPaid >= invoiceAmount) {
              // Still fully paid
              await storage.updateInvoiceStatus(invoiceId, "paid");
            } else if (totalPaid > 0) {
              // Now partially paid
              await storage.updateInvoiceStatus(invoiceId, "partially_paid");
            } else {
              // No valid payments, revert to unpaid
              await storage.updateInvoiceStatus(invoiceId, "unpaid");
            }
          }
        }
      } catch (updateError) {
        console.error("Error updating invoice status after payment deletion:", updateError);
        // Continue with the response even if status update fails
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting payment:", error);
      res.status(500).json({ message: "Failed to delete payment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
