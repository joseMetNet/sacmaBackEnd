import z from "zod";

export const registerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string().optional(),
  userName: z.string().optional(),
  address: z.string(),
  phoneNumber: z.string(),
  idIdentityCard: z.coerce.number(),
  identityCardNumber: z.string(),
  identityCardExpeditionDate: z.string(),
  idIdentityCardExpeditionCity: z.coerce.number(),
  idRole: z.coerce.number(),
  idPosition: z.coerce.number().optional(),
  idContractType: z.coerce.number().optional(),
  entryDate: z.string().optional(),
  baseSalary: z.string().optional(),
  compensation: z.string().optional(),
  idPaymentType: z.coerce.number().optional(),
  bankAccountNumber: z.string().optional(),
  idBankAccount: z.coerce.number().optional(),
  idEps: z.coerce.number().optional(),
  idArl: z.coerce.number().optional(),
  severancePay: z.string().optional(),
  emergencyContactfirstName: z.string().optional(),
  emergencyContactlastName: z.string().optional(),
  emergencyContactphoneNumber: z.string().optional(),
  emergencyContactkinship: z.string().optional(),
  idPensionFund: z.coerce.number().optional(),
  idCompensationFund: z.coerce.number().optional(),
  imageProfile: z.string().optional(),
});

export const createRefreshTokenSchema = z.object({
  idUser: z.coerce.number(),
});

export const revokeRefreshTokenSchema = z.object({
  idUser: z.coerce.number(),
  idRefreshToken: z.coerce.number()
});

export const loginSchema = z.object({
  email: z.string().max(50),
  password: z.string().max(40),
});
