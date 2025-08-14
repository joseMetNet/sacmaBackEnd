import { Invoice } from "./invoice.model";
import { InvoiceStatus } from "./invoice-status.model";
import { CostCenterProject } from "../cost-center/cost-center-project.model";
import { InvoiceProjectItem } from "./invoice-project-item.model";
import { isPipelineLike } from "@azure/storage-blob";

export class InvoiceRepository {
  constructor() { }

  async findById(id: number): Promise<Invoice | null> {
    return await Invoice.findByPk(id, {
      include: [
        {
          model: InvoiceStatus,
          required: false
        },
        {
          model: CostCenterProject,
          required: false,
        }
      ]
    });
  }

  async findAll(
    filter: { [key: string]: any },
    limit: number,
    offset: number
  ): Promise<{ rows: Invoice[], count: number }> {
    const queryOptions: any = {
      include: [{ all: true }],
      nest: true,
      where: filter,
      distinct: true,
      order: [["idInvoice", "DESC"]]
    };

    if(limit > 0) {
      queryOptions.limit = limit;
      queryOptions.offset = offset;
    }

    const invoice = await Invoice.findAndCountAll(queryOptions);
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

  // Method to create an invoice project item
  async createInvoiceProjectItem(invoiceProjectItemData: Partial<InvoiceProjectItem>): Promise<InvoiceProjectItem> {
    return await InvoiceProjectItem.create(invoiceProjectItemData);
  }

  // Find all invoice project items
  async findAllInvoiceProjectItems(filter?: { [key: string]: any }): Promise<InvoiceProjectItem[]> {
    if (filter) {
      return await InvoiceProjectItem.findAll({ where: filter });
    }
    return await InvoiceProjectItem.findAll();
  }

  // Method to delete invoice project items by invoice ID
  async deleteInvoiceProjectItemsByInvoiceId(idInvoice: number): Promise<number> {
    return await InvoiceProjectItem.destroy({
      where: { idInvoice: idInvoice }
    });
  }

  async updateInvoiceProjectItem(invoiceProjectItemData: Partial<InvoiceProjectItem>): Promise<[number, InvoiceProjectItem[]]> {
    return await InvoiceProjectItem.update(invoiceProjectItemData, {
      where: { idInvoiceProjectItem: invoiceProjectItemData.idInvoiceProjectItem },
      returning: true
    });
  }

  async deleteInvoiceProjectItem(idInvoiceProjectItem: number): Promise<number> {
    return await InvoiceProjectItem.destroy({
      where: { idInvoiceProjectItem: idInvoiceProjectItem }
    });
  }

  // bulk create invoice project items
  async bulkCreate(invoiceProjectItems: Partial<InvoiceProjectItem>[]): Promise<InvoiceProjectItem[]> {
    return await InvoiceProjectItem.bulkCreate(invoiceProjectItems);
  }
}