import { User, InsertUser, BlogPost, InsertBlogPost, Partner, InsertPartner, 
  Message, InsertMessage, Career, InsertCareer, Application, InsertApplication, Service, InsertService,
  Project, InsertProject, ProjectUpdate, InsertProjectUpdate,
  users, blogPosts, partners, messages, careers, applications, services, projects, projectUpdates } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";
import { db } from "./db";
import { eq, desc, asc, and } from "drizzle-orm";
import connectPg from "connect-pg-simple";

// Fix for SessionStore type
declare module "express-session" {
  interface SessionData {
    passport?: any;
  }
}

// Session store
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser & { isAdmin?: boolean }): Promise<User>;
  
  // Blog posts
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Partners
  getPartners(): Promise<Partner[]>;
  getPartner(id: number): Promise<Partner | undefined>;
  createPartner(partner: InsertPartner): Promise<Partner>;
  updatePartner(id: number, partner: Partial<InsertPartner>): Promise<Partner | undefined>;
  deletePartner(id: number): Promise<boolean>;
  
  // Messages
  getMessages(): Promise<Message[]>;
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  deleteMessage(id: number): Promise<boolean>;
  
  // Careers
  getCareers(): Promise<Career[]>;
  getCareer(id: number): Promise<Career | undefined>;
  createCareer(career: InsertCareer): Promise<Career>;
  updateCareer(id: number, career: Partial<InsertCareer>): Promise<Career | undefined>;
  deleteCareer(id: number): Promise<boolean>;
  
  // Applications
  getApplications(careerId?: number): Promise<Application[]>;
  getApplication(id: number): Promise<Application | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplicationStatus(id: number, status: string): Promise<Application | undefined>;
  
  // Services
  getServices(activeOnly?: boolean): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  toggleServiceActive(id: number, active: boolean): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Projects
  getProjects(userId: number): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Project Updates
  getProjectUpdates(projectId: number): Promise<ProjectUpdate[]>;
  createProjectUpdate(update: InsertProjectUpdate): Promise<ProjectUpdate>;
  
  // User Applications
  getUserApplications(email: string): Promise<Application[]>;
  
  // Session store
  sessionStore: any;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private blogs: Map<number, BlogPost>;
  private partnersList: Map<number, Partner>;
  private messagesList: Map<number, Message>;
  private careersList: Map<number, Career>;
  private applicationsList: Map<number, Application>;
  private servicesList: Map<number, Service>;
  private projectsList: Map<number, Project>;
  private projectUpdatesList: Map<number, ProjectUpdate>;
  
  currentUserId: number;
  currentBlogId: number;
  currentPartnerId: number;
  currentMessageId: number;
  currentCareerId: number;
  currentApplicationId: number;
  currentServiceId: number;
  currentProjectId: number;
  currentProjectUpdateId: number;
  sessionStore: any;

  constructor() {
    this.users = new Map();
    this.blogs = new Map();
    this.partnersList = new Map();
    this.messagesList = new Map();
    this.careersList = new Map();
    this.applicationsList = new Map();
    this.servicesList = new Map();
    this.projectsList = new Map();
    this.projectUpdatesList = new Map();
    
    this.currentUserId = 1;
    this.currentBlogId = 1;
    this.currentPartnerId = 1;
    this.currentMessageId = 1;
    this.currentCareerId = 1;
    this.currentApplicationId = 1;
    this.currentServiceId = 1;
    this.currentProjectId = 1;
    this.currentProjectUpdateId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Create default admin user with hashed password
    // Note: In production, this should be done via a seed script or admin UI
    // The password here is "JMk@475869"
    this.createUser({
      username: "manish.jammulapati",
      password: "b5337e9336eeb0de0739ea91dadd18cfd1b897cec7be8d9e93bd676d60aa32e9d0f90a5f8a3b6f815580dd396a8f4d03fed0618c41d8bbc4e138e02e0b5dce67.c3e9f78174e74c4c9e31efa800183d09",
      isAdmin: true,
    });
    
    // Create sample blog posts
    this.createBlogPost({
      title: "E-commerce Platform Modernization",
      slug: "ecommerce-platform-modernization",
      summary: "How we helped a retail client increase sales by 200% through digital transformation.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ac dui sit amet purus tempor posuere.",
      category: "Case Study",
      coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      published: true,
    });
    
    this.createBlogPost({
      title: "Healthcare Application Development",
      slug: "healthcare-application-development",
      summary: "Developing a secure patient management system that improved operational efficiency.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ac dui sit amet purus tempor posuere.",
      category: "Case Study",
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      published: true,
    });
    
    this.createBlogPost({
      title: "Financial Data Analytics",
      slug: "financial-data-analytics",
      summary: "How our data visualization solutions helped a fintech company make better decisions.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ac dui sit amet purus tempor posuere.",
      category: "Case Study",
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      published: true,
    });
    
    // Create sample services
    this.createService({
      title: "Frontend Development",
      slug: "frontend-development",
      description: "Building responsive and accessible user interfaces with modern frameworks. We specialize in modern React development with hooks, responsive mobile-first design, performance optimization, and accessibility compliance.",
      icon: "code",
      active: true,
      order: 1
    });
    
    this.createService({
      title: "Backend Development",
      slug: "backend-development",
      description: "Creating robust and scalable server-side applications and APIs. Our services include RESTful API development, database design and optimization, authentication and authorization, and microservices architecture.",
      icon: "server",
      active: true,
      order: 2
    });
    
    this.createService({
      title: "Mobile Development",
      slug: "mobile-development",
      description: "Building native and cross-platform applications for iOS and Android. We offer cross-platform development with React Native, native iOS development with Swift, native Android development with Kotlin, and mobile UX/UI design.",
      icon: "smartphone",
      active: true,
      order: 3
    });
    
    this.createService({
      title: "Cloud Management",
      slug: "cloud-management",
      description: "Hosting, managing, and scaling applications in the cloud. We provide expertise in AWS, Azure, and Google Cloud, infrastructure as code with Terraform, containerization with Docker and Kubernetes, and CI/CD pipeline implementation.",
      icon: "cloud",
      active: true,
      order: 4
    });
    
    this.createService({
      title: "Data Analytics",
      slug: "data-analytics",
      description: "Turning raw data into actionable insights for better decision making. Our services include data warehouse design, ETL pipeline development, business intelligence dashboards, and machine learning model integration.",
      icon: "bar-chart",
      active: true,
      order: 5
    });
    
    this.createService({
      title: "Tech Consultancy",
      slug: "tech-consultancy",
      description: "Expert advice on technology strategy and implementation. We offer technology stack assessment, digital transformation roadmaps, legacy system modernization, and technical project management.",
      icon: "lightbulb",
      active: true,
      order: 6
    });
  }

  // Users methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser & { isAdmin?: boolean }): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      isAdmin: insertUser.isAdmin || false
    };
    this.users.set(id, user);
    return user;
  }

  // Blog posts methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogs.values());
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogs.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogs.values()).find(
      (blog) => blog.slug === slug,
    );
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogId++;
    const now = new Date();
    const blogPost: BlogPost = { 
      ...post, 
      id,
      createdAt: now
    };
    this.blogs.set(id, blogPost);
    return blogPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existingPost = this.blogs.get(id);
    if (!existingPost) return undefined;
    
    const updatedPost: BlogPost = { 
      ...existingPost, 
      ...post
    };
    this.blogs.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogs.delete(id);
  }

  // Partners methods
  async getPartners(): Promise<Partner[]> {
    return Array.from(this.partnersList.values());
  }

  async getPartner(id: number): Promise<Partner | undefined> {
    return this.partnersList.get(id);
  }

  async createPartner(partner: InsertPartner): Promise<Partner> {
    const id = this.currentPartnerId++;
    const newPartner: Partner = { ...partner, id };
    this.partnersList.set(id, newPartner);
    return newPartner;
  }

  async updatePartner(id: number, partner: Partial<InsertPartner>): Promise<Partner | undefined> {
    const existingPartner = this.partnersList.get(id);
    if (!existingPartner) return undefined;
    
    const updatedPartner: Partner = { 
      ...existingPartner, 
      ...partner
    };
    this.partnersList.set(id, updatedPartner);
    return updatedPartner;
  }

  async deletePartner(id: number): Promise<boolean> {
    return this.partnersList.delete(id);
  }

  // Messages methods
  async getMessages(): Promise<Message[]> {
    return Array.from(this.messagesList.values());
  }

  async getMessage(id: number): Promise<Message | undefined> {
    return this.messagesList.get(id);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const now = new Date();
    const newMessage: Message = { 
      ...message, 
      id,
      read: false,
      createdAt: now
    };
    this.messagesList.set(id, newMessage);
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const existingMessage = this.messagesList.get(id);
    if (!existingMessage) return undefined;
    
    const updatedMessage: Message = { 
      ...existingMessage, 
      read: true
    };
    this.messagesList.set(id, updatedMessage);
    return updatedMessage;
  }

  async deleteMessage(id: number): Promise<boolean> {
    return this.messagesList.delete(id);
  }

  // Careers methods
  async getCareers(): Promise<Career[]> {
    return Array.from(this.careersList.values());
  }

  async getCareer(id: number): Promise<Career | undefined> {
    return this.careersList.get(id);
  }

  async createCareer(career: InsertCareer): Promise<Career> {
    const id = this.currentCareerId++;
    const now = new Date();
    const newCareer: Career = { 
      ...career, 
      id,
      createdAt: now
    };
    this.careersList.set(id, newCareer);
    return newCareer;
  }

  async updateCareer(id: number, career: Partial<InsertCareer>): Promise<Career | undefined> {
    const existingCareer = this.careersList.get(id);
    if (!existingCareer) return undefined;
    
    const updatedCareer: Career = { 
      ...existingCareer, 
      ...career
    };
    this.careersList.set(id, updatedCareer);
    return updatedCareer;
  }

  async deleteCareer(id: number): Promise<boolean> {
    return this.careersList.delete(id);
  }

  // Applications methods
  async getApplications(careerId?: number): Promise<Application[]> {
    if (careerId) {
      return Array.from(this.applicationsList.values()).filter(
        (app) => app.careerId === careerId,
      );
    }
    return Array.from(this.applicationsList.values());
  }

  async getApplication(id: number): Promise<Application | undefined> {
    return this.applicationsList.get(id);
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const id = this.currentApplicationId++;
    const now = new Date();
    const newApplication: Application = { 
      ...application, 
      id,
      status: "pending",
      createdAt: now
    };
    this.applicationsList.set(id, newApplication);
    return newApplication;
  }

  async updateApplicationStatus(id: number, status: string): Promise<Application | undefined> {
    const existingApplication = this.applicationsList.get(id);
    if (!existingApplication) return undefined;
    
    const updatedApplication: Application = { 
      ...existingApplication, 
      status
    };
    this.applicationsList.set(id, updatedApplication);
    return updatedApplication;
  }

  // Services methods
  async getServices(activeOnly?: boolean): Promise<Service[]> {
    const allServices = Array.from(this.servicesList.values());
    if (activeOnly) {
      return allServices.filter(service => service.active);
    }
    return allServices;
  }

  async getService(id: number): Promise<Service | undefined> {
    return this.servicesList.get(id);
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    return Array.from(this.servicesList.values()).find(
      (service) => service.slug === slug
    );
  }

  async createService(service: InsertService): Promise<Service> {
    const id = this.currentServiceId++;
    const now = new Date();
    const newService: Service = { 
      ...service, 
      id,
      createdAt: now,
      active: service.active ?? true,
      order: service.order ?? 0
    };
    this.servicesList.set(id, newService);
    return newService;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined> {
    const existingService = this.servicesList.get(id);
    if (!existingService) return undefined;
    
    const updatedService: Service = { 
      ...existingService, 
      ...service
    };
    this.servicesList.set(id, updatedService);
    return updatedService;
  }

  async toggleServiceActive(id: number, active: boolean): Promise<Service | undefined> {
    const existingService = this.servicesList.get(id);
    if (!existingService) return undefined;
    
    const updatedService: Service = { 
      ...existingService, 
      active
    };
    this.servicesList.set(id, updatedService);
    return updatedService;
  }

  async deleteService(id: number): Promise<boolean> {
    return this.servicesList.delete(id);
  }

  // Projects methods
  async getProjects(userId: number): Promise<Project[]> {
    return Array.from(this.projectsList.values()).filter(
      (project) => project.userId === userId
    );
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projectsList.get(id);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const now = new Date();
    const newProject: Project = {
      ...project,
      id,
      createdAt: now,
      status: project.status || "pending",
      completionPercentage: project.completionPercentage || 0
    };
    this.projectsList.set(id, newProject);
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const existingProject = this.projectsList.get(id);
    if (!existingProject) return undefined;
    
    const updatedProject: Project = {
      ...existingProject,
      ...project
    };
    this.projectsList.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projectsList.delete(id);
  }

  // Project Updates methods
  async getProjectUpdates(projectId: number): Promise<ProjectUpdate[]> {
    return Array.from(this.projectUpdatesList.values())
      .filter(update => update.projectId === projectId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createProjectUpdate(update: InsertProjectUpdate): Promise<ProjectUpdate> {
    const id = this.currentProjectUpdateId++;
    const now = new Date();
    const newUpdate: ProjectUpdate = {
      ...update,
      id,
      createdAt: now
    };
    this.projectUpdatesList.set(id, newUpdate);
    return newUpdate;
  }

  // User Applications methods
  async getUserApplications(email: string): Promise<Application[]> {
    return Array.from(this.applicationsList.values())
      .filter(app => app.email === email)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

// Database Storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    // Set up the PostgreSQL session store
    const PostgresStore = connectPg(session);
    this.sessionStore = new PostgresStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
      tableName: 'session'
    });
  }

  // Users methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser & { isAdmin?: boolean }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        username: insertUser.username,
        password: insertUser.password,
        isAdmin: insertUser.isAdmin || false,
      })
      .returning();
    return user;
  }

  // Blog posts methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set(post)
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return true;
  }

  // Partners methods
  async getPartners(): Promise<Partner[]> {
    return await db.select().from(partners);
  }

  async getPartner(id: number): Promise<Partner | undefined> {
    const [partner] = await db
      .select()
      .from(partners)
      .where(eq(partners.id, id));
    return partner;
  }

  async createPartner(partner: InsertPartner): Promise<Partner> {
    const [newPartner] = await db.insert(partners).values(partner).returning();
    return newPartner;
  }

  async updatePartner(id: number, partner: Partial<InsertPartner>): Promise<Partner | undefined> {
    const [updatedPartner] = await db
      .update(partners)
      .set(partner)
      .where(eq(partners.id, id))
      .returning();
    return updatedPartner;
  }

  async deletePartner(id: number): Promise<boolean> {
    await db.delete(partners).where(eq(partners.id, id));
    return true;
  }

  // Messages methods
  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.createdAt));
  }

  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, id));
    return message;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values({
        ...message,
        read: false,
      })
      .returning();
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const [updatedMessage] = await db
      .update(messages)
      .set({ read: true })
      .where(eq(messages.id, id))
      .returning();
    return updatedMessage;
  }

  async deleteMessage(id: number): Promise<boolean> {
    await db.delete(messages).where(eq(messages.id, id));
    return true;
  }

  // Careers methods
  async getCareers(): Promise<Career[]> {
    return await db.select().from(careers).orderBy(desc(careers.createdAt));
  }

  async getCareer(id: number): Promise<Career | undefined> {
    const [career] = await db
      .select()
      .from(careers)
      .where(eq(careers.id, id));
    return career;
  }

  async createCareer(career: InsertCareer): Promise<Career> {
    const [newCareer] = await db.insert(careers).values(career).returning();
    return newCareer;
  }

  async updateCareer(id: number, career: Partial<InsertCareer>): Promise<Career | undefined> {
    const [updatedCareer] = await db
      .update(careers)
      .set(career)
      .where(eq(careers.id, id))
      .returning();
    return updatedCareer;
  }

  async deleteCareer(id: number): Promise<boolean> {
    await db.delete(careers).where(eq(careers.id, id));
    return true;
  }

  // Applications methods
  async getApplications(careerId?: number): Promise<Application[]> {
    if (careerId) {
      return await db
        .select()
        .from(applications)
        .where(eq(applications.careerId, careerId))
        .orderBy(desc(applications.createdAt));
    }
    return await db
      .select()
      .from(applications)
      .orderBy(desc(applications.createdAt));
  }

  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, id));
    return application;
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const [newApplication] = await db
      .insert(applications)
      .values({
        ...application,
        status: "pending",
      })
      .returning();
    return newApplication;
  }

  async updateApplicationStatus(id: number, status: string): Promise<Application | undefined> {
    const [updatedApplication] = await db
      .update(applications)
      .set({ status })
      .where(eq(applications.id, id))
      .returning();
    return updatedApplication;
  }

  // Services methods
  async getServices(activeOnly?: boolean): Promise<Service[]> {
    if (activeOnly) {
      return await db
        .select()
        .from(services)
        .where(eq(services.active, true))
        .orderBy(asc(services.order));
    }
    return await db.select().from(services).orderBy(asc(services.order));
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, id));
    return service;
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.slug, slug));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined> {
    const [updatedService] = await db
      .update(services)
      .set(service)
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  async toggleServiceActive(id: number, active: boolean): Promise<Service | undefined> {
    const [updatedService] = await db
      .update(services)
      .set({ active })
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  async deleteService(id: number): Promise<boolean> {
    await db.delete(services).where(eq(services.id, id));
    return true;
  }

  // Projects methods
  async getProjects(userId: number): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values({
        ...project,
        status: project.status || "pending",
        completionPercentage: project.completionPercentage || 0
      })
      .returning();
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set(project)
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    await db.delete(projects).where(eq(projects.id, id));
    return true;
  }

  // Project Updates methods
  async getProjectUpdates(projectId: number): Promise<ProjectUpdate[]> {
    return await db
      .select()
      .from(projectUpdates)
      .where(eq(projectUpdates.projectId, projectId))
      .orderBy(desc(projectUpdates.createdAt));
  }

  async createProjectUpdate(update: InsertProjectUpdate): Promise<ProjectUpdate> {
    const [newUpdate] = await db
      .insert(projectUpdates)
      .values(update)
      .returning();
    return newUpdate;
  }

  // User Applications methods
  async getUserApplications(email: string): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.email, email))
      .orderBy(desc(applications.createdAt));
  }
}

// Use Database Storage
export const storage = new DatabaseStorage();
