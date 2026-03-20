import { Request, Response } from "express";
import { IncomeDiscountInvoiceService } from "./incomeDiscountsInvoice.service";
import * as schemas from "./incomeDiscountsInvoice.schema";

export class IncomeDiscountInvoiceController {
  private readonly incomeDiscountInvoiceService: IncomeDiscountInvoiceService;

  constructor(incomeDiscountInvoiceService: IncomeDiscountInvoiceService) {
    this.incomeDiscountInvoiceService = incomeDiscountInvoiceService;
  }

  /**
   * @swagger
   * /api/v1/income-discount-invoice:
   *   get:
   *     summary: Get all income discount invoices
   *     tags: [Income Discount Invoice]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Page number
   *       - in: query
   *         name: pageSize
   *         schema:
   *           type: integer
   *         description: Number of items per page
   *       - in: query
   *         name: idIncomeDiscountInvoice
   *         schema:
   *           type: integer
   *         description: Filter by income discount invoice ID
   *       - in: query
   *         name: idExpenditureType
   *         schema:
   *           type: integer
   *         description: Filter by expenditure type ID
   *       - in: query
   *         name: idCostCenterProject
   *         schema:
   *           type: integer
   *         description: Filter by cost center project ID
   *       - in: query
   *         name: idInvoice
   *         schema:
   *           type: integer
   *         description: Filter by invoice ID
   *       - in: query
   *         name: refundRequestDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter by refund request date
   *       - in: query
   *         name: isActive
   *         schema:
   *           type: boolean
   *         description: Filter by active status
   *     responses:
   *       200:
   *         description: Success
   *       500:
   *         description: Internal server error
   */
  findAll = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.findAllIncomeDiscountInvoiceSchema.safeParse(req.query);

    if (!request.success) {
      res.status(400).json({
        status: "FAILED",
        message: "Invalid request parameters",
        errors: request.error.errors,
      });
      return;
    }

