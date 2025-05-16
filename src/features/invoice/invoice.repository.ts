import { Invoice } from "./invoice.model";
import { InvoiceStatus } from "./invoice-status.model";

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
  }

  async findAllInvoiceStatus(): Promise<InvoiceStatus[]> {
    return await InvoiceStatus.findAll();
  }
} 