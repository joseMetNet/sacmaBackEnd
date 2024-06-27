import { EmployeePayroll } from "../../models";
import { CustomError } from "../../utils";

export class EmployeePayrollRepository {
  constructor() {}

  async findById(id: number): Promise<CustomError | EmployeePayroll> {
    try {
      const employeePayroll = await EmployeePayroll.findByPk(id, {});
      if(!employeePayroll) {
        return CustomError.notFound("Employee payroll not found");
      }
      return employeePayroll;
    }
    catch(err: any) {
      return CustomError.internalServer(err);
    }
  }


  async findAll(
    payrollFilter: {[key: string]: string},
    limit: number,
    offset: number
  ): Promise<CustomError | {rows: EmployeePayroll[], count: number}> {
    try {
      const employeePayrolls = await EmployeePayroll.findAndCountAll({
        where: payrollFilter,
        limit,
        offset
      });
      return employeePayrolls;
    }
    catch(err: any) {
      console.log(err);
      return CustomError.internalServer("Internal server error");
    }
  }
}

export const employeePayrollRepository = new EmployeePayrollRepository();
