import * as dtos from "./purchase.interface";
import { PurchaseRequest } from "./purchase-request.model";
import { PurchaseRequestDetail } from "./purchase-request-detail.model";
import { PurchaseRequestDetailMachineryUsed } from "./purchase-request-detail-machinery.model"
import { PurchaseRequestStatus } from "./purchase-request-status.model";
import { CostCenterProject } from "../cost-center";
import { Input, InputUnitOfMeasure } from "../input";
import { WareHouse } from "../warwHouse/warehouse.model";
import { Supplier } from "../supplier/supplier.model";
import { Machinery } from "../machinery/machinery.model";
import { MachineryType } from "../machinery/machinery-type.model";
import { MachineryModel } from "../machinery/machinery-model.model";
import { MachineryStatus } from "../machinery/machinery-status.model";

export class PurchaseRepository {

  findAllPurchaseRequest = (
    filter: { [key: string]: any } = {},
    limit?: number,
    offset?: number
  ) => {
    const queryOptions: any = {
      include: [
        {
          model: Input,
          as: "Input",
          required: false,
        },
        {
          model: WareHouse,
          as: "WareHouse",
          required: false,
        },
        {
          model: Supplier,
          as: "Supplier",
          required: false,
        },
        {
          model: PurchaseRequestStatus,
          as: "PurchaseRequestStatus",
          required: false,
        }
      ],
      where: filter,
      order: [["createdAt", "DESC"]],
    };

    if (limit !== undefined) {
      queryOptions.limit = limit;
    }
    if (offset !== undefined) {
      queryOptions.offset = offset;
    }

    return PurchaseRequest.findAndCountAll(queryOptions);
  };

  findAllPurchaseRequestDetail = (
    filter: { [key: string]: any } = {},
    limit: number = 10,
    offset: number = 0
  ) => {
    return PurchaseRequestDetail.findAndCountAll({
      include: [
        {
          model: Input,
          required: true,
          include: [
            {
              model: InputUnitOfMeasure,
              required: true,
            }
          ]
        }
      ],
      where: filter,
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });
  };
  findAllPurchaseRequestDetailMachineryUsed = (
    filter: { [key: string]: any } = {},
    limit: number = 10,
    offset: number = 0
  ) => {
    return PurchaseRequestDetailMachineryUsed.findAndCountAll({
      include: [
        {
          model: Machinery,
          required: true,
        },
        {
          model: MachineryType,
          required: true,
        },
        {
          model: MachineryModel,
          required: true,
        },
        {
          model: MachineryStatus,
          required: true,
        }
      ],
      where: filter,
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });
  };

  findAllPurchaseRequestDetailMachineryWhitoutPaginator = (filter: { [key: string]: any } = {},) => {

    return PurchaseRequestDetailMachineryUsed.findAndCountAll({
      include: [
        {
          model: Machinery,
          required: true,
        },
        {
          model: MachineryType,
          required: true,
        },
        {
          model: MachineryModel,
          required: true,
        },
        {
          model: MachineryStatus,
          required: true,
        }
      ],
      where: filter,
      order: [["createdAt", "DESC"]],
    });

  }

  findPurchaseRequestStatus = () => {
    return PurchaseRequestStatus.findAll();
  };

  findByIdPurchaseRequest = (id: number) => {
    return PurchaseRequest.findByPk(id,
      {
        include: [
          {
            model: Input,
            as: "Input",
            required: false,
          },
          {
            model: WareHouse,
            as: "WareHouse",
            required: false,
          },
          {
            model: Supplier,
            as: "Supplier",
            required: false,
          }
        ],
      }
    );
  };

  findByIdPurchaseRequestDetail = (id: number) => {
    return PurchaseRequestDetail.findByPk(id,
      {
        include: [
          {
            model: Input,
            required: true,
            include: [
              {
                model: InputUnitOfMeasure,
                required: true,
              }
            ]
          }
        ],
      }
    );
  };
  findByIdPurchaseRequestDetailMachineryUsed = (id: number) => {
    return PurchaseRequestDetailMachineryUsed.findByPk(id,
      {
        // include: [
        //   {
        //     model: Input,
        //     required: true,
        //     include: [
        //       {
        //         model: InputUnitOfMeasure,
        //         required: true,
        //       }
        //     ]
        //   }
        // ],
        include: [
          {
            model: Machinery,
            required: true,
          },
          {
            model: MachineryType,
            required: true,
          },
          {
            model: MachineryModel,
            required: true,
          },
          {
            model: MachineryStatus,
            required: true,
          }
        ],
      }
    );
  };

