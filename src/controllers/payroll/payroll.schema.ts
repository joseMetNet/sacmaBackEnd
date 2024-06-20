import z from "zod";

export const uploadPayrollSchema = z.object({
  idEmployee: z.coerce.number(),
  paymentDate: z.string(),
});

export const findAllPayrollSchema = z.object({
  idEmployee: z.coerce.number(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  year: z.coerce.number().optional(),
  month: z.coerce.number().optional(),
});

export const updatePayrollSchema = z.object({
  idEmployeePayroll: z.coerce.number(),
  paymentDate: z.string().optional(),
  document: z.string().optional(),
});

export const findPayrollByIdSchema = z.object({
  idEmployeePayroll: z.coerce.number(),
});