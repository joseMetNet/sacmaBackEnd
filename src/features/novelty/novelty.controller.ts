import { UploadedFile } from "express-fileupload";
import { Request, Response } from "express";
import * as schemas from "./novelty.schema";
import { StatusCode, StatusValue } from "../../utils/general.interfase";
import { noveltyService } from "./novelty.service";
import { formatZodError } from "../employee/utils";

class NoveltyController {
  constructor() { }

  async createNovelty(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.createNoveltySchema.safeParse(req.body);
      if (!request.success) {
        res
          .status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }

      const filePath = req.files?.document ? (req.files.document as UploadedFile).tempFilePath : undefined;

      const createdNovelty = await noveltyService.createNovelty(request.data, filePath);
      res
        .status(createdNovelty.code)
        .json({ status: createdNovelty.code, data: createdNovelty.data });
    }
    catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({
          status: StatusValue.Failed,
          data: { error: err.message },
        });
    }
  }

  async findNovelties(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.findEmployeeNoveltiesSchema.safeParse(req.query);
      if (!request.success) {
        res
          .status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const novelties = await noveltyService.findNovelties(request.data);
      res
        .status(novelties.code)
        .json({ status: novelties.code, data: novelties.data });
    }
    catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({
          status: StatusValue.Failed,
          data: { error: err.message },
        });
    }
  }

  findNoveltiesByModule(req: Request, res: Response): void {
    const request = schemas.findNoveltiesByModuleSchema.safeParse(req.query);
    if (!request.success) {
      res
        .status(StatusCode.BadRequest)
        .json({
          status: StatusValue.Failed,
          data: { error: formatZodError(request.error) },
        });
      return;
    }
    noveltyService.findNoveltiesByModule(request.data.module)
      .then((novelties) => {
        res
          .status(novelties.code)
          .json({ status: novelties.code, data: novelties.data });
      })
      .catch((err: any) => {
        res
          .status(StatusCode.InternalErrorServer)
          .json({
            status: StatusValue.Failed,
            data: { error: err.message },
          });
      });
  }

  async findNoveltyTypes(req: Request, res: Response): Promise<void> {
    try {
      const novelties = await noveltyService.findNoveltyTypes();
      res
        .status(novelties.code)
        .json({ status: novelties.code, data: novelties.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({
          status: StatusValue.Failed,
          data: { error: err.message },
        });
    }
  }

  async findPeriodicities(req: Request, res: Response): Promise<void> {
    try {
      const periodicities = await noveltyService.findPeriodicities();
      res
        .status(periodicities.code)
        .json({ status: periodicities.code, data: periodicities.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({
          status: StatusValue.Failed,
          data: { error: err.message },
        });
    }
  }

  async findNoveltyById(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.idNoveltySchema.safeParse(req.params);
      if (!request.success) {
        res
          .status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const novelty = await noveltyService.findNoveltyById(request.data.idEmployeeNovelty);
      res
        .status(novelty.code)
        .json({ status: novelty.code, data: novelty.data });
    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({
          status: StatusValue.Failed,
          data: { error: err.message },
        });
    }
  }

  async employeeNoveltiesToExcel(req: Request, res: Response): Promise<void> {
    try {
      const buffer = await noveltyService.createExcelFileBuffer();
      res.setHeader("Content-Disposition", "attachment; filename=\"novelties.xlsx\"");
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

  async updateNovelty(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.updateNoveltySchema.safeParse(req.body);
      if (!request.success) {
        res
          .status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }

      const filePath = req.files?.document ? (req.files.document as UploadedFile).tempFilePath : undefined;
      const updatedNovelty = await noveltyService.updateNovelty(request.data, filePath);
      res.status(200).json(updatedNovelty);

    } catch (err: any) {
      res
        .status(StatusCode.InternalErrorServer)
        .json({
          status: StatusValue.Failed,
          data: { error: err.message },
        });
    }
  }

  async deleteNovelty(req: Request, res: Response): Promise<void> {
    try {
      const request = schemas.idNoveltySchema.safeParse(req.params);
      if (!request.success) {
        res
          .status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await noveltyService.deleteEmployeeNovelty(request.data.idEmployeeNovelty);
      res.status(response.code).json({ status: response.status, data: response.data });
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

export const noveltyController = new NoveltyController();
