/**
 * Ejemplos de uso de los métodos findById organizados
 * 
 * Se han creado dos métodos diferentes para diferentes casos de uso:
 */

// 📋 MÉTODO 1: findById(idIncome) - Busca por campo específico idIncome
const exampleFindByIdIncome = {
  // Uso en el servicio:
  serviceCall: `
    const result = await this.repository.findById(123); // Busca por idIncome = 123
  `,
  
  // Query SQL generada (aproximadamente):
  sqlGenerated: `
    SELECT * FROM TB_IncomeDiscountsInvoice 
    WHERE idIncome = 123 AND isActive = true
    -- Incluye joins con ExpenditureType, CostCenterProject, Invoice
  `,
  
  // Caso de uso:
  useCase: "Cuando tienes el idIncome específico y quieres encontrar el registro completo"
};

// 📋 MÉTODO 2: findByPrimaryKey(idIncomeDiscountInvoice) - Busca por clave primaria
const exampleFindByPrimaryKey = {
  // Uso en el servicio:
  serviceCall: `
    const result = await this.repository.findByPrimaryKey(456); // Busca por idIncomeDiscountInvoice = 456
  `,
  
  // Query SQL generada (aproximadamente):
  sqlGenerated: `
    SELECT * FROM TB_IncomeDiscountsInvoice 
    WHERE idIncomeDiscountInvoice = 456
    -- Incluye joins con ExpenditureType, CostCenterProject, Invoice
  `,
  
  // Caso de uso:
  useCase: "Cuando tienes el ID principal (autoincrement) del registro"
};

// 🔧 DIFERENCIAS CLAVE:

const differences = {
  findById: {
    searchField: "idIncome",
    searchType: "Campo específico personalizado",
    includesActiveFilter: true,
    description: "Busca por el campo idIncome que tú defines"
  },
  
  findByPrimaryKey: {
    searchField: "idIncomeDiscountInvoice", 
    searchType: "Clave primaria (PK)",
    includesActiveFilter: false,
    description: "Busca por la clave primaria autoincrement"
  }
};

// 📊 ESTRUCTURA DE RESPUESTA (ambos métodos):
const expectedResponse = {
  "idIncomeDiscountInvoice": 1,
  "value": 50000.5,
  "idExpenditureType": 1,
  "idCostCenterProject": 45,
  "idInvoice": 11,
  "idIncome": 123, // ← El campo por el que buscas
  "refundRequestDate": "2023-12-01",
  "advance": 100,
  "reteguarantee": 50,
  "retesource": 75,
  "reteica": 25,
  "fic": 15,
  "other": 30,
  "totalDiscounts": 295,
  "isActive": true,
  "createdAt": "2023-12-01T10:00:00.000Z",
  "updatedAt": "2023-12-01T10:00:00.000Z",
  
  // Relaciones incluidas:
  "expenditureType": {
    "idExpenditureType": 1,
    "expenditureType": "Material"
  },
  "costCenterProject": {
    "idCostCenterProject": 45,
    "name": "Proyecto Construcción"
  },
  "invoice": {
    "idInvoice": 11,
    "invoice": "FAC-2023-001"
  }
};

// 🎯 RECOMENDACIÓN DE USO:
const recommendations = {
  useWhen: {
    findById: "Cuando recibes idIncome desde el frontend o API externa",
    findByPrimaryKey: "Para operaciones internas o cuando tienes el PK directo"
  },
  
  routeMapping: {
    "/incomeDiscountInvoiceById/:idIncome": "findById(idIncome)",
    "/incomeDiscountInvoice/:idIncomeDiscountInvoice": "findByPrimaryKey(idIncomeDiscountInvoice)"
  }
};

module.exports = {
  exampleFindByIdIncome,
  exampleFindByPrimaryKey,
  differences,
  expectedResponse,
  recommendations
};