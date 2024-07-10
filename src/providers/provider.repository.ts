import { Provider } from "./provider.model";

class ProviderRepository {
  async findAll(
    filter: { [key: string]: any }, 
    limit: number, offset: number
  ): Promise<{ rows: Provider[], count: number }> {
    const providers = await Provider.findAndCountAll({
      include: [ { all: true } ],
      nest: true,
      where: filter,
      limit,
      offset
    });
    return providers;
  }

  async findById(id: number): Promise<Provider | null> {
    const provider = await Provider.findByPk(id, {
      include: [{ all: true }]
    });
    return provider;
  }

}

const providerRepository = new ProviderRepository();
export { providerRepository };