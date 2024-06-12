import z from "zod";

export const employeeRequestSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  firstName: z.string().optional(),
  identityCardNumber: z.string().optional(),
});

export const updateEmployeeSchema = z.object({
  idUser: z.number(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  idIdentityCard: z.number().optional(),
  identityCardNumber: z.string().optional(),
  identityCardExpeditionDate: z.string().optional(),
  idIdentityCardExpeditionCity: z.number().optional(),
  idRole: z.number().optional(),
  idPosition: z.number().optional(),
  idContractType: z.number().optional(),
  entryDate: z.string().optional(),
  baseSalary: z.string().optional(),
  compensation: z.string().optional(),
  idPaymentType: z.number().optional(),
  bankAccountNumber: z.string().optional(),
  idBankAccount: z.number().optional(),
  idEps: z.number().optional(),
  idArl: z.number().optional(),
  severancePay: z.string().optional(),
  userName: z.string().optional(),
  emergencyContactfirstName: z.string().optional(),
  emergencyContactlastName: z.string().optional(),
  emergencyContactphoneNumber: z.string().optional(),
  emergencyContactkinship: z.string().optional(),
  idPensionFund: z.number().optional(),
  idCompensationFund: z.number().optional(),
});

export const querySchema = z.object({
  idEmployee: z.coerce.number()
});
