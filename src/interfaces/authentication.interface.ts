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
  password?: string;
  userName: string;
  address: string;
  phoneNumber: string;
  idIdentityCard: number;
  identityCardNumber: string;
  identityCardExpeditionDate: string;
  idIdentityCardExpeditionCity: number;
  birthDate?: string;
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
  idSeverancePay?: number;
  emergencyContactfirstName?: string | null;
  emergencyContactlastName?: string | null;
  emergencyContactphoneNumber?: string | null;
  emergencyContactkinship?: string | null;
  idPensionFund?: number | null;
  idCompensationFund?: number | null;
  imageProfile?: string | null;
}
