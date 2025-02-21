import z from "zod";

export const findAll = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  name: z.string().optional(),
  nit: z.string().optional(),
});

export const findAllCostCenterContact = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  idCostCenter: z.coerce.number(),
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  role: z.string().optional()
});

export const findAllCostCenterProject = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  idCostCenter: z.coerce.number().optional(),
  name: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional()
});

export const findAllProjectItem = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  idCostCenterProject: z.coerce.number(),
});

export const findAllProjectDocument = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  idCostCenterProject: z.coerce.number(),
});

export const idCostCenter = z.object({
  idCostCenter: z.coerce.number(),
});

export const idCostCenterContact = z.object({
  idCostCenterContact: z.coerce.number(),
});

export const idCostCenterProject = z.object({
  idCostCenterProject: z.coerce.number(),
});

export const idProjectDocument = z.object({
  idProjectDocument: z.coerce.number(),
});

export const idProjectItem = z.object({
  idProjectItem: z.coerce.number(),
});

export const createCostCenter = z.object({
  nit: z.string(),
  name: z.string(),
  phone: z.string().optional()
});

export const createCostCenterContact = z.object({
  idCostCenter: z.coerce.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  role: z.string().optional()
});

export const createProjectDocument = z.object({
  idCostCenterProject: z.coerce.number(),
  description: z.string().optional(),
  value: z.string().optional(),
});

export const createProjectItem = z.object({
  idCostCenterProject: z.coerce.number(),
  item: z.string(),
  unitMeasure: z.string(),
  quantity: z.string(),
  unitPrice: z.string(),
  total: z.string().optional()
});

export const createCostCenterProject = z.object({
  idCostCenter: z.coerce.number(),
  name: z.string(),
  location: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional()
});

export const updateCostCenterProject = z.object({
  idCostCenterProject: z.coerce.number(),
  idCostCenter: z.coerce.number().optional(),
  name: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional()
});

export const updateCostCenter = z.object({
  idCostCenter: z.coerce.number(),
  nit: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional()
});

export const updateProjectDocument = z.object({
  idProjectDocument: z.coerce.number(),
  idCostCenterProject: z.coerce.number().optional(),
  description: z.string().optional(),
  value: z.string().optional()
});

export const updateProjectItem = z.object({
  idProjectItem: z.coerce.number(),
  idCostCenterProject: z.coerce.number().optional(),
  item: z.string().optional(),
  unitMeasure: z.string().optional(),
  quantity: z.string().optional(),
  unitPrice: z.string().optional(),
  total: z.string().optional()
});

export const updateCostCenterContact = z.object({
  idCostCenterContact: z.coerce.number(),
  idCostCenter: z.coerce.number().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  role: z.string().optional()
});