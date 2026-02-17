import { RevenueCenter } from "./revenue-center.model";
import { IRevenueCenter, IRelationsProjectItemsMaterialInvoiceCreate, IRelationsProjectItemsMaterialInvoiceUpdate } from "./revenue-center.interface";
import { CostCenterProject } from "../cost-center";
import { QueryTypes, WhereOptions } from "sequelize";
import { dbConnection } from "../../config";
import { RevenueCenterStatus } from "./revenue-center-status-model";
import { RelationsProjectItemsMaterialInvoice } from "./relations-project-items-material-invoice.model";
import { DetailPriceInventoryCostCenter } from "../inventory/detail-price-inventory-cost-center.model";

export class RevenueCenterRepository {
  findAll = (
    limit: number,
    offset: number,
    filter?: WhereOptions<IRevenueCenter>
  ) => {
    return RevenueCenter.findAndCountAll({
      limit,
      offset,
      where: filter,
      include: [
        {
          model: CostCenterProject,
          required: true,
        },
        {
          model: RevenueCenterStatus,
          required: true,
        },
        {
          model: DetailPriceInventoryCostCenter,
          required: false,
        }
      ],
      order: [[CostCenterProject, 'name', 'ASC']],
      subQuery: false,
    });
  };

  async findById(idRevenueCenter: number): Promise<IRevenueCenter | null> {
    return await RevenueCenter.findByPk(idRevenueCenter);
  }

  async findByIdFromAnyTable(idRevenueCenter: number): Promise<(IRevenueCenter & { sourceTable: string }) | null> {
    const query = `
      SELECT TOP 1 *
      FROM (
        SELECT
          rc.idRevenueCenter,
          rc.name,
          rc.idCostCenterProject,
          rc.idRevenueCenterStatus,
          rc.idQuotation,
          rc.fromDate,
          rc.toDate,
          rc.createdAt,
          rc.updatedAt,
          rc.invoice,
          rc.spend,
          rc.utility,
          CAST('Active' AS VARCHAR(50)) AS sourceTable
        FROM mvp1.TB_RevenueCenter rc
        WHERE rc.idRevenueCenter = :idRevenueCenter

        UNION ALL

        SELECT
          rc.idRevenueCenter,
          rc.name,
          rc.idCostCenterProject,
          rc.idRevenueCenterStatus,
          rc.idQuotation,
          rc.fromDate,
          rc.toDate,
          rc.createdAt,
          rc.updatedAt,
          rc.invoice,
          rc.spend,
          rc.utility,
          CAST('Inactive' AS VARCHAR(50)) AS sourceTable
        FROM mvp1.TB_RevenueCenter_Inactive rc
        WHERE rc.idRevenueCenter = :idRevenueCenter

        UNION ALL

        SELECT
          rc.idRevenueCenter,
          rc.name,
          rc.idCostCenterProject,
          rc.idRevenueCenterStatus,
          rc.idQuotation,
          rc.fromDate,
          rc.toDate,
          rc.createdAt,
          rc.updatedAt,
          rc.invoice,
          rc.spend,
          rc.utility,
          CAST('Liquidation' AS VARCHAR(50)) AS sourceTable
        FROM mvp1.TB_RevenueCenter_Liquidation rc
        WHERE rc.idRevenueCenter = :idRevenueCenter

        UNION ALL

        SELECT
          rc.idRevenueCenter,
          rc.name,
          rc.idCostCenterProject,
          rc.idRevenueCenterStatus,
          rc.idQuotation,
          rc.fromDate,
          rc.toDate,
          rc.createdAt,
          rc.updatedAt,
          rc.invoice,
          rc.spend,
          rc.utility,
          CAST('RetentionGuarantee' AS VARCHAR(50)) AS sourceTable
        FROM mvp1.TB_RevenueCenter_RetentionGuarantee rc
        WHERE rc.idRevenueCenter = :idRevenueCenter
      ) t
    `;

    const result = await dbConnection.query<(IRevenueCenter & { sourceTable: string })>(query, {
      type: QueryTypes.SELECT,
      replacements: { idRevenueCenter },
    });

    return result[0] ?? null;
  }

  async changeRevenueCenterStatus(idRevenueCenter: number, newIdRevenueCenterStatus: number): Promise<void> {
    const query = `
      EXEC [mvp1].[SP_ChangeRevenueCenterStatus]
        @idRevenueCenter = :idRevenueCenter,
        @newIdRevenueCenterStatus = :newIdRevenueCenterStatus
    `;

    await dbConnection.query(query, {
      replacements: {
        idRevenueCenter,
        newIdRevenueCenterStatus,
      },
    });
  }

  async create(data: Partial<IRevenueCenter>): Promise<IRevenueCenter> {
    console.log("Creating revenue center with data:", data);
    return await RevenueCenter.create(data as Partial<IRevenueCenter>);
  }

  async update(idRevenueCenter: number, data: Partial<IRevenueCenter>): Promise<[number]> {
    return await RevenueCenter.update(data, {
      where: { idRevenueCenter },
    });
  }

  async delete(idRevenueCenter: number): Promise<number> {
    return await RevenueCenter.destroy({
      where: { idRevenueCenter },
    });
  }

