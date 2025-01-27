import { Role, User } from "../../authentication";
import { Employee, Position } from "../../models";
import { EmployeeNovelty, Novelty } from "../../novelty";
import { CustomError } from "../../utils";

export class EmployeeRepository {

  constructor() {}

  async findEmployeeAndRoles(): Promise<Employee[] | CustomError> {
    try {
      const employees = await Employee.findAll({
        attributes: ["baseSalary"],
        include: [
          {
            model: User,
            attributes: ["firstName", "lastName", "status"],
            required: true,
            include: [
              {
                model: Role,
                required: true
              }
            ]
          },
          {
            model: Position,
            required: true
          }
        ]
      });
      return employees;
    }catch(err: any) {
      return CustomError.internalServer(err.message);
    }
  }

  async findEmployeeById(idEmployee: number): Promise<Employee | CustomError> {
    try {
      const employee = await Employee.findByPk(idEmployee, {
        attributes: { 
          exclude: [
            "idUser", 
            "idPosition", 
            "idContractType", 
            "idPaymentType",
            "idArl",
            "idEps",
            "idEmergencyContact",
            "idBankAccount",
            "idPensionFund",
            "idSeverancePay",
            "idCompensationFund"
          ] 
        },
        include: [
          {
            model: User,
            required: true,
            include: [
              {
                model: Role,
                required: true
              },
              {
                all: true
              },
            ]
          },
          {
            all: true
          },
        ]
      });
      if (!employee) {
        return CustomError.notFound("Employee not found");
      }

      return employee;
    }catch(err: any) {
      return CustomError.internalServer(err.message);
    }
  }

  async findById(idEmployee: number): Promise<Employee | CustomError> {
    try {
      const employee = await Employee.findByPk(idEmployee, {
        include: [
          {
            model: User,
            required: true,
          },
          {
            model: Position,
            required: true
          }
        ]
      });
      console.log(employee);
      if (!employee) {
        return CustomError.notFound("Employee not found");
      }
      return employee;
    }catch(err: any) {
      console.error(err);
      return CustomError.internalServer(err.message);
    }
  }

  async findEmployeeNoveltiesByEmployeeId(idEmployee: number): Promise<CustomError | EmployeeNovelty[]> {
    try {
      const novelties = await EmployeeNovelty.findAll({
        attributes: { 
          exclude: ["idNovelty", "idEmployee"]
        },
        where: { idEmployee },
        include: [
          {
            model: Novelty,
            required: true
          },
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

export const employeeRepository = new EmployeeRepository();