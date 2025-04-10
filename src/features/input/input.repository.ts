import { Input } from "./input.model";

export class InputRepository {

  async findAllAndSearch(
    filter: { [key: string]: any },
    limit: number, offset: number
  ): Promise<{ rows: Input[], count: number }> {
    const inputs = await Input.findAndCountAll({
      include: [{ all: true }],
      nest: true,
      where: filter,
      limit,
      offset,
      distinct: true,
      order: [["idInput", "DESC"]]
    });
    return inputs;
  }

  async findAll(): 
  Promise<{ rows: Input[], count: number }> {
    const inputs = await Input.findAndCountAll({
      include: [{ all: true }],
      nest: true,
      distinct: true,
      order: [["idInput", "DESC"]]
    });
    return inputs;
  }

  async findById(id: number) {
    const input = await Input.findByPk(id, {
      include: [{ all: true }]
    });
    return input;
  }
}

const inputRepository = new InputRepository();
export { inputRepository };