  findAllWorkTrackingEfrain = async (
    limit: number,
    offset: number,
    filter?: { idRevenueCenter?: number; idCostCenterProject?: number }
  ) => {
    const currentYear = new Date().getFullYear();
    const sequelize = RevenueCenter.sequelize!;

    const monthlyWorkQuery = `
      WITH MonthlyWork AS (
        SELECT
          CONCAT(u.firstName, ' ', u.lastName) AS Name,
          tp.position AS Position,
          ccp.name AS Project,
          MONTH(wt.createdAt) AS WorkMonth,
          YEAR(wt.createdAt) AS WorkYear,
          COUNT(wt.createdAt) AS DaysWorked,
          e.baseSalary / DAY(EOMONTH(wt.createdAt)) AS ValorDia,
          COUNT(wt.createdAt) * (e.baseSalary / DAY(EOMONTH(wt.createdAt))) AS MonthlyTotal
        FROM mvp1.TB_WorkTracking wt
        INNER JOIN mvp1.TB_Employee e ON wt.idEmployee = e.idEmployee
        INNER JOIN mvp1.TB_User u ON e.idUser = u.idUser
        INNER JOIN mvp1.TB_Position tp ON tp.idPosition = e.idPosition
        INNER JOIN mvp1.TB_CostCenterProject ccp ON wt.idCostCenterProject = ccp.idCostCenterProject
        INNER JOIN mvp1.TB_RevenueCenter rc ON rc.idCostCenterProject = ccp.idCostCenterProject
        WHERE YEAR(wt.createdAt) = :currentYear
        ${filter?.idRevenueCenter ? "AND rc.idRevenueCenter = :idRevenueCenter" : ""}
        ${filter?.idCostCenterProject ? "AND wt.idCostCenterProject = :idCostCenterProject" : ""}
        GROUP BY
          u.firstName,
          u.lastName,
          ccp.name,
          tp.position,
          MONTH(wt.createdAt),
          YEAR(wt.createdAt),
          e.baseSalary,
          EOMONTH(wt.createdAt)
      )
      SELECT
        Name,
        Position,
        Project,
        MAX(CASE WHEN WorkMonth = 1 THEN DaysWorked ELSE 0 END) AS 'Enero',
        MAX(CASE WHEN WorkMonth = 2 THEN DaysWorked ELSE 0 END) AS 'Febrero',
        MAX(CASE WHEN WorkMonth = 3 THEN DaysWorked ELSE 0 END) AS 'Marzo',
        MAX(CASE WHEN WorkMonth = 4 THEN DaysWorked ELSE 0 END) AS 'Abril',
        MAX(CASE WHEN WorkMonth = 5 THEN DaysWorked ELSE 0 END) AS 'Mayo',
        MAX(CASE WHEN WorkMonth = 6 THEN DaysWorked ELSE 0 END) AS 'Junio',
        MAX(CASE WHEN WorkMonth = 7 THEN DaysWorked ELSE 0 END) AS 'Julio',
        MAX(CASE WHEN WorkMonth = 8 THEN DaysWorked ELSE 0 END) AS 'Agosto',
        MAX(CASE WHEN WorkMonth = 9 THEN DaysWorked ELSE 0 END) AS 'Septiembre',
        MAX(CASE WHEN WorkMonth = 10 THEN DaysWorked ELSE 0 END) AS 'Octubre',
        MAX(CASE WHEN WorkMonth = 11 THEN DaysWorked ELSE 0 END) AS 'Noviembre',
        MAX(CASE WHEN WorkMonth = 12 THEN DaysWorked ELSE 0 END) AS 'Diciembre',
        MAX(ValorDia) AS 'dailyWage',
        SUM(DaysWorked) AS 'workedDays',
        SUM(MonthlyTotal) AS 'monthlyTotal'
      FROM MonthlyWork
      GROUP BY Name, Project, Position
      ORDER BY Name
      OFFSET :offset ROWS
      FETCH NEXT :limit ROWS ONLY;
    `;

    const totalQuery = `
      WITH MonthlyWork AS (
        SELECT
          CONCAT(u.firstName, ' ', u.lastName) AS Name,
          tp.position AS Position,
          ccp.name AS Project,
          MONTH(wt.createdAt) AS WorkMonth,
          YEAR(wt.createdAt) AS WorkYear,
          COUNT(wt.createdAt) AS DaysWorked,
          e.baseSalary / DAY(EOMONTH(wt.createdAt)) AS ValorDia,
          COUNT(wt.createdAt) * (e.baseSalary / DAY(EOMONTH(wt.createdAt))) AS MonthlyTotal
        FROM mvp1.TB_WorkTracking wt
        INNER JOIN mvp1.TB_Employee e ON wt.idEmployee = e.idEmployee
        INNER JOIN mvp1.TB_User u ON e.idUser = u.idUser
        INNER JOIN mvp1.TB_Position tp ON tp.idPosition = e.idPosition
        INNER JOIN mvp1.TB_CostCenterProject ccp ON wt.idCostCenterProject = ccp.idCostCenterProject
        INNER JOIN mvp1.TB_RevenueCenter rc ON rc.idCostCenterProject = ccp.idCostCenterProject
        WHERE YEAR(wt.createdAt) = :currentYear
        ${filter?.idRevenueCenter ? "AND rc.idRevenueCenter = :idRevenueCenter" : ""}
        ${filter?.idCostCenterProject ? "AND wt.idCostCenterProject = :idCostCenterProject" : ""}
        GROUP BY
          u.firstName,
          u.lastName,
          ccp.name,
          tp.position,
          MONTH(wt.createdAt),
          YEAR(wt.createdAt),
          e.baseSalary,
          EOMONTH(wt.createdAt)
      )
      SELECT
        Name,
        Position,
        Project,
        MAX(CASE WHEN WorkMonth = 1 THEN DaysWorked ELSE 0 END) AS 'Enero',
        MAX(CASE WHEN WorkMonth = 2 THEN DaysWorked ELSE 0 END) AS 'Febrero',
        MAX(CASE WHEN WorkMonth = 3 THEN DaysWorked ELSE 0 END) AS 'Marzo',
        MAX(CASE WHEN WorkMonth = 4 THEN DaysWorked ELSE 0 END) AS 'Abril',
        MAX(CASE WHEN WorkMonth = 5 THEN DaysWorked ELSE 0 END) AS 'Mayo',
        MAX(CASE WHEN WorkMonth = 6 THEN DaysWorked ELSE 0 END) AS 'Junio',
        MAX(CASE WHEN WorkMonth = 7 THEN DaysWorked ELSE 0 END) AS 'Julio',
        MAX(CASE WHEN WorkMonth = 8 THEN DaysWorked ELSE 0 END) AS 'Agosto',
        MAX(CASE WHEN WorkMonth = 9 THEN DaysWorked ELSE 0 END) AS 'Septiembre',
        MAX(CASE WHEN WorkMonth = 10 THEN DaysWorked ELSE 0 END) AS 'Octubre',
        MAX(CASE WHEN WorkMonth = 11 THEN DaysWorked ELSE 0 END) AS 'Noviembre',
        MAX(CASE WHEN WorkMonth = 12 THEN DaysWorked ELSE 0 END) AS 'Diciembre',
        MAX(ValorDia) AS 'dailyWage',
        SUM(DaysWorked) AS 'workedDays',
        SUM(MonthlyTotal) AS 'monthlyTotal'
      FROM MonthlyWork
      GROUP BY Name, Project, Position
      ORDER BY Name
    `;

    // Update the count query to match the grouping in the main query
    const countQuery = `
      SELECT COUNT(DISTINCT CONCAT(u.firstName, ' ', u.lastName, ccp.name)) as total
      FROM mvp1.TB_WorkTracking wt
      INNER JOIN mvp1.TB_Employee e ON wt.idEmployee = e.idEmployee
      INNER JOIN mvp1.TB_User u ON e.idUser = u.idUser
      INNER JOIN mvp1.TB_CostCenterProject ccp ON wt.idCostCenterProject = ccp.idCostCenterProject
      INNER JOIN mvp1.TB_RevenueCenter rc ON rc.idCostCenterProject = ccp.idCostCenterProject
      WHERE YEAR(wt.createdAt) = :currentYear
      ${filter?.idRevenueCenter ? "AND rc.idRevenueCenter = :idRevenueCenter" : ""}
      ${filter?.idCostCenterProject ? "AND wt.idCostCenterProject = :idCostCenterProject" : ""}
    `;

    const [results, totalResult, countResults] = await Promise.all([
      sequelize.query(monthlyWorkQuery, {
        replacements: {
          currentYear,
          limit,
          offset,
          ...filter
        }
      }),
      sequelize.query(totalQuery, {
        replacements: {
          currentYear,
          ...filter
        }
      }),
      sequelize.query(countQuery, {
        replacements: {
          currentYear,
          ...filter
        }
      })
    ]);

    const countResult = countResults[0] as Array<{ total: number }>;
    const total = countResult[0]?.total ?? 0;

    return {
      rows: results[0],
      totalRows: totalResult[0],
      count: total
    };
  };

