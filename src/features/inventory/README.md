# Módulo de Inventario - SACMA Backend

## Descripción

Módulo completo para la gestión de inventario de materiales con las siguientes características:

- ✅ Control de stock por bodega (disponible, reservado, total)
- ✅ Costo promedio ponderado automático
- ✅ Entradas desde solicitudes de compra
- ✅ Asignación de materiales a proyectos
- ✅ Devoluciones desde proyectos
- ✅ Trazabilidad completa de movimientos
- ✅ Consultas optimizadas con Stored Procedures
- ✅ Validaciones de stock y restricciones de negocio

## Estructura de Base de Datos

### Tablas Principales

1. **TB_Inventory**: Stock consolidado por material y bodega
   - `quantityAvailable`: Stock disponible para uso
   - `quantityReserved`: Stock asignado a proyectos
   - `quantityTotal`: Total calculado (disponible + reservado)
   - `averageCost`: Costo promedio ponderado

2. **TB_InventoryMovement**: Registro de todos los movimientos
   - Tipos: Entrada, Salida, AsignacionProyecto, DevolucionProyecto, Ajuste, Transferencia
   - Incluye stock antes/después para auditoría
   - Referencia a solicitudes de compra y proyectos

3. **TB_ProjectInventoryAssignment**: Asignaciones específicas a proyectos
   - Control de cantidad asignada, usada y devuelta
   - Estados: Asignado, EnUso, Completado, Devuelto, Cancelado
   - Cálculo automático de cantidad pendiente

## Endpoints Disponibles

### 🔵 Operaciones Principales (Stored Procedures)

#### 1. Registrar Entrada de Inventario
```http
POST /api/v1/inventory/entry
Content-Type: application/json

{
  "idPurchaseRequest": 1,
  "idPurchaseRequestDetail": 5,
  "idInput": 10,
  "idWarehouse": 2,
  "quantity": "100.00",
  "unitPrice": "25.50",
  "remarks": "Entrada desde orden de compra #123",
  "createdBy": "admin"
}
```

**Funcionalidad:**
- Crea o actualiza registro en TB_Inventory
- Calcula costo promedio ponderado automáticamente
- Registra movimiento tipo "Entrada"
- Actualiza stock disponible

#### 2. Asignar Material a Proyecto
```http
POST /api/v1/inventory/assign-to-project
Content-Type: application/json

{
  "idCostCenterProject": 15,
  "idInput": 10,
  "idWarehouse": 2,
  "quantity": "50.00",
  "remarks": "Asignación para proyecto Construcción Edificio A",
  "createdBy": "admin"
}
```

**Funcionalidad:**
- Valida stock disponible suficiente
- Reduce `quantityAvailable` y aumenta `quantityReserved`
- Crea registro en TB_ProjectInventoryAssignment
- Registra movimiento tipo "AsignacionProyecto"
- Retorna `idProjectAssignment` generado

#### 3. Devolver Material desde Proyecto
```http
POST /api/v1/inventory/return-from-project
Content-Type: application/json

{
  "idProjectAssignment": 8,
  "quantityToReturn": "20.00",
  "remarks": "Material sobrante del proyecto",
  "createdBy": "admin"
}
```

**Funcionalidad:**
- Valida que cantidad no exceda la pendiente
- Aumenta `quantityAvailable` y reduce `quantityReserved`
- Actualiza `quantityReturned` en asignación
- Cambia status a "Devuelto" si se devuelve todo
- Registra movimiento tipo "DevolucionProyecto"

#### 4. Consultar Inventario por Bodega
```http
GET /api/v1/inventory/by-warehouse?idWarehouse=2
```

**Respuesta:**
```json
{
  "code": 200,
  "data": [
    {
      "idInventory": 1,
      "idInput": 10,
      "inputName": "Cemento Portland",
      "idWarehouse": 2,
      "warehouseName": "Bodega Central",
      "quantityAvailable": 150.00,
      "quantityReserved": 50.00,
      "quantityTotal": 200.00,
      "averageCost": 25.50,
      "totalValue": 5100.00,
      "lastMovementDate": "2024-11-14T10:30:00",
      "updatedAt": "2024-11-14T10:30:00"
    }
  ],
  "totalItems": 1
}
```

#### 5. Consultar Materiales Asignados a Proyecto
```http
GET /api/v1/inventory/project-materials/15
```

**Respuesta:**
```json
{
  "code": 200,
  "data": [
    {
      "idProjectAssignment": 8,
      "idCostCenterProject": 15,
      "idInput": 10,
      "inputName": "Cemento Portland",
      "idWarehouse": 2,
      "warehouseName": "Bodega Central",
      "quantityAssigned": 50.00,
      "quantityUsed": 30.00,
      "quantityReturned": 0.00,
      "quantityPending": 20.00,
      "unitPrice": 25.50,
      "totalCost": 1275.00,
      "assignmentDate": "2024-11-14T09:00:00",
      "status": "EnUso",
      "createdBy": "admin"
    }
  ],
  "totalItems": 1
}
```

