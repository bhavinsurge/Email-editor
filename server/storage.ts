import { type User, type InsertUser, type EmailTemplate, type InsertEmailTemplate, type UpdateEmailTemplate } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getEmailTemplate(id: string): Promise<EmailTemplate | undefined>;
  getEmailTemplates(userId?: string): Promise<EmailTemplate[]>;
  createEmailTemplate(template: InsertEmailTemplate & { userId?: string }): Promise<EmailTemplate>;
  updateEmailTemplate(id: string, template: UpdateEmailTemplate): Promise<EmailTemplate | undefined>;
  deleteEmailTemplate(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private emailTemplates: Map<string, EmailTemplate>;

  constructor() {
    this.users = new Map();
    this.emailTemplates = new Map();
    
    // Add some sample templates
    this.seedTemplates();
  }

  private seedTemplates() {
    const sampleTemplates: EmailTemplate[] = [
      {
        id: "template-1",
        name: "Newsletter Template",
        subject: "Weekly Newsletter",
        content: {
          type: "newsletter",
          components: [
            { type: "header", title: "Weekly Newsletter", subtitle: "Stay updated with our latest news" },
            { type: "text", content: "Hello there! Here's what's new this week." },
            { type: "button", text: "Read More", href: "#" }
          ]
        },
        htmlContent: null,
        userId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "template-2",
        name: "Welcome Email",
        subject: "Welcome to our platform!",
        content: {
          type: "welcome",
          components: [
            { type: "header", title: "Welcome!", subtitle: "Get started with your journey" },
            { type: "text", content: "We're excited to have you on board." },
            { type: "button", text: "Get Started", href: "#" }
          ]
        },
        htmlContent: null,
        userId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleTemplates.forEach(template => {
      this.emailTemplates.set(template.id, template);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getEmailTemplate(id: string): Promise<EmailTemplate | undefined> {
    return this.emailTemplates.get(id);
  }

  async getEmailTemplates(userId?: string): Promise<EmailTemplate[]> {
    const templates = Array.from(this.emailTemplates.values());
    if (userId) {
      return templates.filter(template => template.userId === userId || template.userId === null);
    }
    return templates;
  }

  async createEmailTemplate(templateData: InsertEmailTemplate & { userId?: string }): Promise<EmailTemplate> {
    const id = randomUUID();
    const template: EmailTemplate = {
      ...templateData,
      id,
      userId: templateData.userId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.emailTemplates.set(id, template);
    return template;
  }

  async updateEmailTemplate(id: string, templateData: UpdateEmailTemplate): Promise<EmailTemplate | undefined> {
    const existing = this.emailTemplates.get(id);
    if (!existing) return undefined;

    const updated: EmailTemplate = {
      ...existing,
      ...templateData,
      updatedAt: new Date(),
    };
    
    this.emailTemplates.set(id, updated);
    return updated;
  }

  async deleteEmailTemplate(id: string): Promise<boolean> {
    return this.emailTemplates.delete(id);
  }
}

export const storage = new MemStorage();
