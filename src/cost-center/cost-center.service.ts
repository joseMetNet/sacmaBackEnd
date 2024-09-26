import { CostCenterRepository } from "./cost-center.repository";
import * as types from "./cost-center.interfase";
import { Op } from "sequelize";
import { BuildResponse } from "../services";
import { StatusCode } from "../interfaces";
import { ResponseEntity } from "../services/interface";
import { CustomError, deleteFile, uploadFile } from "../utils";
import * as ExcelJS from "exceljs";


class CostCenterService {
  private costCenterRepository: CostCenterRepository;

  constructor(costCenterRepository: CostCenterRepository) {
    this.costCenterRepository = costCenterRepository;
  }

  create = async (costCenterData: types.CreateCostCenterDTO, filePath?: string): Promise<ResponseEntity> => {
    try {
      if (filePath) {
        const identifier = crypto.randomUUID();
        const uploadResponse = await uploadFile(filePath, identifier, "image/jpg", "cost-center");
        if (uploadResponse instanceof CustomError) {
          console.log(`Error uploading image: ${JSON.stringify(uploadResponse)}`);
          return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Error uploading image" });
        }
        costCenterData.imageUrl = `https://sacmaback.blob.core.windows.net/cost-center/${identifier}.png`;
      }
      const response = await this.costCenterRepository.create(costCenterData);
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, response);
    } catch (err: any) {
      console.log(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  };

  createCostCenterContact = async (request: types.CreateCostCenterContactDTO): Promise<ResponseEntity> => {
    try {
      const response = await this.costCenterRepository.createCostCenterContact(request);
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, response);
    } catch (err: any) {
      console.log(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  };

  createCostCenterProject = async (request: types.CreateCostCenterProjectDTO): Promise<ResponseEntity> => {
    try {
      const response = await this.costCenterRepository.createCostCenterProject(request);
      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, response);
    } catch (err: any) {
      console.log(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  };

  download = async () => {
    try {
      const data = await this.costCenterRepository.findAll();
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Cost Centers");
      worksheet.columns = [
        { header: "Consecutivo", key: "idCostCenter", width: 10 },
        { header: "NIT", key: "nit", width: 32 },
        { header: "Nombre", key: "name", width: 32 },
        { header: "Número de celular", key: "phone", width: 32 },
        { header: "Imagen de perfil", key: "imageUrl", width: 32 },
      ];


      data.rows.forEach((item) => {
        const costCenter = item.toJSON();
        worksheet.addRow({
          idCostCenter: costCenter.idCostCenter,
          nit: costCenter.nit,
          name: costCenter.name,
          phone: costCenter.phone,
          imageUrl: costCenter.imageUrl,
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
  };

  findById = async (id: number): Promise<ResponseEntity> => {
    try {
      const data = await this.costCenterRepository.findById(id);
      if (!data) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Cost center not found" }
        );
      }
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    }
    catch (err: any) {
      console.log(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  };

  findCostCenterContactById = async (id: number): Promise<ResponseEntity> => {
    try {
      const data = await this.costCenterRepository.findCostCenterContactById(id);
      if (!data) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Cost center not found" }
        );
      }
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    }
    catch (err: any) {
      console.log(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  };

  findCostCenterProjectById = async (id: number): Promise<ResponseEntity> => {
    try {
      const data = await this.costCenterRepository.findCostCenterProjectById(id);
      if (!data) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Cost center project not found" }
        );
      }
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    }
    catch (err: any) {
      console.log(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  };

  findAll = async (request: types.FindAllDTO): Promise<ResponseEntity> => {
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
        const data = await this.costCenterRepository.findAll();
        return BuildResponse.buildSuccessResponse(StatusCode.Ok, { data: data.rows });
      }
      const data = await this.costCenterRepository.findAllAndSearch(filter, limit, offset);
      const result = data.rows.map(item => {
        return {
          idCostCenter: item.idCostCenter,
          nit: item.nit,
          name: item.name,
          phone: item.phone,
          imageUrl: item.imageUrl,
          totalProjects: item?.CostCenterProjects.length,
          CostCenterContacts: item?.CostCenterContacts,
          CostCenterProjects: item?.CostCenterProjects
        };
      });
      const response = {
        data: result,
        totalItems: data.count,
        currentPage: page,
        totalPages: Math.ceil(data.count / pageSize),
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
  };

  findAllCostCenterContact = async (request: types.FindAllCostCenterContactDTO): Promise<ResponseEntity> => {
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
    const filter = this.buildFindAllCostCenterContactFilter(request);


    try {
      if (request.pageSize === -1) {
        const data = await this.costCenterRepository.findAllCostCenterContact();
        return BuildResponse.buildSuccessResponse(StatusCode.Ok, { data: data.rows });
      }
      const data = await this.costCenterRepository.findAllAndSearchCostCenterContact(filter, limit, offset);
      const response = {
        data: data.rows,
        totalItems: data.count,
        currentPage: page,
        totalPages: Math.ceil(data.count / pageSize),
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
  };

  findAllCostCenterProject = async (request: types.FindAllCostCenterProjectDTO): Promise<ResponseEntity> => {
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
    const filter = this.buildFindAllCostCenterProjectFilter(request);

    console.log(`filter ${JSON.stringify(filter)}`);

    try {
      if (request.pageSize === -1) {
        const data = await this.costCenterRepository.findAllCostCenterProject();
        return BuildResponse.buildSuccessResponse(StatusCode.Ok, { data: data.rows });
      }
      const data = await this.costCenterRepository.findAllAndSearchCostCenterProject(filter, limit, offset);
      const response = {
        data: data.rows,
        totalItems: data.count,
        currentPage: page,
        totalPages: Math.ceil(data.count / pageSize),
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
  };

  update = async (costCenterData: types.UpdateCostCenterDTO, filePath?: string): Promise<ResponseEntity> => {
    try {
      const dbCostCenter = await this.costCenterRepository.findById(costCenterData.idCostCenter);
      if (!dbCostCenter) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Cost center not found" });
      }
      if (filePath && dbCostCenter.imageUrl) {
        await deleteFile(
          new URL(dbCostCenter.imageUrl).pathname.split("/").pop()!,
          "cost-center"
        );
        const identifier = crypto.randomUUID();
        const uploadResponse = await uploadFile(filePath, identifier, "image/jpg", "cost-center");
        if (uploadResponse instanceof CustomError) {
          return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Error uploading image" });
        }
        await dbCostCenter.update({
          imageUrl: `https://sacmaback.blob.core.windows.net/cost-center/${identifier}.png`
        });
      }

      if (filePath && !dbCostCenter.imageUrl) {
        const identifier = crypto.randomUUID();
        const uploadResponse = await uploadFile(filePath, identifier, "image/jpg", "cost-center");
        if (uploadResponse instanceof CustomError) {
          return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Error uploading image" });
        }
        await dbCostCenter.update({
          imageUrl: `https://sacmaback.blob.core.windows.net/cost-center/${identifier}.png`
        });
      }
      const data = await this.costCenterRepository.update(costCenterData);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    }
    catch (err: any) {
      console.log(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  };

  updateCostCenterContact = async (costCenterData: types.UpdateCostCenterContactDTO): Promise<ResponseEntity> => {
    try {
      const data = await this.costCenterRepository.updateCostCenterContact(costCenterData);
      console.log(`data ${JSON.stringify(costCenterData)}`);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    }
    catch (err: any) {
      console.log(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  };

  updateCostCenterProject = async (costCenterData: types.UpdateCostCenterProjectDTO): Promise<ResponseEntity> => {
    try {
      const data = await this.costCenterRepository.updateCostCenterProject(costCenterData);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data[1]);
    }
    catch (err: any) {
      console.log(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err.message }
      );
    }
  };

  delete = async (id: number): Promise<ResponseEntity> => {
    await this.costCenterRepository.delete(id);
    return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Cost center deleted" });
  };

  deleteCostCenterContact = async (id: number): Promise<ResponseEntity> => {
    await this.costCenterRepository.deleteCostCenterContact(id);
    return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Cost center contact deleted" });
  };

  deleteCostCenterProject = async (id: number): Promise<ResponseEntity> => {
    await this.costCenterRepository.deleteCostCenterProject(id);
    return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Cost center project deleted" });
  };

  private buildFindAllFilter(request: types.FindAllDTO): { [key: string]: any } {
    let filter: { [key: string]: any } = {};
    for (const key of Object.getOwnPropertyNames(request)) {
      if (/^id/.test(key)) {
        filter = {
          ...filter,
          [key]: request[key as keyof types.FindAllDTO],
        };
      } else if (key === "name") {
        filter = {
          ...filter,
          name: {
            [Op.like]: `%${request.name}%`,
          },
        };
      }
      else if (key === "nit") {
        filter = {
          ...filter,
          nit: {
            [Op.like]: `%${request.nit}%`,
          },
        };
      }
    }
    return filter;
  }

  private buildFindAllCostCenterContactFilter(request: types.FindAllCostCenterContactDTO): { [key: string]: any } {
    let filter: { [key: string]: any } = {};
    for (const key of Object.getOwnPropertyNames(request)) {
      if (/^id/.test(key)) {
        filter = {
          ...filter,
          [key]: request[key as keyof types.FindAllCostCenterContactDTO],
        };
      } else if (key === "name") {
        filter = {
          ...filter,
          name: {
            [Op.like]: `%${request.name}%`,
          },
        };
      }
      else if (key === "phone") {
        filter = {
          ...filter,
          phone: {
            [Op.like]: `%${request.phone}%`,
          },
        };
      }
      else if (key === "email") {
        filter = {
          ...filter,
          email: {
            [Op.like]: `%${request.email}%`,
          },
        };
      }
      else if (key === "role") {
        filter = {
          ...filter,
          role: {
            [Op.like]: `%${request.role}%`,
          },
        };
      }
    }
    return filter;
  }

  private buildFindAllCostCenterProjectFilter(request: types.FindAllCostCenterProjectDTO): { [key: string]: any } {
    let filter: { [key: string]: any } = {};
    for (const key of Object.getOwnPropertyNames(request)) {
      if (/^id/.test(key)) {
        filter = {
          ...filter,
          [key]: request[key as keyof types.FindAllCostCenterProjectDTO],
        };
      } else if (key === "name") {
        filter = {
          ...filter,
          name: {
            [Op.like]: `%${request.name}%`,
          },
        };
      }
      else if (key === "location") {
        filter = {
          ...filter,
          location: {
            [Op.like]: `%${request.location}%`,
          },
        };
      }
      else if (key === "address") {
        filter = {
          ...filter,
          address: {
            [Op.like]: `%${request.address}%`,
          },
        };
      }
      else if (key === "phone") {
        filter = {
          ...filter,
          phone: {
            [Op.like]: `%${request.phone}%`,
          },
        };
      }
    }
    return filter;
  }
}

const costCenterRepository = new CostCenterRepository();
export const costCenterService = new CostCenterService(costCenterRepository);