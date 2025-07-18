import { RevenueCenter } from "./revenue-center.model";
import { IRevenueCenter } from "./revenue-center.interface";
import { CostCenterProject } from "../cost-center";
import { QueryTypes, WhereOptions } from "sequelize";
import { dbConnection } from "../../config";
import { RevenueCenterStatus } from "./revenue-center-status-model";

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
        }
      ],
    });
  };

  async findById(idRevenueCenter: number): Promise<IRevenueCenter | null> {
    return await RevenueCenter.findByPk(idRevenueCenter);
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

  findAllWorkTracking = async (
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

  findInputValues = async (
  ) => {
    const query = `
    SELECT
    	oi.idCostCenterProject,
    	SUM(oid.quantity * CONVERT(FLOAT, i.cost)) AS totalValue
    FROM
    	mvp1.TB_OrderItemDetail oid
    INNER JOIN mvp1.TB_OrderItem oi on
    	oi.idOrderItem = oid.idOrderItem
    INNER JOIN mvp1.TB_Input i ON
    	i.idInput = oid.idInput
    INNER JOIN mvp1.TB_RevenueCenter rc ON
    	rc.idCostCenterProject = oi.idCostCenterProject
    INNER JOIN mvp1.TB_InputUnitOfMeasure iu ON
    	iu.idInputUnitOfMeasure = i.idInputUnitOfMeasure
    WHERE
    	i.idInputType IN (1, 2, 3)
    GROUP BY
    	oi.idCostCenterProject
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
    limit: number,
    offset: number,
    filter: { idRevenueCenter: number }
  ) => {
    const sequelize = RevenueCenter.sequelize!;

    const materialSummaryQuery = `
    SELECT
      ti.idInput,
      ti.name AS material,
      MAX(ti.performance) AS performance,
      SUM(toid.quantity) AS shipped,
      SUM(toid.quantity) * MAX(ti.performance) AS quantityM2,
      0 AS budgeted,
      MAX(trc.idCostCenterProject) AS idCostCenterProject,
      MAX(trc.idQuotation) AS idQuotation,
      0 AS contracted,
      580 AS invoiced,
      475 AS shippedAndInvoiced,
      25 AS diff
    FROM mvp1.TB_OrderItemDetail toid
    INNER JOIN mvp1.TB_OrderItem toi ON toi.idOrderItem = toid.idOrderItem
    INNER JOIN mvp1.TB_Input ti ON ti.idInput = toid.idInput
    INNER JOIN mvp1.TB_RevenueCenter trc ON trc.idCostCenterProject = toi.idCostCenterProject
    WHERE trc.idRevenueCenter = :idRevenueCenter AND ti.idInputType = 1
    GROUP BY ti.idInput, ti.name
    ORDER BY ti.name
    OFFSET :offset ROWS
    FETCH NEXT :limit ROWS ONLY;
  `;

    const totalQuery = `
    SELECT
      ti.idInput,
      ti.name AS material,
      MAX(ti.performance) AS performance,
      SUM(toid.quantity) AS shipped,
      SUM(toid.quantity) * MAX(ti.performance) AS quantityM2,
      0 AS budgeted,
      MAX(trc.idCostCenterProject) AS idCostCenterProject,
      MAX(trc.idQuotation) AS idQuotation,
      0 AS contracted,
      580 AS invoiced,
      475 AS shippedAndInvoiced,
      25 AS diff
    FROM mvp1.TB_OrderItemDetail toid
    INNER JOIN mvp1.TB_OrderItem toi ON toi.idOrderItem = toid.idOrderItem
    INNER JOIN mvp1.TB_Input ti ON ti.idInput = toid.idInput
    INNER JOIN mvp1.TB_RevenueCenter trc ON trc.idCostCenterProject = toi.idCostCenterProject
    WHERE trc.idRevenueCenter = :idRevenueCenter AND ti.idInputType = 1
    GROUP BY ti.idInput, ti.name
    ORDER BY ti.name
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
          limit,
          offset,
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
}