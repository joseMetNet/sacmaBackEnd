import z from "zod";

export const employeeRequestSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  firstName: z.string().optional(),
  identityCardNumber: z.string().optional(),
});

export const updateEmployeeSchema = z.object({
  idUser: z.coerce.number(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  idIdentityCard: z.coerce.number().optional(),
  identityCardNumber: z.string().optional(),
  identityCardExpeditionDate: z.string().optional(),
  idIdentityCardExpeditionCity: z.coerce.number().optional(),
  idRole: z.coerce.number().optional(),
  idPosition: z.coerce.number().optional(),
  idContractType: z.coerce.number().optional(),
  entryDate: z.string().optional(),
  baseSalary: z.string().optional(),
  birthDate: z.string().optional(),
  compensation: z.string().optional(),
  idPaymentType: z.coerce.number().optional(),
  bankAccountNumber: z.string().optional(),
  idBankAccount: z.coerce.number().optional(),
  idEps: z.coerce.number().optional(),
  idArl: z.coerce.number().optional(),
  idSeverancePay: z.coerce.number().optional(),
  userName: z.string().optional(),
  emergencyContactfirstName: z.string().optional(),
  emergencyContactlastName: z.string().optional(),
  emergencyContactphoneNumber: z.string().optional(),
  emergencyContactkinship: z.string().optional(),
  idPensionFund: z.coerce.number().optional(),
  idCompensationFund: z.coerce.number().optional(),
  status: z.boolean().optional(),
});

export const querySchema = z.object({
  idEmployee: z.coerce.number()
});

export const requiredEmployeeSchema = z.object({
  idEmployee: z.coerce.number(),
  idRequiredDocument: z.coerce.number(),
  expirationDate: z.string().optional()
});