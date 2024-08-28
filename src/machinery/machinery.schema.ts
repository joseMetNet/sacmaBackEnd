import z from "zod";

export const findAllMachinerySchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  idMachineryType: z.coerce.number().optional(),
  idMachineryBrand: z.coerce.number().optional(),
  serial: z.string().optional(),
  idMachineryStatus: z.coerce.number().optional(),
});

export const findAllMachineryLocationSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  idMachinery: z.coerce.number()
});

export const findAllMachineryMaintenanceSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  idMachinery: z.coerce.number(),
});

export const createMachinerySchema = z.object({
  serial: z.string(),
  description: z.string(),
  price: z.string(),
  idMachineryModel: z.coerce.number(),
  idMachineryType: z.coerce.number(),
  idMachineryBrand: z.coerce.number(),
  idMachineryStatus: z.coerce.number(),
  status: z.string().optional(),
});

export const createMachineryLocationSchema = z.object({
  idMachinery: z.coerce.number(),
  idProject: z.coerce.number(),
  idEmployee: z.coerce.number(),
  modificationDate: z.string(),
  assignmentDate: z.string(),
});

export const updateMachinerySchema = z.object({
  idMachinery: z.coerce.number(),
  serial: z.string().optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  idMachineryModel: z.coerce.number().optional(),
  idMachineryType: z.coerce.number().optional(),
  idMachineryBrand: z.coerce.number().optional(),
  idMachineryStatus: z.coerce.number().optional(),
  status: z.string().optional(),
});

export const createMachineryMaintenanceSchema = z.object({
  idMachinery: z.coerce.number(),
  maintenanceDate: z.string(),
  maintenanceEffectiveDate: z.string(),
  documentName: z.string(),
});

export const machineryIdSchema = z.object({
  idMachinery: z.coerce.number(),
});

export const machineryMaintenanceIdSchema = z.object({
  idMachineryMaintenance: z.coerce.number(),
});