  findAllWorkTracking = async (
    limit: number,
    offset: number,
    filter?: { idRevenueCenter?: number; idCostCenterProject?: number }
  ) => {
    const sequelize = RevenueCenter.sequelize!;

    // Determinar si se debe usar paginación
    const usePagination = limit !== -1;
    const paginationClause = usePagination 
      ? `OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY` 
      : '';

    const monthlyWorkQuery = `
    WITH MonthlyWork AS (
      SELECT
        CONCAT(u.firstName, ' ', u.lastName) AS Name,
        tp.position AS Position,
        ccp.name AS Project,
        MONTH(wt.createdAt) AS WorkMonth,
        YEAR(wt.createdAt) AS WorkYear,
        COUNT(wt.createdAt) AS DaysWorked,
        --e.baseSalary / DAY(EOMONTH(wt.createdAt)) AS ValorDia,
        e.baseSalary / 24 * 1.35 AS ValorDia,
        COUNT(wt.createdAt) * (e.baseSalary / DAY(EOMONTH(wt.createdAt))) AS MonthlyTotal
      FROM mvp1.TB_WorkTracking wt
      INNER JOIN mvp1.TB_Employee e ON wt.idEmployee = e.idEmployee
      INNER JOIN mvp1.TB_User u ON e.idUser = u.idUser
      INNER JOIN mvp1.TB_Position tp ON tp.idPosition = e.idPosition
      INNER JOIN mvp1.TB_CostCenterProject ccp ON wt.idCostCenterProject = ccp.idCostCenterProject
      INNER JOIN mvp1.TB_RevenueCenter rc ON rc.idCostCenterProject = ccp.idCostCenterProject
      WHERE 1=1
      ${filter?.idRevenueCenter ? "AND rc.idRevenueCenter = :idRevenueCenter" : ""}
      ${filter?.idCostCenterProject ? "AND wt.idCostCenterProject = :idCostCenterProject" : ""}
      GROUP BY
        u.firstName,
        u.lastName,
        ccp.name,
        tp.position,
        MONTH(wt.createdAt),
        YEAR(wt.createdAt),
        e.baseSalary,
        EOMONTH(wt.createdAt)
    )
    SELECT
      WorkYear,
      Name,
      Position,
      Project,
      MAX(CASE WHEN WorkMonth = 1 THEN DaysWorked ELSE 0 END) AS 'Enero',
      MAX(CASE WHEN WorkMonth = 2 THEN DaysWorked ELSE 0 END) AS 'Febrero',
      MAX(CASE WHEN WorkMonth = 3 THEN DaysWorked ELSE 0 END) AS 'Marzo',
      MAX(CASE WHEN WorkMonth = 4 THEN DaysWorked ELSE 0 END) AS 'Abril',
      MAX(CASE WHEN WorkMonth = 5 THEN DaysWorked ELSE 0 END) AS 'Mayo',
      MAX(CASE WHEN WorkMonth = 6 THEN DaysWorked ELSE 0 END) AS 'Junio',
      MAX(CASE WHEN WorkMonth = 7 THEN DaysWorked ELSE 0 END) AS 'Julio',
      MAX(CASE WHEN WorkMonth = 8 THEN DaysWorked ELSE 0 END) AS 'Agosto',
      MAX(CASE WHEN WorkMonth = 9 THEN DaysWorked ELSE 0 END) AS 'Septiembre',
      MAX(CASE WHEN WorkMonth = 10 THEN DaysWorked ELSE 0 END) AS 'Octubre',
      MAX(CASE WHEN WorkMonth = 11 THEN DaysWorked ELSE 0 END) AS 'Noviembre',
      MAX(CASE WHEN WorkMonth = 12 THEN DaysWorked ELSE 0 END) AS 'Diciembre',
      MAX(ValorDia) AS 'dailyWage',
      SUM(DaysWorked) AS 'workedDays',
      MAX(ValorDia) * SUM(DaysWorked) AS 'monthlyTotal'
      --SUM(MonthlyTotal) AS 'monthlyTotal'
    FROM MonthlyWork
    GROUP BY WorkYear, Name, Project, Position
    ORDER BY WorkYear DESC, Name
    ${paginationClause};
  `;

    const totalQuery = `
    WITH MonthlyWork AS (
      SELECT
        CONCAT(u.firstName, ' ', u.lastName) AS Name,
        tp.position AS Position,
        ccp.name AS Project,
        MONTH(wt.createdAt) AS WorkMonth,
        YEAR(wt.createdAt) AS WorkYear,
        COUNT(wt.createdAt) AS DaysWorked,
        --e.baseSalary / DAY(EOMONTH(wt.createdAt)) AS ValorDia,
        e.baseSalary / 24 * 1.35 AS ValorDia,
        COUNT(wt.createdAt) * (e.baseSalary / DAY(EOMONTH(wt.createdAt))) AS MonthlyTotal
      FROM mvp1.TB_WorkTracking wt
      INNER JOIN mvp1.TB_Employee e ON wt.idEmployee = e.idEmployee
      INNER JOIN mvp1.TB_User u ON e.idUser = u.idUser
      INNER JOIN mvp1.TB_Position tp ON tp.idPosition = e.idPosition
      INNER JOIN mvp1.TB_CostCenterProject ccp ON wt.idCostCenterProject = ccp.idCostCenterProject
      INNER JOIN mvp1.TB_RevenueCenter rc ON rc.idCostCenterProject = ccp.idCostCenterProject
      WHERE 1=1
      ${filter?.idRevenueCenter ? "AND rc.idRevenueCenter = :idRevenueCenter" : ""}
      ${filter?.idCostCenterProject ? "AND wt.idCostCenterProject = :idCostCenterProject" : ""}
      GROUP BY
        u.firstName,
        u.lastName,
        ccp.name,
        tp.position,
        MONTH(wt.createdAt),
        YEAR(wt.createdAt),
        e.baseSalary,
        EOMONTH(wt.createdAt)
    )
    SELECT
      WorkYear,
      Name,
      Position,
      Project,
      MAX(CASE WHEN WorkMonth = 1 THEN DaysWorked ELSE 0 END) AS 'Enero',
      MAX(CASE WHEN WorkMonth = 2 THEN DaysWorked ELSE 0 END) AS 'Febrero',
      MAX(CASE WHEN WorkMonth = 3 THEN DaysWorked ELSE 0 END) AS 'Marzo',
      MAX(CASE WHEN WorkMonth = 4 THEN DaysWorked ELSE 0 END) AS 'Abril',
      MAX(CASE WHEN WorkMonth = 5 THEN DaysWorked ELSE 0 END) AS 'Mayo',
      MAX(CASE WHEN WorkMonth = 6 THEN DaysWorked ELSE 0 END) AS 'Junio',
      MAX(CASE WHEN WorkMonth = 7 THEN DaysWorked ELSE 0 END) AS 'Julio',
      MAX(CASE WHEN WorkMonth = 8 THEN DaysWorked ELSE 0 END) AS 'Agosto',
      MAX(CASE WHEN WorkMonth = 9 THEN DaysWorked ELSE 0 END) AS 'Septiembre',
      MAX(CASE WHEN WorkMonth = 10 THEN DaysWorked ELSE 0 END) AS 'Octubre',
      MAX(CASE WHEN WorkMonth = 11 THEN DaysWorked ELSE 0 END) AS 'Noviembre',
      MAX(CASE WHEN WorkMonth = 12 THEN DaysWorked ELSE 0 END) AS 'Diciembre',
      MAX(ValorDia) AS 'dailyWage',
      SUM(DaysWorked) AS 'workedDays',
      MAX(ValorDia) * SUM(DaysWorked) AS 'monthlyTotal'
      --SUM(MonthlyTotal) AS 'monthlyTotal'
    FROM MonthlyWork
    GROUP BY WorkYear, Name, Project, Position
    ORDER BY WorkYear DESC, Name
  `;

    const countQuery = `
    SELECT COUNT(DISTINCT CONCAT(YEAR(wt.createdAt), '-', u.firstName, ' ', u.lastName, '-', ccp.name)) as total
    FROM mvp1.TB_WorkTracking wt
    INNER JOIN mvp1.TB_Employee e ON wt.idEmployee = e.idEmployee
    INNER JOIN mvp1.TB_User u ON e.idUser = u.idUser
    INNER JOIN mvp1.TB_CostCenterProject ccp ON wt.idCostCenterProject = ccp.idCostCenterProject
    INNER JOIN mvp1.TB_RevenueCenter rc ON rc.idCostCenterProject = ccp.idCostCenterProject
    WHERE 1=1
    ${filter?.idRevenueCenter ? "AND rc.idRevenueCenter = :idRevenueCenter" : ""}
    ${filter?.idCostCenterProject ? "AND wt.idCostCenterProject = :idCostCenterProject" : ""}
  `;

    const [results, totalResult, countResults] = await Promise.all([
      sequelize.query(monthlyWorkQuery, {
        replacements: {
          limit,
          offset,
          ...filter
        }
      }),
      sequelize.query(totalQuery, {
        replacements: {
          ...filter
        }
      }),
      sequelize.query(countQuery, {
        replacements: {
          ...filter
        }
      })
    ]);

    const countResult = countResults[0] as Array<{ total: number }>;
    const total = countResult[0]?.total ?? 0;

    return {
      rows: results[0],
      totalRows: totalResult[0],
      count: total
    };
  };

  findAllWorkTrackingTotals = async () => {
    const sequelize = RevenueCenter.sequelize!;

    const query = `
    /*
          WITH MonthlyWork AS (
                SELECT
                  rc.idRevenueCenter,
                  COUNT(wt.createdAt) AS DaysWorked,
                  e.baseSalary / 24 * 1.35 AS ValorDia
                  --COUNT(wt.createdAt) * (e.baseSalary / DAY(EOMONTH(wt.createdAt))) AS MonthlyTotal
                
                FROM mvp1.TB_WorkTracking wt
                INNER JOIN mvp1.TB_Employee e ON wt.idEmployee = e.idEmployee
                INNER JOIN mvp1.TB_CostCenterProject ccp ON wt.idCostCenterProject = ccp.idCostCenterProject
                INNER JOIN mvp1.TB_RevenueCenter rc ON rc.idCostCenterProject = ccp.idCostCenterProject
                GROUP BY rc.idRevenueCenter, wt.createdAt, e.baseSalary
              )
              SELECT idRevenueCenter, MAX(ValorDia) * SUM(DaysWorked) AS 'totalWorkTracking'
              --SUM(MonthlyTotal) as totalWorkTracking
              FROM MonthlyWork
              GROUP BY idRevenueCenter;*/
    WITH MonthlyWork AS (
      SELECT
        rc.idRevenueCenter,
        e.idEmployee,
        COUNT(wt.createdAt) AS DaysWorked,
        MAX(TRY_CONVERT(FLOAT, REPLACE(REPLACE(LTRIM(RTRIM(e.baseSalary)), '.', ''), ',', '.')) / 24 * 1.35) AS ValorDia
      FROM mvp1.TB_WorkTracking wt
      INNER JOIN mvp1.TB_Employee e ON wt.idEmployee = e.idEmployee
      INNER JOIN mvp1.TB_CostCenterProject ccp ON wt.idCostCenterProject = ccp.idCostCenterProject
      INNER JOIN mvp1.TB_RevenueCenter rc ON rc.idCostCenterProject = ccp.idCostCenterProject
      WHERE TRY_CONVERT(FLOAT, REPLACE(REPLACE(LTRIM(RTRIM(e.baseSalary)), '.', ''), ',', '.')) IS NOT NULL
      GROUP BY rc.idRevenueCenter, e.idEmployee
    )
    SELECT 
        idRevenueCenter, 
        SUM(ValorDia * DaysWorked) AS 'totalWorkTracking'
    FROM MonthlyWork
    GROUP BY idRevenueCenter;
  `;

    const [results] = await sequelize.query(query);
    return results as Array<{ idRevenueCenter: number; totalWorkTracking: number }>;
  };

