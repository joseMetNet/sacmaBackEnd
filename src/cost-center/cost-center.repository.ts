import { CostCenterContact } from "./cost-center-contact.model";
import { CostCenterProject } from "./cost-center-project.model";
import { CostCenter } from "./cost-center.model";

export class CostCenterRepository {

  async findById(id: number): Promise<CostCenter | null> {
    return await CostCenter.findByPk(id, { include: [{ all: true }] });
  }

  async findCostCenterContactById(id: number): Promise<CostCenterContact | null> {
    return await CostCenterContact.findByPk(id, { include: [{ all: true }] });
  }

  async findCostCenterProjectById(id: number): Promise<CostCenterProject | null> {
    return await CostCenterProject.findByPk(id, { include: [{ all: true }] });
  }

  async findAllAndSearch(
    filter: { [key: string]: any },
    limit: number, offset: number
  ): Promise<{ rows: CostCenter[], count: number }> {
    const costCenter = await CostCenter.findAndCountAll({
      include: [{ all: true }],
      nest: true,
      where: filter,
      limit,
      offset,
      distinct: true,
      order: [["idCostCenter", "DESC"]]
    });
    return costCenter;
  }

  async findAllAndSearchCostCenterContact(
    filter: { [key: string]: any },
    limit: number, offset: number
  ): Promise<{ rows: CostCenterContact[], count: number }> {
    const costCenterContact = await CostCenterContact.findAndCountAll({
      include: [{ all: true }],
      nest: true,
      where: filter,
      limit,
      offset,
      distinct: true,
      order: [["idCostCenterContact", "DESC"]]
    });
    return costCenterContact;
  }

  async findAllAndSearchCostCenterProject(
    filter: { [key: string]: any },
    limit: number, offset: number
  ): Promise<{ rows: CostCenterProject[], count: number }> {
    const costCenterProject = await CostCenterProject.findAndCountAll({
      include: [{ all: true }],
      nest: true,
      where: filter,
      limit,
      offset,
      distinct: true,
      order: [["idCostCenterProject", "DESC"]]
    });
    return costCenterProject;
  }

  async findAll():
    Promise<{ rows: CostCenter[], count: number }> {
    const costCenter = await CostCenter.findAndCountAll({
      include: [{ all: true }],
      nest: true,
      distinct: true,
      order: [["idCostCenter", "DESC"]]
    });
    return costCenter;
  }

  async findAllCostCenterContact():
    Promise<{ rows: CostCenterContact[], count: number }> {
    const costCenterContact = await CostCenterContact.findAndCountAll({
      include: [{ all: true }],
      nest: true,
      distinct: true,
      order: [["idCostCenterContact", "DESC"]]
    });
    return costCenterContact;
  }

  async findAllCostCenterProject():
    Promise<{ rows: CostCenterProject[], count: number }> {
    const costCenterProject = await CostCenterProject.findAndCountAll({
      include: [{ all: true }],
      nest: true,
      distinct: true,
      order: [["idCostCenterProject", "DESC"]]
    });
    return costCenterProject;
  }

  async update(costCenterData: Partial<CostCenter>): Promise<[number, CostCenter[]]> {
    return await CostCenter.update(costCenterData, {
      where: { idCostCenter: costCenterData.idCostCenter },
      returning: true
    });
  }

  async updateCostCenterContact(request: Partial<CostCenterContact>): Promise<[number, CostCenterContact[]]> {
    return await CostCenterContact.update(request, {
      where: { idCostCenterContact: request.idCostCenterContact },
      returning: true
    });
  }

  async updateCostCenterProject(costCenterProjectData: Partial<CostCenterProject>): Promise<[number, CostCenterProject[]]> {
    return await CostCenterProject.update(costCenterProjectData, {
      where: { idCostCenterProject: costCenterProjectData.idCostCenterProject },
      returning: true
    });
  }

  async create(costCenterData: Partial<CostCenter>): Promise<CostCenter> {
    return await CostCenter.create(costCenterData);
  }

  async createCostCenterContact(request: Partial<CostCenterContact>): Promise<CostCenterContact> {
    return await CostCenterContact.create(request);
  }

  async createCostCenterProject(costCenterProjectData: Partial<CostCenterProject>): Promise<CostCenterProject> {
    return await CostCenterProject.create(costCenterProjectData);
  }

  async delete(id: number): Promise<number> {
    return await CostCenter.destroy({
      where: { idCostCenter: id }
    });
  }

  async deleteCostCenterContact(id: number): Promise<number> {
    return await CostCenterContact.destroy({
      where: { idCostCenterContact: id }
    });
  }

  async deleteCostCenterProject(id: number): Promise<number> {
    return await CostCenterProject.destroy({
      where: { idCostCenterProject: id }
    });
  }
}