### 🔵 Consultas con Filtros y Paginación

#### 6. Listar Inventario con Filtros
```http
GET /api/v1/inventory?page=1&pageSize=10&idWarehouse=2&minStock=10
```

**Parámetros:**
- `page`: Número de página (default: 1)
- `pageSize`: Elementos por página (default: 10)
- `idWarehouse`: Filtrar por bodega
- `idInput`: Filtrar por material
- `minStock`: Stock mínimo

#### 7. Consultar Inventario por ID
```http
GET /api/v1/inventory/1
```

#### 8. Listar Movimientos de Inventario
```http
GET /api/v1/inventory/movements?page=1&pageSize=20&movementType=Entrada&dateFrom=2024-11-01
```

**Parámetros:**
- `page`, `pageSize`: Paginación
- `idInventory`: Filtrar por inventario específico
- `idWarehouse`: Filtrar por bodega
- `idInput`: Filtrar por material
- `movementType`: Tipo de movimiento (Entrada, Salida, AsignacionProyecto, DevolucionProyecto, Ajuste, Transferencia)
- `dateFrom`, `dateTo`: Rango de fechas

#### 9. Listar Asignaciones de Proyectos
```http
GET /api/v1/inventory/project-assignments?idCostCenterProject=15&status=Asignado
```

**Parámetros:**
- `page`, `pageSize`: Paginación
- `idCostCenterProject`: Filtrar por proyecto
- `idInput`: Filtrar por material
- `status`: Filtrar por estado (Asignado, EnUso, Completado, Devuelto, Cancelado)

## Arquitectura del Módulo

```
src/features/inventory/
├── inventory.model.ts                      # Modelo principal de inventario
├── inventory-movement.model.ts             # Modelo de movimientos
├── project-inventory-assignment.model.ts   # Modelo de asignaciones
├── inventory.interface.ts                  # DTOs y tipos TypeScript
├── inventory.schema.ts                     # Validaciones con Zod
├── inventory.repository.ts                 # Acceso a datos (Sequelize + SPs)
├── inventory.service.ts                    # Lógica de negocio
├── inventory.controller.ts                 # Controladores Express
├── inventory.route.ts                      # Rutas y documentación Swagger
├── inventory-stored-procedures.sql         # Scripts SQL de los SPs
└── index.ts                                # Exportaciones del módulo
```

## Flujo de Trabajo Típico

### 1️⃣ Recepción de Material
```
Solicitud de Compra → Entrada de Inventario → Stock Disponible
```

### 2️⃣ Asignación a Proyecto
```
Stock Disponible → Asignación → Stock Reservado (Proyecto)
```

### 3️⃣ Devolución de Material
```
Stock Reservado → Devolución → Stock Disponible
```

## Características Técnicas

### ✅ Validaciones Implementadas
- Stock insuficiente en asignaciones
- Cantidad de devolución no excede pendiente
- Tipos de movimiento restringidos
- Estados de asignación controlados
- Conversiones de decimal precisas

### ✅ Cálculos Automáticos
- Costo promedio ponderado en entradas
- Stock total (disponible + reservado)
- Cantidad pendiente en asignaciones
- Costo total de asignaciones

### ✅ Auditoría
- Stock antes/después en cada movimiento
- Usuario que creó cada operación
- Fechas de movimientos
- Referencias a documentos origen

## Integración con Otros Módulos

- **Purchase (Solicitudes de Compra)**: Origen de entradas al inventario
- **Cost Center (Proyectos)**: Destino de asignaciones de material
- **Warehouse (Bodegas)**: Control de ubicación física
- **Input (Materiales)**: Catálogo de items

## Instalación

Los modelos ya están integrados en el sistema. Para activar los Stored Procedures:

```sql
-- Ejecutar en SQL Server Management Studio
USE SACMA;
GO
-- Copiar y ejecutar el contenido de inventory-stored-procedures.sql
```

## Testing con Swagger

Accede a la documentación interactiva:
```
http://localhost:8080/api/v1/docs
```

Busca la sección **[Inventory]** para probar todos los endpoints.

## Notas Importantes

⚠️ **Transacciones**: Todas las operaciones críticas están protegidas con transacciones SQL
⚠️ **Decimales**: Se usa DECIMAL(18,2) para precisión en cantidades y precios
⚠️ **Stock Reservado**: No está disponible para nuevas asignaciones hasta que se devuelva
⚠️ **Costo Promedio**: Se recalcula automáticamente en cada entrada

## Soporte

Para dudas o mejoras, contactar al equipo de desarrollo.
