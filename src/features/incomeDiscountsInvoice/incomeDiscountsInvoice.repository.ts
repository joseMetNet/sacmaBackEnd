import { IncomeDiscountInvoice } from "./incomeDiscountsInvoice.model";
import { 
  IIncomeDiscountInvoice, 
  CreateIncomeDiscountInvoiceDTO,
  FindAllIncomeDiscountInvoiceDTO 
} from "./incomeDiscountsInvoice.interface";
import { ExpenditureType } from "../expenditure/expendityre-type.model";
import { CostCenterProject } from "../cost-center";
import { Invoice } from "../invoice/invoice.model";
import { WhereOptions } from "sequelize";

export class IncomeDiscountInvoiceRepository {
  
  async findAll(
    limit: number,
    offset: number,
    filter?: WhereOptions<IIncomeDiscountInvoice>
  ): Promise<{ rows: IncomeDiscountInvoice[], count: number }> {
    return await IncomeDiscountInvoice.findAndCountAll({
      limit,
      offset,
      where: filter,
      include: [
        {
          model: ExpenditureType,
          as: "expenditureType",
          required: false,
        },
        {
          model: CostCenterProject,
          as: "costCenterProject",
          required: false,
        },
        {
          model: Invoice,
          as: "invoice",
          required: false,
        },
      ],
      order: [["idIncomeDiscountInvoice", "DESC"]],
    });
  }

  // Buscar por idIncome (campo específico)
  async findById(idIncome: number): Promise<IncomeDiscountInvoice | null> {
    return await IncomeDiscountInvoice.findOne({
      where: {
        idIncome: idIncome,
        isActive: true // Solo buscar registros activos
      },
      include: [
        {
          association: "expenditureType", // Usar association string en lugar de model
          required: false,
        },
        {
          association: "costCenterProject",
          required: false,
        },
        {
          association: "invoice",
          required: false,
        },
      ],
    });
  }

  // Buscar por idIncome sin filtrar por isActive (para restore)
  async findByIdIncomeAny(idIncome: number): Promise<IncomeDiscountInvoice | null> {
    return await IncomeDiscountInvoice.findOne({
      where: {
        idIncome: idIncome
        // No filtrar por isActive para poder encontrar registros inactivos
      },
      include: [
        {
          association: "expenditureType",
          required: false,
        },
        {
          association: "costCenterProject",
          required: false,
        },
        {
          association: "invoice",
          required: false,
        },
      ],
    });
  }

  // Buscar por ID principal (clave primaria)
  async findByPrimaryKey(idIncomeDiscountInvoice: number): Promise<IncomeDiscountInvoice | null> {
    return await IncomeDiscountInvoice.findByPk(idIncomeDiscountInvoice, {
      include: [
        {
          association: "expenditureType",
          required: false,
        },
        {
          association: "costCenterProject",
          required: false,
        },
        {
          association: "invoice",
          required: false,
        },
      ],
    });
  }
  

  async create(data: any): Promise<IncomeDiscountInvoice> {
    return await IncomeDiscountInvoice.create(data);
  }

  async update(
    idIncomeDiscountInvoice: number,
    data: Partial<IIncomeDiscountInvoice>
  ): Promise<[number]> {
    return await IncomeDiscountInvoice.update(data, {
      where: { idIncomeDiscountInvoice },
    });
  }

  async delete(idIncomeDiscountInvoice: number): Promise<number> {
    return await IncomeDiscountInvoice.destroy({
      where: { idIncomeDiscountInvoice },
    });
  }

  async softDelete(idIncomeDiscountInvoice: number): Promise<[number]> {
    return await IncomeDiscountInvoice.update(
      { isActive: false },
      { where: { idIncomeDiscountInvoice } }
    );
  }

  async restore(idIncomeDiscountInvoice: number): Promise<[number]> {
    return await IncomeDiscountInvoice.update(
      { isActive: true },
      { where: { idIncomeDiscountInvoice } }
    );
  }

  // Métodos alternativos que filtran por idIncome en lugar de idIncomeDiscountInvoice
  async updateByIdIncome(
    idIncome: number,
    data: Partial<IIncomeDiscountInvoice>
  ): Promise<[number]> {
    return await IncomeDiscountInvoice.update(data, {
      where: { idIncome, isActive: true },
    });
  }

  async deleteByIdIncome(idIncome: number): Promise<number> {
    return await IncomeDiscountInvoice.destroy({
      where: { idIncome, isActive: true },
    });
  }

  async softDeleteByIdIncome(idIncome: number): Promise<[number]> {
    return await IncomeDiscountInvoice.update(
      { isActive: false },
      { where: { idIncome, isActive: true } }
    );
  }

  async restoreByIdIncome(idIncome: number): Promise<[number]> {
    return await IncomeDiscountInvoice.update(
      { isActive: true },
      { where: { idIncome } } // No filtrar por isActive aquí porque queremos restaurar inactivos
    );
  }
}