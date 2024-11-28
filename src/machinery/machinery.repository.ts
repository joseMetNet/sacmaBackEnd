import { User } from "../authentication";
import { CostCenterProject } from "../cost-center/cost-center-project.model";
import { Employee } from "../models";
import { MachineryDocumentType } from "./machinery-document-type.model";
import { MachineryLocation } from "./machinery-location.model";
import { MachineryMaintenance } from "./machinery-maintenance.model";
import { MachineryStatus } from "./machinery-status.model";
import { Machinery } from "./machinery.model";

class MachineryRepository {
  async findAllAndSearch(
    filter: { [key: string]: any },
    limit: number, offset: number
  ): Promise<{ rows: Machinery[], count: number }> {
    const machinery = await Machinery.findAndCountAll({
      include: [
        { all: true },
        {
          model: MachineryLocation,
          include: [
            {
              model: CostCenterProject,
              attributes: ["name", "location"],
            }
          ]
        }
      ],
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
      include: [
        {
          attributes: ["idEmployee"],
          model: Employee,
          include: [ {model: User, attributes: ["firstName", "lastName"] } ]
        },
        {
          model: CostCenterProject,
          attributes: ["name", "location"]
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

  async findMachineryStatus(): Promise<MachineryStatus[]> {
    const machineryStatus = await MachineryStatus.findAll();
    return machineryStatus;
  }

  async findMachineryDocumentType(): Promise<MachineryDocumentType[]> {
    const machineryDocumentType = await MachineryDocumentType.findAll();
    return machineryDocumentType;
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
      include: [ { all: true } ],
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
            },
            {
              model: CostCenterProject,
              attributes: ["name", "location"],
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

  async findMachineryLocation(id: number): Promise<MachineryLocation | null> {
    const machineryLocation = await MachineryLocation.findByPk(id, {
      include: [
        { all: true },
        {
          model: CostCenterProject,
          attributes: ["name", "location"],
        }
      ]
    });
    return machineryLocation;
  }
}


const machineryRepository = new MachineryRepository();
export { machineryRepository };