  createPurchaseRequest = (purchaseRequest: dtos.CreatePurchaseRequest) => {
    return PurchaseRequest.create(purchaseRequest as any);
  };

  // Buscar purchase request por combinación única
  findPurchaseRequestByUnique = (idWarehouse: number, idSupplier: number, idInput: number) => {
    return PurchaseRequest.findOne({
      where: {
        idWarehouse,
        idSupplier,
        idInput,
        isActive: true
      }
    });
  };

  // Actualizar purchase request existente por ID
  updatePurchaseRequestById = (idPurchaseRequest: number, data: Partial<dtos.UpdatePurchaseRequest>) => {
    return PurchaseRequest.update(data, { 
      where: { idPurchaseRequest } 
    });
  };

  // Actualizar costo en TB_Input
  updateInputCost = async (idInput: number, newCost: string) => {
    return Input.update(
      { cost: newCost },
      { where: { idInput } }
    );
  };

  createPurchaseRequestDetail = (purchaseRequestDetail: dtos.CreatePurchaseRequestDetail) => {
    return PurchaseRequestDetail.create(purchaseRequestDetail as any);
  };

  createPurchaseRequestDetailMachineryUsed = (purchaseRequestDetailMachineryUsed: dtos.CreatePurchaseRequestDetailMachineryUsed) => {
    return PurchaseRequestDetailMachineryUsed.create(purchaseRequestDetailMachineryUsed as any);
  };
  // createPurchaseRequestDetailMachineryUsed = (purchaseRequestDetailMachineryUsed: dtos.CreatePurchaseRequestDetailMachineryUsed, transaction?: any) => {
  //   const options: any = {};
  //   if (transaction) {
  //     options.transaction = transaction;
  //   }
  //   return PurchaseRequestDetailMachineryUsed.create(purchaseRequestDetailMachineryUsed as any, options);
  // };

  updatePurchaseRequest = (purchaseRequest: dtos.UpdatePurchaseRequest) => {
    return PurchaseRequest.update(purchaseRequest, { where: { idPurchaseRequest: purchaseRequest.idPurchaseRequest } });
  };

  updatePurchaseRequestDetail = (purchaseRequestDetail: dtos.UpdatePurchaseRequestDetail) => {
    return PurchaseRequestDetail.update(purchaseRequestDetail, { where: { idPurchaseRequestDetail: purchaseRequestDetail.idPurchaseRequestDetail } });
  };

  updatePurchaseRequestDetailMachineryUsed = (purchaseRequestDetailMachineryUsed: dtos.UpdatePurchaseRequestDetailMachineryUsed) => {
    return PurchaseRequestDetailMachineryUsed.update(purchaseRequestDetailMachineryUsed, { where: { idPurchaseRequestDetailMachineryUsed: purchaseRequestDetailMachineryUsed.idPurchaseRequestDetailMachineryUsed } });
  };

  deletePurchaseRequest = (id: number) => {
    return PurchaseRequest.destroy({ where: { idPurchaseRequest: id } });
  };

  deletePurchaseRequestDetail = (id: number) => {
    return PurchaseRequestDetail.destroy({ where: { idPurchaseRequestDetail: id } });
  };
  
  // Calcular el precio total de todos los detalles de una PurchaseRequest
  calculateTotalPriceForPurchaseRequest = async (idPurchaseRequest: number): Promise<number> => {
    const details = await PurchaseRequestDetail.findAll({
      where: { idPurchaseRequest },
      attributes: ['quantity', 'price']
    });

    const total = details.reduce((sum, detail) => {
      const quantity = parseFloat(detail.quantity?.toString() || "0");
      const price = parseFloat(detail.price?.toString() || "0");
      return sum + (quantity * price);
    }, 0);

    return total;
  };

  // Actualizar el precio en TB_PurchaseRequest
  updatePurchaseRequestPrice = async (idPurchaseRequest: number, newPrice: string) => {
    return PurchaseRequest.update(
      { 
        price: newPrice,
        updatedAt: new Date()
      },
      { where: { idPurchaseRequest } }
    );
  };
  
  deletePurchaseRequestDetailMachineryUsed = (id: number) => {
    return PurchaseRequestDetailMachineryUsed.destroy({ where: { idPurchaseRequestDetailMachineryUsed: id } });
  };
}