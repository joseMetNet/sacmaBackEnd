import { Request, Response } from "express";
import { InputMovementService } from "./input-movement.service";
import * as schemas from "./input-movement.schema";
import { formatZodError } from "../employee/utils";
import { StatusCode, StatusValue } from "../../utils/general.interfase";

export class InputMovementController {
  private readonly inputMovementService: InputMovementService;

  constructor(inputMovementService: InputMovementService) {
    this.inputMovementService = inputMovementService;
  }

  // Registrar movimiento (Entrada o Salida)
  moveInput = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.moveInputSchema.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.inputMovementService.moveInput(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  // Obtener todos los movimientos
  findAll = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllInputMovementSchema.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.inputMovementService.findAll(request.data);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  // Obtener movimiento por ID
  findById = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idInputMovementSchema.safeParse(req.params);
    if (!request.success) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: formatZodError(request.error) }
      });
      return;
    }

    const response = await this.inputMovementService.findById(request.data.idInputMovement);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  // Obtener historial por producto
  findByInput = async (req: Request, res: Response): Promise<void> => {
    const idInput = parseInt(req.params.idInput);
    if (isNaN(idInput)) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: "idInput debe ser un número válido" }
      });
      return;
    }

    const response = await this.inputMovementService.findByInput(idInput);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };

  // Obtener historial por bodega
  findByWarehouse = async (req: Request, res: Response): Promise<void> => {
    const idWarehouse = parseInt(req.params.idWarehouse);
    if (isNaN(idWarehouse)) {
      res.status(StatusCode.BadRequest).json({
        status: StatusValue.Failed,
        data: { error: "idWarehouse debe ser un número válido" }
      });
      return;
    }

    const response = await this.inputMovementService.findByWarehouse(idWarehouse);
    res.status(response.code).json({
      status: response.status,
      data: response.data
    });
  };
}