  findInputValues = async (
  ) => {
    const query = `
    /*SELECT
    	oi.idCostCenterProject,
    	SUM(oid.quantity * CONVERT(FLOAT, i.cost)) AS totalValue
    FROM    	mvp1.TB_OrderItemDetail oid
    INNER JOIN mvp1.TB_OrderItem oi on	oi.idOrderItem = oid.idOrderItem
    INNER JOIN mvp1.TB_Input i ON	i.idInput = oid.idInput
    INNER JOIN mvp1.TB_RevenueCenter rc ON	rc.idCostCenterProject = oi.idCostCenterProject
    INNER JOIN mvp1.TB_InputUnitOfMeasure iu ON	iu.idInputUnitOfMeasure = i.idInputUnitOfMeasure
    WHERE	i.idInputType IN (1, 2, 3)
    GROUP BY	oi.idCostCenterProject*/

    WITH ReturnedQuantities AS (
          SELECT 
              im.idInput,
              im.idCostCenterProject,
              SUM(im.quantityReturned) AS totalReturned,
              SUM(im.quantityReturned * CONVERT(FLOAT, i.cost)) AS totalReturnedValue
          FROM [mvp1].[TB_ProjectInventoryAssignment] im
          INNER JOIN mvp1.TB_Input i ON i.idInput = im.idInput 
        WHERE i.idInputType IN (1, 2, 3)
          GROUP BY im.idInput, im.idCostCenterProject
      )
      SELECT
          oi.idCostCenterProject,
          SUM(oid.quantity * CONVERT(FLOAT, i.cost)) - COALESCE(SUM(DISTINCT rq.totalReturnedValue), 0) AS totalValue,
          COALESCE(SUM(DISTINCT rq.totalReturnedValue), 0) AS totalValueReturned
      FROM   mvp1.TB_OrderItemDetail oid
      INNER JOIN mvp1.TB_OrderItem oi on oi.idOrderItem = oid.idOrderItem
      INNER JOIN mvp1.TB_Input i ON  i.idInput = oid.idInput
      INNER JOIN mvp1.TB_RevenueCenter rc ON  rc.idCostCenterProject = oi.idCostCenterProject
      INNER JOIN mvp1.TB_InputUnitOfMeasure iu ON  iu.idInputUnitOfMeasure = i.idInputUnitOfMeasure
      LEFT JOIN ReturnedQuantities rq ON rq.idInput = i.idInput AND rq.idCostCenterProject = oi.idCostCenterProject
      WHERE  i.idInputType IN (1, 2, 3)
      GROUP BY oi.idCostCenterProject
    `;

    type result = {
      idCostCenterProject: number;
      totalValue: number;
    };

    return dbConnection.query<result>(query, {
      type: QueryTypes.SELECT,
    });
  };

  findAllInput = async (
    limit: number,
    offset: number,
    filter?: { idRevenueCenter?: number, idInputType?: number }
  ) => {
    const sequelize = RevenueCenter.sequelize!;

    const materialQuery = `
      SELECT
        i.name AS material,
        rc.name AS costCenter,
        oid.quantity AS quantity,
        iu.unitOfMeasure AS unitOfMeasure,
        oid.createdAt AS createdAt,
        oi.orderRequest AS orderRequest,
        i.cost AS unitValue,
        oid.quantity * CONVERT(FLOAT, i.cost) AS totalValue
      FROM mvp1.TB_OrderItemDetail oid
      INNER JOIN mvp1.TB_OrderItem oi on oi.idOrderItem = oid.idOrderItem
      INNER JOIN mvp1.TB_Input i ON i.idInput=oid.idInput
      INNER JOIN mvp1.TB_RevenueCenter rc ON rc.idCostCenterProject=oi.idCostCenterProject
      INNER JOIN mvp1.TB_InputUnitOfMeasure iu ON iu.idInputUnitOfMeasure=i.idInputUnitOfMeasure
      WHERE rc.idRevenueCenter = :idRevenueCenter AND i.idInputType = :idInputType
      ORDER BY oid.createdAt DESC
      OFFSET :offset ROWS
      FETCH NEXT :limit ROWS ONLY;
    `;
    const totalQuery = `
      SELECT
        i.name AS material,
        rc.name AS costCenter,
        oid.quantity AS quantity,
        iu.unitOfMeasure AS unitOfMeasure,
        oid.createdAt AS createdAt,
        oi.orderRequest AS orderRequest,
        i.cost AS unitValue,
        oid.quantity * CONVERT(FLOAT, i.cost) AS totalValue
      FROM mvp1.TB_OrderItemDetail oid
      INNER JOIN mvp1.TB_OrderItem oi on oi.idOrderItem = oid.idOrderItem
      INNER JOIN mvp1.TB_Input i ON i.idInput=oid.idInput
      INNER JOIN mvp1.TB_RevenueCenter rc ON rc.idCostCenterProject=oi.idCostCenterProject
      INNER JOIN mvp1.TB_InputUnitOfMeasure iu ON iu.idInputUnitOfMeasure=i.idInputUnitOfMeasure
      WHERE rc.idRevenueCenter = :idRevenueCenter AND i.idInputType = :idInputType
      ORDER BY oid.createdAt DESC
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM mvp1.TB_OrderItemDetail oid
      INNER JOIN mvp1.TB_OrderItem oi on oi.idOrderItem = oid.idOrderItem
      INNER JOIN mvp1.TB_Input i ON i.idInput=oid.idInput
      INNER JOIN mvp1.TB_RevenueCenter rc ON rc.idCostCenterProject=oi.idCostCenterProject
      INNER JOIN mvp1.TB_InputUnitOfMeasure iu ON iu.idInputUnitOfMeasure=i.idInputUnitOfMeasure
      WHERE rc.idRevenueCenter = :idRevenueCenter AND i.idInputType = :idInputType;
    `;

    const [results, countResults, totalResult] = await Promise.all([
      sequelize.query(materialQuery, {
        replacements: {
          idRevenueCenter: filter?.idRevenueCenter,
          idInputType: filter?.idInputType,
          limit,
          offset,
        }
      }),
      sequelize.query(countQuery, {
        replacements: {
          idRevenueCenter: filter?.idRevenueCenter,
          idInputType: filter?.idInputType,
        }
      }),
      sequelize.query(totalQuery, {
        replacements: {
          idRevenueCenter: filter?.idRevenueCenter,
          idInputType: filter?.idInputType,
        }
      })
    ]);

    const countResult = countResults[0] as Array<{ total: number }>;
    const total = countResult[0]?.total ?? 0;

    return {
      rows: results[0],
      totalRows: totalResult[0],
      count: total
    };
  };

  findAllQuotation = async (
    limit: number,
    offset: number,
    filter?: { idRevenueCenter?: number }
  ) => {
    const sequelize = RevenueCenter.sequelize!;

    const quotationQuery = `
      SELECT
        ti.name AS material,
        tccp.name AS costCenter,
        SUM(tqid.quantity) AS quantity,
        tiu.unitOfMeasure AS unitOfMeasure,
        MAX(tq.createdAt) AS createdAt,
        MAX(tqid.performance) AS performance,
        SUM(tqid.totalCost) AS totalCost
      FROM mvp1.TB_QuotationItemDetail tqid
      INNER JOIN mvp1.TB_QuotationItem tqi ON tqi.idQuotationItem = tqid.idQuotationItem
      INNER JOIN mvp1.TB_Quotation tq ON tq.idQuotation = tqi.idQuotation
      INNER JOIN mvp1.TB_RevenueCenter rc ON rc.idQuotation = tq.idQuotation
      INNER JOIN mvp1.TB_CostCenterProject tccp ON tccp.idCostCenterProject = rc.idCostCenterProject
      INNER JOIN mvp1.TB_Input ti ON ti.idInput = tqid.idInput
      INNER JOIN mvp1.TB_InputUnitOfMeasure tiu ON tiu.idInputUnitOfMeasure = ti.idInputUnitOfMeasure
      ${filter?.idRevenueCenter ? "WHERE rc.idRevenueCenter = :idRevenueCenter" : ""}
      GROUP BY ti.idInput, ti.name, tccp.idCostCenterProject, tccp.name, tiu.unitOfMeasure
      ORDER BY SUM(tqid.totalCost) DESC
      OFFSET :offset ROWS
      FETCH NEXT :limit ROWS ONLY;
    `;

    const totalQuery = `
      SELECT
        ti.name AS material,
        tccp.name AS costCenter,
        SUM(tqid.quantity) AS quantity,
        tiu.unitOfMeasure AS unitOfMeasure,
        MAX(tq.createdAt) AS createdAt,
        MAX(tqid.performance) AS performance,
        SUM(tqid.totalCost) AS totalCost
      FROM mvp1.TB_QuotationItemDetail tqid
      INNER JOIN mvp1.TB_QuotationItem tqi ON tqi.idQuotationItem = tqid.idQuotationItem
      INNER JOIN mvp1.TB_Quotation tq ON tq.idQuotation = tqi.idQuotation
      INNER JOIN mvp1.TB_RevenueCenter rc ON rc.idQuotation = tq.idQuotation
      INNER JOIN mvp1.TB_CostCenterProject tccp ON tccp.idCostCenterProject = rc.idCostCenterProject
      INNER JOIN mvp1.TB_Input ti ON ti.idInput = tqid.idInput
      INNER JOIN mvp1.TB_InputUnitOfMeasure tiu ON tiu.idInputUnitOfMeasure = ti.idInputUnitOfMeasure
      ${filter?.idRevenueCenter ? "WHERE rc.idRevenueCenter = :idRevenueCenter" : ""}
      GROUP BY ti.idInput, ti.name, tccp.idCostCenterProject, tccp.name, tiu.unitOfMeasure
      ORDER BY SUM(tqid.totalCost) DESC
    `;

    const countQuery = `
      SELECT COUNT(DISTINCT CONCAT(ti.idInput, '-', tccp.idCostCenterProject)) as total
      FROM mvp1.TB_QuotationItemDetail tqid
      INNER JOIN mvp1.TB_QuotationItem tqi ON tqi.idQuotationItem = tqid.idQuotationItem
      INNER JOIN mvp1.TB_Quotation tq ON tq.idQuotation = tqi.idQuotation
      INNER JOIN mvp1.TB_RevenueCenter rc ON rc.idQuotation = tq.idQuotation
      INNER JOIN mvp1.TB_CostCenterProject tccp ON tccp.idCostCenterProject = rc.idCostCenterProject
      INNER JOIN mvp1.TB_Input ti ON ti.idInput = tqid.idInput
      ${filter?.idRevenueCenter ? "WHERE rc.idRevenueCenter = :idRevenueCenter" : ""};
    `;

    const [results, totalResult, countResults] = await Promise.all([
      sequelize.query(quotationQuery, {
        replacements: {
          limit,
          offset,
          ...filter
        }
      }),
      sequelize.query(totalQuery, {
        replacements: {
          ...filter
        }
      }),
      sequelize.query(countQuery, {
        replacements: {
          ...filter
        }
      })
    ]);

    const countResult = countResults[0] as Array<{ total: number }>;
    const total = countResult[0]?.total ?? 0;

    return {
      rows: results[0],
      totalRows: totalResult[0],
      count: total
    };
  };

