import sequelize from "sequelize";
import { StatusCode } from "../interfaces";
import { BuildResponse } from "../services";
import { ResponseEntity } from "../services/interface";
import { calculateBusinessDaysForCurrentMonth, CustomError } from "../utils";
import * as types from "./work-tracking.interfase";
import { WorkTrackingRepository } from "./work-tracking.repository";
import { dbConnection } from "../config";
import { WorkTracking } from "./work-tracking.model";
import { Employee, User } from "../models";
import { EmployeeRepository } from "../repositories";
import * as ExcelJS from "exceljs";
import { NoveltyRepository } from "../novelty";

export class WorkTrackingService {
  private readonly workTrackingRepository: WorkTrackingRepository;
  private readonly novelityRepository: NoveltyRepository;
  private readonly employeeRepository: EmployeeRepository;

  constructor(
    workTrackingRepository: WorkTrackingRepository,
    novelityRepository: NoveltyRepository,
    employeeRepository: EmployeeRepository
  ) {
    this.workTrackingRepository = workTrackingRepository;
    this.novelityRepository = novelityRepository;
    this.employeeRepository = employeeRepository;
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

  findDailyWorkTrackingByEmployee = async (request: types.FindAllDailyWorkTrackingDTO): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = this.getPagination(request);
      const filterConditions = this.buildDailyWorkTrackingFilterConditions(request);

      const query = `
        SELECT
          CONVERT(DATE, wt.createdAt) AS date,
          SUM(CASE WHEN tn.novelty = 'Asistencia' THEN 1 ELSE 0 END) AS ingresoCount,
          SUM(CASE WHEN tn.novelty = 'Incapacitado' THEN 1 ELSE 0 END) AS incapacitatedCount,
          SUM(CASE WHEN tn.novelty = 'Vacación' THEN 1 ELSE 0 END) AS vacationCount,
          SUM(CASE WHEN tn.novelty = 'Sanción' THEN 1 ELSE 0 END) AS sancionadosCount,
          SUM(CASE WHEN tn.novelty = 'Permiso' THEN 1 ELSE 0 END) AS permisoCount
        FROM mvp1.TB_WorkTracking wt
        LEFT JOIN mvp1.TB_Novelty tn ON tn.idNovelty = wt.idNovelty
        ${filterConditions}
        GROUP BY CONVERT(DATE, wt.createdAt)
        ORDER BY CONVERT(DATE, wt.createdAt) DESC
        OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY;
      `;

      const replacements = { offset, limit, ...request };

      const data = await dbConnection.query(query, {
        replacements,
        type: sequelize.QueryTypes.SELECT,
      });

      const totalQuery = `
        SELECT COUNT(DISTINCT CONVERT(DATE, wt.createdAt)) AS total
        FROM mvp1.TB_WorkTracking wt
        LEFT JOIN mvp1.TB_Novelty tn ON tn.idNovelty = wt.idNovelty
        ${filterConditions};
      `;

      const totalResult = await dbConnection.query<FindDailyCount>(totalQuery, {
        replacements,
        type: sequelize.QueryTypes.SELECT,
      });

      const totalItems = totalResult[0].total;
      const totalPages = Math.ceil(totalItems / pageSize);

      const response = {
        data,
        totalItems,
        currentPage: page,
        totalPages,
      };

      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        response
      );
    }
    catch (error) {
      console.error(`Error getting Daily Work Tracking by Employee: ${error}`);
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

      // Check if there is any work tracking with the same date
      const workTracking = await WorkTracking.findAll({
        include: [
          {
            model: Employee,
            attributes: ["idEmployee"],
            include: [
              {
                model: User,
                attributes: ["idUser", "firstName", "lastName"]
              }
            ]
          }
        ],
        where: {
          createdAt: sequelize.where(sequelize.literal("CONVERT(DATE, WorkTracking.createdAt)"), "=", request[0].createdAt)
        }
      });

      // If there is any work tracking with the same date, return an error, add the name of the employee and the date
      if(workTracking.length > 0) {
        const namesAndDate = workTracking.map((item) => {
          const data = item.toJSON();
          return `${data.Employee.User.firstName} ${data.Employee.User.lastName}`;
        });
        return BuildResponse.buildErrorResponse(
          StatusCode.BadRequest,
          { message: `Work Tracking already exists for the following employees: ${namesAndDate.join(", ")} on ${request[0].createdAt}` }
        );
      }

      // check is there is a novelty with id distinct of 1
      const noveltiesRequest = request.filter((item) => item.idNovelty !== 1);

      if(noveltiesRequest.length > 0) {
        // create novelties
        const createNoveltiesPromises = noveltiesRequest.map((item) => {
          const newNovelty = {
            idNovelty: item.idNovelty!,
            idEmployee: item.idEmployee,
            createdAt: item.createdAt!,
            endAt: item.createdAt!
          };
          return this.novelityRepository.createNovelty(newNovelty);
        });

        await Promise.all(createNoveltiesPromises);
      }

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
  // method to generate an excel file, this call a store procedure called sp_FindDynamicWorkTrackingReport
  generateReport = async (): Promise<ExcelJS.Buffer | CustomError> => {
    try {
      let data = await dbConnection.query<PivotResult>(
        "EXEC mvp1.sp_FindDynamicWorkTrackingReport",
        { type: sequelize.QueryTypes.SELECT }
      );
      // add the total to the returned data
      const employees = await this.employeeRepository.findEmployeeAndRoles();
      if(employees instanceof CustomError) {
        return employees;
      }

      const businessDays = calculateBusinessDaysForCurrentMonth();
      const wageEmployees = employees.map((employee) => {
        const wage = parseFloat(employee.baseSalary) / businessDays;
        const jsonEmployee = employee.toJSON();
        return {
          employeeName: `${jsonEmployee.User.firstName} ${jsonEmployee.User.lastName}`,
          wage: parseFloat(wage.toFixed(2))
        };
      });

      data = data.map((item) => {
        const values = Object.values(item).filter(value => typeof value === "number");
        const total = values.reduce((sum, value) => sum + value, 0);
        const wage = wageEmployees.find((employee) => employee.employeeName === item.employeeName)?.wage || 0;
        return { ...item, ValorDia: wage, Total: total };
      });


      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Work Tracking Report");
      const columns = Object.keys(data[0]);
      worksheet.columns = columns.map(
        (column) => {
          if (column === "employeeName") {
            return { header: "Nombre", key: column, width: 50, style: { font: { bold: true } } };
          }
          if (column === "ValorDia") {
            return { header: "Valor Dia", key: column, width: 30, style: { font: { bold: true } } };
          }
          return { header: column, key: column, width: 30, style: { font: { bold: true } } };
        }
      );

      data.forEach((item) => {
        worksheet.addRow(item);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;
    }
    catch (error) {
      console.error(`Error generating report: ${error}`);
      return new CustomError(StatusCode.InternalErrorServer, "Error generating report");
    }
  };

  updateAll = async (request: types.UpdateWorkTrackingDTO[]): Promise<ResponseEntity> => {
    try {
      const workTrackingIds = request.map(item => item.idWorkTracking);
      const workTrackings = await this.workTrackingRepository.findAllByIds(workTrackingIds);

      if (workTrackings.length !== workTrackingIds.length) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Work Tracking not found" }
        );
      }

      const updateAllPromises = workTrackings.map(item => {
        const newWorkTracking = request.find(element => element.idWorkTracking === item.idWorkTracking);
        if (newWorkTracking) {
          Object.assign(item, {
            idEmployee: newWorkTracking.idEmployee || item.idEmployee,
            idCostCenterProject: newWorkTracking.idCostCenterProject || item.idCostCenterProject,
            hoursWorked: newWorkTracking.hoursWorked || item.hoursWorked,
            overtimeHour: newWorkTracking.overtimeHour || item.overtimeHour,
            idNovelty: newWorkTracking.idNovelty || item.idNovelty,
            createdAt: newWorkTracking.createdAt || item.createdAt,
          });
        }
        return item.save();
      });

      await Promise.all(updateAllPromises);

      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        { message: "Work Tracking updated successfully" }
      );
    } catch (error) {
      console.error(error);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "Error updating Work Tracking" }
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

  deleteById = async (data: types.DeleteById): Promise<ResponseEntity> => {
    try {
      const workTracking = await this.workTrackingRepository.findById(data.idWorkTracking);
      if (!workTracking) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Work Tracking not found" }
        );
      }

      await this.workTrackingRepository.delete(data.idWorkTracking);

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

  delete = async (data: types.DeleteWorkTrackingDTO): Promise<ResponseEntity> => {
    try {
      const workTracking = await WorkTracking.findAll({
        where: {
          createdAt: sequelize.where(sequelize.literal("CONVERT(DATE, WorkTracking.createdAt)"), "=", data.createdAt)
        }
      });

      if(workTracking.length === 0) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Work Tracking not found" }
        );
      }
      const deletePromises = workTracking.map((item) => {
        return item.destroy();
      });
      Promise.all(deletePromises);

      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        { message: "Work Tracking deleted successfully" }
      );
    }
    catch (error) {
      console.error(`Error deleting Work Tracking: ${error}`);
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

    if (request.createdAt) {
      replacements.createdAt = request.createdAt;
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
      } else if (key === "projectName") {
        filters.push("ccp.name LIKE :projectName");
      } else if (key === "createdAt") {
        filters.push("CONVERT(DATE, wt.createdAt) = :createdAt");
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
      }else if (key === "createdAt") {
        filters = {
          ...filters,
          createdAt: sequelize.where(sequelize.literal("CONVERT(DATE, WorkTracking.createdAt)"), "=", request.createdAt)
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

  private getPagination = (request: { page?: number, pageSize?: number }) => {
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    return { page, pageSize, limit, offset };
  };

  private buildDailyWorkTrackingFilterConditions = (request: types.FindAllDailyWorkTrackingDTO): string => {
    let conditions = "WHERE 1=1";
    
    if (request.year) {
      conditions += " AND YEAR(wt.createdAt) = :year";
    }
    
    if (request.month) {
      conditions += " AND MONTH(wt.createdAt) = :month";
    }
    
    if (request.createdAt) {
      conditions += " AND CONVERT(DATE, wt.createdAt) = :createdAt";
    }
    return conditions;
  };
}

interface FindDailyCount {
  total: number;
}

interface PivotResult {
  employeeName: string;
  [key: string]: string | number;
}