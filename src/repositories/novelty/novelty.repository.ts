import { ICreateEmployeeNovelty } from "../../interfaces/novelty.interface";
import { Employee, EmployeeNovelty, Novelty, Position  } from "../../models";
import { CustomError } from "../../utils";

export class NoveltyRepository {
  constructor() {}

  async findNoveltyById(id: number): Promise<CustomError | EmployeeNovelty> {
    try {
      const novelty = await EmployeeNovelty.findByPk(id);
      if(!novelty) {
        return CustomError.notFound("Novelty not found");
      }
      return novelty;
    }
    catch(err: any) {
      return CustomError.internalServer(err);
    }
  }

  async createNovelty(novelty: ICreateEmployeeNovelty): Promise<CustomError | EmployeeNovelty> {
    try {
      const newNovelty = await EmployeeNovelty.create({
        idNovelty: novelty.idNovelty,
        loanValue: novelty.loanValue,
        idEmployee: novelty.idEmployee,
        observation: novelty.observation,
      });
      return newNovelty;
    }
    catch(err: any) {
      return CustomError.internalServer(err);
    }
  }

  async findNovelty(idNovelty: number, idEmployee: number): Promise<CustomError | EmployeeNovelty> {
    try {
      const novelty = await EmployeeNovelty.findOne({
        where: { idNovelty, idEmployee },
      });
      if(!novelty) {
        return CustomError.notFound("Novelty not found");
      }
      return novelty;
    }
    catch(err: any) {
      console.log(err);
      return CustomError.internalServer("Internal server error");
    }
  }

  async findEmployeeNovelties(): Promise<CustomError | EmployeeNovelty[]> {
    try {
      const novelties = await EmployeeNovelty.findAll({
        attributes: { 
          exclude: ["idNovelty", "idEmployee"]
        },
        include: [
          {
            model: Novelty,
            required: true
          },
          {
            model: Employee,
            attributes: ["idPosition"],
            required: true,
            include: [
              {
                model: Position,
                required: true,
              },
            ]
          }
        ],
      });
      return novelties;
    }
    catch(err: any) {
      console.log(err);
      return CustomError.internalServer("Internal server error");
    }
  }
}

export const noveltyRepository = new NoveltyRepository();