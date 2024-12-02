import { Quotation } from "./quotation.model";
import * as dtos from "./quotation.interfase";
import { QuotationItem } from "./quotation-item.model";
import { QuotationItemDetail } from "./quotation-item-detail.model";
import { Employee, User } from "../models";
import { Input } from "../input/input.model";
import { CustomError } from "../utils";
import { Transaction } from "sequelize";
import { QuotationPercentage } from "./quotation-percentage.model";
import { QuotationStatus } from "./quotation-status.model";
import { QuotationComment } from "./quotation-comment.model";

export class QuotationRepository {
  async create(
    quotationData: dtos.CreateQuotationDTO,
    transaction: Transaction
  ): Promise<Quotation> {
    return await Quotation.create(quotationData as any, { transaction });
  }

  async findById(id: number): Promise<Quotation | null> {
    return await Quotation.findByPk(id, 
      {
        include: [
          {
            model: Employee,
            attributes: ["idEmployee"],
            include: [
              { 
                model: User, 
                attributes: ["firstName", "lastName"], 
              },
            ],
          },
          { model: QuotationPercentage},
          { model: QuotationStatus },
          { model: QuotationComment },
        ],
      }
    );
  }

  async findAll(
    filter: { [key: string]: any},
    limit: number, offset: number
  ): Promise<{ rows: Quotation[], count: number}> {
    const quotations = await Quotation.findAndCountAll({
      include: [
        {
          model: Employee,
          attributes: ["idEmployee"],
          required: true,
          include: [
            { 
              model: User, 
              attributes: ["firstName", "lastName"],
              required: true, 
              where: filter
            },
          ],
        },
        { model: QuotationPercentage },
        { model: QuotationStatus },
        { model: QuotationComment },
      ],
      limit,
      offset,
      distinct: true,
      order: [["idQuotation", "DESC"]],
    });
    return quotations;
  }

  async findAllQuotationStatus(): Promise<QuotationStatus[]> {
    return await QuotationStatus.findAll();
  }

  async update(quotationData: dtos.UpdateQuotationDTO): Promise<[number, Quotation[]]> {
    return await Quotation.update(quotationData, {
      where: { idQuotation: quotationData.idQuotation },
      returning: true,
    });
  }

  async delete(idQuotation: number): Promise<number> {
    return await Quotation.destroy({
      where: { idQuotation },
    });
  }

  async createQuotationItem(quotationItemData: dtos.CreateQuotationItemDTO): Promise<QuotationItem> {
    return await QuotationItem.create(quotationItemData as any);
  }

  async findQuotationItemById(idQuotationItem: number): Promise<QuotationItem | null> {
    return await QuotationItem.findByPk(idQuotationItem);
  }

  async findAllQuotationItem(
    filter: { [key: string]: any},
    limit: number, offset: number
  ): Promise<{ rows: QuotationItem[], count: number }> {
    const quotationItems = await QuotationItem.findAndCountAll({
      include: [ {all: true} ],
      where: filter,
      limit: limit === -1 ? undefined : limit,
      offset,
      distinct: true,
      order: [["idQuotationItem", "DESC"]],
    });
    return quotationItems;
  }

  async updateQuotationItem(quotationItemData: dtos.UpdateQuotationItemDTO): Promise<[number, QuotationItem[]]> {
    return await QuotationItem.update(quotationItemData, {
      where: { idQuotationItem: quotationItemData.idQuotationItem },
      returning: true,
    });
  }

  async deleteQuotationItem(idQuotationItem: number): Promise<number> {
    return await QuotationItem.destroy({
      where: { idQuotationItem },
    });
  }

  async findQuotationItemDetailById(idQuotationItemDetail: number): Promise<QuotationItemDetail | null> {
    return await QuotationItemDetail.findByPk(idQuotationItemDetail);
  }

  async findAllQuotationItemDetail(
    filter: { [key: string]: any},
    limit: number, offset: number
  ): Promise<{ rows: QuotationItemDetail[], count: number } | CustomError> {
    try {
      const quotationItemDetails = await QuotationItemDetail.findAndCountAll({
        include: [
          {
            model: QuotationItem,
            attributes: ["idQuotationItem", "item"],
            include: [
              {
                model: Quotation,
                attributes: ["idQuotation", "name"],
              },
            ],
          },
          {
            model: Input,
            attributes: ["idInput", "name", "cost", "performance"],
          }
        ],
        where: filter,
        limit,
        offset,
        distinct: true,
        order: [["idQuotationItemDetail", "DESC"]],
      });
      return { rows: quotationItemDetails.rows, count: quotationItemDetails.count };
    }catch(error) {
      console.error(`Error: ${error}`);
      return CustomError.internalServer("Errror querying the database");
    }
  }

  async createQuotationItemDetail(quotationItemDetailData: dtos.CreateQuotationItemDetailDTO): Promise<QuotationItemDetail> {
    return await QuotationItemDetail.create(quotationItemDetailData as any);
  }

  async updateQuotationItemDetail(quotationItemDetailData: dtos.UpdateQuotationItemDetailDTO): Promise<[number, QuotationItemDetail[]]> {
    return await QuotationItemDetail.update(quotationItemDetailData, {
      where: { idQuotationItemDetail: quotationItemDetailData.idQuotationItemDetail },
      returning: true,
    });
  }

  async deleteQuotationItemDetail(idQuotationItemDetail: number): Promise<number> {
    return await QuotationItemDetail.destroy({
      where: { idQuotationItemDetail },
    });
  }

  async findQuotationPercentageById(idQuotationItemDetail: number): Promise<QuotationPercentage | null> {
    return await QuotationPercentage.findByPk(idQuotationItemDetail);
  }

  async createQuotationPercentage(quotationPercentageData: dtos.CreateQuotationPercentageDTO): Promise<QuotationPercentage> {
    return await QuotationPercentage.create(quotationPercentageData as any);
  }

  async createQuotationComment(quotationCommentData: dtos.CreateQuotationCommentDTO): Promise<QuotationComment> {
    return await QuotationComment.create(quotationCommentData as any);
  }

  async findAllQuotationComment(
    filter: { [key: string]: any},
    limit: number, offset: number
  ): Promise<{ rows: QuotationComment[], count: number }> {
    const quotationComments = await QuotationComment.findAndCountAll({
      include: [
        {
          model: Employee,
          attributes: ["idEmployee"],
          include: [
            { 
              model: User, 
              attributes: ["firstName", "lastName"], 
            },
          ],
        },
      ],
      where: filter,
      limit,
      offset,
      distinct: true,
      order: [["idQuotationComment", "DESC"]],
    });
    return quotationComments;
  }

  async findQuotationCommentById(idQuotationComment: number): Promise<QuotationComment | null> {
    return await QuotationComment.findByPk(idQuotationComment);
  }

  async deleteQuotationComment(idQuotationComment: number): Promise<number> {
    return await QuotationComment.destroy({
      where: { idQuotationComment },
    });
  }
}