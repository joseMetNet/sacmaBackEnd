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
}

export const employeeRepository = new EmployeeRepository();