import { Op, Transaction } from "sequelize";
import { providerRepository } from "./provider.repository";
import { BuildResponse } from "../services";
import { StatusCode } from "../interfaces";
import * as dtos from "./provider.interface";
import { ResponseEntity } from "../services/interface";
import { dbConnection } from "../config";
import { ProviderContact } from "./provider-contact.model";
import { Provider } from "./provider.model";
import { deleteFile, uploadFile } from "../utils";

class ProviderService {

  async findAll(request: dtos.FindAllDTO): Promise<ResponseEntity> {
    let page = 1;
    if (request.page) {
      page = request.page;
    }
    let pageSize = 10;
    if (request.pageSize) {
      pageSize = request.pageSize;
    }
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    const filter = this.buildFindAllProviderFilter(request);
    try {
      const providers = await providerRepository.findAll(filter, limit, offset);
      const response = {
        data: providers.rows,
        totalItems: providers.count,
        currentPage: page,
        totalPages: Math.ceil(providers.count / limit),
      };
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    }
    catch (err: any) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer, 
        { message: err.message }
      );
    }
  }

  async findById(id: number): Promise<ResponseEntity> {
    try {
      const provider = await providerRepository.findById(id);
      if (!provider) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound, 
          { message: "Provider not found" }
        );
      }
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, provider);
    }
    catch (err: any) {
      console.log(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer, 
        { message: err.message }
      );
    }
  }

  async create(request: dtos.CreateProviderDTO, filePath?: string): Promise<ResponseEntity> {
    const transaction = await dbConnection.transaction();
    try {
      const provider = await this.buildProvider(request, transaction);

      if(request.providerContactName) {
        await this.buildContactProvider(provider.idProvider, request, transaction);
      }

      const identifier = crypto.randomUUID();
      if(filePath) {
        await uploadFile(filePath, identifier, 'image/jpg', 'image-profile');
      }

      provider.imageProfileUrl = `https://sacmaback.blob.core.windows.net/image-profile/${identifier}.png`;
      await provider.save({ transaction });
      
      await transaction.commit();
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, provider);
    }
    catch (err: any) {
      await transaction.rollback();
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer, 
        { message: err.message }
      );
    }
  }

  async update(request: dtos.UpdateProviderDTO, filePath?: string): Promise<ResponseEntity> {
    const transaction: Transaction = await dbConnection.transaction();
    try {
      const provider = await providerRepository.findById(request.idProvider);
      if (!provider) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound, 
          { message: "Provider not found" }
        );
      }

      if (filePath) {
        if(provider.imageProfileUrl) {
          const identifier = provider.imageProfileUrl.split('/').pop()!;
          await deleteFile(identifier, 'image-profile');
        }
        const identifier = crypto.randomUUID();
        await uploadFile(filePath, identifier, 'image/jpg', 'image-profile');
        provider.imageProfileUrl = `https://sacmaback.blob.core.windows.net/image-profile/${identifier}.png`;
      }

      const updateProvider = this.buildUpdateProvider(request, provider);
      await provider.update(updateProvider, { transaction });
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, provider);
    } catch (err: any) {
      await transaction.rollback();
      console.error('Error updating provider:', err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer, 
        { message: err.message }
      );
    }
  }

  async delete(idProvider: number): Promise<ResponseEntity> {
    const transaction: Transaction = await dbConnection.transaction();
    
    try {
      const provider = await providerRepository.findById(idProvider);
      
      if (!provider) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound, 
          { message: "Provider not found" }
        );
      }
  
      await ProviderContact.destroy({
        where: { idProvider },
        transaction
      });
  
      await provider.destroy({ transaction });
      if(provider.imageProfileUrl) {
        const identifier = provider.imageProfileUrl.split('/').pop()!;
        await deleteFile(identifier, 'image-profile');
      }
      await transaction.commit();
  
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { data: provider });
    } catch (err: any) {
      await transaction.rollback();
      console.error('Error deleting provider:', err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer, 
        { message: err.message }
      );
    }
  }

  async buildContactProvider(
    idProvider: number,
    provider: dtos.CreateProviderDTO, 
    transaction: Transaction
  ) {
    return ProviderContact.create({
      idProvider: idProvider,
      name: provider.providerContactName,
      email: provider.providerContactEmail,
      phoneNumber: provider.providerContactPhoneNumber,
      position: provider.providerContactPosition,
    }, { transaction })
  }

  async buildProvider(
    provider: dtos.CreateProviderDTO, 
    transaction: Transaction
  ) {
    return Provider.create({
      socialReason: provider.socialReason,
      nit: provider.nit,
      telephone: provider.telephone,
      phoneNumber: provider.phoneNumber,
      idState: provider.idState,
      idCity: provider.idCity,
      address: provider.address,
      status: provider.status,
      imageProfile: provider.imageProfile,
      idAccountType: provider.idAccountType,
      idBankAccount: provider.idBankAccount,
      accountNumber: provider.accountNumber,
      accountHolder: provider.accountHolder,
      accountHolderId: provider.accountHolderId,
      paymentMethod: provider.paymentMethod,
      observation: provider.observation,
    }, { transaction });
  }

  private async buildUpdateProvider(
    request: dtos.UpdateProviderDTO, 
    providerDb: Provider
  ) {
    return {
      socialReason: request.socialReason ?? providerDb.socialReason,
      nit: request.nit ?? providerDb.nit,
      telephone: request.telephone ?? providerDb.telephone,
      phoneNumber: request.phoneNumber ?? providerDb.phoneNumber,
      idState: request.idState ?? providerDb.idState,
      idCity: request.idCity ?? providerDb.idCity,
      address: request.address ?? providerDb.address,
      status: request.status ?? providerDb.status,
      idAccountType: request.idAccountType ?? providerDb.idAccountType,
      idBankAccount: request.idBankAccount ?? providerDb.idBankAccount,
      accountNumber: request.accountNumber ?? providerDb.accountNumber,
      accountHolder: request.accountHolder ?? providerDb.accountHolder,
      accountHolderId: request.accountHolderId ?? providerDb.accountHolderId,
      paymentMethod: request.paymentMethod ?? providerDb.paymentMethod,
      observation: request.observation ?? providerDb.observation
    };
  }

  private buildFindAllProviderFilter(request: dtos.FindAllDTO) {
    let providerFilter = {};
    for (const key of Object.getOwnPropertyNames(request)) {
      if (key === "socialReason") {
        providerFilter = {
          ...providerFilter,
          socialReason: {
            [Op.like]: `%${request.socialReason}%`,
          },
        };
      }
    }
    return providerFilter;
  }
}

const providerService = new ProviderService();
export { providerService };