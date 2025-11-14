-- ====================================================================
-- Script SQL para Stored Procedures del Módulo de Inventario
-- Base de datos: SACMA
-- Schema: mvp1
-- ====================================================================

USE [SACMA];
GO

-- ====================================================================
-- PROCEDIMIENTO: SP_RegisterInventoryEntry
-- Registra entrada de material al inventario desde solicitud de compra
-- ====================================================================

CREATE OR ALTER PROCEDURE [mvp1].[SP_RegisterInventoryEntry]
    @idPurchaseRequest INT,
    @idPurchaseRequestDetail INT,
    @idInput INT,
    @idWarehouse INT,
    @quantity DECIMAL(18,2),
    @unitPrice DECIMAL(18,2),
    @remarks NVARCHAR(500) = NULL,
    @createdBy NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    DECLARE @idInventory INT;
    DECLARE @currentStock DECIMAL(18,2) = 0;
    DECLARE @currentAvgCost DECIMAL(18,2) = 0;
    DECLARE @newAvgCost DECIMAL(18,2);
    DECLARE @totalPrice DECIMAL(18,2) = @quantity * @unitPrice;
    
    BEGIN TRY
        -- Buscar o crear registro en TB_Inventory
        SELECT @idInventory = idInventory, 
               @currentStock = quantityAvailable,
               @currentAvgCost = ISNULL(averageCost, 0)
        FROM [mvp1].[TB_Inventory]
        WHERE idInput = @idInput AND idWarehouse = @idWarehouse;
        
        IF @idInventory IS NULL
        BEGIN
            -- Crear nuevo registro de inventario
            INSERT INTO [mvp1].[TB_Inventory] 
            (idInput, idWarehouse, quantityAvailable, averageCost, lastMovementDate)
            VALUES 
            (@idInput, @idWarehouse, @quantity, @unitPrice, GETDATE());
            
            SET @idInventory = SCOPE_IDENTITY();
            SET @newAvgCost = @unitPrice;
        END
        ELSE
        BEGIN
            -- Calcular nuevo costo promedio ponderado
            SET @newAvgCost = ((@currentStock * @currentAvgCost) + (@quantity * @unitPrice)) 
                              / (@currentStock + @quantity);
            
            -- Actualizar inventario existente
            UPDATE [mvp1].[TB_Inventory]
            SET quantityAvailable = quantityAvailable + @quantity,
                averageCost = @newAvgCost,
                lastMovementDate = GETDATE(),
                updatedAt = GETDATE()
            WHERE idInventory = @idInventory;
        END
        
        -- Registrar movimiento
        INSERT INTO [mvp1].[TB_InventoryMovement]
        (idInventory, idPurchaseRequest, idPurchaseRequestDetail, idInput, idWarehouse,
         movementType, quantity, unitPrice, totalPrice, stockBefore, stockAfter,
         remarks, createdBy, dateMovement)
        VALUES
        (@idInventory, @idPurchaseRequest, @idPurchaseRequestDetail, @idInput, @idWarehouse,
         'Entrada', @quantity, @unitPrice, @totalPrice, @currentStock, @currentStock + @quantity,
         @remarks, @createdBy, GETDATE());
        
        COMMIT TRANSACTION;
        PRINT 'Entrada de inventario registrada correctamente.';
        
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

-- ====================================================================
-- PROCEDIMIENTO: SP_AssignMaterialToProject
-- Asigna material del inventario a un proyecto
-- ====================================================================

