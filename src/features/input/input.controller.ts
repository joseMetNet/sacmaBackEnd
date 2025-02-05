import { Request, Response } from "express";
import { StatusCode, StatusValue } from "../../utils/general.interfase";
import { inputService } from "./input.service";
import * as schemas from "./input.schema";
import { UploadedFile } from "express-fileupload";
import { formatZodError } from "../employee/utils";

class InputController {
  async findAll(req: Request, res: Response): Promise<void> {
    const request = schemas.findAll.safeParse(req.query);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) },
        });
      return;
    }
    const response = await inputService.findAll(request.data);
    res
      .status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.idInput.safeParse(req.params);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await inputService.findById(request.data.idInput);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async findInputTypes(req: Request, res: Response): Promise<void> {
    try {
      const response = await inputService.findInputTypes();
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async findUnitOfMeasures(req: Request, res: Response): Promise<void> {
    try {
      const response = await inputService.findUnitOfMeasures();
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async findInputDocumentTypes(req: Request, res: Response): Promise<void> {
    try {
      const response = await inputService.findInputDocumentTypes();
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.idInput.safeParse(req.params);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await inputService.delete(request.data.idInput);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.createInput.safeParse(req.body);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await inputService.create(request.data);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.updateInput.safeParse(req.body);
      if (!request.success) {
        res.status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await inputService.update(request.data);
      res
        .status(response.code)
        .json({ status: response.status, data: response.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({ message: err.message });
    }
  }

  async uploadDocument(req: Request, res: Response): Promise<void> {
    const request = schemas.uploadInputDocument.safeParse(req.body);
    if (!request.success) {
      res.status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) },
        });
      return;
    }

    const filePath = req.files
      ? (req.files.document as UploadedFile).tempFilePath
      : undefined;
    const response = await inputService.uploadDocument(request.data, filePath);
    res.status(response.code)
      .json({ status: response.status, data: response.data });
  }

  async download(req: Request, res: Response): Promise<void> {
    try {
      const buffer = await inputService.download();
      res.setHeader("Content-Disposition", "attachment; filename=\"insumos.xlsx\"");
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.end(buffer, "binary");

    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({
          status: StatusValue.Failed,
          data: { error: err.message },
        });
    }
  }

}

const inputController = new InputController();
export { inputController };