  async findAllRevenueCenterStatus(): Promise<RevenueCenterStatus[]> {
    return await RevenueCenterStatus.findAll();
  }

  findAllMaterialSummaryDetail = async (
    // limit: number,
    // offset: number,
    filter: { idRevenueCenter: number }
  ) => {
    const sequelize = RevenueCenter.sequelize!;

    // // Debug: Print some diagnostic info
    // console.log(`\n=========== DEBUG INFO FOR idRevenueCenter=${filter.idRevenueCenter} ===========`);
    
    // const debugQuery = `
    //   SELECT DISTINCT
    //     trc.idQuotation,
    //     trc.idCostCenterProject,
    //     (SELECT COUNT(*) FROM [mvp1].[TB_QuotationItem] qi WHERE qi.idQuotation = trc.idQuotation) AS quotationItemCount,
    //     (SELECT COUNT(*) FROM [mvp1].[TB_ProjectItem] pi WHERE pi.idCostCenterProject = trc.idCostCenterProject) AS projectItemCount,
    //     (SELECT COUNT(*) 
    //      FROM [mvp1].[TB_ProjectItem] pi 
    //      INNER JOIN [mvp1].[TB_InvoiceProjectItem] ipi ON ipi.idProjectItem = pi.idProjectItem
    //      INNER JOIN [mvp1].[TB_Invoice] inv ON inv.idInvoice = ipi.idInvoice
    //      WHERE pi.idCostCenterProject = trc.idCostCenterProject 
    //        AND inv.invoice IS NOT NULL) AS invoicedItemCount
    //   FROM [mvp1].[TB_RevenueCenter] trc
    //   WHERE trc.idRevenueCenter = ${filter.idRevenueCenter};
    // `;
    
    // // Query to see actual project item descriptions
    // const projectItemsQuery = `
    //   SELECT
    //     pi.idProjectItem,
    //     pi.item,
    //     SUM(ipi.invoicedQuantity) AS totalInvoiced
    //   FROM [mvp1].[TB_RevenueCenter] trc
    //   INNER JOIN [mvp1].[TB_ProjectItem] pi ON pi.idCostCenterProject = trc.idCostCenterProject
    //   LEFT JOIN [mvp1].[TB_InvoiceProjectItem] ipi ON ipi.idProjectItem = pi.idProjectItem
    //   LEFT JOIN [mvp1].[TB_Invoice] inv ON inv.idInvoice = ipi.idInvoice AND inv.invoice IS NOT NULL
    //   WHERE trc.idRevenueCenter = ${filter.idRevenueCenter}
    //   GROUP BY pi.idProjectItem, pi.item
    //   ORDER BY SUM(ipi.invoicedQuantity) DESC;
    // `;
    
    // // Query to check which materials are quoted vs ordered
    // const materialPatternsQuery = `
    //   -- Materials that are QUOTED (in QuotationItemDetail for idQuotationItem=44)
    //   SELECT
    //     'QUOTED' AS source,
    //     ti.idInput,
    //     ti.name AS materialName,
    //     qid.quantity AS quotedQuantity,
    //     (SELECT SUM(oid.quantity) 
    //      FROM mvp1.TB_OrderItemDetail oid 
    //      INNER JOIN mvp1.TB_OrderItem oi ON oi.idOrderItem = oid.idOrderItem
    //      INNER JOIN mvp1.TB_RevenueCenter rc ON rc.idCostCenterProject = oi.idCostCenterProject
    //      WHERE oid.idInput = ti.idInput AND rc.idRevenueCenter = ${filter.idRevenueCenter}) AS orderedQuantity
    //   FROM [mvp1].[TB_QuotationItemDetail] qid
    //   INNER JOIN [mvp1].[TB_QuotationItem] qi ON qi.idQuotationItem = qid.idQuotationItem
    //   INNER JOIN [mvp1].[TB_Input] ti ON ti.idInput = qid.idInput
    //   WHERE qi.idQuotationItem = 44
      
    //   UNION ALL
      
    //   -- Materials that are ORDERED but NOT QUOTED
    //   SELECT
    //     'ORDERED_NOT_QUOTED' AS source,
    //     ti.idInput,
    //     ti.name AS materialName,
    //     NULL AS quotedQuantity,
    //     SUM(toid.quantity) AS orderedQuantity
    //   FROM mvp1.TB_OrderItemDetail toid
    //   INNER JOIN mvp1.TB_OrderItem toi ON toi.idOrderItem = toid.idOrderItem
    //   INNER JOIN mvp1.TB_Input ti ON ti.idInput = toid.idInput
    //   INNER JOIN mvp1.TB_RevenueCenter trc ON trc.idCostCenterProject = toi.idCostCenterProject
    //   WHERE trc.idRevenueCenter = ${filter.idRevenueCenter} 
    //     AND ti.idInputType = 1
    //     AND ti.idInput NOT IN (SELECT idInput FROM [mvp1].[TB_QuotationItemDetail] WHERE idQuotationItem = 44)
    //   GROUP BY ti.idInput, ti.name
    //   ORDER BY source DESC, materialName;
    // `;
    
    // try {
    //   const debugResults = await sequelize.query(debugQuery, { type: QueryTypes.SELECT });
    //   console.log('Revenue Center Info:', JSON.stringify(debugResults, null, 2));
      
    //   const projectItems = await sequelize.query(projectItemsQuery, { type: QueryTypes.SELECT });
    //   console.log('\nProject Items (All):', JSON.stringify(projectItems, null, 2));
      
    //   const materialPatterns = await sequelize.query(materialPatternsQuery, { type: QueryTypes.SELECT });
    //   console.log('\nMaterials in QuotationItemDetail:', JSON.stringify(materialPatterns, null, 2));
    // } catch (err) {
    //   console.error('Debug query error:', err);
    // }
    
    // console.log(`=========================================================================\n`);

    const materialSummaryQuery = `
    SELECT DISTINCT
      ti.idInput,
      ti.name AS material,
      MAX(CAST(ti.performance AS DECIMAL(10,2))) AS performance,
      
      -- Cantidades ordenadas y pendientes
      SUM(toid.quantity) AS totalOrdenado,
      COALESCE((
          SELECT SUM(im.quantityPending)
          FROM [mvp1].[TB_ProjectInventoryAssignment] im
          WHERE im.idInput = ti.idInput 
            AND im.idCostCenterProject = toi.idCostCenterProject
      ), 0) AS totalPendiente,
      
      -- Cantidad enviada (ordenada - pendiente)
      SUM(toid.quantity) - COALESCE((
          SELECT SUM(im.quantityReturned)
          FROM [mvp1].[TB_ProjectInventoryAssignment] im
          WHERE im.idInput = ti.idInput 
            AND im.idCostCenterProject = toi.idCostCenterProject
      ), 0) AS shipped,
      
      -- Cantidad en M2 (enviada * rendimiento)
      (SUM(toid.quantity) - COALESCE((
          SELECT SUM(im.quantityReturned)
          FROM [mvp1].[TB_ProjectInventoryAssignment] im
          WHERE im.idInput = ti.idInput 
            AND im.idCostCenterProject = toi.idCostCenterProject
      ), 0)) * MAX(CAST(ti.performance AS DECIMAL(10,2))) AS quantityM2,
      
      -- Costo total enviado
      (SUM(toid.quantity) - COALESCE((
          SELECT SUM(im.quantityReturned)
          FROM [mvp1].[TB_ProjectInventoryAssignment] im
          WHERE im.idInput = ti.idInput 
            AND im.idCostCenterProject = toi.idCostCenterProject
      ), 0)) * MAX(ti.cost) AS totalCostSend,
      
      -- Valores de proyecto
      0 AS budgeted,
      toi.idCostCenterProject AS idCostCenterProject,
      trc.idQuotation AS idQuotation,
      0 AS contracted,
      COALESCE((
        SELECT SUM(ripi.invoicedQuantity)
        FROM [mvp1].[TB_RelationsProjectItemsMaterialInvoice] AS ripi 
        INNER JOIN [mvp1].[TB_ProjectItem] pi ON pi.idProjectItem = ripi.idProjectItem
        INNER JOIN [mvp1].[TB_RevenueCenter] ttcr ON ttcr.idCostCenterProject = pi.idCostCenterProject
        WHERE ripi.idInput = toid.idInput 
          AND ttcr.idRevenueCenter = :idRevenueCenter
          AND pi.idCostCenterProject = toi.idCostCenterProject
    ), 0) AS invoiced,
      --0 AS invoiced,
      --SUM(ipi.invoicedQuantity) AS invoiced,
      /*
      COALESCE((
        SELECT SUM(ipi.invoicedQuantity * ISNULL((qid.quantity / NULLIF(qi.quantity, 0)), 1))
        FROM [mvp1].[TB_QuotationItemDetail] qid
        INNER JOIN [mvp1].[TB_QuotationItem] qi 
            ON qi.idQuotationItem = qid.idQuotationItem
        INNER JOIN [mvp1].[TB_ProjectItem] pi 
            ON pi.idCostCenterProject = toi.idCostCenterProject
        INNER JOIN [mvp1].[TB_InvoiceProjectItem] ipi 
            ON ipi.idProjectItem = pi.idProjectItem
        INNER JOIN [mvp1].[TB_Invoice] inv 
            ON inv.idInvoice = ipi.idInvoice
        WHERE qid.idInput = ti.idInput
          AND qi.idQuotation = trc.idQuotation
          AND inv.invoice IS NOT NULL
        ), 0) AS invoiced, */
     
      0 AS shippedAndInvoiced,
      0 AS diff
      
    FROM mvp1.TB_OrderItemDetail toid
    INNER JOIN mvp1.TB_OrderItem toi ON toi.idOrderItem = toid.idOrderItem
    INNER JOIN mvp1.TB_Input ti ON ti.idInput = toid.idInput
    INNER JOIN mvp1.TB_RevenueCenter trc ON trc.idCostCenterProject = toi.idCostCenterProject
    /*
    INNER JOIN [mvp1].[TB_ProjectItem] pi ON pi.idCostCenterProject = trc.idCostCenterProject
    LEFT JOIN [mvp1].[TB_InvoiceProjectItem] ipi ON ipi.idProjectItem = pi.idProjectItem
    LEFT JOIN [mvp1].[TB_Invoice] inv ON inv.idInvoice = ipi.idInvoice AND inv.invoice IS NOT NULL
       */ 
    WHERE trc.idRevenueCenter = :idRevenueCenter
      AND ti.idInputType = 1
      
    GROUP BY ti.idInput, ti.name, toi.idCostCenterProject, trc.idCostCenterProject, trc.idQuotation,toid.idInput
    --, trc.idRevenueCenter
    ORDER BY invoiced DESC;
  `;

    const totalQuery = `
    SELECT
      ti.idInput,
      ti.name AS material,
      --MAX(ti.performance) AS performance,
      MAX(CAST(ti.performance AS DECIMAL(10,2))) AS performance,
      --SUM(toid.quantity) AS shipped,
      --SUM(toid.quantity) * MAX(ti.performance) AS quantityM2,
      --SUM(toid.quantity) * MAX(CAST(ti.performance AS DECIMAL(10,2))) AS quantityM2,
      --SUM(toid.quantity) * MAX(ti.cost) AS totalCostSend,
      SUM(toid.quantity) AS totalOrdenado,
    COALESCE((
        SELECT SUM(im.quantityPending)
        FROM [mvp1].[TB_ProjectInventoryAssignment] im
        WHERE im.idInput = ti.idInput 
          AND im.idCostCenterProject = toi.idCostCenterProject
    ), 0) AS totalPendiente,
    SUM(toid.quantity) - COALESCE((
        SELECT SUM(im.quantityReturned)
        FROM [mvp1].[TB_ProjectInventoryAssignment] im
        WHERE im.idInput = ti.idInput 
          AND im.idCostCenterProject = toi.idCostCenterProject
    ), 0) AS shipped,
    (SUM(toid.quantity) - COALESCE((
        SELECT SUM(im.quantityReturned)
        FROM [mvp1].[TB_ProjectInventoryAssignment] im
        WHERE im.idInput = ti.idInput 
          AND im.idCostCenterProject = toi.idCostCenterProject
    ), 0)) * MAX(CAST(ti.performance AS DECIMAL(10,2))) AS quantityM2,
    (SUM(toid.quantity) - COALESCE((
        SELECT SUM(im.quantityReturned)
        FROM [mvp1].[TB_ProjectInventoryAssignment] im
        WHERE im.idInput = ti.idInput 
          AND im.idCostCenterProject = toi.idCostCenterProject
    ), 0)) * MAX(ti.cost) AS totalCostSend,
      0 AS budgeted,
      trc.idCostCenterProject AS idCostCenterProject,
      trc.idQuotation AS idQuotation,
      0 AS contracted,
    COALESCE((
        SELECT SUM(ripi.invoicedQuantity)
        FROM [mvp1].[TB_RelationsProjectItemsMaterialInvoice] AS ripi 
        INNER JOIN [mvp1].[TB_ProjectItem] pi ON pi.idProjectItem = ripi.idProjectItem
        INNER JOIN [mvp1].[TB_RevenueCenter] ttcr ON ttcr.idCostCenterProject = pi.idCostCenterProject
        WHERE ripi.idInput = toid.idInput 
          AND ttcr.idRevenueCenter = :idRevenueCenter
          AND pi.idCostCenterProject = toi.idCostCenterProject
    ), 0) AS invoiced,
      --0 AS invoiced,
      --SUM(ipi.invoicedQuantity) AS invoiced,
      /*
      COALESCE((
        SELECT SUM(ipi.invoicedQuantity * ISNULL((qid.quantity / NULLIF(qi.quantity, 0)), 1))
        FROM [mvp1].[TB_QuotationItemDetail] qid
        INNER JOIN [mvp1].[TB_QuotationItem] qi 
            ON qi.idQuotationItem = qid.idQuotationItem
        INNER JOIN [mvp1].[TB_ProjectItem] pi 
            ON pi.idCostCenterProject = toi.idCostCenterProject
        INNER JOIN [mvp1].[TB_InvoiceProjectItem] ipi 
            ON ipi.idProjectItem = pi.idProjectItem
        INNER JOIN [mvp1].[TB_Invoice] inv 
            ON inv.idInvoice = ipi.idInvoice
        WHERE qid.idInput = ti.idInput
          AND qi.idQuotation = trc.idQuotation
          AND inv.invoice IS NOT NULL
    ), 0) AS invoiced,*/
      

      0 AS shippedAndInvoiced,
      0 AS diff
    FROM mvp1.TB_OrderItemDetail toid
    INNER JOIN mvp1.TB_OrderItem toi ON toi.idOrderItem = toid.idOrderItem
    INNER JOIN mvp1.TB_Input ti ON ti.idInput = toid.idInput
    INNER JOIN mvp1.TB_RevenueCenter trc ON trc.idCostCenterProject = toi.idCostCenterProject
    /*
    INNER JOIN [mvp1].[TB_ProjectItem] pi ON pi.idCostCenterProject = trc.idCostCenterProject
    LEFT JOIN [mvp1].[TB_InvoiceProjectItem] ipi ON ipi.idProjectItem = pi.idProjectItem
    LEFT JOIN [mvp1].[TB_Invoice] inv ON inv.idInvoice = ipi.idInvoice AND inv.invoice IS NOT NULL
    */
    WHERE trc.idRevenueCenter = :idRevenueCenter AND ti.idInputType = 1
    GROUP BY ti.idInput, ti.name, toi.idCostCenterProject, trc.idCostCenterProject, trc.idQuotation,toid.idInput
    --, trc.idRevenueCenter
    ORDER BY invoiced DESC;
  `;

    const countQuery = `
    SELECT COUNT(DISTINCT ti.name) as total
    FROM mvp1.TB_OrderItemDetail toid
    INNER JOIN mvp1.TB_OrderItem toi ON toi.idOrderItem = toid.idOrderItem
    INNER JOIN mvp1.TB_Input ti ON ti.idInput = toid.idInput
    INNER JOIN mvp1.TB_RevenueCenter trc ON trc.idCostCenterProject = toi.idCostCenterProject
    WHERE trc.idRevenueCenter = :idRevenueCenter AND ti.idInputType = 1;
  `;

    const [results, totalResult, countResults] = await Promise.all([
      sequelize.query(materialSummaryQuery, {
        replacements: {
          idRevenueCenter: filter.idRevenueCenter,
          // limit,
          // offset,
        },
        type: QueryTypes.SELECT
      }),
      sequelize.query(totalQuery, {
        replacements: {
          idRevenueCenter: filter.idRevenueCenter,
        },
        type: QueryTypes.SELECT
      }),
      sequelize.query(countQuery, {
        replacements: {
          idRevenueCenter: filter.idRevenueCenter,
        },
        type: QueryTypes.SELECT
      })
    ]);

    const countResult = countResults as Array<{ total: number }>;
    const total = countResult[0]?.total ?? 0;

    return {
      rows: results,
      totalRows: totalResult,
      count: total
    };
  };

