import { CostCenterContact } from "./cost-center-contact.model";
import { CostCenterProject } from "./cost-center-project.model";
import { CostCenter } from "./cost-center.model";
import { ProjectDocument } from "./project-document.model";
import { ProjectItem } from "./project-item.model";

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

  async findProjectItemById(id: number): Promise<ProjectItem | null> {
    return await ProjectItem.findByPk(id, { include: [{ all: true }] });
  }

  async findProjectDocumentById(id: number): Promise<ProjectDocument | null> {
    return await ProjectDocument.findByPk(id, { include: [{ all: true }] });
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

  async findAllProjectItem(
    filter: { [key: string]: any },
    limit: number, offset: number
  ): Promise<{ rows: ProjectItem[], count: number }> {
    const projectItem = await ProjectItem.findAndCountAll({
      include: [{ all: true }],
      where: filter,
      nest: true,
      distinct: true,
      limit,
      offset,
      order: [["idProjectItem", "ASC"]]
    });
    return projectItem;
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

  async findAllProjectDocument(
    filter: { [key: string]: any },
    limit: number, offset: number
  ): Promise<{ rows: any[], count: number }> {
    return await ProjectDocument.findAndCountAll({
      include: [{ all: true }],
      where: filter ?? undefined,
      limit: limit ?? undefined,
      offset: offset ?? undefined,
      distinct: true,
      order: [["idProjectDocument", "DESC"]]
    });
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

  async updateProjectItem(projectItemData: Partial<ProjectItem>): Promise<[number, ProjectItem[]]> {
    return await ProjectItem.update(projectItemData, {
      where: { idProjectItem: projectItemData.idProjectItem },
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

  async createProjectItem(projectItemData: Partial<ProjectItem>): Promise<ProjectItem> {
    return await ProjectItem.create(projectItemData);
  }

  async createProjectDocument(projectDocumentData: Partial<ProjectDocument>): Promise<ProjectDocument> {
    return await ProjectDocument.create(projectDocumentData);
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

  async deleteProjectItem(id: number): Promise<number> {
    return await ProjectItem.destroy({
      where: { idProjectItem: id }
    });
  }

  async deleteProjectDocument(id: number): Promise<number> {
    return await ProjectDocument.destroy({
      where: { idProjectDocument: id }
    });
  }
}