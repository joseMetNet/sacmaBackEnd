import { Employee, User } from "../models";
import { MachineryLocation } from "./machinery-location.model";
import { MachineryMaintenance } from "./machinery-maintenance.model";
import { Machinery } from "./machinery.model";

class MachineryRepository {
  async findAllAndSearch(
    filter: { [key: string]: any },
    limit: number, offset: number
  ): Promise<{ rows: Machinery[], count: number }> {
    const machinery = await Machinery.findAndCountAll({
      include: [{ all: true }],
      nest: true,
      where: filter,
      limit,
      offset,
      distinct: true,
      order: [["idMachinery", "DESC"]]
    });
    return machinery;
  }

  async findAllAndSearchMachineryLocation(
    filter: { [key: string]: any },
    limit: number, offset: number
  ): Promise<{ rows: MachineryLocation[], count: number }> {
    const machineryLocation = await MachineryLocation.findAndCountAll({
      include: [{
        attributes: ["idMachinery", "serial"],
        model: Machinery,
      },
      {
        attributes: ["idEmployee"],
        model: Employee,
        include: [ {model: User, attributes: ["firstName", "lastName"] }]
      }],
      nest: true,
      where: filter,
      limit,
      offset,
      distinct: true,
      order: [["idMachineryLocationHistory", "DESC"]]
    });
    return machineryLocation;
  }

  async findAllAndSearchMachineryMaintenance(
    filter: { [key: string]: any },
    limit: number, offset: number
  ): Promise<{ rows: MachineryMaintenance[], count: number }> {
    const machinery = await MachineryMaintenance.findAndCountAll({
      include: [{ all: true }],
      nest: true,
      where: filter,
      limit,
      offset,
      distinct: true,
      order: [["idMachineryMaintenance", "DESC"]]
    });
    return machinery;
  }

  async findAll(): 
  Promise<{ rows: Machinery[], count: number }> {
    const machinery = await Machinery.findAndCountAll({
      include: [{ all: true }],
      nest: true,
      distinct: true,
      order: [["idMachinery", "DESC"]]
    });
    return machinery;
  }

  async findAllMachineryLocation(): 
  Promise<{ rows: MachineryLocation[], count: number }> {
    const machineryLocation = await MachineryLocation.findAndCountAll({
      include: [{
        attributes: ["idMachinery", "serial"],
        model: Machinery,
      },
      {
        attributes: ["idEmployee", "name"],
        model: Employee,
      }],
      nest: true,
      distinct: true,
      order: [["idMachineryLocationHistory", "DESC"]]
    });
    return machineryLocation;
  }

  async findAllMachineryMaintenance(): 
  Promise<{ rows: MachineryMaintenance[], count: number }> {
    const machinery = await MachineryMaintenance.findAndCountAll({
      include: [{ all: true }],
      nest: true,
      distinct: true,
      order: [["idMachineryMaintenance", "DESC"]]
    });
    return machinery;
  }

  async findById(id: number): Promise<Machinery | null> {
    const machinery = await Machinery.findByPk(id, {
      include: [
        { all: true },
        {
          model: MachineryLocation,
          include: [
            {
              model: Employee,
              attributes: ["idEmployee", "idUser"],
              include: [ {model: User, attributes: ["firstName", "lastName"]} ]
            }
          ]
        }
      ]
    });
    return machinery;
  }

  async findMachineryMaintenance(id: number): Promise<MachineryMaintenance | null> {
    const machineryMaintenance = await MachineryMaintenance.findByPk(id, {
      include: [{ all: true }]
    });
    return machineryMaintenance;
  }
}


const machineryRepository = new MachineryRepository();
export { machineryRepository };