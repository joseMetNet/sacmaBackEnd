import z from "zod";

export const findAllSupplierSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  socialReason: z.string().optional(),
});

export const supplierIdSchema = z.object({
  id: z.coerce.number(),
});

export const createSupplierSchema = z.object({
  socialReason: z.string(),
  nit: z.string(),
  telephone: z.string(),
  phoneNumber: z.string(),
  idState: z.coerce.number(),
  idCity: z.coerce.number(),
  address: z.string(),
  status: z.coerce.boolean(),
  imageProfile: z.string().optional(),
  idAccountType: z.coerce.number().optional(),
  idBankAccount: z.coerce.number().optional(),
  accountNumber: z.string().optional(),
  accountHolder: z.string().optional(),
  accountHolderId: z.string().optional(),
  paymentMethod: z.string().optional(),
  observation: z.string().optional(),
  contactInfo: z.array(z.object({
    supplierContactName: z.string().optional(),
    supplierContactEmail: z.string().optional(),
    supplierContactPhoneNumber: z.string().optional(),
    supplierContactPosition: z.string().optional(),
  })).optional()
});

export const contactSupplierSchema = z.object({
  contactInfo: z.array(z.object({
    supplierContactName: z.string().optional(),
    supplierContactEmail: z.string().optional(),
    supplierContactPhoneNumber: z.string().optional(),
    supplierContactPosition: z.string().optional(),
  })).optional()
});

export const updateSupplierSchema = z.object({
  idSupplier: z.coerce.number(),
  socialReason: z.string().optional(),
  nit: z.string().optional(),
  telephone: z.string().optional(),
  phoneNumber: z.string().optional(),
  idState: z.coerce.number().optional(),
  idCity: z.coerce.number().optional(),
  address: z.string().optional(),
  status: z.coerce.boolean().optional(),
  imageProfile: z.string().optional(),
  idAccountType: z.coerce.number().optional(),
  idBankAccount: z.coerce.number().optional(),
  accountNumber: z.string().optional(),
  accountHolder: z.string().optional(),
  accountHolderId: z.string().optional(),
  paymentMethod: z.string().optional(),
  observation: z.string().optional(),
  contactInfo: z.array(z.object({
    supplierContactName: z.string().optional(),
    supplierContactEmail: z.string().optional(),
    supplierContactPhoneNumber: z.string().optional(),
    supplierContactPosition: z.string().optional(),
  })).optional()
});

export const supplierSupplierDocumentSchema = z.object({
  idSupplier: z.coerce.number(),
  idDocumentType: z.coerce.number(),
});