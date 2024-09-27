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
  idCostCenter: z.coerce.number(),
  name: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional()
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

export const updateCostCenterContact = z.object({
  idCostCenterContact: z.coerce.number(),
  idCostCenter: z.coerce.number().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  role: z.string().optional()
});