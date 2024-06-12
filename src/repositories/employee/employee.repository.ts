import { Employee, Position, Role, User } from "../../models";
import { CustomError } from "../../utils";

export class EmployeeRepository {

  constructor() {}

  async findEmployeeAndRoles() {
    try {
      const employees = await Employee.findAll({
        attributes: [],
        include: [
          {
            model: User,
            attributes: ["firstName", "lastName"],
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
              }
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
}

export const employeeRepository = new EmployeeRepository();