    const response = await this.incomeDiscountInvoiceService.findAll(request.data);
    res.status(response.code).json(response);
  };

  /**
   * @swagger
   * /api/v1/income-discount-invoice/{idIncomeDiscountInvoice}:
   *   get:
   *     summary: Get income discount invoice by ID
   *     tags: [Income Discount Invoice]
   *     parameters:
   *       - in: path
   *         name: idIncomeDiscountInvoice
   *         required: true
   *         schema:
   *           type: integer
   *         description: Income discount invoice ID
   *     responses:
   *       200:
   *         description: Success
   *       404:
   *         description: Income discount invoice not found
   *       500:
   *         description: Internal server error
   */
  findById = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idIncomeDiscountInvoiceSchema.safeParse(req.params);

    if (!request.success) {
      res.status(400).json({
        status: "FAILED",
        message: "Invalid income discount invoice ID",
        errors: request.error.errors,
      });
      return;
    }

    // const idIncome = parseInt(request.data.idIncome);
    const response = await this.incomeDiscountInvoiceService.findById(request.data.idIncome);
    res.status(response.code).json(response);
  };

  /**
   * @swagger
   * /api/v1/income-discount-invoice:
   *   post:
   *     summary: Create a new income discount invoice
   *     tags: [Income Discount Invoice]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               value:
   *                 type: number
   *                 description: Invoice value
   *               idExpenditureType:
   *                 type: integer
   *                 description: Expenditure type ID
   *               idCostCenterProject:
   *                 type: integer
   *                 description: Cost center project ID
   *               idInvoice:
   *                 type: integer
   *                 description: Invoice ID
   *               refundRequestDate:
   *                 type: string
   *                 format: date
   *                 description: Refund request date
   *               advance:
   *                 type: number
   *                 description: Advance amount
   *               reteguarantee:
   *                 type: number
   *                 description: Guarantee retention
   *               retesource:
   *                 type: number
   *                 description: Source retention
   *               reteica:
   *                 type: number
   *                 description: ICA retention
   *               fic:
   *                 type: number
   *                 description: FIC amount
   *               other:
   *                 type: number
   *                 description: Other discounts
   *     responses:
   *       201:
   *         description: Income discount invoice created successfully
   *       400:
   *         description: Invalid request data
   *       500:
   *         description: Internal server error
   */
  create = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.createIncomeDiscountInvoiceSchema.safeParse(req.body);

    if (!request.success) {
      res.status(400).json({
        status: "FAILED",
        message: "Invalid request data",
        errors: request.error.errors,
      });
      return;
    }

    const response = await this.incomeDiscountInvoiceService.create(request.data);
    res.status(response.code).json(response);
  };

  /**
   * @swagger
   * /api/v1/income-discount-invoice/{idIncomeDiscountInvoice}:
   *   put:
   *     summary: Update income discount invoice
   *     tags: [Income Discount Invoice]
   *     parameters:
   *       - in: path
   *         name: idIncomeDiscountInvoice
   *         required: true
   *         schema:
   *           type: integer
   *         description: Income discount invoice ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               value:
   *                 type: number
   *                 description: Invoice value
   *               idExpenditureType:
   *                 type: integer
   *                 description: Expenditure type ID
   *               idCostCenterProject:
   *                 type: integer
   *                 description: Cost center project ID
   *               idInvoice:
   *                 type: integer
   *                 description: Invoice ID
   *               refundRequestDate:
   *                 type: string
   *                 format: date
   *                 description: Refund request date
   *               advance:
   *                 type: number
   *                 description: Advance amount
   *               reteguarantee:
   *                 type: number
   *                 description: Guarantee retention
   *               retesource:
   *                 type: number
   *                 description: Source retention
   *               reteica:
   *                 type: number
   *                 description: ICA retention
   *               fic:
   *                 type: number
   *                 description: FIC amount
   *               other:
   *                 type: number
   *                 description: Other discounts
   *               isActive:
   *                 type: boolean
   *                 description: Active status
   *     responses:
   *       200:
   *         description: Income discount invoice updated successfully
   *       400:
   *         description: Invalid request data
   *       404:
   *         description: Income discount invoice not found
   *       500:
   *         description: Internal server error
   */
  update = async (req: Request, res: Response): Promise<void> => {
    const paramsRequest = schemas.idIncomeDiscountInvoiceSchema.safeParse(req.params);
    const bodyRequest = schemas.updateIncomeDiscountInvoiceSchema.safeParse({
      ...req.body,
      idIncomeDiscountInvoice: parseInt(req.params.idIncomeDiscountInvoice),
    });

    if (!paramsRequest.success || !bodyRequest.success) {
      res.status(400).json({
        status: "FAILED",
        message: "Invalid request data",
        errors: [...(paramsRequest.error?.errors || []), ...(bodyRequest.error?.errors || [])],
      });
      return;
    }

    const response = await this.incomeDiscountInvoiceService.update(bodyRequest.data);
    res.status(response.code).json(response);
  };

  /**
   * @swagger
   * /api/v1/income-discount-invoice/{idIncomeDiscountInvoice}:
   *   delete:
   *     summary: Delete income discount invoice
   *     tags: [Income Discount Invoice]
   *     parameters:
   *       - in: path
   *         name: idIncomeDiscountInvoice
   *         required: true
   *         schema:
   *           type: integer
   *         description: Income discount invoice ID
   *     responses:
   *       200:
   *         description: Income discount invoice deleted successfully
   *       404:
   *         description: Income discount invoice not found
   *       500:
   *         description: Internal server error
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idIncomeDiscountInvoiceSchema.safeParse(req.params);

    if (!request.success) {
      res.status(400).json({
        status: "FAILED",
        message: "Invalid income discount invoice ID",
        errors: request.error.errors,
      });
      return;
    }

    // const idIncomeDiscountInvoice = parseInt(request.data.idIncome);
    const response = await this.incomeDiscountInvoiceService.delete(request.data.idIncome);
    res.status(response.code).json(response);
  };

  /**
   * @swagger
   * /api/v1/income-discount-invoice/{idIncomeDiscountInvoice}/soft-delete:
   *   patch:
   *     summary: Soft delete income discount invoice
   *     tags: [Income Discount Invoice]
   *     parameters:
   *       - in: path
   *         name: idIncomeDiscountInvoice
   *         required: true
   *         schema:
   *           type: integer
   *         description: Income discount invoice ID
   *     responses:
   *       200:
   *         description: Income discount invoice soft deleted successfully
   *       404:
   *         description: Income discount invoice not found
   *       500:
   *         description: Internal server error
   */
  softDelete = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idIncomeDiscountInvoiceSchema.safeParse(req.params);

    if (!request.success) {
      res.status(400).json({
        status: "FAILED",
        message: "Invalid income discount invoice ID",
        errors: request.error.errors,
      });
      return;
    }

    // const idIncomeDiscountInvoice = parseInt(request.data.idIncome);
    const response = await this.incomeDiscountInvoiceService.softDelete(request.data.idIncome);
    res.status(response.code).json(response);
  };

  /**
   * @swagger
   * /api/v1/income-discount-invoice/{idIncomeDiscountInvoice}/restore:
   *   patch:
   *     summary: Restore income discount invoice
   *     tags: [Income Discount Invoice]
   *     parameters:
   *       - in: path
   *         name: idIncomeDiscountInvoice
   *         required: true
   *         schema:
   *           type: integer
   *         description: Income discount invoice ID
   *     responses:
   *       200:
   *         description: Income discount invoice restored successfully
   *       404:
   *         description: Income discount invoice not found
   *       500:
   *         description: Internal server error
   */
  restore = async (req: Request, res: Response): Promise<void> => {
    const request = schemas.idIncomeDiscountInvoiceSchema.safeParse(req.params);

    if (!request.success) {
      res.status(400).json({
        status: "FAILED",
        message: "Invalid income discount invoice ID",
        errors: request.error.errors,
      });
      return;
    }

    // const idIncomeDiscountInvoice = parseInt(request.data.idIncome);
    const response = await this.incomeDiscountInvoiceService.restore(request.data.idIncome);
    res.status(response.code).json(response);
  };
}