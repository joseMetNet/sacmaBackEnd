# Ejemplos de Payloads para Testing - Módulo de Inventario

## 1. Registrar Entrada de Inventario (desde Solicitud de Compra)

### POST /api/v1/inventory/entry

**Caso de Éxito: Primera entrada de un material**
```json
{
  "idPurchaseRequest": 1,
  "idPurchaseRequestDetail": 5,
  "idInput": 217,
  "idWarehouse": 4,
  "quantity": "100.00",
  "unitPrice": "25.50",
  "remarks": "Entrada inicial desde OC #001",
  "createdBy": "admin metnet"
}
```

**Caso de Éxito: Segunda entrada (calcula costo promedio)**
```json
{
  "idPurchaseRequest": 2,
  "idPurchaseRequestDetail": 8,
  "idInput": 217,
  "idWarehouse": 4,
  "quantity": "50.00",
  "unitPrice": "27.00",
  "remarks": "Segunda compra - precio actualizado",
  "createdBy": "admin metnet"
}
```
_Resultado esperado: Costo promedio = (100*25.50 + 50*27.00) / 150 = 25.83_

---

## 2. Asignar Material a Proyecto

### POST /api/v1/inventory/assign-to-project

**Caso de Éxito: Asignación normal**
```json
{
  "idCostCenterProject": 15,
  "idInput": 217,
  "idWarehouse": 4,
  "quantity": "30.00",
  "remarks": "Asignación para proyecto Construcción Edificio A - Fase 1",
  "createdBy": "admin metnet"
}
```

**Caso de Error: Stock insuficiente**
```json
{
  "idCostCenterProject": 15,
  "idInput": 217,
  "idWarehouse": 4,
  "quantity": "1000.00",
  "remarks": "Cantidad excesiva",
  "createdBy": "admin metnet"
}
```
_Resultado esperado: Error 400 - "Stock insuficiente. Disponible: X, Solicitado: 1000"_

**Caso de Error: Material no existe en bodega**
```json
{
  "idCostCenterProject": 15,
  "idInput": 999,
  "idWarehouse": 4,
  "quantity": "10.00",
  "remarks": "Material inexistente",
  "createdBy": "admin metnet"
}
```
_Resultado esperado: Error 400 - "No existe inventario para el material en la bodega especificada"_

---

## 3. Devolver Material desde Proyecto

### POST /api/v1/inventory/return-from-project

**Caso de Éxito: Devolución parcial**
```json
{
  "idProjectAssignment": 8,
  "quantityToReturn": "10.00",
  "remarks": "Devolución de material sobrante - Fase 1 completada",
  "createdBy": "admin metnet"
}
```

**Caso de Éxito: Devolución total (cambia status a "Devuelto")**
```json
{
  "idProjectAssignment": 8,
  "quantityToReturn": "20.00",
  "remarks": "Devolución total - Proyecto cancelado",
  "createdBy": "admin metnet"
}
```
_Nota: Si quantityAssigned = quantityUsed + quantityReturned, status cambia a "Devuelto"_

**Caso de Error: Cantidad excede pendiente**
```json
{
  "idProjectAssignment": 8,
  "quantityToReturn": "100.00",
  "remarks": "Cantidad excesiva",
  "createdBy": "admin metnet"
}
```
_Resultado esperado: Error 400 - "Cantidad a devolver excede la cantidad pendiente. Pendiente: X"_

---

## 4. Consultar Inventario por Bodega

### GET /api/v1/inventory/by-warehouse

**Todas las bodegas:**
```
GET /api/v1/inventory/by-warehouse
```

**Bodega específica:**
```
GET /api/v1/inventory/by-warehouse?idWarehouse=4
```

**Respuesta esperada:**
```json
{
  "code": 200,
  "data": [
    {
      "idInventory": 12,
      "idInput": 217,
      "inputName": "Cemento Portland Tipo I",
      "idWarehouse": 4,
      "warehouseName": "Bodega Principal Bogotá",
      "quantityAvailable": 120.00,
      "quantityReserved": 30.00,
      "quantityTotal": 150.00,
      "averageCost": 25.83,
      "totalValue": 3099.60,
      "lastMovementDate": "2024-11-14T15:30:00.000Z",
      "updatedAt": "2024-11-14T15:30:00.000Z"
    }
  ],
  "totalItems": 1
}
```

---

## 5. Consultar Materiales Asignados a Proyecto

### GET /api/v1/inventory/project-materials/{idCostCenterProject}

**Ejemplo:**
```
GET /api/v1/inventory/project-materials/15
```

**Respuesta esperada:**
```json
{
  "code": 200,
  "data": [
    {
      "idProjectAssignment": 8,
      "idCostCenterProject": 15,
      "idInput": 217,
      "inputName": "Cemento Portland Tipo I",
      "idWarehouse": 4,
      "warehouseName": "Bodega Principal Bogotá",
      "quantityAssigned": 30.00,
      "quantityUsed": 0.00,
      "quantityReturned": 10.00,
      "quantityPending": 20.00,
      "unitPrice": 25.83,
      "totalCost": 774.90,
      "assignmentDate": "2024-11-14T10:00:00.000Z",
      "status": "Asignado",
      "createdBy": "admin metnet"
    }
  ],
  "totalItems": 1
}
```

---

## 6. Listar Inventario con Filtros

### GET /api/v1/inventory

**Sin filtros (paginado):**
```
GET /api/v1/inventory?page=1&pageSize=10
```

**Filtrar por bodega:**
```
GET /api/v1/inventory?idWarehouse=4&page=1&pageSize=20
```

