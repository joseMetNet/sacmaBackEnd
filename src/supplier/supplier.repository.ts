import { Supplier } from "./supplier.model";

class SupplierRepository {
  async findAllAndSearch(
    filter: { [key: string]: any },
    limit: number, offset: number
  ): Promise<{ rows: Supplier[], count: number }> {
    const suppliers = await Supplier.findAndCountAll({
      include: [{ all: true }],
      nest: true,
      where: filter,
      limit,
      offset,
      distinct: true
    });
    return suppliers;
  }

  async findAll(): 
  Promise<{ rows: Supplier[], count: number }> {
    const suppliers = await Supplier.findAndCountAll({
      include: [{ all: true }],
      nest: true,
      distinct: true
    });
    return suppliers;
  }

  async findById(id: number): Promise<Supplier | null> {
    const supplier = await Supplier.findByPk(id, {
      include: [{ all: true }]
    });
    return supplier;
  }

}

const supplierRepository = new SupplierRepository();
export { supplierRepository };