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
  idMachinery: z.coerce.number(),
  idCostCenterProject: z.coerce.number().optional(),
  nameCostCenterProject: z.string().optional(),
});

export const findAllMachineryMaintenanceSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  idMachinery: z.coerce.number(),
  documentName: z.string().optional(),
});

export const createMachinerySchema = z.object({
  serial: z.string(),
  description: z.string(),
  price: z.string(),
  idMachineryModel: z.coerce.number(),
  idMachineryType: z.coerce.number(),
  idMachineryBrand: z.coerce.number(),
  idMachineryStatus: z.coerce.number(),
});

export const createMachineryLocationSchema = z.object({
  idMachinery: z.coerce.number(),
  idCostCenterProject: z.coerce.number(),
  idEmployee: z.coerce.number(),
  assignmentDate: z.string(),
});

export const createMachineryBrandSchema = z.object({
  machineryBrand: z.string(),
});

export const updateMachineryLocationSchema = z.object({
  idMachineryLocationHistory: z.coerce.number(),
  idMachinery: z.coerce.number().optional(),
  idCostCenterProject: z.coerce.number().optional(),
  idEmployee: z.coerce.number().optional(),
  assignmentDate: z.string().optional(),
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
});

export const createMachineryMaintenanceSchema = z.object({
  idMachinery: z.coerce.number(),
  maintenanceDate: z.string(),
  maintenanceEffectiveDate: z.string(),
  documentName: z.string().optional(),
});

export const machineryIdSchema = z.object({
  idMachinery: z.coerce.number(),
});

export const uploadMachineryDocument = z.object({
  idMachinery: z.coerce.number(),
  idMachineryDocumentType: z.coerce.number(),
});

export const machineryMaintenanceIdSchema = z.object({
  idMachineryMaintenance: z.coerce.number(),
});

export const machineryLocationIdSchema = z.object({
  idMachineryLocationHistory: z.coerce.number(),
});