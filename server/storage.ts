import {
  type User, type InsertUser, type Crop, type InsertCrop, type Field, type InsertField,
  type DroneConnection, type InsertDroneConnection, type PlantHealthRecord,
  type InsertPlantHealthRecord, type PesticideApplication, type InsertPesticideApplication,
  type ContactMessage, type InsertContactMessage
} from "@shared/schema";
import { randomUUID } from "crypto";
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials not found. Falling back to MemStorage.");
}

const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Crop operations
  getCropsByUserId(userId: string): Promise<Crop[]>;
  getCrop(id: string): Promise<Crop | undefined>;
  createCrop(crop: InsertCrop): Promise<Crop>;
  updateCrop(id: string, crop: Partial<Crop>): Promise<Crop | undefined>;
  deleteCrop(id: string): Promise<boolean>;

  // Field operations
  getFieldsByUserId(userId: string): Promise<Field[]>;
  getField(id: string): Promise<Field | undefined>;
  createField(field: InsertField): Promise<Field>;

  // Drone operations
  getDronesByUserId(userId: string): Promise<DroneConnection[]>;
  getDrone(id: string): Promise<DroneConnection | undefined>;
  createDroneConnection(drone: InsertDroneConnection): Promise<DroneConnection>;
  updateDrone(id: string, drone: Partial<DroneConnection>): Promise<DroneConnection | undefined>;

  // Plant health operations
  getHealthRecordsByFieldId(fieldId: string): Promise<PlantHealthRecord[]>;
  getHealthRecordsByUserId(userId: string): Promise<PlantHealthRecord[]>;
  createHealthRecord(record: InsertPlantHealthRecord): Promise<PlantHealthRecord>;

  // Pesticide operations
  getPesticideApplicationsByFieldId(fieldId: string): Promise<PesticideApplication[]>;
  getPesticideApplicationsByUserId(userId: string): Promise<PesticideApplication[]>;
  createPesticideApplication(application: InsertPesticideApplication): Promise<PesticideApplication>;
  updatePesticideApplication(id: string, application: Partial<PesticideApplication>): Promise<PesticideApplication | undefined>;

  // Contact operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private crops: Map<string, Crop>;
  private fields: Map<string, Field>;
  private drones: Map<string, DroneConnection>;
  private healthRecords: Map<string, PlantHealthRecord>;
  private pesticideApplications: Map<string, PesticideApplication>;
  private contactMessages: Map<string, ContactMessage>;

  constructor() {
    this.users = new Map();
    this.crops = new Map();
    this.fields = new Map();
    this.drones = new Map();
    this.healthRecords = new Map();
    this.pesticideApplications = new Map();
    this.contactMessages = new Map();

    // Initialize with sample user
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleUserId = randomUUID();
    const sampleUser: User = {
      id: sampleUserId,
      username: "farmer1",
      email: "farmer1@example.com",
      password: "$2b$10$ITOAicsj1lEPrdK0ttJG/.MXbRHaNX47eFT6.zeGDxqe4agAKydUa", // password123
      fullName: "Rajesh Kumar",
      role: "farmer",
      createdAt: new Date(),
    };
    this.users.set(sampleUserId, sampleUser);

    // Sample crop
    const sampleCropId = randomUUID();
    const sampleCrop: Crop = {
      id: sampleCropId,
      userId: sampleUserId,
      name: "Main Rice Field",
      type: "rice",
      plantedDate: new Date("2024-03-15"),
      expectedHarvestDate: new Date("2024-08-20"),
      growthStage: "flowering",
      area: 2.5,
      isActive: true,
      createdAt: new Date(),
    };
    this.crops.set(sampleCropId, sampleCrop);

    // Sample fields - using the specified coordinates
    const field1Id = randomUUID();
    const field1: Field = {
      id: field1Id,
      userId: sampleUserId,
      cropId: sampleCropId,
      name: "Punjab Field Zone A",
      latitude: 30.5795555, // Center of the specified area
      longitude: 75.9249285, // Center of the specified area
      area: 1.2,
      boundaries: JSON.stringify([
        [30.577888, 75.921646], // Southwest corner
        [30.581223, 75.921646], // Southeast corner
        [30.581223, 75.928211], // Northeast corner
        [30.577888, 75.928211]  // Northwest corner
      ]),
      createdAt: new Date(),
    };
    this.fields.set(field1Id, field1);

    // Sample drone
    const droneId = randomUUID();
    const drone: DroneConnection = {
      id: droneId,
      userId: sampleUserId,
      droneName: "Drone Alpha-1",
      connectionType: "wifi",
      status: "connected",
      batteryLevel: 87,
      lastSeen: new Date(),
      createdAt: new Date(),
    };
    this.drones.set(droneId, drone);

    // Sample health records
    const healthRecordId = randomUUID();
    const healthRecord: PlantHealthRecord = {
      id: healthRecordId,
      fieldId: field1Id,
      droneId: droneId,
      healthScore: 94,
      infectionRate: 3.2,
      infectionType: "aphid",
      severity: "low",
      latitude: 30.5798, // Within the specified area
      longitude: 75.9252, // Within the specified area
      detectionConfidence: 85,
      recordedAt: new Date(),
    };
    this.healthRecords.set(healthRecordId, healthRecord);

    // Sample pesticide application
    const applicationId = randomUUID();
    const application: PesticideApplication = {
      id: applicationId,
      fieldId: field1Id,
      healthRecordId: healthRecordId,
      pesticideType: "Neem oil spray",
      volumePerHectare: 2.5,
      totalVolume: 3.0,
      applicationMethod: "drone",
      status: "recommended",
      recommendedBy: "ai_system",
      confidence: 85,
      scheduledFor: null,
      appliedAt: null,
      createdAt: new Date(),
    };
    this.pesticideApplications.set(applicationId, application);
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || 'farmer',
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Crop operations
  async getCropsByUserId(userId: string): Promise<Crop[]> {
    return Array.from(this.crops.values()).filter(crop => crop.userId === userId);
  }

  async getCrop(id: string): Promise<Crop | undefined> {
    return this.crops.get(id);
  }

  async createCrop(insertCrop: InsertCrop): Promise<Crop> {
    const id = randomUUID();
    const crop: Crop = {
      ...insertCrop,
      id,
      growthStage: insertCrop.growthStage || 'seedling',
      isActive: insertCrop.isActive ?? true,
      createdAt: new Date()
    };
    this.crops.set(id, crop);
    return crop;
  }

  async updateCrop(id: string, cropUpdate: Partial<Crop>): Promise<Crop | undefined> {
    const crop = this.crops.get(id);
    if (crop) {
      const updatedCrop = { ...crop, ...cropUpdate };
      this.crops.set(id, updatedCrop);
      return updatedCrop;
    }
    return undefined;
  }

  async deleteCrop(id: string): Promise<boolean> {
    return this.crops.delete(id);
  }

  // Field operations
  async getFieldsByUserId(userId: string): Promise<Field[]> {
    return Array.from(this.fields.values()).filter(field => field.userId === userId);
  }

  async getField(id: string): Promise<Field | undefined> {
    return this.fields.get(id);
  }

  async createField(insertField: InsertField): Promise<Field> {
    const id = randomUUID();
    const field: Field = {
      ...insertField,
      id,
      cropId: insertField.cropId || null,
      boundaries: insertField.boundaries || null,
      createdAt: new Date()
    };
    this.fields.set(id, field);
    return field;
  }

  // Drone operations
  async getDronesByUserId(userId: string): Promise<DroneConnection[]> {
    return Array.from(this.drones.values()).filter(drone => drone.userId === userId);
  }

  async getDrone(id: string): Promise<DroneConnection | undefined> {
    return this.drones.get(id);
  }

  async createDroneConnection(insertDrone: InsertDroneConnection): Promise<DroneConnection> {
    const id = randomUUID();
    const drone: DroneConnection = {
      ...insertDrone,
      id,
      status: insertDrone.status || 'connected',
      batteryLevel: insertDrone.batteryLevel || 100,
      lastSeen: new Date(),
      createdAt: new Date()
    };
    this.drones.set(id, drone);
    return drone;
  }

  async updateDrone(id: string, droneUpdate: Partial<DroneConnection>): Promise<DroneConnection | undefined> {
    const drone = this.drones.get(id);
    if (drone) {
      const updatedDrone = { ...drone, ...droneUpdate, lastSeen: new Date() };
      this.drones.set(id, updatedDrone);
      return updatedDrone;
    }
    return undefined;
  }

  // Plant health operations
  async getHealthRecordsByFieldId(fieldId: string): Promise<PlantHealthRecord[]> {
    return Array.from(this.healthRecords.values()).filter(record => record.fieldId === fieldId);
  }

  async getHealthRecordsByUserId(userId: string): Promise<PlantHealthRecord[]> {
    const userFields = await this.getFieldsByUserId(userId);
    const fieldIds = userFields.map(field => field.id);
    return Array.from(this.healthRecords.values()).filter(record => fieldIds.includes(record.fieldId));
  }

  async createHealthRecord(insertRecord: InsertPlantHealthRecord): Promise<PlantHealthRecord> {
    const id = randomUUID();
    const record: PlantHealthRecord = {
      ...insertRecord,
      id,
      latitude: insertRecord.latitude || null,
      longitude: insertRecord.longitude || null,
      droneId: insertRecord.droneId || null,
      infectionType: insertRecord.infectionType || null,
      recordedAt: new Date()
    };
    this.healthRecords.set(id, record);
    return record;
  }

  // Pesticide operations
  async getPesticideApplicationsByFieldId(fieldId: string): Promise<PesticideApplication[]> {
    return Array.from(this.pesticideApplications.values()).filter(app => app.fieldId === fieldId);
  }

  async getPesticideApplicationsByUserId(userId: string): Promise<PesticideApplication[]> {
    const userFields = await this.getFieldsByUserId(userId);
    const fieldIds = userFields.map(field => field.id);
    return Array.from(this.pesticideApplications.values()).filter(app => fieldIds.includes(app.fieldId));
  }

  async createPesticideApplication(insertApplication: InsertPesticideApplication): Promise<PesticideApplication> {
    const id = randomUUID();
    const application: PesticideApplication = {
      ...insertApplication,
      id,
      healthRecordId: insertApplication.healthRecordId || null,
      status: insertApplication.status || 'recommended',
      recommendedBy: insertApplication.recommendedBy || 'ai_system',
      applicationMethod: insertApplication.applicationMethod || 'drone',
      scheduledFor: insertApplication.scheduledFor || null,
      appliedAt: insertApplication.appliedAt || null,
      createdAt: new Date()
    };
    this.pesticideApplications.set(id, application);
    return application;
  }

  async updatePesticideApplication(id: string, applicationUpdate: Partial<PesticideApplication>): Promise<PesticideApplication | undefined> {
    const application = this.pesticideApplications.get(id);
    if (application) {
      const updatedApplication = { ...application, ...applicationUpdate };
      this.pesticideApplications.set(id, updatedApplication);
      return updatedApplication;
    }
    return undefined;
  }

  // Contact operations
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = {
      ...insertMessage,
      id,
      status: "new",
      createdAt: new Date()
    };
    this.contactMessages.set(id, message);
    return message;
  }
}