CREATE OR ALTER PROCEDURE [mvp1].[SP_AssignMaterialToProject]
    @idCostCenterProject INT,
    @idInput INT,
    @idWarehouse INT,
    @quantity DECIMAL(18,2),
    @remarks NVARCHAR(500) = NULL,
    @createdBy NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    DECLARE @idInventory INT;
    DECLARE @currentStock DECIMAL(18,2);
    DECLARE @unitPrice DECIMAL(18,2);
    DECLARE @idProjectAssignment INT;
    
    BEGIN TRY
        -- Obtener inventario disponible
        SELECT @idInventory = idInventory,
               @currentStock = quantityAvailable,
               @unitPrice = averageCost
        FROM [mvp1].[TB_Inventory]
        WHERE idInput = @idInput AND idWarehouse = @idWarehouse;
        
        -- Validaciones
        IF @idInventory IS NULL
        BEGIN
            RAISERROR('No existe inventario para el material en la bodega especificada.', 16, 1);
            RETURN;
        END
        
        IF @currentStock < @quantity
        BEGIN
            DECLARE @MsgStock NVARCHAR(500) = 'Stock insuficiente. Disponible: ' + CAST(@currentStock AS NVARCHAR(20)) + ', Solicitado: ' + CAST(@quantity AS NVARCHAR(20));
            RAISERROR(@MsgStock, 16, 1);
            RETURN;
        END
        
        -- Actualizar inventario (reducir disponible, aumentar reservado)
        UPDATE [mvp1].[TB_Inventory]
        SET quantityAvailable = quantityAvailable - @quantity,
            quantityReserved = quantityReserved + @quantity,
            lastMovementDate = GETDATE(),
            updatedAt = GETDATE()
        WHERE idInventory = @idInventory;
        
        -- Crear registro de asignación a proyecto
        INSERT INTO [mvp1].[TB_ProjectInventoryAssignment]
        (idCostCenterProject, idInput, idWarehouse, quantityAssigned, unitPrice, 
         assignmentDate, createdBy, status)
        VALUES
        (@idCostCenterProject, @idInput, @idWarehouse, @quantity, @unitPrice,
         GETDATE(), @createdBy, 'Asignado');
        
        SET @idProjectAssignment = SCOPE_IDENTITY();
        
        -- Registrar movimiento
        INSERT INTO [mvp1].[TB_InventoryMovement]
        (idInventory, idCostCenterProject, idInput, idWarehouse, movementType,
         quantity, unitPrice, totalPrice, stockBefore, stockAfter, remarks, createdBy, dateMovement)
        VALUES
        (@idInventory, @idCostCenterProject, @idInput, @idWarehouse, 'AsignacionProyecto',
         @quantity, @unitPrice, @quantity * @unitPrice, @currentStock, @currentStock - @quantity,
         @remarks, @createdBy, GETDATE());
        
        COMMIT TRANSACTION;
        
        -- Retornar ID de asignación
        SELECT @idProjectAssignment AS idProjectAssignment;
        PRINT 'Material asignado al proyecto correctamente.';
        
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

-- ====================================================================
-- PROCEDIMIENTO: SP_ReturnMaterialFromProject
-- Devuelve material no utilizado desde un proyecto
-- ====================================================================

