export interface ChagePasswordRequest {
  email: string;
  password: string;
}

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  idIdentityCard: number;
  identityCardNumber: string;
  identityCardExpeditionDate: string;
  idIdentityCardExpeditionPlace: number;
  idRole: number;
  idPosition?: number | null;
  idContractType?: number | null;
  entryDate?: string;
  baseSalary?: string;
  compensation?: string;
  idPaymentType?: number | null;
  bankAccountNumber?: string;
  idBankAccount?: number | null;
  idEps?: number | null;
  idArl?: number | null;
  severancePay?: string | null;
  userName?: string;
  emergencyContactfirstName?: string | null;
  emergencyContactlastName?: string | null;
  emergencyContactphoneNumber?: string | null;
  emergencyContactkinship?: string | null;
  idPensionFund?: number | null;
  idCompensationFund?: number | null;
  compensationFund?: string | null;
  idRequiredDocument?: number | null;
}
