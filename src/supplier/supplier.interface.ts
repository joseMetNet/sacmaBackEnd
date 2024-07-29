export interface FindAllDTO {
  page?: number;
  pageSize?: number;
  socialReason?: string;
}

export interface CreateSupplierDTO {
  socialReason: string;
  nit: string;
  telephone: string;
  phoneNumber: string;
  idState: number;
  idCity: number;
  address: string;
  status: boolean;
  imageProfile?: string;
  idAccountType?: number;
  idBankAccount?: number;
  accountNumber?: string;
  accountHolder?: string;
  accountHolderId?: string;
  paymentMethod?: string;
  observation?: string;
  contactInfo?: CreateContactSupplierDTO[];
}

export interface CreateContactSupplierDTO {
  supplierContactName?: string;
  supplierContactEmail?: string;
  supplierContactPhoneNumber?: string;
  supplierContactPosition?: string;
}

export interface UpdateSupplierDTO {
  idSupplier: number;
  socialReason?: string;
  nit?: string;
  telephone?: string;
  phoneNumber?: string;
  idState?: number;
  idCity?: number;
  address?: string;
  status?: boolean;
  imageProfile?: string;
  idAccountType?: number;
  idBankAccount?: number;
  accountNumber?: string;
  accountHolder?: string;
  accountHolderId?: string;
  paymentMethod?: string;
  observation?: string;
}

export interface UploadSupplierDocumentDTO {
  idSupplier: number;
  idDocumentType: number;
}