  findDistinctInputsByRevenueCenter = async (
    filter: { itemFilter: string; idRevenueCenter: number ; idProjectItem: any }
  ) => {
    const sequelize = RevenueCenter.sequelize!;
    // Muestra materiales que YA HAN SIDO ORDENADOS (están en órdenes de compra)
    // const query = `
    //   SELECT DISTINCT 
    //     tbi.idInput, 
    //     tbi.name
    //   FROM [mvp1].[TB_OrderItemDetail] AS toid
    //   INNER JOIN [mvp1].[TB_OrderItem] AS toi ON toi.idOrderItem = toid.idOrderItem
    //   INNER JOIN [mvp1].[TB_Input] AS tbi ON tbi.idInput = toid.idInput
    //   INNER JOIN [mvp1].[TB_RevenueCenter] AS tbrnc ON tbrnc.idCostCenterProject = toi.idCostCenterProject
    //   INNER JOIN [mvp1].[TB_ProjectItem] AS tbpi ON tbpi.idCostCenterProject = tbrnc.idCostCenterProject
    //   WHERE tbpi.item COLLATE Latin1_General_CI_AI LIKE :itemFilter
    //     AND tbrnc.idRevenueCenter = :idRevenueCenter
    //     AND tbi.idInputType = 1
    //   ORDER BY tbi.name;
    // `;

    // Muestra materiales que están en la COTIZACIÓN (aunque no se hayan ordenado aún)
    const query = `
      SELECT DISTINCT 
        tbpi.idProjectItem,
        tbi.idInput, 
        tbi.name
        FROM [mvp1].[TB_ProjectItem] AS tbpi
        INNER JOIN [mvp1].[TB_RevenueCenter] AS tbrnc ON tbrnc.idCostCenterProject = tbpi.idCostCenterProject
        INNER JOIN [mvp1].[TB_Quotation] AS tbq ON tbq.idQuotation = tbrnc.idQuotation
        INNER JOIN [mvp1].[TB_QuotationItem] AS tbqi ON tbqi.idQuotation = tbq.idQuotation
        INNER JOIN [mvp1].[TB_QuotationItemDetail] AS tbqid ON tbqid.idQuotationItem = tbqi.idQuotationItem
        INNER JOIN [mvp1].[TB_Input] AS tbi ON tbi.idInput = tbqid.idInput
        WHERE tbpi.item COLLATE Latin1_General_CI_AI LIKE :itemFilter
        AND tbrnc.idRevenueCenter = :idRevenueCenter
        AND tbpi.idProjectItem = :idProjectItem
        AND tbi.idInputType = 1
        ORDER BY tbi.name;    
    `;

    const replacements: Record<string, any> = {
      itemFilter: `%${filter.itemFilter}%`,
      idRevenueCenter: filter.idRevenueCenter,
      idProjectItem: filter.idProjectItem
    };

    const results = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT
    });

    return results;
  };

  // debugInvoicedData = async (filter: { idRevenueCenter: number }) => {
  //   const sequelize = RevenueCenter.sequelize!;

  //   // Query 1: Check if materials exist in QuotationItemDetail
  //   const query1 = `
  //     SELECT 
  //       'Query 1: Materials in QuotationItemDetail' AS queryType,
  //       ti.idInput,
  //       ti.name,
  //       qid.idQuotationItem,
  //       qi.idQuotation,
  //       qid.quantity AS qidQuantity,
  //       qi.quantity AS qiQuantity
  //     FROM [mvp1].[TB_Input] ti
  //     INNER JOIN [mvp1].[TB_QuotationItemDetail] qid ON qid.idInput = ti.idInput
  //     INNER JOIN [mvp1].[TB_QuotationItem] qi ON qi.idQuotationItem = qid.idQuotationItem
  //     WHERE ti.idInput IN (220, 221, 27, 20, 219, 70)
  //     ORDER BY ti.idInput;
  //   `;

  //   // Query 2: Check quotation for this revenue center
  //   const query2 = `
  //     SELECT 
  //       'Query 2: RevenueCenter Quotation' AS queryType,
  //       trc.idRevenueCenter,
  //       trc.idQuotation,
  //       trc.idCostCenterProject
  //     FROM [mvp1].[TB_RevenueCenter] trc
  //     WHERE trc.idRevenueCenter = :idRevenueCenter;
  //   `;

  //   // Query 3: Check project items and invoices
  //   const query3 = `
  //     SELECT 
  //       'Query 3: ProjectItems with Invoices' AS queryType,
  //       pi.idProjectItem,
  //       pi.item,
  //       ipi.invoicedQuantity,
  //       inv.invoice
  //     FROM [mvp1].[TB_RevenueCenter] trc
  //     INNER JOIN [mvp1].[TB_ProjectItem] pi ON pi.idCostCenterProject = trc.idCostCenterProject
  //     INNER JOIN [mvp1].[TB_InvoiceProjectItem] ipi ON ipi.idProjectItem = pi.idProjectItem
  //     INNER JOIN [mvp1].[TB_Invoice] inv ON inv.idInvoice = ipi.idInvoice
  //     WHERE trc.idRevenueCenter = :idRevenueCenter 
  //       AND inv.invoice IS NOT NULL;
  //   `;

  //   // Query 4: Check LIKE matching
  //   const query4 = `
  //     SELECT 
  //       'Query 4: LIKE Match Test' AS queryType,
  //       ti.idInput,
  //       ti.name AS materialName,
  //       qi.idQuotationItem,
  //       qi.technicalSpecification,
  //       CASE 
  //         WHEN UPPER(qi.technicalSpecification) LIKE '%' + UPPER(REPLACE(TRIM(ti.name), ' ', '%')) + '%' 
  //         THEN 'MATCH' 
  //         ELSE 'NO MATCH' 
  //       END AS likeResult
  //     FROM [mvp1].[TB_Input] ti
  //     INNER JOIN [mvp1].[TB_QuotationItemDetail] qid ON qid.idInput = ti.idInput
  //     INNER JOIN [mvp1].[TB_QuotationItem] qi ON qi.idQuotationItem = qid.idQuotationItem
  //     WHERE ti.idInput IN (220, 221, 27, 20, 219, 70)
  //     ORDER BY ti.idInput;
  //   `;

  //   const [results1, results2, results3, results4] = await Promise.all([
  //     sequelize.query(query1, { type: QueryTypes.SELECT }),
  //     sequelize.query(query2, { replacements: { idRevenueCenter: filter.idRevenueCenter }, type: QueryTypes.SELECT }),
  //     sequelize.query(query3, { replacements: { idRevenueCenter: filter.idRevenueCenter }, type: QueryTypes.SELECT }),
  //     sequelize.query(query4, { type: QueryTypes.SELECT })
  //   ]);

  //   return {
  //     materialsInQuotationItemDetail: results1,
  //     revenueCenterQuotation: results2,
  //     projectItemsWithInvoices: results3,
  //     likeMatchTest: results4
  //   };
  // };

  findInvoicedQuantityByProjectItem = async (
    filter: { idRevenueCenter: number; idProjectItem?: number; idInput?: number }
  ) => {
    const sequelize = RevenueCenter.sequelize!;

    const query = `
WITH RevenueCenterData AS (
        SELECT 
          idRevenueCenter,
          idCostCenterProject,
          idQuotation
        FROM [mvp1].[TB_RevenueCenter]
        WHERE idRevenueCenter = :idRevenueCenter
      ),
      
      -- Primero agregamos las cantidades facturadas por ProjectItem
      InvoicedData AS (
        SELECT 
          pi.idProjectItem,
          SUM(CAST(ipi.invoicedQuantity AS DECIMAL(18,2))) AS totalInvoiced
        FROM [mvp1].[TB_ProjectItem] pi
        INNER JOIN RevenueCenterData rc ON pi.idCostCenterProject = rc.idCostCenterProject
        INNER JOIN [mvp1].[TB_InvoiceProjectItem] ipi ON ipi.idProjectItem = pi.idProjectItem
        INNER JOIN [mvp1].[TB_Invoice] inv ON inv.idInvoice = ipi.idInvoice AND inv.invoice IS NOT NULL
        WHERE (:idProjectItem IS NULL OR pi.idProjectItem = :idProjectItem)
        GROUP BY pi.idProjectItem
      ),

      InvoiceItemDetails AS (
        SELECT 
          pi.idProjectItem,
          pi.item AS projectItem,
          pi.contract,
          qid.idInput,
          ti.name AS inputName,
          inv_data.totalInvoiced AS invoicedQuantity,
          ISNULL((qid.quantity / NULLIF(qi.quantity, 0)), 1) AS materialRatio
        FROM [mvp1].[TB_ProjectItem] pi
        INNER JOIN RevenueCenterData rc ON pi.idCostCenterProject = rc.idCostCenterProject
        LEFT JOIN InvoicedData inv_data ON inv_data.idProjectItem = pi.idProjectItem
        LEFT JOIN [mvp1].[TB_QuotationItem] qi ON qi.idQuotation = rc.idQuotation
        LEFT JOIN [mvp1].[TB_QuotationItemDetail] qid ON qid.idQuotationItem = qi.idQuotationItem
        LEFT JOIN [mvp1].[TB_Input] ti ON ti.idInput = qid.idInput
        WHERE (:idProjectItem IS NULL OR pi.idProjectItem = :idProjectItem)
          AND (:idInput IS NULL OR qid.idInput = :idInput)
      )

      SELECT 
        idProjectItem,
        projectItem,
        contract,
        idInput,
        inputName,
        MAX(ISNULL(invoicedQuantity, 0)) AS invoicedQuantity,  -- MAX porque es el mismo valor para todas las filas
        MAX(ISNULL(invoicedQuantity, 0)) AS AcumuladoCant
        --MAX(ISNULL(invoicedQuantity * materialRatio, 0)) AS AcumuladoCant  -- Usa MAX si quieres aplicar el ratio
      FROM InvoiceItemDetails
      WHERE idInput IS NOT NULL
      GROUP BY idProjectItem, projectItem, contract, idInput, inputName
      ORDER BY idProjectItem, idInput;
    `;

    type result = {
      idProjectItem: number;
      projectItem: string;
      contract: string;
      idInput: number;
      inputName: string;
      AcumuladoCant: number;
    };

    return dbConnection.query<result>(query, {
      replacements: {
        idRevenueCenter: filter.idRevenueCenter,
        idProjectItem: filter.idProjectItem || null,
        idInput: filter.idInput || null,
      },
      type: QueryTypes.SELECT,
    });
  };

  async findRelationsProjectItemsMaterialInvoice(
    filter: {
      idCostCenterProject?: number | null;
      idInput: number;
      idRevenueCenter: number;
      idProjectItem: number;
    }
  ): Promise<RelationsProjectItemsMaterialInvoice | null> {
    return await RelationsProjectItemsMaterialInvoice.findOne({
      where: filter as any,
    });
  }

  async findAllRelationsProjectItemsMaterialInvoice(filter: {
    idRevenueCenter: number;
    idProjectItem: number;
    idCostCenterProject: number;
  }): Promise<RelationsProjectItemsMaterialInvoice[]> {
    return await RelationsProjectItemsMaterialInvoice.findAll({
      where: filter,
    });
  }

  async createRelationsProjectItemsMaterialInvoice( data: IRelationsProjectItemsMaterialInvoiceCreate ): Promise<RelationsProjectItemsMaterialInvoice> {
    return await RelationsProjectItemsMaterialInvoice.create(data as any);
  }

  async updateRelationsProjectItemsMaterialInvoice(
    idRelationsProjectItemsMaterialInvoice: number,
    data: IRelationsProjectItemsMaterialInvoiceUpdate
  ): Promise<[number, RelationsProjectItemsMaterialInvoice[]]> {
    return await RelationsProjectItemsMaterialInvoice.update(
      { invoicedQuantity: data.invoicedQuantity },
      {
        where: { idRelationsProjectItemsMaterialInvoice },
        returning: true,
      }
    );
  }

  async deleteRelationsProjectItemsMaterialInvoice(
    idRelationsProjectItemsMaterialInvoice: number
  ): Promise<number> {
    return await RelationsProjectItemsMaterialInvoice.destroy({
      where: { idRelationsProjectItemsMaterialInvoice },
    });
  }

  async findRelationsProjectItemsMaterialInvoiceById(
    idRelationsProjectItemsMaterialInvoice: number
  ): Promise<RelationsProjectItemsMaterialInvoice | null> {
    return await RelationsProjectItemsMaterialInvoice.findByPk(idRelationsProjectItemsMaterialInvoice);
  }


  findAllInactiveHistory = async (
    limit: number,
    offset: number,
    filter?: { name?: string; idCostCenterProject?: number }
  ) => {
    return this.findAllRevenueCenterHistoryByTable("mvp1.TB_RevenueCenter_Inactive", limit, offset, filter);
  };

  findAllLiquidationHistory = async (
    limit: number,
    offset: number,
    filter?: { name?: string; idCostCenterProject?: number }
  ) => {
    return this.findAllRevenueCenterHistoryByTable("mvp1.TB_RevenueCenter_Liquidation", limit, offset, filter);
  };

  findAllRetentionGuaranteeHistory = async (
    limit: number,
    offset: number,
    filter?: { name?: string; idCostCenterProject?: number }
  ) => {
    return this.findAllRevenueCenterHistoryByTable("mvp1.TB_RevenueCenter_RetentionGuarantee", limit, offset, filter);
  };

  private findAllRevenueCenterHistoryByTable = async (
    tableName: "mvp1.TB_RevenueCenter_Inactive" | "mvp1.TB_RevenueCenter_Liquidation" | "mvp1.TB_RevenueCenter_RetentionGuarantee",
    limit: number,
    offset: number,
    filter?: { name?: string; idCostCenterProject?: number }
  ) => {
    const replacements: Record<string, unknown> = {};
    const whereClauses: string[] = ["1 = 1"];

    if (filter?.name) {
      whereClauses.push("rc.name LIKE :name");
      replacements.name = `%${filter.name}%`;
    }

    if (filter?.idCostCenterProject) {
      whereClauses.push("rc.idCostCenterProject = :idCostCenterProject");
      replacements.idCostCenterProject = filter.idCostCenterProject;
    }

    const usePagination = limit !== -1;
    const paginationClause = usePagination ? "OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY" : "";
    if (usePagination) {
      replacements.limit = limit;
      replacements.offset = offset;
    }

    const whereSql = whereClauses.join(" AND ");

    const dataQuery = `
      SELECT
        rc.idRevenueCenter,
        rc.name,
        rc.idCostCenterProject,
        rc.fromDate,
        rc.toDate,
        rc.createdAt,
        rc.updatedAt,
        rc.idRevenueCenterStatus,
        rc.idQuotation,
        rc.invoice,
        rc.spend,
        rc.utility,
        rc.movedAt,
        ccp.name AS costCenterProjectName,
        ccp.idCostCenterProject AS costCenterProjectId
      FROM ${tableName} rc
      INNER JOIN mvp1.TB_CostCenterProject ccp ON ccp.idCostCenterProject = rc.idCostCenterProject
      WHERE ${whereSql}
      ORDER BY ccp.name ASC
      ${paginationClause}
    `;

    const countQuery = `
      SELECT COUNT(1) AS total
      FROM ${tableName} rc
      WHERE ${whereSql}
    `;

    const [rows, totalResult] = await Promise.all([
      dbConnection.query<Record<string, unknown>>(dataQuery, {
        replacements,
        type: QueryTypes.SELECT,
      }),
      dbConnection.query<{ total: number }>(countQuery, {
        replacements,
        type: QueryTypes.SELECT,
      }),
    ]);

    return {
      rows,
      count: totalResult[0]?.total ?? 0,
    };
  };
}