export class SupabaseStorage implements IStorage {
  private getSupabase() {
    if (!supabase) {
      throw new Error("Supabase client not initialized. Check your environment variables.");
    }
    return supabase;
  }

  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await this.getSupabase().from('users').select('*').eq('id', id).single();
    if (error || !data) return undefined;
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await this.getSupabase().from('users').select('*').eq('username', username).single();
    if (error || !data) return undefined;
    return data as User;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await this.getSupabase().from('users').select('*').eq('email', email).single();
    if (error || !data) return undefined;
    return data as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await this.getSupabase().from('users').insert([{
      ...insertUser,
      role: insertUser.role || 'farmer',
      createdAt: new Date().toISOString()
    }]).select().single();
    if (error) throw new Error(error.message);
    return data as User;
  }

  async getCropsByUserId(userId: string): Promise<Crop[]> {
    const { data, error } = await this.getSupabase().from('crops').select('*').eq('user_id', userId);
    if (error) return [];
    return data as Crop[];
  }

  async getCrop(id: string): Promise<Crop | undefined> {
    const { data, error } = await this.getSupabase().from('crops').select('*').eq('id', id).single();
    if (error || !data) return undefined;
    return data as Crop;
  }

  async createCrop(insertCrop: InsertCrop): Promise<Crop> {
    const { data, error } = await this.getSupabase().from('crops').insert([{
      ...insertCrop,
      growthStage: insertCrop.growthStage || 'seedling',
      isActive: insertCrop.isActive ?? true,
      createdAt: new Date().toISOString()
    }]).select().single();
    if (error) throw new Error(error.message);
    return data as Crop;
  }

  async updateCrop(id: string, cropUpdate: Partial<Crop>): Promise<Crop | undefined> {
    const { data, error } = await this.getSupabase().from('crops').update(cropUpdate).eq('id', id).select().single();
    if (error || !data) return undefined;
    return data as Crop;
  }

  async deleteCrop(id: string): Promise<boolean> {
    const { error } = await this.getSupabase().from('crops').delete().eq('id', id);
    return !error;
  }

  async getFieldsByUserId(userId: string): Promise<Field[]> {
    const { data, error } = await this.getSupabase().from('fields').select('*').eq('user_id', userId);
    if (error) return [];
    return data as Field[];
  }

  async getField(id: string): Promise<Field | undefined> {
    const { data, error } = await this.getSupabase().from('fields').select('*').eq('id', id).single();
    if (error || !data) return undefined;
    return data as Field;
  }

  async createField(insertField: InsertField): Promise<Field> {
    const { data, error } = await this.getSupabase().from('fields').insert([{
      ...insertField,
      createdAt: new Date().toISOString()
    }]).select().single();
    if (error) throw new Error(error.message);
    return data as Field;
  }

  async getDronesByUserId(userId: string): Promise<DroneConnection[]> {
    const { data, error } = await this.getSupabase().from('drone_connections').select('*').eq('user_id', userId);
    if (error) return [];
    return data as DroneConnection[];
  }

  async getDrone(id: string): Promise<DroneConnection | undefined> {
    const { data, error } = await this.getSupabase().from('drone_connections').select('*').eq('id', id).single();
    if (error || !data) return undefined;
    return data as DroneConnection;
  }

  async createDroneConnection(insertDrone: InsertDroneConnection): Promise<DroneConnection> {
    const { data, error } = await this.getSupabase().from('drone_connections').insert([{
      ...insertDrone,
      status: insertDrone.status || 'connected',
      batteryLevel: insertDrone.batteryLevel || 100,
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }]).select().single();
    if (error) throw new Error(error.message);
    return data as DroneConnection;
  }

  async updateDrone(id: string, droneUpdate: Partial<DroneConnection>): Promise<DroneConnection | undefined> {
    const { data, error } = await this.getSupabase().from('drone_connections').update({
      ...droneUpdate,
      lastSeen: new Date().toISOString()
    }).eq('id', id).select().single();
    if (error || !data) return undefined;
    return data as DroneConnection;
  }

  async getHealthRecordsByFieldId(fieldId: string): Promise<PlantHealthRecord[]> {
    const { data, error } = await this.getSupabase().from('plant_health_records').select('*').eq('field_id', fieldId);
    if (error) return [];
    return data as PlantHealthRecord[];
  }

  async getHealthRecordsByUserId(userId: string): Promise<PlantHealthRecord[]> {
    const fields = await this.getFieldsByUserId(userId);
    const fieldIds = fields.map(f => f.id);
    const { data, error } = await this.getSupabase().from('plant_health_records').select('*').in('field_id', fieldIds);
    if (error) return [];
    return data as PlantHealthRecord[];
  }

  async createHealthRecord(insertRecord: InsertPlantHealthRecord): Promise<PlantHealthRecord> {
    const { data, error } = await this.getSupabase().from('plant_health_records').insert([{
      ...insertRecord,
      recordedAt: new Date().toISOString()
    }]).select().single();
    if (error) throw new Error(error.message);
    return data as PlantHealthRecord;
  }

  async getPesticideApplicationsByFieldId(fieldId: string): Promise<PesticideApplication[]> {
    const { data, error } = await this.getSupabase().from('pesticide_applications').select('*').eq('field_id', fieldId);
    if (error) return [];
    return data as PesticideApplication[];
  }

  async getPesticideApplicationsByUserId(userId: string): Promise<PesticideApplication[]> {
    const fields = await this.getFieldsByUserId(userId);
    const fieldIds = fields.map(f => f.id);
    const { data, error } = await this.getSupabase().from('pesticide_applications').select('*').in('field_id', fieldIds);
    if (error) return [];
    return data as PesticideApplication[];
  }

  async createPesticideApplication(insertApplication: InsertPesticideApplication): Promise<PesticideApplication> {
    const { data, error } = await this.getSupabase().from('pesticide_applications').insert([{
      ...insertApplication,
      status: insertApplication.status || 'recommended',
      recommendedBy: insertApplication.recommendedBy || 'ai_system',
      applicationMethod: insertApplication.applicationMethod || 'drone',
      createdAt: new Date().toISOString()
    }]).select().single();
    if (error) throw new Error(error.message);
    return data as PesticideApplication;
  }

  async updatePesticideApplication(id: string, applicationUpdate: Partial<PesticideApplication>): Promise<PesticideApplication | undefined> {
    const { data, error } = await this.getSupabase().from('pesticide_applications').update(applicationUpdate).eq('id', id).select().single();
    if (error || !data) return undefined;
    return data as PesticideApplication;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const { data, error } = await this.getSupabase().from('contact_messages').insert([{
      ...insertMessage,
      status: "new",
      createdAt: new Date().toISOString()
    }]).select().single();
    if (error) throw new Error(error.message);
    return data as ContactMessage;
  }
}

// Automatically use Supabase if credentials are present (Vercel), otherwise fallback to MemStorage (Local)
console.log("Initializing storage...");
console.log("VITE_SUPABASE_URL present:", !!supabaseUrl);
console.log("VITE_SUPABASE_ANON_KEY present:", !!supabaseAnonKey);

export const storage = (supabaseUrl && supabaseAnonKey) ? new SupabaseStorage() : new MemStorage();
if (supabaseUrl && supabaseAnonKey) {
  console.log("Using SupabaseStorage");
} else {
  console.log("Using MemStorage (Falling back - Check Env Vars if this is Vercel)");
}
