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
      if(request.pageSize === -1) {
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
    const filter = { idMachinery: request.idMachinery}; // this.buildFindAllFilter(request);
    try {
      if(request.pageSize === -1) {
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
    const filter = { idMachinery: request.idMachinery};
    try {
      if(request.pageSize === -1) {
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
          idProject: request.idProject,
          idEmployee: request.idEmployee,
          modificationDate: request.modificationDate,
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

  async findMachineryModel(): Promise<ResponseEntity> {
    try {
      const machineryModel = await MachineryModel.findAll();
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

  async download() {
    try {
      const machineries = await machineryRepository.findAll();

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Inputs");

      worksheet.columns = [
        { header: "Serial", key: "serial", width: 32 },
        { header: "Descripción", key: "description", width: 32 },
        { header: "Precio", key: "price", width: 32 },
        { header: "Imagen", key: "imageUrl", width: 32 },
        { header: "Modelo", key: "model", width: 32 },
        { header: "Tipo", key: "type", width: 32 },
        { header: "Marca", key: "brand", width: 32 },
        { header: "Estado Maquina", key: "machineryStatus", width: 32 },
        { header: "Estado", key: "status", width: 32 },
      ];

      machineries.rows.forEach((item) => {
        const machinery = item.toJSON();
        worksheet.addRow({
          serial: machinery.serial,
          description: machinery.description,
          price: machinery.price,
          imageUrl: machinery.imageUrl,
          model: machinery.MachineryModel.machineryModel ?? null,
          type: machinery.MachineryType.machineryType ?? null,
          brand: machinery.MachineryBrand.machineryBrand ?? null,
          machineryStatus: machinery.MachineryStatus.status ?? null,
          status: machinery.status,
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;
    }
    catch (err: any) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  }

  async create(request: dtos.CreateDTO, filePath?: string): Promise<ResponseEntity> {
    try {

      let imageUrl = "";
      if(filePath) {
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
          status: request.status,
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
          console.log(`machinery.imageUrl: ${machinery.imageUrl}`);
          const identifier = new URL(machinery.imageUrl).pathname.split("/").pop();
          const deleteRequest = await deleteFile(identifier!, "machinery");
          if(deleteRequest instanceof CustomError) {
            await transaction.rollback();
            return BuildResponse.buildErrorResponse(
              deleteRequest.statusCode,
              { message: deleteRequest.message }
            );
          }
        }
        const identifier = crypto.randomUUID();
        const uploadRequest = await uploadFile(filePath, identifier, "image/jpg", "machinery");
        if(uploadRequest instanceof CustomError) {
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
      machinery.status = Boolean(request.status) ?? machinery.status;
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

      if(filePath) {
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