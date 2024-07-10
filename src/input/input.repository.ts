import { Input } from "./input.model";

class InputRepository {

  async findAll(
    filter: { [key: string]: any },
    limit: number, offset: number
  ): Promise<{ rows: Input[], count: number }> {
    const inputs = await Input.findAndCountAll({
      include: [{ all: true }],
      nest: true,
      where: filter,
      limit,
      offset
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