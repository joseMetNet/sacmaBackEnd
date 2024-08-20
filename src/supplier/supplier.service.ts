import { Op, Transaction } from "sequelize";
import { supplierRepository } from "./supplier.repository";
import { BuildResponse } from "../services";
import { StatusCode } from "../interfaces";
import * as dtos from "./supplier.interface";
import { ResponseEntity } from "../services/interface";
import { dbConnection } from "../config";
import { SupplierContact } from "./supplier-contact.model";
import { Supplier } from "./supplier.model";
import { CustomError, deleteFile, uploadFile } from "../utils";
import { SupplierDocumentType } from "./supplier-document.model";
import { SupplierSupplierDocument } from "./supplier-supplier-document.model";
import { AccountType } from "./account-types.model";
import * as ExcelJS from "exceljs";
import { BankAccount, City, State } from "../models";

class SupplierService {

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
    const filter = this.buildFindAllSupplierFilter(request);
    try {
      if(request.pageSize === -1) {
        const suppliers = await supplierRepository.findAll();
        return BuildResponse.buildSuccessResponse(StatusCode.Ok, { data: suppliers.rows });
      }
      const suppliers = await supplierRepository.findAllAndSearch(filter, limit, offset);
      const rows = suppliers.rows.map(supplier => {
        const supplierContacts = supplier.get("SupplierContacts") as SupplierContact[];
        return {
          idSupplier: supplier.idSupplier,
          socialReason: supplier.socialReason,
          nit: supplier.nit,
          telephone: supplier.telephone,
          phoneNumber: supplier.phoneNumber,
          idState: supplier.idState,
          idCity: supplier.idCity,
          address: supplier.address,
          status: supplier.status,
          imageProfileUrl: supplier.imageProfileUrl,
          idAccountType: supplier.idAccountType,
          idBankAccount: supplier.idBankAccount,
          accountNumber: supplier.accountNumber,
          accountHolder: supplier.accountHolder,
          accountHolderId: supplier.accountHolderId,
          paymentMethod: supplier.paymentMethod,
          observation: supplier.observation,
          supplierContact: supplierContacts.map((contact: SupplierContact) => {
            return {
              idSupplierContact: contact.idSupplierContact,
              idSupplier: contact.idSupplier,
              supplierContactName: contact.name,
              supplierContactEmail: contact.email,
              supplierContactPhoneNumber: contact.phoneNumber,
              supplierContactPosition: contact.position,
            };
          }),
          SupplierSupplierDocuments: supplier.get("SupplierSupplierDocuments"),
          City: supplier.get("City"),
          BankAccount: supplier.get("BankAccount"),
          State: supplier.get("State")
        };
      });
      const response = {
        data: rows,
        totalItems: suppliers.count,
        currentPage: page,
        totalPages: Math.ceil(suppliers.count / limit),
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
      const supplier = await supplierRepository.findById(id);
      if (!supplier) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Supplier not found" }
        );
      }
      const supplierContacts = supplier.get("SupplierContacts") as SupplierContact[];
      const supplierResponse = {
        idSupplier: supplier.idSupplier,
        socialReason: supplier.socialReason,
        nit: supplier.nit,
        telephone: supplier.telephone,
        phoneNumber: supplier.phoneNumber,
        idState: supplier.idState,
        idCity: supplier.idCity,
        address: supplier.address,
        status: supplier.status,
        imageProfileUrl: supplier.imageProfileUrl,
        idAccountType: supplier.idAccountType,
        idBankAccount: supplier.idBankAccount,
        accountNumber: supplier.accountNumber,
        accountHolder: supplier.accountHolder,
        accountHolderId: supplier.accountHolderId,
        paymentMethod: supplier.paymentMethod,
        observation: supplier.observation,
        supplierContact: supplierContacts.map((contact: SupplierContact) => {
          return {
            idSupplierContact: contact.idSupplierContact,
            idSupplier: contact.idSupplier,
            supplierContactName: contact.name,
            supplierContactEmail: contact.email,
            supplierContactPhoneNumber: contact.phoneNumber,
            supplierContactPosition: contact.position,
          };
        }),
        SupplierSupplierDocuments: supplier.get("SupplierSupplierDocuments"),
        City: supplier.get("City"),
        BankAccount: supplier.get("BankAccount"),
        State: supplier.get("State")
      };
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, supplierResponse);
    }
    catch (err: any) {
      console.log(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async create(request: dtos.CreateSupplierDTO, filePath?: string): Promise<ResponseEntity> {
    const transaction = await dbConnection.transaction();
    try {
      const supplier = await this.buildSupplier(request, transaction);

      if (request.contactInfo) {
        await this.buildContactSupplier(supplier.idSupplier, request, transaction);
      }

      const identifier = crypto.randomUUID();
      if (filePath) {
        await uploadFile(filePath, identifier, "image/jpg", "image-profile");
      }

      supplier.imageProfileUrl = `https://sacmaback.blob.core.windows.net/image-profile/${identifier}.png`;
      await supplier.save({ transaction });

      await transaction.commit();

      const supplierResponse = await supplierRepository.findById(supplier.idSupplier);
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, supplierResponse!);
    }
    catch (err: any) {
      await transaction.rollback();
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async update(request: dtos.UpdateSupplierDTO, filePath?: string): Promise<ResponseEntity> {
    const transaction: Transaction = await dbConnection.transaction();
    try {
      const supplier = await supplierRepository.findById(request.idSupplier);
      if (!supplier) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Supplier not found" }
        );
      }

      if (filePath) {
        if (supplier.imageProfileUrl) {
          const identifier = new URL(supplier.imageProfileUrl).pathname.split("/").pop();
          const deleteRequest = await deleteFile(identifier!, "image-profile");
          if(deleteRequest instanceof CustomError) {
            await transaction.rollback();
            return BuildResponse.buildErrorResponse(
              deleteRequest.statusCode,
              { message: deleteRequest.message }
            );
          }
        }
        const identifier = crypto.randomUUID();
        const uploadRequest = await uploadFile(filePath, identifier, "image/jpg", "image-profile");
        if(uploadRequest instanceof CustomError) {
          await transaction.rollback();
          return BuildResponse.buildErrorResponse(
            uploadRequest.statusCode,
            { message: uploadRequest.message }
          );
        }
        request.imageProfile = `https://sacmaback.blob.core.windows.net/image-profile/${identifier}.png`;
      }
      if(request.contactInfo) {
        await SupplierContact.destroy({
          where: { idSupplier: request.idSupplier },
          transaction
        });
        await this.buildContactSupplier(request.idSupplier, request, transaction);
      }

      const updateSupplier = this.buildUpdateSupplier(request, supplier);
      await supplier.update(updateSupplier, { transaction });

      await transaction.commit();

      const supplierDb = await supplierRepository.findById(request.idSupplier);
      if(!supplierDb) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Supplier not found" }
        );
      }
      const supplierContacts = supplier.get("SupplierContacts") as SupplierContact[];
      const supplierResponse = {
        idSupplier: supplier.idSupplier,
        socialReason: supplier.socialReason,
        nit: supplier.nit,
        telephone: supplier.telephone,
        phoneNumber: supplier.phoneNumber,
        idState: supplier.idState,
        idCity: supplier.idCity,
        address: supplier.address,
        status: supplier.status,
        imageProfileUrl: supplier.imageProfileUrl,
        idAccountType: supplier.idAccountType,
        idBankAccount: supplier.idBankAccount,
        accountNumber: supplier.accountNumber,
        accountHolder: supplier.accountHolder,
        accountHolderId: supplier.accountHolderId,
        paymentMethod: supplier.paymentMethod,
        observation: supplier.observation,
        supplierContact: supplierContacts.map((contact: SupplierContact) => {
          return {
            idSupplierContact: contact.idSupplierContact,
            idSupplier: contact.idSupplier,
            supplierContactName: contact.name,
            supplierContactEmail: contact.email,
            supplierContactPhoneNumber: contact.phoneNumber,
            supplierContactPosition: contact.position,
          };
        }),
      };

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, supplierResponse);
    } catch (err: any) {
      await transaction.rollback();
      console.error("Error updating supplier:", err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async download() {
    try {
      const suppliers = await supplierRepository.findAll();
      const rows = suppliers.rows.map(supplier => {
        const supplierContacts = supplier.get("SupplierContacts") as SupplierContact[];
        return {
          idSupplier: supplier.idSupplier,
          socialReason: supplier.socialReason,
          nit: supplier.nit,
          telephone: supplier.telephone,
          phoneNumber: supplier.phoneNumber,
          idState: supplier.idState,
          idCity: supplier.idCity,
          address: supplier.address,
          status: supplier.status,
          imageProfileUrl: supplier.imageProfileUrl,
          idAccountType: supplier.idAccountType,
          idBankAccount: supplier.idBankAccount,
          accountNumber: supplier.accountNumber,
          accountHolder: supplier.accountHolder,
          accountHolderId: supplier.accountHolderId,
          paymentMethod: supplier.paymentMethod,
          observation: supplier.observation,
          supplierContact: supplierContacts.map((contact: SupplierContact) => {
            return {
              idSupplierContact: contact.idSupplierContact,
              idSupplier: contact.idSupplier,
              supplierContactName: contact.name,
              supplierContactEmail: contact.email,
              supplierContactPhoneNumber: contact.phoneNumber,
              supplierContactPosition: contact.position,
            };
          }),
          SupplierSupplierDocuments: supplier.get("SupplierSupplierDocuments"),
          City: supplier.get("City"),
          BankAccount: supplier.get("BankAccount"),
          State: supplier.get("State")
        };
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Suppliers");

      worksheet.columns = [
        { header: "Nombre", key: "socialReason", width: 30 },
        { header: "NIT", key: "nit", width: 20 },
        { header: "Teléfono", key: "telephone", width: 20 },
        { header: "Número de celular", key: "phoneNumber", width: 20 },
        { header: "Departamento", key: "state", width: 20 },
        { header: "Ciudad", key: "city", width: 20 },
        { header: "Dirección", key: "address", width: 20 },
        { header: "Estado", key: "status", width: 20 },
        { header: "Imagen de perfil", key: "imageProfile", width: 20 },
        { header: "Tipo de cuenta", key: "accountType", width: 20 },
        { header: "Banco", key: "bankAccount", width: 20 },
        { header: "Número de cuenta", key: "accountNumber", width: 20 },
        { header: "Titular de la cuenta", key: "accountHolder", width: 20 },
        { header: "Identificación titular de cuenta", key: "accountHolderId", width: 20 },
        { header: "Método de pago", key: "paymentMethod", width: 20 },
        { header: "Observación", key: "observation", width: 20 },
        { header: "Correos de contacto", key: "contactInfo", width: 20 },
      ];

      rows.forEach(supplier => {
        worksheet.addRow({
          idSupplier: supplier.idSupplier,
          socialReason: supplier.socialReason,
          nit: supplier.nit,
          telephone: supplier.telephone,
          phoneNumber: supplier.phoneNumber,
          state: (supplier.State as State).state ?? null,
          city: (supplier.City as City).city ?? null,
          address: supplier.address,
          status: supplier.status,
          imageProfile: supplier.imageProfileUrl,
          bankAccount: (supplier.BankAccount as BankAccount | null)?.bankAccount ?? null,
          accountNumber: supplier.accountNumber,
          accountHolder: supplier.accountHolder,
          accountHolderId: supplier.accountHolderId,
          paymentMethod: supplier.paymentMethod,
          observation: supplier.observation,
          contactInfo: supplier.supplierContact.map((item) => { 
            return item.supplierContactEmail;
          }).join(", "),
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;

    } catch (err: any) {
      console.error("Error downloading suppliers:", err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async delete(idSupplier: number): Promise<ResponseEntity> {
    const transaction: Transaction = await dbConnection.transaction();

    try {
      const supplier = await supplierRepository.findById(idSupplier);

      if (!supplier) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Supplier not found" }
        );
      }

      await SupplierContact.destroy({
        where: { idSupplier },
        transaction
      });

      await supplier.destroy({ transaction });
      if (supplier.imageProfileUrl) {
        const identifier = supplier.imageProfileUrl.split("/").pop()!;
        await deleteFile(identifier, "image-profile");
      }
      await transaction.commit();

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { data: supplier });
    } catch (err: any) {
      await transaction.rollback();
      console.error("Error deleting supplier:", err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async findDocumentTypes(): Promise<ResponseEntity> {
    try {
      const documentType = await SupplierDocumentType.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, documentType);
    } catch (err: any) {
      console.error("Error finding document type:", err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }
  async findAccountTypes(): Promise<ResponseEntity> {
    try {
      const accountType = await AccountType.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, accountType);
    } catch (err: any) {
      console.error("Error finding document type:", err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async uploadDocument(request: dtos.UploadSupplierDocumentDTO, filePath: string) {
    const transaction: Transaction = await dbConnection.transaction();
    try {
      const existingDocument = await SupplierSupplierDocument.findOne({
        where: {
          idSupplier: request.idSupplier,
          idSupplierDocumentType: request.idDocumentType,
        },
      });

      if (existingDocument && existingDocument.documentUrl) {
        const fileName = existingDocument.documentUrl.split("/").pop() as string;
        const deleteBlobResponse = await deleteFile(fileName, "supplier-documents");
        if (deleteBlobResponse instanceof CustomError) {
          await transaction.rollback();
          return BuildResponse.buildErrorResponse(StatusCode.BadRequest, {
            message: deleteBlobResponse.message,
          });
        }
      }

      const identifier = crypto.randomUUID();
      const uploadDocumentResponse = await uploadFile(filePath, identifier, "application/pdf", "supplier-documents");
      if (uploadDocumentResponse instanceof CustomError) {
        await transaction.rollback();
        return BuildResponse.buildErrorResponse(
          uploadDocumentResponse.statusCode,
          { message: uploadDocumentResponse.message }
        );
      }

      const url = `https://sacmaback.blob.core.windows.net/supplier-documents/${identifier}.pdf`;

      if (existingDocument) {
        await existingDocument.update(
          { documentUrl: url },
          { transaction }
        );
      } else {
        await SupplierSupplierDocument.create(
          {
            idSupplier: request.idSupplier,
            idSupplierDocumentType: request.idDocumentType,
            documentUrl: url,
          },
          { transaction }
        );
      }

      await transaction.commit();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        document: existingDocument ? existingDocument : { idSupplier: request.idSupplier, idDocumentType: request.idDocumentType, documentUrl: url }
      });
    } catch (err: any) {
      await transaction.rollback();
      console.error("Error uploading document:", err);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "Internal server error",
      });
    }
  }

  async buildContactSupplier(
    idSupplier: number,
    supplier: dtos.CreateSupplierDTO | dtos.UpdateSupplierDTO,
    transaction: Transaction
  ) {
    return supplier.contactInfo?.map(item => {
      SupplierContact.create({
        idSupplier: idSupplier,
        name: item.supplierContactName,
        email: item.supplierContactEmail,
        phoneNumber: item.supplierContactPhoneNumber,
        position: item.supplierContactPosition,

      }, { transaction });
    });
  }

  async buildSupplier(
    supplier: dtos.CreateSupplierDTO,
    transaction: Transaction
  ) {
    return Supplier.create({
      socialReason: supplier.socialReason,
      nit: supplier.nit,
      telephone: supplier.telephone,
      phoneNumber: supplier.phoneNumber,
      idState: supplier.idState,
      idCity: supplier.idCity,
      address: supplier.address,
      status: supplier.status,
      imageProfile: supplier.imageProfile,
      idAccountType: supplier.idAccountType,
      idBankAccount: supplier.idBankAccount,
      accountNumber: supplier.accountNumber,
      accountHolder: supplier.accountHolder,
      accountHolderId: supplier.accountHolderId,
      paymentMethod: supplier.paymentMethod,
      observation: supplier.observation,
    }, { transaction });
  }

  private buildUpdateSupplier(
    request: dtos.UpdateSupplierDTO,
    supplierDb: Supplier
  ) {
    return {
      socialReason: request.socialReason ?? supplierDb.socialReason,
      nit: request.nit ?? supplierDb.nit,
      telephone: request.telephone ?? supplierDb.telephone,
      phoneNumber: request.phoneNumber ?? supplierDb.phoneNumber,
      idState: request.idState ?? supplierDb.idState,
      imageProfileUrl: request.imageProfile ?? supplierDb.imageProfileUrl,
      idCity: request.idCity ?? supplierDb.idCity,
      address: request.address ?? supplierDb.address,
      status: request.status ?? supplierDb.status,
      idAccountType: request.idAccountType ?? supplierDb.idAccountType,
      idBankAccount: request.idBankAccount ?? supplierDb.idBankAccount,
      accountNumber: request.accountNumber ?? supplierDb.accountNumber,
      accountHolder: request.accountHolder ?? supplierDb.accountHolder,
      accountHolderId: request.accountHolderId ?? supplierDb.accountHolderId,
      paymentMethod: request.paymentMethod ?? supplierDb.paymentMethod,
      observation: request.observation ?? supplierDb.observation
    };
  }

  private buildFindAllSupplierFilter(request: dtos.FindAllDTO) {
    let supplierFilter = {};
    for (const key of Object.getOwnPropertyNames(request)) {
      if (key === "socialReason") {
        supplierFilter = {
          ...supplierFilter,
          socialReason: {
            [Op.like]: `%${request.socialReason}%`,
          },
        };
      }
    }
    return supplierFilter;
  }
}

const supplierService = new SupplierService();
export { supplierService };