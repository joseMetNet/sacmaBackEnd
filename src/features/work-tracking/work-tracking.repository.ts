import { WorkTracking } from "./work-tracking.model";
import * as dtos from "./work-tracking.interfase";
import { Employee } from "../employee";
import { CostCenterProject } from "../cost-center/cost-center-project.model";
import { WorkHour } from "./work-hour.model";
import { dbConnection } from "../../config";
import { QueryTypes } from "sequelize";
import { Novelty } from "../novelty";
import { User } from "../authentication";

export class WorkTrackingRepository {

  async findById(id: number): Promise<WorkTracking | null> {
    return await WorkTracking.findByPk(id, {
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
        },
        {
          model: CostCenterProject,
          attributes: ["idCostCenterProject", "name", "location"]
        }
      ]
    });
  }

  async findAllAndSearch(
    filter: string,
    replacements: { [key: string]: any },
    limit: number,
    offset: number
  ): Promise<dtos.WorkTrackingRFindAllDTO> {
    const query = `
      SELECT 
          wt.idEmployee, 
          COUNT(wt.createdAt) AS workedDays, 
          u.idUser, 
          u.firstName, 
          u.lastName,
          MAX(e.baseSalary) baseSalary
      FROM mvp1.TB_WorkTracking wt
      INNER JOIN mvp1.TB_Employee e ON wt.idEmployee = e.idEmployee
      INNER JOIN mvp1.TB_User u ON e.idUser = u.idUser
      INNER JOIN mvp1.TB_CostCenterProject ccp ON wt.idCostCenterProject = ccp.idCostCenterProject
      WHERE ${filter ? filter : "1 = 1"} 
      GROUP BY 
          wt.idEmployee, 
          e.idEmployee, 
          u.idUser, 
          u.firstName, 
          u.lastName
      ORDER BY wt.idEmployee
      OFFSET :offset ROWS
      FETCH NEXT :limit ROWS ONLY;
    `;

    const countQuery = `
      SELECT 
        COUNT(*) AS total
      FROM (
        SELECT 
            wt.idEmployee, 
            u.idUser, 
            u.firstName, 
            u.lastName
        FROM mvp1.TB_WorkTracking wt
        INNER JOIN mvp1.TB_Employee e ON wt.idEmployee = e.idEmployee
        INNER JOIN mvp1.TB_User u ON e.idUser = u.idUser
        INNER JOIN mvp1.TB_CostCenterProject ccp ON wt.idCostCenterProject = ccp.idCostCenterProject
        WHERE ${filter ? filter : "1 = 1"} 
        GROUP BY 
            wt.idEmployee, 
            e.idEmployee, 
            u.idUser, 
            u.firstName, 
            u.lastName
      ) AS subquery;
    `;

    const rows = await dbConnection.query<dtos.WorkTrackingRDTO>(query, {
      replacements: {
        limit,
        offset,
        ...replacements
      },
      type: QueryTypes.SELECT
    });

    const countResult = await dbConnection.query<{ total: number }>(countQuery, {
      replacements: {
        ...replacements
      },
      type: QueryTypes.SELECT
    });

    const count = countResult[0].total;

    return { rows, count };
  }

  async findAllByEmployee(
    filter: string,
    replacements: { [key: string]: any },
    limit: number,
    offset: number
  ): Promise<{ rows: dtos.WorkTrackingByEmployeeDTO[], count: number }> {

    const query = `
    SELECT
        u.firstName,
        u.lastName,
        u.identityCardNumber,
        tp.position,
        COUNT(wt.createdAt) AS workedDays,
        MONTH(wt.createdAt) AS month,
        YEAR(wt.createdAt) AS year,
        ccp.name AS projectName 
    FROM mvp1.TB_WorkTracking wt
        INNER JOIN mvp1.TB_Employee e ON wt.idEmployee = e.idEmployee
        INNER JOIN mvp1.TB_User u ON e.idUser = u.idUser
        INNER JOIN mvp1.TB_CostCenterProject ccp ON wt.idCostCenterProject = ccp.idCostCenterProject
        INNER JOIN mvp1.TB_Position tp ON tp.idPosition=e.idPosition
    WHERE ${filter ? filter : "1 = 1"}
    GROUP BY
        ccp.name,
        u.firstName,
        u.lastName,
        u.identityCardNumber,
        tp.position,
        MONTH(wt.createdAt),
        YEAR(wt.createdAt),
        ccp.name
    ORDER BY YEAR(wt.createdAt) DESC, MONTH(wt.createdAt) DESC
    OFFSET :offset ROWS
    FETCH NEXT :limit ROWS ONLY;
    `;
    const countQuery = `
      SELECT 
        COUNT(*) AS total
      FROM (
        SELECT
            u.firstName,
            u.lastName,
            u.identityCardNumber,
            tp.position,
            MONTH(wt.createdAt) AS month,
            YEAR(wt.createdAt) AS year,
            ccp.name AS projectName
        FROM mvp1.TB_WorkTracking wt
            INNER JOIN mvp1.TB_Employee e ON wt.idEmployee = e.idEmployee
            INNER JOIN mvp1.TB_User u ON e.idUser = u.idUser
            INNER JOIN mvp1.TB_CostCenterProject ccp ON wt.idCostCenterProject = ccp.idCostCenterProject
            INNER JOIN mvp1.TB_Position tp ON tp.idPosition = e.idPosition
        WHERE ${filter ? filter : "1 = 1"}
        GROUP BY
            ccp.name,
            u.firstName,
            u.lastName,
            u.identityCardNumber,
            tp.position,
            MONTH(wt.createdAt),
            YEAR(wt.createdAt)
      ) AS subquery;
    `;

    const rows = await dbConnection.query<dtos.WorkTrackingByEmployeeDTO>(query, {
      replacements: {
        limit,
        offset,
        ...replacements
      },
      type: QueryTypes.SELECT
    });

    const countResult = await dbConnection.query<{ total: number }>(countQuery, {
      replacements: {
        ...replacements
      },
      type: QueryTypes.SELECT
    });

    const count = countResult[0].total;
    return { rows, count };
  }

  async findWorkTrackingByEmployee(
    filter: { [key: string]: any },
    replacements: { [key: string]: any },
    limit: number,
    offset: number
  ): Promise<{ rows: WorkTracking[], count: number }> {
    const workTrackings = await WorkTracking.findAndCountAll({
      where: filter ? filter : {},
      include: [
        {
          model: Employee,
          attributes: ["idEmployee"],
          include: [
            {
              model: User,
              attributes: ["idUser", "firstName", "lastName", "identityCardNumber"]
            }
          ]
        },
        {
          model: CostCenterProject,
          attributes: ["idCostCenterProject", "name"]
        },
        {
          model: Novelty,
          attributes: ["idNovelty", "novelty"]
        }
      ],
      limit,
      offset,
      order: [[{ model: Employee, as: "Employee" }, { model: User, as: "User" }, "firstName", "DESC"]]
    });
    return workTrackings;
  }

  async findAll(): Promise<{ rows: WorkTracking[], count: number }> {
    const workTrackings = await WorkTracking.findAndCountAll({
      include: [{ all: true }],
      nest: true,
      distinct: true,
      order: [["idWorkTracking", "DESC"]]
    });
    return workTrackings;
  }

  async findAllWorkHour(): Promise<WorkHour[]> {
    const workHours = await WorkHour.findAll({});
    return workHours;
  }

  async update(workTrackingData: dtos.UpdateWorkTrackingDTO): Promise<[number, WorkTracking[]]> {
    return await WorkTracking.update(workTrackingData, {
      where: { idWorkTracking: workTrackingData.idWorkTracking },
      returning: true
    });
  }

  async create(workTrackingData: Partial<WorkTracking>): Promise<WorkTracking> {
    return await WorkTracking.create(workTrackingData);
  }

  async delete(id: number): Promise<number> {
    return await WorkTracking.destroy({
      where: { idWorkTracking: id }
    });
  }

  // find work tracking bu a list of ids
  async findAllByIds(ids: number[]): Promise<WorkTracking[]> {
    return await WorkTracking.findAll({
      where: {
        idWorkTracking: ids
      }
    });
  }
}