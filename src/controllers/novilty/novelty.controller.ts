import { StatusCode, StatusValue } from "../../interfaces";
import { noveltyService } from "../../services";
import { formatZodError } from "../utils";
import { findEmployeeNoveltiesSchema, idNoveltySchema, updateNoveltySchema } from "./novelty.schema";
import { Request, Response } from "express";

class NoveltyController {
  constructor() { }

  async createNovelty(req: Request, res: Response): Promise<void> {
    const novelty = req.body;
    const createdNovelty = await noveltyService.createNovelty(novelty);
    res.status(201).json(createdNovelty);
  }

  async findNovelties(req: Request, res: Response): Promise<void> {
    try {
      const request = findEmployeeNoveltiesSchema.safeParse(req.query);
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

  async findNoveltyById(req: Request, res: Response): Promise<void> {
    try {
      const request = idNoveltySchema.safeParse(req.params);
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

  async updateNovelty(req: Request, res: Response): Promise<void> {
    try {
      const request = updateNoveltySchema.safeParse(req.body);
      if (!request.success) {
        res
          .status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const updatedNovelty = await noveltyService.updateNovelty(request.data);
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
      const request = idNoveltySchema.safeParse(req.params);
      if (!request.success) {
        res
          .status(StatusCode.BadRequest)
          .json({
            status: StatusValue.Failed,
            data: { error: formatZodError(request.error) },
          });
        return;
      }
      const response = await noveltyService.deleteNovelty(request.data.idEmployeeNovelty);
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
