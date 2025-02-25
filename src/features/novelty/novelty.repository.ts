import { Transaction } from "sequelize";
import { EmployeeNovelty } from "./employee-novelty.model";
import { CustomError } from "../../utils";
import { Novelty } from "./novelty.model";
import { Periodicity } from "./periodicity.model";
import { Employee, Position } from "../employee";
import { ModuleNovelty } from "./module-novelty.model";
import { User } from "../authentication";
import { ICreateEmployeeNovelty } from "./novelty.interface";

export class NoveltyRepository {
  constructor() { }

  async findNoveltyById(id: number): Promise<CustomError | EmployeeNovelty> {
    try {
      const novelty = await EmployeeNovelty.findByPk(id, {
        include: [
          {
            model: Novelty,
            required: true
          },
          {
            model: Periodicity,
            required: false
          },
          {
            model: Employee,
            required: true,
            attributes: ["idPosition", "idUser", "idEmployee"],
            include: [
              {
                model: Position,
                attributes: ["position"],
                required: false,
              },
              {
                model: User,
                attributes: ["firstName", "lastName"],
                required: true,
              }
            ]
          }
        ],
      });
      if (!novelty) {
        return CustomError.notFound("Novelty not found");
      }
      return novelty;
    }
    catch (err: any) {
      return CustomError.internalServer(err);
    }
  }

  async findNoveltiesByModule(
    module: string
  ): Promise<CustomError | Novelty[]> {
    try {
      const novelties = await Novelty.findAll({
        include: [
          {
            model: ModuleNovelty,
            required: true,
            where: { module },
          },
        ],
      });
      return novelties;
    }
    catch (err: any) {
      return CustomError.internalServer(err);
    }
  }

  async createNovelty(
    novelty: ICreateEmployeeNovelty,
    transaction?: Transaction
  ): Promise<CustomError | EmployeeNovelty> {
    try {
      const newNovelty = await EmployeeNovelty.create({
        idNovelty: novelty.idNovelty,
        idEmployee: novelty.idEmployee,
        createdAt: novelty.createdAt,
        endAt: novelty.endAt,
        installment: novelty.installment ?? null,
        documentUrl: novelty.documentUrl ?? null,
        loanValue: novelty.loanValue ?? null,
        idPeriodicity: novelty.idPeriodicity ?? null,
        observation: novelty.observation ?? null,
      }, { transaction });
      return newNovelty;
    }
    catch (err: any) {
      return CustomError.internalServer(err);
    }
  }

  async findEmployeeNovelty(idEmployeeNovelty: number): Promise<CustomError | EmployeeNovelty> {
    try {
      const novelty = await EmployeeNovelty.findByPk(idEmployeeNovelty);
      if (!novelty) {
        return CustomError.notFound("Novelty not found");
      }
      return novelty;
    }
    catch (err: any) {
      console.log(err);
      return CustomError.internalServer("Internal server error");
    }
  }

  async findEmployeeNovelties(
    noveltyFilter: { [key: string]: string }[],
    limit: number,
    offset: number
  ): Promise<CustomError | { rows: EmployeeNovelty[], count: number }> {
    try {
      const novelties = await EmployeeNovelty.findAndCountAll({
        where: noveltyFilter[0],
        include: [
          {
            model: Novelty,
            required: true
          },
          {
            model: Periodicity,
            required: false
          },
          {
            model: Employee,
            required: true,
            attributes: ["idPosition", "idUser", "idEmployee"],
            include: [
              {
                model: Position,
                attributes: ["position"],
                required: false,
              },
              {
                model: User,
                attributes: ["firstName", "lastName"],
                required: true,
                where: noveltyFilter[1]
              }
            ]
          }
        ],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        distinct: true
      });
      return novelties;
    }
    catch (err: any) {
      console.log(err);
      return CustomError.internalServer("Internal server error");
    }
  }
}

export const noveltyRepository = new NoveltyRepository();
