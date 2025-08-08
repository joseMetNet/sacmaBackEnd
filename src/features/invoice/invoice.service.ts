import { InvoiceRepository } from "./invoice.repository";
import { CreateInvoiceDTO, FindAllDTO, UpdateInvoiceDTO } from "./invoice.schema";
import { ResponseEntity } from "../employee/interface";
import { StatusCode } from "../../utils/general.interfase";
import { BuildResponse } from "../../utils/build-response";
import { CustomError, deleteFile, uploadFile } from "../../utils";
import crypto from "crypto";
import { CostCenterRepository } from "../cost-center/cost-center.repository";
import { Op } from "sequelize";
import { dbConnection } from "../../config/database";

export class InvoiceService {
  private readonly invoiceRepository: InvoiceRepository;
  private readonly costCenterRepository: CostCenterRepository;

  constructor(
    invoiceRepository: InvoiceRepository,
    costCenterRepository: CostCenterRepository
  ) {
    this.invoiceRepository = invoiceRepository;
    this.costCenterRepository = costCenterRepository;
  }

  create = async (invoiceData: CreateInvoiceDTO, filePath?: string): Promise<ResponseEntity> => {
    // Use database transaction for data consistency
    const transaction = await dbConnection.transaction();

    try {
      // Handle file upload first (fail fast if upload fails)
      let documentUrl: string | undefined = undefined;
      if (filePath) {
        const identifier = crypto.randomUUID();
        const contentType = "application/pdf";
        const uploadResponse = await uploadFile(filePath, identifier, contentType, "invoice");

        if (uploadResponse instanceof CustomError) {
          console.error("File upload failed:", uploadResponse);
          await transaction.rollback();
          return BuildResponse.buildErrorResponse(
            StatusCode.InternalErrorServer,
            { message: "Failed to upload document" }
          );
        }

        documentUrl = `https://sacmaback.blob.core.windows.net/invoice/${identifier}.pdf`;
      }

      const invoicePayload = {
        ...invoiceData,
        documentUrl,
        idInvoiceStatus: 1  // Default value for new invoices
      };

      // Create invoice within transaction
      const newInvoice = await this.invoiceRepository.create(invoicePayload);

      // Fetch project items with contract filter
      const projectItemsFilter = {
        idCostCenterProject: invoicePayload.idCostCenterProject,
        contract: { [Op.ne]: null }
      };

      const projectItemsResult = await this.costCenterRepository.findAllProjectItem(
        projectItemsFilter,
        100,
        0
      );

      const projectItems = projectItemsResult.rows;
      if (projectItems.length > 0) {
        console.log(`Processing ${projectItems.length} project items for invoice ${newInvoice.idInvoice}`);

        // Prepare invoice-project item relationships for bulk insert
        const invoiceProjectItems = projectItems.map(item => ({
          idInvoice: newInvoice.idInvoice,
          idProjectItem: item.idProjectItem,
          invoicedQuantity: item.invoicedQuantity,
          contract: item.contract
        }));

        // Bulk create invoice project items
        await this.invoiceRepository.bulkCreate(invoiceProjectItems);

        // get project item id and contract
        const projectItemData = projectItems.map(pi => ({
          projectItemId: pi.idProjectItem,
          contract: pi.contract
        }));
        // Update project items to set invoicedQuantity to null
        await this.costCenterRepository.setInvoicedQuantityToNull(projectItemData);
      }

      // Commit transaction
      await transaction.commit();

      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, newInvoice);

    } catch (err: unknown) {
      // Rollback transaction on any error
      await transaction.rollback();

      console.error("Error creating invoice:", err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err instanceof Error ? err.message : "Unknown error occurred while creating invoice" }
      );
    }
  };

  findById = async (id: number): Promise<ResponseEntity> => {
    try {
      const data = await this.invoiceRepository.findById(id);
      if (!data) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Invoice not found" }
        );
      }

      // Calculate totalValue for this invoice
      const invoiceProjectItems = await this.invoiceRepository.findAllInvoiceProjectItems();
      const totalValue = invoiceProjectItems
        .find(item => item.idInvoice === data.idInvoice && item.contract === data.contract)
        ?.invoicedQuantity || 0;

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        ...data.toJSON(),
        totalValue
      });
    }
    catch (err: unknown) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err instanceof Error ? err.message : "Unknown error" }
      );
    }
  };

  findAll = async (request: FindAllDTO): Promise<ResponseEntity> => {
    try {
      const filter = this.buildFindAllFilter(request);
      const { limit, offset, page, pageSize } = this.getPagination(request);

      const data = await this.invoiceRepository.findAll(
        filter,
        limit,
        offset
      );

      if (data.rows.length === 0) {
        return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
          data: [],
          totalItems: data.count,
          currentPage: page,
          totalPages: Math.ceil(data.count / pageSize)
        });
      }

      // Extract unique contracts and cost center project IDs for batch processing
      const invoiceProjectItems = await this.invoiceRepository.findAllInvoiceProjectItems();
      const costCenters = await this.costCenterRepository.findClients();

      const responseData = data.rows.map(invoice => {
        const totalValue = invoiceProjectItems
          .find(item => item.idInvoice === invoice.idInvoice && item.contract === invoice.contract)
          ?.invoicedQuantity || 0;

        // Find the corresponding cost center project for this invoice, CostCenterProject is assumed to be included in the invoice model
        // and can be null, idCostCenterProject is a field of the CostCenterProject model
        // so we have CostCenter -> CostCenterProject -> idCostCenterProject
        const costCenterProject = costCenters.filter(cc =>
          cc.CostCenterProjects &&
          Array.isArray(cc.CostCenterProjects) &&
          cc.CostCenterProjects.find((ccp: any) => ccp.idCostCenterProject === invoice.idCostCenterProject)
        );
        console.log(JSON.stringify(costCenterProject));
        return {
          ...invoice.toJSON(),
          totalValue,
          client: costCenterProject && costCenterProject.length > 0 ? costCenterProject[0].name : null
        };
      });

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: responseData,
        totalItems: data.count,
        currentPage: page,
        totalPages: Math.ceil(data.count / pageSize)
      });
    } catch (err: unknown) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err instanceof Error ? err.message : "Unknown error" }
      );
    }
  };

  update = async (invoiceData: UpdateInvoiceDTO, filePath?: string): Promise<ResponseEntity> => {
    try {
      const invoice = await this.invoiceRepository.findById(invoiceData.idInvoice);
      if (!invoice) {
        return BuildResponse.buildErrorResponse(
          StatusCode.NotFound,
          { message: "Invoice not found" }
        );
      }

      let documentUrl = invoiceData.documentUrl;
      if (filePath) {
        // if documentUrl is provided, remove the old file
        if (documentUrl) {
          const oldIdentifier = documentUrl.split("/").pop()?.split(".")[0];
          if (oldIdentifier) {
            const oldFilePath = `invoice/${oldIdentifier}.pdf`;
            const deleteResponse = await deleteFile(oldFilePath, "invoice");
            if (deleteResponse instanceof CustomError) {
              console.error(deleteResponse);
              return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to delete old document" });
            }
          }
        }
        const identifier = crypto.randomUUID();
        const contentType = "application/pdf";
        const response = await uploadFile(filePath, identifier, contentType, "invoice");
        if (response instanceof CustomError) {
          console.error(response);
          return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "Failed to upload document" });
        }
        documentUrl = `https://sacmaback.blob.core.windows.net/invoice/${identifier}.pdf`;
      }

      const updatePayload = {
        ...invoiceData,
        documentUrl
      };

      const [, [updatedInvoice]] = await this.invoiceRepository.update(updatePayload);
      return BuildResponse.buildSuccessResponse(
        StatusCode.Ok,
        updatedInvoice
      );
    } catch (err: unknown) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err instanceof Error ? err.message : "Unknown error" }
      );
    }
  };

  delete = async (id: number): Promise<ResponseEntity> => {
    try {
      const response = await this.invoiceRepository.delete(id);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { deleted: response > 0 });
    } catch (err: unknown) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err instanceof Error ? err.message : "Unknown error" }
      );
    }
  };

  findAllInvoiceStatus = async (): Promise<ResponseEntity> => {
    try {
      const data = await this.invoiceRepository.findAllInvoiceStatus();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    } catch (err: unknown) {
      console.error(err);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: err instanceof Error ? err.message : "Unknown error" }
      );
    }
  };

  private buildFindAllFilter(request: FindAllDTO): Record<string, unknown> {
    const filter: Record<string, unknown> = {};

    if (request.idCostCenterProject) {
      filter.idCostCenterProject = request.idCostCenterProject;
    }

    if (request.idInvoiceStatus) {
      filter.idInvoiceStatus = request.idInvoiceStatus;
    }

    if (request.invoice) {
      filter.invoice = {
        [Op.like]: `%${request.invoice}%`
      };
    }

    return filter;
  }

  private getPagination = (request: { page?: number, pageSize?: number }) => {
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    return { page, pageSize, limit, offset };
  };
}

export const invoiceService = new InvoiceService(
  new InvoiceRepository(),
  new CostCenterRepository()
);