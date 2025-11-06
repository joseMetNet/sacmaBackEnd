/**
 * Ejemplos de JSON para testing del módulo incomeDiscountsInvoice
 */

// 📋 EJEMPLO JSON PARA CREAR - CAMPOS OBLIGATORIOS Y OPCIONALES

// ✅ JSON MÍNIMO (Solo campos obligatorios)
const createMinimumExample = {
  "value": 50000.5,
  "idExpenditureType": 1,
  "idCostCenterProject": 45,
  "idInvoice": 11
  // refundRequestDate se asigna automáticamente con la fecha actual
  // advance, reteguarantee, retesource, reteica, fic, other tienen valor por defecto 0
};

// ✅ JSON COMPLETO (Todos los campos)
const createCompleteExample = {
  "value": 50000.5,           // OBLIGATORIO
  "idExpenditureType": 1,     // OBLIGATORIO
  "idCostCenterProject": 45,  // OBLIGATORIO
  "idInvoice": 11,            // OBLIGATORIO
  "refundRequestDate": "2023-12-01", // OPCIONAL (si no se envía, usa fecha actual)
  "advance": 100,             // OPCIONAL (por defecto 0)
  "reteguarantee": 50,        // OPCIONAL (por defecto 0)
  "retesource": 75,           // OPCIONAL (por defecto 0)
  "reteica": 25,              // OPCIONAL (por defecto 0)
  "fic": 15,                  // OPCIONAL (por defecto 0)
  "other": 30                 // OPCIONAL (por defecto 0)
};

// 📋 VALIDACIONES IMPLEMENTADAS:

// ❌ ERROR - Campos obligatorios faltantes
const errorMissingRequired = {
  "advance": 100,
  "reteguarantee": 50
  // Faltan: value, idExpenditureType, idCostCenterProject, idInvoice
};

// ❌ ERROR - Valores negativos no permitidos
const errorNegativeValues = {
  "value": -1000,              // ❌ No puede ser negativo
  "idExpenditureType": 0,      // ❌ Debe ser >= 1
  "idCostCenterProject": 45,
  "idInvoice": 11,
  "advance": -50               // ❌ No puede ser negativo
};

// 📋 COMPORTAMIENTO ESPECIAL:

// 🕒 refundRequestDate - Fecha por defecto
const withoutDate = {
  "value": 50000.5,
  "idExpenditureType": 1,
  "idCostCenterProject": 45,
  "idInvoice": 11
  // refundRequestDate NO enviado -> Se asigna fecha actual automáticamente
};

const withDate = {
  "value": 50000.5,
  "idExpenditureType": 1,
  "idCostCenterProject": 45,
  "idInvoice": 11,
  "refundRequestDate": "2023-12-01" // Fecha específica
};

// 📊 RESPUESTA ESPERADA:
const responseExample = {
  "status": "SUCCESS",
  "code": 201,
  "data": {
    "idIncomeDiscountInvoice": 1,
    "value": 50000.5,
    "idExpenditureType": 1,
    "idCostCenterProject": 45,
    "idInvoice": 11,
    "refundRequestDate": "2023-12-01", // Fecha actual si no se envió
    "advance": 100,
    "reteguarantee": 50,
    "retesource": 75,
    "reteica": 25,
    "fic": 15,
    "other": 30,
    "isActive": true,
    "createdAt": "2023-12-01T10:30:00.000Z",
    "updatedAt": "2023-12-01T10:30:00.000Z"
  }
};

module.exports = {
  createMinimumExample,
  createCompleteExample,
  errorMissingRequired,
  errorNegativeValues,
  withoutDate,
  withDate,
  responseExample
};