**Filtrar por material:**
```
GET /api/v1/inventory?idInput=217
```

**Filtrar por stock mínimo (alerta de reorden):**
```
GET /api/v1/inventory?minStock=50&page=1&pageSize=100
```

**Combinación de filtros:**
```
GET /api/v1/inventory?idWarehouse=4&minStock=20&pageSize=50
```

---

## 7. Consultar Inventario Específico

### GET /api/v1/inventory/{idInventory}

**Ejemplo:**
```
GET /api/v1/inventory/12
```

---

## 8. Listar Movimientos de Inventario

### GET /api/v1/inventory/movements

**Todos los movimientos (paginado):**
```
GET /api/v1/inventory/movements?page=1&pageSize=20
```

**Filtrar por tipo de movimiento:**
```
GET /api/v1/inventory/movements?movementType=Entrada&page=1&pageSize=50
```

**Filtrar por bodega:**
```
GET /api/v1/inventory/movements?idWarehouse=4&page=1
```

**Filtrar por material:**
```
GET /api/v1/inventory/movements?idInput=217&page=1
```

**Filtrar por rango de fechas:**
```
GET /api/v1/inventory/movements?dateFrom=2024-11-01&dateTo=2024-11-14&page=1
```

**Movimientos de asignaciones a proyectos:**
```
GET /api/v1/inventory/movements?movementType=AsignacionProyecto&page=1
```

**Movimientos de devoluciones:**
```
GET /api/v1/inventory/movements?movementType=DevolucionProyecto&dateFrom=2024-11-01
```

**Combinación completa:**
```
GET /api/v1/inventory/movements?idWarehouse=4&movementType=Entrada&dateFrom=2024-11-01&dateTo=2024-11-14&pageSize=100
```

---

## 9. Listar Asignaciones de Proyectos

### GET /api/v1/inventory/project-assignments

**Todas las asignaciones:**
```
GET /api/v1/inventory/project-assignments?page=1&pageSize=20
```

**Filtrar por proyecto:**
```
GET /api/v1/inventory/project-assignments?idCostCenterProject=15
```

**Filtrar por material:**
```
GET /api/v1/inventory/project-assignments?idInput=217
```

**Filtrar por estado:**
```
GET /api/v1/inventory/project-assignments?status=Asignado&page=1
```

**Asignaciones activas (múltiples estados):**
```
GET /api/v1/inventory/project-assignments?status=Asignado&page=1
GET /api/v1/inventory/project-assignments?status=EnUso&page=1
```

**Asignaciones completadas:**
```
GET /api/v1/inventory/project-assignments?status=Completado&page=1
```

**Asignaciones devueltas:**
```
GET /api/v1/inventory/project-assignments?status=Devuelto&page=1
```

**Combinación:**
```
GET /api/v1/inventory/project-assignments?idCostCenterProject=15&status=Asignado&pageSize=50
```

---

## Flujo de Testing Completo

### Paso 1: Registrar entrada inicial
```bash
curl -X POST http://localhost:8080/api/v1/inventory/entry \
  -H "Content-Type: application/json" \
  -d '{
    "idPurchaseRequest": 5,
    "idPurchaseRequestDetail": 35,
    "idInput": 217,
    "idWarehouse": 4,
    "quantity": "100.00",
    "unitPrice": "25.50",
    "remarks": "Entrada inicial - Testing",
    "createdBy": "admin metnet"
  }'
```

### Paso 2: Verificar inventario creado
```bash
curl http://localhost:8080/api/v1/inventory/by-warehouse?idWarehouse=4
```

### Paso 3: Asignar material a proyecto
```bash
curl -X POST http://localhost:8080/api/v1/inventory/assign-to-project \
  -H "Content-Type: application/json" \
  -d '{
    "idCostCenterProject": 15,
    "idInput": 217,
    "idWarehouse": 4,
    "quantity": "30.00",
    "remarks": "Asignación de prueba",
    "createdBy": "admin metnet"
  }'
```

### Paso 4: Verificar asignación
```bash
curl http://localhost:8080/api/v1/inventory/project-materials/15
```

### Paso 5: Verificar stock actualizado
```bash
curl http://localhost:8080/api/v1/inventory/by-warehouse?idWarehouse=4
# Debe mostrar: quantityAvailable=70, quantityReserved=30, quantityTotal=100
```

### Paso 6: Devolver material parcial
```bash
curl -X POST http://localhost:8080/api/v1/inventory/return-from-project \
  -H "Content-Type: application/json" \
  -d '{
    "idProjectAssignment": 8,
    "quantityToReturn": "10.00",
    "remarks": "Devolución parcial - Testing",
    "createdBy": "admin metnet"
  }'
```

### Paso 7: Verificar movimientos registrados
```bash
curl http://localhost:8080/api/v1/inventory/movements?idWarehouse=4
```

---

## Estados de Asignaciones

- **Asignado**: Material asignado inicialmente
- **EnUso**: Material en uso (se actualiza manualmente)
- **Completado**: Proyecto completado
- **Devuelto**: Material devuelto completamente
- **Cancelado**: Asignación cancelada

---

## Tipos de Movimiento

- **Entrada**: Ingreso de material desde compras
- **Salida**: Salida de material (uso futuro)
- **AsignacionProyecto**: Asignación a proyecto específico
- **DevolucionProyecto**: Devolución desde proyecto
- **Ajuste**: Ajustes manuales (uso futuro)
- **Transferencia**: Transferencia entre bodegas (uso futuro)
