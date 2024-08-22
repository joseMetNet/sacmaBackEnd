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

  async findById(id: number): Promise<Machinery | null> {
    const supplier = await Machinery.findByPk(id, {
      include: [{ all: true }]
    });
    return supplier;
  }
}


const machineryRepository = new MachineryRepository();
export { machineryRepository };