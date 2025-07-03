import { Invoice } from "./invoice.model";
import { InvoiceStatus } from "./invoice-status.model";
import { ProjectItem } from "../cost-center/project-item.model";
import { Op, literal } from "sequelize";

export class InvoiceRepository {
  constructor() { }

  async findById(id: number): Promise<Invoice | null> {
    return await Invoice.findByPk(id, { include: [{ all: true }] });
  }

  async findAll(
    filter: { [key: string]: any },
    limit: number,
    offset: number
  ): Promise<{ rows: Invoice[], count: number }> {
    const invoice = await Invoice.findAndCountAll({
      include: [{ all: true }],
      nest: true,
      where: filter,
      limit,
      offset,
      distinct: true,
      order: [["idInvoice", "DESC"]]
    });
    return invoice;
  }

  async create(invoiceData: Partial<Invoice>): Promise<Invoice> {
    return await Invoice.create(invoiceData);
  }

  async update(invoiceData: Partial<Invoice>): Promise<[number, Invoice[]]> {
    return await Invoice.update(invoiceData, {
      where: { idInvoice: invoiceData.idInvoice },
      returning: true
    });
  }

  async delete(id: number): Promise<number> {
    return await Invoice.destroy({
      where: { idInvoice: id }
    });
  } async calculateTotalValueByContract(contract: string): Promise<number> {
    const result = await ProjectItem.findAll({
      where: {
        contract: contract,
        invoicedQuantity: {
          [Op.ne]: null
        }
      },
      attributes: [
        [literal("SUM(CAST(unitPrice AS DECIMAL) * CAST(invoicedQuantity AS DECIMAL))"), "totalValue"]
      ],
      raw: true
    }) as any[];

    return parseFloat(result[0]?.totalValue) || 0;
  }

  async findAllInvoiceStatus(): Promise<InvoiceStatus[]> {
    return await InvoiceStatus.findAll();
  }
}