CREATE OR ALTER PROCEDURE [mvp1].[SP_ReturnMaterialFromProject]
    @idProjectAssignment INT,
    @quantityToReturn DECIMAL(18,2),
    @remarks NVARCHAR(500) = NULL,
    @createdBy NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    DECLARE @idInventory INT;
    DECLARE @idInput INT;
    DECLARE @idWarehouse INT;
    DECLARE @idCostCenterProject INT;
    DECLARE @currentStock DECIMAL(18,2);
    DECLARE @unitPrice DECIMAL(18,2);
    DECLARE @quantityPending DECIMAL(18,2);
    
    BEGIN TRY
        -- Obtener datos de la asignación
        SELECT @idCostCenterProject = idCostCenterProject,
               @idInput = idInput,
               @idWarehouse = idWarehouse,
               @unitPrice = unitPrice,
               @quantityPending = quantityAssigned - quantityUsed - quantityReturned
        FROM [mvp1].[TB_ProjectInventoryAssignment]
        WHERE idProjectAssignment = @idProjectAssignment;
        
        -- Validaciones
        IF @quantityPending < @quantityToReturn
        BEGIN
            DECLARE @MsgPending NVARCHAR(500) = 'Cantidad a devolver excede la cantidad pendiente. Pendiente: ' + CAST(@quantityPending AS NVARCHAR(20));
            RAISERROR(@MsgPending, 16, 1);
            RETURN;
        END
        
        -- Obtener inventario
        SELECT @idInventory = idInventory,
               @currentStock = quantityAvailable
        FROM [mvp1].[TB_Inventory]
        WHERE idInput = @idInput AND idWarehouse = @idWarehouse;
        
        -- Actualizar inventario (aumentar disponible, reducir reservado)
        UPDATE [mvp1].[TB_Inventory]
        SET quantityAvailable = quantityAvailable + @quantityToReturn,
            quantityReserved = quantityReserved - @quantityToReturn,
            lastMovementDate = GETDATE(),
            updatedAt = GETDATE()
        WHERE idInventory = @idInventory;
        
        -- Actualizar asignación de proyecto
        UPDATE [mvp1].[TB_ProjectInventoryAssignment]
        SET quantityReturned = quantityReturned + @quantityToReturn,
            status = CASE 
                WHEN (quantityReturned + @quantityToReturn) >= quantityAssigned THEN 'Devuelto'
                ELSE status
            END
        WHERE idProjectAssignment = @idProjectAssignment;
        
        -- Registrar movimiento
        INSERT INTO [mvp1].[TB_InventoryMovement]
        (idInventory, idCostCenterProject, idInput, idWarehouse, movementType,
         quantity, unitPrice, totalPrice, stockBefore, stockAfter, remarks, createdBy, dateMovement)
        VALUES
        (@idInventory, @idCostCenterProject, @idInput, @idWarehouse, 'DevolucionProyecto',
         @quantityToReturn, @unitPrice, @quantityToReturn * @unitPrice, 
         @currentStock, @currentStock + @quantityToReturn, @remarks, @createdBy, GETDATE());
        
        COMMIT TRANSACTION;
        PRINT 'Material devuelto correctamente.';
        
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

-- ====================================================================
-- PROCEDIMIENTO: SP_GetInventoryByWarehouse
-- Consulta el inventario actual por bodega
-- ====================================================================

CREATE OR ALTER PROCEDURE [mvp1].[SP_GetInventoryByWarehouse]
    @idWarehouse INT = NULL
AS
BEGIN
    SELECT 
        i.idInventory,
        i.idInput,
        inp.name AS inputName,
        i.idWarehouse,
        w.name AS warehouseName,
        i.quantityAvailable,
        i.quantityReserved,
        i.quantityTotal,
        i.averageCost,
        i.quantityAvailable * i.averageCost AS totalValue,
        i.lastMovementDate,
        i.updatedAt
    FROM [mvp1].[TB_Inventory] i
    LEFT JOIN [mvp1].[TB_Input] inp ON i.idInput = inp.idInput
    LEFT JOIN [mvp1].[TB_WareHouse] w ON i.idWarehouse = w.idWarehouse
    WHERE (@idWarehouse IS NULL OR i.idWarehouse = @idWarehouse)
    ORDER BY inp.name, w.name;
END;
GO

-- ====================================================================
-- PROCEDIMIENTO: SP_GetProjectMaterialsAssigned
-- Consulta materiales asignados a un proyecto
-- ====================================================================

CREATE OR ALTER PROCEDURE [mvp1].[SP_GetProjectMaterialsAssigned]
    @idCostCenterProject INT
AS
BEGIN
    SELECT 
        pa.idProjectAssignment,
        pa.idCostCenterProject,
        pa.idInput,
        inp.name AS inputName,
        pa.idWarehouse,
        w.name AS warehouseName,
        pa.quantityAssigned,
        pa.quantityUsed,
        pa.quantityReturned,
        pa.quantityPending,
        pa.unitPrice,
        pa.totalCost,
        pa.assignmentDate,
        pa.status,
        pa.createdBy
    FROM [mvp1].[TB_ProjectInventoryAssignment] pa
    LEFT JOIN [mvp1].[TB_Input] inp ON pa.idInput = inp.idInput
    LEFT JOIN [mvp1].[TB_WareHouse] w ON pa.idWarehouse = w.idWarehouse
    WHERE pa.idCostCenterProject = @idCostCenterProject
    ORDER BY pa.assignmentDate DESC;
END;
GO

PRINT 'Todos los Stored Procedures han sido creados/actualizados correctamente.';
GO
