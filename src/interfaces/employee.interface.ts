export interface UpdateEmployeeRequest {
  idUser: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  address?: string;
  phoneNumber?: string;
  idIdentityCard?: number;
  identityCardNumber?: string;
  identityCardExpeditionDate?: string;
  idIdentityCardExpeditionCity?: number;
  idRole?: number;
  idPosition?: number;
  idContractType?: number;
  entryDate?: string;
  baseSalary?: string;
  compensation?: string;
  idPaymentType?: number;
  bankAccountNumber?: string;
  idBankAccount?: number;
  idEps?: number;
  idArl?: number;
  severancePay?: string;
  userName?: string;
  emergencyContactfirstName?: string;
  emergencyContactlastName?: string;
  emergencyContactphoneNumber?: string;
  emergencyContactkinship?: string;
  idPensionFund?: number;
  idCompensationFund?: number;
}

export interface IUploadDocument {
  idEmployee: number;
  idRequiredDocument: number;
  expirationDate?: string;
}