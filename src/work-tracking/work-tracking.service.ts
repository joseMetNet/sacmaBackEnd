import sequelize from "sequelize";
import { StatusCode } from "../interfaces";
import { BuildResponse } from "../services";
import { ResponseEntity } from "../services/interface";
import { calculateBusinessDaysForCurrentMonth } from "../utils";
import * as types from "./work-tracking.interfase";
import { WorkTrackingRepository } from "./work-tracking.repository";

export class WorkTrackingService {
  private readonly workTrackingRepository: WorkTrackingRepository;

  constructor(workTrackingRepository: WorkTrackingRepository) {
    this.workTrackingRepository = workTrackingRepository;
  }

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

    try {
      if (request.pageSize === -1) {
        const data = await this.workTrackingRepository.findAll();
        return BuildResponse.buildSuccessResponse(
          StatusCode.Ok,
          data.rows
        );
      }
      const filter = this.buildFindAllFilter(request);
      const replacements = this.buildReplacements(request);

      const data = await this.workTrackingRepository.findAllAndSearch(filter, replacements, limit, offset);
      const result = data.rows.map((item: types.WorkTrackingRDTO) => {
        const wage = item.baseSalary / calculateBusinessDaysForCurrentMonth();
        return {
          ...item,
          businessDays: calculateBusinessDaysForCurrentMonth(),
          dailyWage: parseFloat(wage.toFixed(2)),
        };
      });
      const response = {
        data: result,
        totalItems: data.count,
        currentPage: page,
        totalPages: Math.ceil(data.count / pageSize),
      };
      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        response
      );
    }
    catch (error) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error getting Work Trackings" }
      );
    }
  };

  findWorkTrackingByEmployee = async (request: types.FindAllByEmployeeDTO): Promise<ResponseEntity> => {
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

    try {
      const filter = this.buildFindWorkTrackingByEmployeeFilter(request);
      const replacements = this.buildReplacementsByEmployee(request);

      const data = await this.workTrackingRepository.findWorkTrackingByEmployee(filter, replacements, limit, offset);

      const response = {
        data: data.rows,
        totalItems: data.count,
        currentPage: page,
        totalPages: Math.ceil(data.count / pageSize),
      };
      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        response
      );
    }
    catch (error) {
      console.error(`Error getting Work Tracking by Employee: ${error}`);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error getting Work Trackings" }
      );
    }
  };

  findAllByEmployee = async (request: types.FindAllByEmployeeDTO): Promise<ResponseEntity> => {
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

    try {
      const filter = this.buildFindAllByEmployeeFilter(request);
      const replacements = this.buildReplacementsByEmployee(request);

      const data = await this.workTrackingRepository.findAllByEmployee(filter, replacements, limit, offset);

      const user = {
        firstName: data.rows[0].firstName,
        lastName: data.rows[0].lastName,
        identityCardNumber: data.rows[0].identityCardNumber,
        position: data.rows[0].position,
      };
      const summary = data.rows.map((item: types.WorkTrackingByEmployeeDTO) => {
        return {
          projectName: item.projectName,
          workedDays: item.workedDays,
          date: this.buildStartDateWithMonthAndYear(item),
        };
      });

      const result = {
        user,
        summary,
      };

      const response = {
        data: result,
        totalItems: data.count,
        currentPage: page,
        totalPages: Math.ceil(data.count / pageSize),
      };
      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        response
      );
    }
    catch (error) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error getting Work Trackings" }
      );
    }
  };

  findAllWorkHour = async (): Promise<ResponseEntity> => {
    try {
      const result = await this.workTrackingRepository.findAllWorkHour();
      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        result
      );
    }
    catch (error) {
      console.error(`Error getting Work Hour: ${error}`);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error getting Work Trackings" }
      );
    }
  };

  findById = async (id: number): Promise<ResponseEntity> => {
    try {
      const response = await this.workTrackingRepository.findById(id);
      if (!response) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Work Tracking not found" }
        );
      }
      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        response
      );
    }
    catch (error) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error getting Work Tracking" }
      );
    }
  };

  create = async (request: types.CreateWorkTrackingDTO): Promise<ResponseEntity> => {
    try {
      const response = await this.workTrackingRepository.create(request);
      return BuildResponse.buildSuccessResponse(
        StatusCode.ResourceCreated,
        response
      );
    }
    catch (error) {
      console.error(`Error creating Work Tracking: ${error}`);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error creating Work Tracking" }
      );
    }
  };

  createAll = async (request: types.CreateWorkTrackingDTO[]): Promise<ResponseEntity> => {
    try {
      const createAllPromises = request.map((item) => {
        return this.workTrackingRepository.create(item);
      });

      await Promise.all(createAllPromises);

      return BuildResponse.buildSuccessResponse(
        StatusCode.ResourceCreated,
        { message: "Work Tracking created successfully" }
      );
    }
    catch (error) {
      console.error(`Error creating Work Tracking: ${error}`);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error creating Work Tracking" }
      );
    }
  };

  update = async (request: types.UpdateWorkTrackingDTO): Promise<ResponseEntity> => {
    try {
      const workTracking = await this.workTrackingRepository.findById(request.idWorkTracking);
      if (!workTracking) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Work Tracking not found" }
        );
      }

      await this.workTrackingRepository.update(request);

      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        workTracking
      );
    }
    catch (error) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error updating Work Tracking" }
      );
    }
  };

  delete = async (id: number): Promise<ResponseEntity> => {
    try {
      const workTracking = await this.workTrackingRepository.findById(id);
      if (!workTracking) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Work Tracking not found" }
        );
      }

      await workTracking.destroy();

      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        { message: "Work Tracking deleted successfully" }
      );
    }
    catch (error) {
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error deleting Work Tracking" }
      );
    }
  };

  private buildReplacements = (request: types.FindAllDTO): { [key: string]: any } => {
    const replacements: { [key: string]: any } = {};
  
    if (request.idEmployee) {
      replacements.idEmployee = request.idEmployee;
    }
    
    if (request.idCostCenterProject) {
      replacements.idCostCenterProject = request.idCostCenterProject;
    }
  
    if (request.month) {
      replacements.month = request.month;
    }
  
    if (request.year) {
      replacements.year = request.year;
    }

    if (request.employeeName) {
      replacements.employeeName = `%${request.employeeName}%`;
    }

    if(request.projectName) {
      replacements.projectName = `%${request.projectName}%`;
    }
  
    return replacements;
  };

  private buildReplacementsByEmployee = (request: types.FindAllByEmployeeDTO): { [key: string]: any } => {
    const replacements: { [key: string]: any } = {};
  
    if (request.idEmployee) {
      replacements.idEmployee = request.idEmployee;
    }
    
    if (request.idCostCenterProject) {
      replacements.idCostCenterProject = request.idCostCenterProject;
    }
  
    if(request.projectName) {
      replacements.projectName = `%${request.projectName}%`;
    }
  
    return replacements;
  };

  private buildFindAllFilter(request: types.FindAllDTO): string {
    const filters: string[] = [];
  
    for (const key of Object.getOwnPropertyNames(request)) {
      if (key === "idEmployee") {
        filters.push("wt.idEmployee = :idEmployee");
      } else if (key === "idCostCenterProject") {
        filters.push("wt.idCostCenterProject = :idCostCenterProject");
      } 
      else if (key === "month") {
        filters.push("MONTH(wt.createdAt) = :month");
      } else if (key === "year") {
        filters.push("YEAR(wt.createdAt) = :year");
      }
      else if (key === "projectName") {
        filters.push("ccp.name LIKE :projectName");
      }else if (key === "employeeName") {
        filters.push("u.firstName LIKE :employeeName OR u.lastName LIKE :employeeName");
      }
    }
  
    return filters.length > 0 ? " " + filters.join(" AND ") : "";
  }

  private buildFindAllByEmployeeFilter(request: types.FindAllByEmployeeDTO): string {
    const filters: string[] = [];
  
    for (const key of Object.getOwnPropertyNames(request)) {
      if (key === "idEmployee") {
        filters.push("wt.idEmployee = :idEmployee");
      } else if (key === "idCostCenterProject") {
        filters.push("wt.idCostCenterProject = :idCostCenterProject");
      } 
      else if (key === "projectName") {
        filters.push("ccp.name LIKE :projectName");
      }
    }
  
    return filters.length > 0 ? " " + filters.join(" AND ") : "";
  }

  private buildFindWorkTrackingByEmployeeFilter(request: types.FindAllByEmployeeDTO): { [key: string]: any } {
    let filters: { [key: string]: any } = {};
  
    for (const key of Object.getOwnPropertyNames(request)) {
      if (key === "idEmployee") {
        filters.idEmployee = request.idEmployee;
      } else if (key === "idCostCenterProject") {
        filters.idCostCenterProject = request.idCostCenterProject;
      } 
      else if (key === "projectName") {
        filters = {
          ...filters,
          projectName: sequelize.where(sequelize.col("CostCenterProject.name"), "LIKE", `%${request.projectName}%`)
        };
      }
    }
  
    return filters;
  }

  private buildStartDateWithMonthAndYear = (data: types.WorkTrackingByEmployeeDTO): string => {
    const { month, year } = data;

    const startDate = new Date(year, month - 1, 1);
    const formattedStartDate = startDate.toISOString().split("T")[0];
    return formattedStartDate;
  };
}