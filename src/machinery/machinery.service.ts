import { Op } from "sequelize";
import * as ExcelJS from "exceljs";
import { StatusCode } from "../interfaces";
import { BuildResponse } from "../services";
import { ResponseEntity } from "../services/interface";
import * as dtos from "./machinery.interfase";
import { machineryRepository } from "./machinery.repository";
import { MachineryType } from "./machinery-type.model";
import { MachineryBrand } from "./machinery-brand.model";
import { MachineryModel } from "./machinery-model.model";
import { Machinery } from "./machinery.model";
import { CustomError, deleteFile, uploadFile } from "../utils";
import { dbConnection } from "../config";
import { MachineryMaintenance } from "./machinery-maintenance.model";
import { MachineryLocation } from "./machinery-location.model";
import { tz } from "moment-timezone";
import { MachineryDocument } from "./machinery-document.model";
import { MachineryDocumentType } from "./machinery-document-type.model";

class MachineryService {
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
    const filter = this.buildFindAllFilter(request);
    try {
      if (request.pageSize === -1) {
        const machinery = await machineryRepository.findAll();
        return BuildResponse.buildSuccessResponse(StatusCode.Ok, { data: machinery.rows });
      }
      const machinery = await machineryRepository.findAllAndSearch(filter, limit, offset);
      const response = {
        data: machinery.rows,
        totalItems: machinery.count,
        currentPage: page,
        totalPages: Math.ceil(machinery.count / limit),
      };
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    }
    catch (err: any) {
      console.log(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async findAllMachineryMaintenance(request: dtos.FindAllDTO): Promise<ResponseEntity> {
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
    const filter = { idMachinery: request.idMachinery }; // this.buildFindAllFilter(request);
    try {
      if (request.pageSize === -1) {
        const machinery = await machineryRepository.findAllMachineryMaintenance();
        return BuildResponse.buildSuccessResponse(StatusCode.Ok, { data: machinery.rows });
      }
      const machineryMaintenance = await machineryRepository.findAllAndSearchMachineryMaintenance(filter, limit, offset);
      const response = {
        data: machineryMaintenance.rows,
        totalItems: machineryMaintenance.count,
        currentPage: page,
        totalPages: Math.ceil(machineryMaintenance.count / limit),
      };
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    }
    catch (err: any) {
      console.log(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async findAllMachineryLocation(request: dtos.FindAllDTO): Promise<ResponseEntity> {
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
    const filter = { idMachinery: request.idMachinery };
    try {
      if (request.pageSize === -1) {
        const machineryLocation = await machineryRepository.findAllMachineryLocation();
        return BuildResponse.buildSuccessResponse(StatusCode.Ok, { data: machineryLocation.rows });
      }
      const machineryLocation = await machineryRepository.findAllAndSearchMachineryLocation(filter, limit, offset);
      const response = {
        data: machineryLocation.rows,
        totalItems: machineryLocation.count,
        currentPage: page,
        totalPages: Math.ceil(machineryLocation.count / limit),
      };
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    }
    catch (err: any) {
      console.log(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async findById(id: number): Promise<ResponseEntity> {
    try {
      const machinery = await machineryRepository.findById(id);
      if (!machinery) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Machinery not found" }
        );
      }
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, machinery);
    }
    catch (err: any) {
      console.log(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async delete(id: number): Promise<ResponseEntity> {
    try {
      const machinery = await machineryRepository.findById(id);
      if (!machinery) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Machinery not found" }
        );
      }
      await machinery.destroy();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Machinery deleted" });
    }
    catch (err: any) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async uploadDocument(request: dtos.UploadMachineryDocumentDTO, filePath?: string): Promise<ResponseEntity> {
    const transaction = await dbConnection.transaction();
    try {
      const documentExist = await MachineryDocument.findOne({
        where: {
          idMachinery: request.idMachinery,
          idMachineryDocumentType: request.idMachineryDocumentType,
        }
      });

      if (documentExist && filePath) {
        const deleteDocumentResponse = await deleteFile(
          new URL(documentExist.documentUrl).pathname.split("/").pop()!,
          "machinery",
        );
        if (deleteDocumentResponse instanceof CustomError) {
          await transaction.rollback();
          return BuildResponse.buildErrorResponse(deleteDocumentResponse.statusCode, { message: deleteDocumentResponse.message });
        }
      }

      if (filePath) {
        const identifier = crypto.randomUUID();
        const uploadResponse = await uploadFile(filePath, identifier, "application/pdf", "machinery");
        if (uploadResponse instanceof CustomError) {
          await transaction.rollback();
          return BuildResponse.buildErrorResponse(uploadResponse.statusCode, { message: uploadResponse.message });
        }
        if (documentExist) {
          await documentExist.update({
            documentUrl: `https://sacmaback.blob.core.windows.net/machinery/${identifier}.pdf`,
          }, { transaction });
        } else {
          await MachineryDocument.create({
            idMachinery: request.idMachinery,
            idMachineryDocumentType: request.idMachineryDocumentType,
            documentUrl: `https://sacmaback.blob.core.windows.net/machinery/${identifier}.pdf`,
          }, { transaction });
        }
      }

      await transaction.commit();

      const machineryDocument = await MachineryDocument.findOne({
        where: {
          idMachinery: request.idMachinery,
          idMachineryDocumentType: request.idMachineryDocumentType,
        },
        include: {
          model: MachineryDocumentType,
          required: true,
        },
      });

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, machineryDocument!);
    } catch (err: any) {
      await transaction.rollback();
      console.error("Error uploading document:", err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async findMachineryType(): Promise<ResponseEntity> {
    try {
      const machineryType = await MachineryType.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, machineryType);
    }
    catch (err: any) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async createMachineryLocation(request: dtos.MachineryLocationDTO): Promise<ResponseEntity> {
    try {
      const machineryLocation = await MachineryLocation.create(
        {
          idMachinery: request.idMachinery,
          idCostCenterProject: request.idCostCenterProject,
          idEmployee: request.idEmployee,
          assignmentDate: request.assignmentDate
        }
      );
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, machineryLocation);
    }
    catch (err: any) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async updateMachineryLocation(request: dtos.CreateMachineryLocationDTO): Promise<ResponseEntity> {
    try {
      const machineryLocation = await machineryRepository.findMachineryLocation(request.idMachineryLocationHistory);
      if (!machineryLocation) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Machinery Location not found" }
        );
      }
      machineryLocation.idCostCenterProject = request.idCostCenterProject ?? machineryLocation.idCostCenterProject;
      machineryLocation.idEmployee = request.idEmployee ?? machineryLocation.idEmployee;
      machineryLocation.assignmentDate = request.assignmentDate ? request.assignmentDate : machineryLocation.assignmentDate;
      machineryLocation.modificationDate = tz("America/Bogota").format();
      await machineryLocation.save();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, machineryLocation);
    }
    catch (err: any) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async findMachineryModel(): Promise<ResponseEntity> {
    try {
      const machineryModel = await MachineryModel.findAll({
        order: [["machineryModel", "DESC"]]
      });
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, machineryModel);
    }
    catch (err: any) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async findMachineryBrand(): Promise<ResponseEntity> {
    try {
      const machineryBrand = await MachineryBrand.findAll();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, machineryBrand);
    }
    catch (err: any) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async findMachineryStatus(): Promise<ResponseEntity> {
    try {
      const machineryStatus = await machineryRepository.findMachineryStatus();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, machineryStatus);
    }
    catch (err: any) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async findMachineryDocumentType(): Promise<ResponseEntity> {
    try {
      const machineryDocumentType = await machineryRepository.findMachineryDocumentType();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, machineryDocumentType);
    }
    catch (err: any) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async download() {
    try {
      const machineries = await machineryRepository.findAll();

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Inputs");

      worksheet.columns = [
        { header: "Tipo", key: "type", width: 32 },
        { header: "Serial", key: "serial", width: 32 },
        { header: "Marca", key: "brand", width: 32 },
        { header: "Modelo", key: "model", width: 32 },
        { header: "Precio", key: "price", width: 32 },
        { header: "Estado Maquina", key: "machineryStatus", width: 32 },
        { header: "Descripción", key: "description", width: 32 },
        { header: "Ultima Ubicación", key: "lastLocation", width: 32 },
        { header: "Responsable", key: "responsible", width: 32 },
        { header: "Fecha de Asignación", key: "assignmentDate", width: 32 },
        { header: "Fecha ultimo Mantenimiento", key: "lastMaintenance", width: 32 },
        { header: "fecha de Vigencia", key: "maintenanceEffectiveDate", width: 32 },
      ];

      machineries.rows.forEach((item) => {
        const machinery = item.toJSON();
        const lastLocation = machinery.MachineryLocations.reduce((location: MachineryLocation | null, currentLocation: MachineryLocation) => {
          if (!location) {
            return currentLocation;
          }
          if (currentLocation.assignmentDate > location.assignmentDate) {
            return currentLocation;
          }
          return location;
        }
          , null);
        const lastMaintenance = machinery.MachineryMaintenances.reduce((maintenance: MachineryMaintenance | null, currentMaintenance: MachineryMaintenance) => {
          if (!maintenance) {
            return currentMaintenance;
          }
          if (currentMaintenance.maintenanceDate > maintenance.maintenanceDate) {
            return currentMaintenance;
          }
          return maintenance;
        }
          , null);
        worksheet.addRow({
          serial: machinery.serial,
          description: machinery.description,
          price: machinery.price,
          imageUrl: machinery.imageUrl,
          model: machinery.MachineryModel.machineryModel ?? null,
          type: machinery.MachineryType.machineryType ?? null,
          brand: machinery.MachineryBrand.machineryBrand ?? null,
          machineryStatus: machinery.MachineryStatus.machineryStatus ?? null,
          lastLocation: lastLocation ? lastLocation.Project?.project : null,
          responsible: lastLocation ? lastLocation.Employee?.name : null,
          assignmentDate: lastLocation ? lastLocation.assignmentDate : null,
          lastMaintenance: lastMaintenance ? lastMaintenance.maintenanceDate : null,
          maintenanceEffectiveDate: lastMaintenance ? lastMaintenance.maintenanceEffectiveDate : null,
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;
    }
    catch (err: any) {
      console.log(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async create(request: dtos.CreateDTO, filePath?: string): Promise<ResponseEntity> {
    try {

      let imageUrl = "";
      if (filePath) {
        const identifier = crypto.randomUUID();
        await uploadFile(filePath, identifier, "image/jpg", "machinery");
        imageUrl = `https://sacmaback.blob.core.windows.net/machinery/${identifier}.png`;
      }

      const machinery = await Machinery.create(
        {
          serial: request.serial,
          description: request.description,
          price: request.price,
          imageUrl: imageUrl,
          idMachineryModel: request.idMachineryModel,
          idMachineryType: request.idMachineryType,
          idMachineryBrand: request.idMachineryBrand,
          idMachineryStatus: request.idMachineryStatus,
        }
      );
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, machinery);
    }
    catch (err: any) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async update(request: dtos.UpdateDTO, filePath?: string): Promise<ResponseEntity> {
    const transaction = await dbConnection.transaction();
    try {
      const machinery = await machineryRepository.findById(request.idMachinery);
      if (!machinery) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Machinery not found" }
        );
      }

      if (filePath) {
        if (machinery.imageUrl) {
          const identifier = new URL(machinery.imageUrl).pathname.split("/").pop();
          const deleteRequest = await deleteFile(identifier!, "machinery");
          if (deleteRequest instanceof CustomError) {
            await transaction.rollback();
            return BuildResponse.buildErrorResponse(
              deleteRequest.statusCode,
              { message: deleteRequest.message }
            );
          }
        }
        const identifier = crypto.randomUUID();
        const uploadRequest = await uploadFile(filePath, identifier, "image/jpg", "machinery");
        if (uploadRequest instanceof CustomError) {
          await transaction.rollback();
          return BuildResponse.buildErrorResponse(
            uploadRequest.statusCode,
            { message: uploadRequest.message }
          );
        }
        machinery.imageUrl = `https://sacmaback.blob.core.windows.net/machinery/${identifier}.png`;
      }

      machinery.serial = request.serial ?? machinery.serial;
      machinery.description = request.description ?? machinery.description;
      machinery.price = request.price ?? machinery.price;
      machinery.idMachineryModel = request.idMachineryModel ?? machinery.idMachineryModel;
      machinery.idMachineryType = request.idMachineryType ?? machinery.idMachineryType;
      machinery.idMachineryBrand = request.idMachineryBrand ?? machinery.idMachineryBrand;
      machinery.idMachineryStatus = request.idMachineryStatus ?? machinery.idMachineryStatus;
      await machinery.save();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, machinery);
    }
    catch (err: any) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async createMachineryMaintenance(request: dtos.MachineryMaintenanceDTO, filePath?: string): Promise<ResponseEntity> {
    const transaction = await dbConnection.transaction();
    try {
      const machineryMaintenance = await MachineryMaintenance.create(
        {
          idMachinery: request.idMachinery,
          documentName: request.documentName,
          maintenanceDate: request.maintenanceDate,
          maintenanceEffectiveDate: request.maintenanceEffectiveDate
        }
      );

      if (filePath) {
        const identifier = crypto.randomUUID();
        await uploadFile(filePath, identifier, "application/pdf", "machinery");
        machineryMaintenance.documentUrl = `https://sacmaback.blob.core.windows.net/machinery/${identifier}.pdf`;
      }

      await machineryMaintenance.save();
      await transaction.commit();

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, machineryMaintenance);
    }
    catch (err: any) {
      await transaction.rollback();
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async deleteMachineryMaintenance(id: number): Promise<ResponseEntity> {
    try {
      const machinery = await machineryRepository.findMachineryMaintenance(id);
      if (!machinery) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Machinery not found" }
        );
      }
      await machinery.destroy();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Machinery deleted" });
    }
    catch (err: any) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async deleteMachineryLocation(id: number): Promise<ResponseEntity> {
    try {
      const machineryLocation = await machineryRepository.findMachineryLocation(id);
      if (!machineryLocation) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Machinery location not found" }
        );
      }
      await machineryLocation.destroy();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Machinery location deleted" });
    }
    catch (err: any) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }


  private buildFindAllFilter(request: dtos.FindAllDTO): { [key: string]: any } {
    let filter: { [key: string]: any } = {};
    for (const key of Object.getOwnPropertyNames(request)) {
      if (/^id/.test(key)) {
        filter = {
          ...filter,
          [key]: request[key as keyof dtos.FindAllDTO],
        };
      } else if (key === "serial") {
        filter = {
          ...filter,
          serial: {
            [Op.like]: `%${request.serial}%`,
          },
        };
      }
    }
    return filter;
  }
}

const machineryService = new MachineryService();
export { machineryService };