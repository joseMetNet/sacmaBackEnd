import { z } from "zod";

export const getReportEmployees = z.object({
  year: z.coerce.number().int().optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  bimester: z.coerce.number().int().min(1).max(6).optional(),
  semester: z.coerce.number().int().min(1).max(2).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  idEmployee: z.coerce.number().int().optional(),
  employeeStatus: z.coerce.number().int().min(0).max(1).optional(),
  idContractType: z.coerce.number().int().optional(),
  idNovelty: z.coerce.number().int().optional(),
  salaryMin: z.coerce.number().min(0).optional(),
  salaryMax: z.coerce.number().min(0).optional(),
  idPosition: z.coerce.number().int().optional(),
  idRole: z.coerce.number().int().optional(),
});

export type GetReportEmployeesDTO = z.infer<typeof getReportEmployees>;
