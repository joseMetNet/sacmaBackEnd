import { QuotationItem } from "./quotation-item.model";
import * as dtos from "./quotation-item.interfase";
import { dbConnection } from "../config";
import { QueryTypes } from "sequelize";

export class QuotationItemRepository {
  async create(quotationItemData: dtos.CreateQuotationItemDTO): Promise<QuotationItem> {
    return await QuotationItem.create(quotationItemData);
  }

  async findById(id: number): Promise<QuotationItem | null> {
    return await QuotationItem.findByPk(id);
  }

  async findAll(): Promise<dtos.QuotationItemFindAllDTO> {
    const quotationItems = await QuotationItem.findAndCountAll({
      order: [["idQuotationItem", "DESC"]],
    });
    return { rows: quotationItems.rows, count: quotationItems.count };
  }

  async update(quotationItemData: dtos.UpdateQuotationItemDTO): Promise<[number, QuotationItem[]]> {
    return await QuotationItem.update(quotationItemData, {
      where: { idQuotationItem: quotationItemData.idQuotationItem },
      returning: true,
    });
  }

  async delete(id: number): Promise<number> {
    return await QuotationItem.destroy({
      where: { idQuotationItem: id },
    });
  }
}
