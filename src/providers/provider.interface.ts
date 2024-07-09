export interface FindAllDTO {
  page?: number;
  pageSize?: number;
  socialReason?: string;
}

export interface CreateProviderDTO {
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
}

export interface UpdateProviderDTO {
  idProvider: number;
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
  providerContactName?: string;
  providerContactEmail?: string;
  providerContactPhoneNumber?: string;
  providerContactPosition?: string;
}