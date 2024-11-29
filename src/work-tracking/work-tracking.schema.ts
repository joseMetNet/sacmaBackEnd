import z, { date } from "zod";

export const findAll = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  idEmployee: z.coerce.number().optional(),
  employeeName: z.coerce.string().optional(),
  idCostCenterProject: z.coerce.number().optional(),
  projectName: z.coerce.string().optional(),
  month: z.coerce.number().optional(),
  year: z.coerce.number().optional(),
});

export const findAllByEmployee = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  idEmployee: z.coerce.number().optional(),
  idCostCenterProject: z.coerce.number().optional(),
  projectName: z.coerce.string().optional(),
  createdAt: z.coerce.string().optional(),
});

export const findDailyWorkTrackingByEmployee = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  year: z.coerce.string().optional(),
  month: z.coerce.string().optional(),
  createdAt: z.coerce.string().optional(),
});

export const idWorkTracking = z.object({
  idWorkTracking: z.coerce.number(),
});

export const createWorkTracking = z.object({
  idEmployee: z.coerce.number(),
  idCostCenterProject: z.coerce.number(),
  hoursWorked: z.coerce.number().optional(),
  overtimeHour: z.coerce.number().optional(),
  idNovelty: z.coerce.number().optional(),
  createdAt: z.coerce.string().optional()
});

export const updateWorkTracking = z.object({
  idWorkTracking: z.coerce.number(),
  idEmployee: z.coerce.number().optional(),
  idCostCenterProject: z.coerce.number().optional(),
  hoursWorked: z.coerce.number().optional(),
  overtimeHour: z.coerce.number().optional(),
  idNovelty: z.coerce.number().optional(),
});

export const createWorkTrackingArray = z.array(createWorkTracking);
