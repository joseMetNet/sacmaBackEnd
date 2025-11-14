// Configuración de relaciones entre modelos
// Este archivo debe ser importado después de que todos los modelos estén inicializados

import { ExpenditureType } from "../features/expenditure/expendityre-type.model";
import { CostCenterProject } from "../features/cost-center/cost-center-project.model";
import { Invoice } from "../features/invoice/invoice.model";
import { IncomeDiscountInvoice } from "../features/incomeDiscountsInvoice/incomeDiscountsInvoice.model";
import { InputType } from "../features/input/input-type.model";
import { Input, InputUnitOfMeasure } from "../features/input";
import { Supplier } from "../features/supplier";
import { InputDocument } from "../features/input/input-document.model";
import { PurchaseRequest } from "../features/purchase/purchase-request.model";
import { WareHouse } from "../features/warwHouse/warehouse.model";
import { OrderItemDetail } from "../features/order/order-item-detail.model";
import { OrderItem } from "../features/order/order-item.model";
import { PurchaseRequestDetail } from "../features/purchase/purchase-request-detail.model";

export function setupModelRelations() {
  // Relaciones para IncomeDiscountInvoice

  // Un ExpenditureType puede tener muchos IncomeDiscountInvoice
  ExpenditureType.hasMany(IncomeDiscountInvoice, {
    foreignKey: "idExpenditureType",
    as: "incomeDiscountInvoices",
  });

  // Un CostCenterProject puede tener muchos IncomeDiscountInvoice
  CostCenterProject.hasMany(IncomeDiscountInvoice, {
    foreignKey: "idCostCenterProject",
    as: "incomeDiscountInvoices",
  });

  // Un Invoice puede tener muchos IncomeDiscountInvoice
  //   Invoice.hasMany(IncomeDiscountInvoice, {
  //     foreignKey: "idInvoice",
  //     as: "incomeDiscountInvoices",
  //   });


  // Relaciones para Input
  Input.hasOne(InputType, {
    foreignKey: "idInputType",
    sourceKey: "idInputType"
  });

  Input.hasOne(Supplier, {
    foreignKey: "idSupplier",
    sourceKey: "idSupplier"
  });

  Input.hasOne(InputUnitOfMeasure, {
    foreignKey: "idInputUnitOfMeasure",
    sourceKey: "idInputUnitOfMeasure"
  });

  Input.hasMany(InputDocument, {
    foreignKey: "idInput",
    sourceKey: "idInput"
  });

  // Input.hasMany(PurchaseRequest, {
  //   foreignKey: "idInput",
  //   sourceKey: "idInput",
  //   as: "PurchaseRequests"
  // });

  Input.hasMany(PurchaseRequestDetail, {
    foreignKey: "idInput",
    sourceKey: "idInput",
    as: "PurchaseRequestDetails"
  });

  // Relaciones para PurchaseRequest
  PurchaseRequest.belongsTo(WareHouse, {
    foreignKey: "idWarehouse",
    targetKey: "idWarehouse",
    as: "WareHouse"
  });

  PurchaseRequest.belongsTo(Input, {
    foreignKey: "idInput",
    targetKey: "idInput",
    as: "Input"
  });

  PurchaseRequest.belongsTo(Supplier, {
    foreignKey: "idSupplier",
    targetKey: "idSupplier",
    as: "Supplier"
  });

  console.log("Model relations configured successfully");
}