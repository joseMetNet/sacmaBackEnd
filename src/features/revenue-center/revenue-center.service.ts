import { RevenueCenterRepository } from "./revenue-center.repository";
import { ResponseEntity } from "../employee/interface";
import { BuildResponse } from "../../utils/build-response";
import { findPagination, StatusCode } from "../../utils/general.interfase";
import { IRevenueCenterUpdate } from "./revenue-center.interface";
import * as schemas from "./revenue-center.schema";
import { ExpenditureRepository } from "../expenditure";
import { CostCenterRepository } from "../cost-center/cost-center.repository";
import { QuotationRepository } from "../quotation/quotation.repository";
import { InvoiceRepository } from "../invoice/invoice.repository";
import { InvoiceProjectItem } from "../invoice";

export class RevenueCenterService {
  private readonly revenueCenterRepository: RevenueCenterRepository;
  private readonly expenditureRepository: ExpenditureRepository;
  private readonly costCenterRepository: CostCenterRepository;
  private readonly quotationRepository: QuotationRepository;
  private readonly invoiceRepository: InvoiceRepository;
  constructor(
    revenueCenterRepository: RevenueCenterRepository,
    expenditureRepository: ExpenditureRepository,
    costCenterRepository: CostCenterRepository,
    quotationRepository: QuotationRepository,
    invoiceRepository: InvoiceRepository
  ) {
    this.revenueCenterRepository = revenueCenterRepository;
    this.expenditureRepository = expenditureRepository;
    this.costCenterRepository = costCenterRepository;
    this.quotationRepository = quotationRepository;
    this.invoiceRepository = invoiceRepository;
  }

  findAll = async (request: schemas.FindAllSchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      const filter = this.buildFilter(request);

      // ✅ Solo traemos de la BD
      const revenueCenters = await this.revenueCenterRepository.findAll(limit, offset, filter);

      const rows = revenueCenters.rows.map((revenueCenter: any) => ({
        idRevenueCenter: revenueCenter.idRevenueCenter,
        name: revenueCenter.name,
        idCostCenterProject: revenueCenter.idCostCenterProject,
        idRevenueCenterStatus: revenueCenter.idRevenueCenterStatus,
        idQuotation: revenueCenter.idQuotation,
        fromDate: revenueCenter.fromDate,
        toDate: revenueCenter.toDate,
        createdAt: revenueCenter.createdAt,
        updatedAt: revenueCenter.updatedAt,
        invoice: revenueCenter.invoice,   // ✅ directo de la BD
        spend: revenueCenter.spend,       // ✅ directo de la BD
        utility: revenueCenter.utility,   // ✅ directo de la BD
        CostCenterProject: revenueCenter.toJSON().CostCenterProject,
      }));

      const response = {
        data: rows,
        totalItems: revenueCenters.count,
        currentPage: page,
        totalPage: Math.ceil(revenueCenters.count / pageSize),
      };

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error) {
      console.error("An error occurred while trying to find all revenue centers", error);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "An error occurred while trying to find all revenue centers" }
      );
    }
  };


  findAllOriginCalculatedsEfraim = async (request: schemas.FindAllSchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      const filter = this.buildFilter(request);

      // Fetch data concurrently
      const [revenueCenters, inputs, expenditures] = await Promise.all([
        this.revenueCenterRepository.findAll(limit, offset, filter),
        this.revenueCenterRepository.findInputValues(),
        this.expenditureRepository.findAllValues(),
      ]);

      // Combine inputs and expenditures and group them in one pass
      const groupedSpend = [...inputs, ...expenditures].reduce<Record<number, number>>((acc, curr) => {
        const key = curr.idCostCenterProject;
        acc[key] = (acc[key] || 0) + curr.totalValue;
        return acc;
      }, {});

      const rows = revenueCenters.rows.map((revenueCenter) => {
        const spend = groupedSpend[revenueCenter.idCostCenterProject] || 0;
        return {
          idRevenueCenter: revenueCenter.idRevenueCenter,
          name: revenueCenter.name,
          idCostCenterProject: revenueCenter.idCostCenterProject,
          idRevenueCenterStatus: revenueCenter.idRevenueCenterStatus,
          idQuotation: revenueCenter.idQuotation,
          fromDate: revenueCenter.fromDate,
          toDate: revenueCenter.toDate,
          createdAt: revenueCenter.createdAt,
          updatedAt: revenueCenter.updatedAt,
          invoice: "0.0", // Consider if this needs calculation
          spend: spend.toString(), // Ensure spend is a string if needed, or keep as number
          utility: "0.0", // Consider if this needs calculation
          CostCenterProject: revenueCenter.toJSON().CostCenterProject,
        };
      });

      const response = {
        data: rows,
        totalItems: revenueCenters.count,
        currentPage: page,
        totalPage: Math.ceil(revenueCenters.count / pageSize),
      };

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error) {
      console.error("An error occurred while trying to find all revenue centers", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all revenue centers" });
    }
  };

  findById = async (idRevenueCenter: number): Promise<ResponseEntity> => {
    try {
      const revenueCenter = await this.revenueCenterRepository.findById(idRevenueCenter);
      if (!revenueCenter) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Revenue center not found" });
      }

      const response = {
        idRevenueCenter: revenueCenter.idRevenueCenter,
        name: revenueCenter.name,
        idCostCenterProject: revenueCenter.idCostCenterProject,
        idRevenueCenterStatus: revenueCenter.idRevenueCenterStatus,
        idQuotation: revenueCenter.idQuotation,
        fromDate: revenueCenter.fromDate,
        toDate: revenueCenter.toDate,
        createdAt: revenueCenter.createdAt,
        updatedAt: revenueCenter.updatedAt,
        // Assuming these fields are calculated or fetched from another source
        // Replace with actual logic to fetch these values 
        invoice: "0.0",
        spend: "0.0",
        utility: "0.0"
      };

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error) {
      console.error("An error occurred while trying to find revenue center by id", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find revenue center by id" });
    }
  };

  create = async (request: schemas.CreateRevenueCenterSchema): Promise<ResponseEntity> => {
    try {
      // 1️⃣ Crear el revenue center en la BD
      const revenueCenter = await this.revenueCenterRepository.create(request);

      // 2️⃣ Obtener inputs y expenditures relacionados al proyecto
      const [inputs, expenditures] = await Promise.all([
        this.revenueCenterRepository.findInputValues(),
        this.expenditureRepository.findAllValues(),
      ]);

      // 3️⃣ Agrupar los valores
      const groupedSpend = [...inputs, ...expenditures].reduce<Record<number, number>>((acc, curr) => {
        const key = curr.idCostCenterProject;
        acc[key] = (acc[key] || 0) + curr.totalValue;
        return acc;
      }, {});

      // 4️⃣ Calcular el spend para este revenue center recién creado
      const spend = groupedSpend[revenueCenter.idCostCenterProject] || 0;

      // 5️⃣ Opcional: persistir el valor calculado en la BD
      await this.revenueCenterRepository.update(revenueCenter.idRevenueCenter, {
        spend: spend.toString(),
      });

      // 6️⃣ Respuesta con los valores finales
      const response = {
        idRevenueCenter: revenueCenter.idRevenueCenter,
        name: revenueCenter.name,
        idCostCenterProject: revenueCenter.idCostCenterProject,
        idRevenueCenterStatus: revenueCenter.idRevenueCenterStatus,
        idQuotation: revenueCenter.idQuotation,
        fromDate: revenueCenter.fromDate,
        toDate: revenueCenter.toDate,
        createdAt: revenueCenter.createdAt,
        updatedAt: revenueCenter.updatedAt,
        invoice: "0.0",                // puedes dejarlo fijo o calcularlo similar
        spend: spend.toString(),       // 👈 ya viene del cálculo
        utility: "0.0",                // pendiente cálculo
      };

      console.log("🔍 groupedSpend:", groupedSpend);
      console.log("🔍 Buscando id:", revenueCenter.idCostCenterProject);
      console.log("🔍 Valor encontrado:", groupedSpend[revenueCenter.idCostCenterProject]);

      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, response);
    } catch (error) {
      console.error("An error occurred while trying to create revenue center", error);
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        { message: "An error occurred while trying to create revenue center" }
      );
    }
  };

  createOrigin = async (request: schemas.CreateRevenueCenterSchema): Promise<ResponseEntity> => {
    try {
      //const createData: IRevenueCenterCreate = {
      //  name: request.name,
      //  idCostCenterProject: request.idCostCenterProject,
      //  idRevenueCenterStatus: request.idRevenueCenterStatus,
      //  idQuotation: request.idQuotation,
      //  fromDate: request.fromDate,
      //  toDate: request.toDate,
      //};
      const revenueCenter = await this.revenueCenterRepository.create(request);
      const response = {
        idRevenueCenter: revenueCenter.idRevenueCenter,
        name: revenueCenter.name,
        idCostCenterProject: revenueCenter.idCostCenterProject,
        idRevenueCenterStatus: revenueCenter.idRevenueCenterStatus,
        idQuotation: revenueCenter.idQuotation,
        fromDate: revenueCenter.fromDate,
        toDate: revenueCenter.toDate,
        createdAt: revenueCenter.createdAt,
        updatedAt: revenueCenter.updatedAt,
        // Assuming these fields are calculated or fetched from another source
        // Replace with actual logic to fetch these values 
        invoice: "0.0",
        spend: "0.0",
        utility: "0.0"
      };

      return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, response);
    } catch (error) {
      console.error("An error occurred while trying to create revenue center", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to create revenue center" });
    }
  };

  update = async (request: schemas.UpdateRevenueCenterSchema): Promise<ResponseEntity> => {
    try {
      const revenueCenter = await this.revenueCenterRepository.findById(request.idRevenueCenter);
      if (!revenueCenter) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Revenue center not found" });
      }

      const { idRevenueCenter, ...updateData } = request;

      // // 🔹 Aquí calculamos el spend real
      // const [inputs, expenditures] = await Promise.all([
      //   this.revenueCenterRepository.findInputValues(),
      //   this.expenditureRepository.findAllValues(),
      // ]);

      // // Agrupar como en findAll
      // const groupedSpend = [...inputs, ...expenditures].reduce<Record<number, number>>((acc, curr) => {
      //   const key = curr.idCostCenterProject;
      //   acc[key] = (acc[key] || 0) + curr.totalValue;
      //   return acc;
      // }, {});

      // // Buscar el spend específico de este RevenueCenter
      // const calculatedSpend = groupedSpend[revenueCenter.idCostCenterProject] || 0;


      const updatePayload: IRevenueCenterUpdate = {
        name: updateData.name,
        idCostCenterProject: updateData.idCostCenterProject,
        idRevenueCenterStatus: updateData.idRevenueCenterStatus,
        idQuotation: updateData.idQuotation,
        fromDate: updateData.fromDate,
        toDate: updateData.toDate,
        invoice: updateData.invoice ?? "0.0",   // 👈 nuevo
        // spend: calculatedSpend.toString(),       // 👈 nuevo
        spend: updateData.spend,       // 👈 nuevo
        utility: updateData.utility ?? "0.0"    // 👈 nuevo
      };
      await this.revenueCenterRepository.update(idRevenueCenter, updatePayload);

      // Volvemos a consultar el registro actualizado
      // const updatedRevenueCenter = await this.revenueCenterRepository.findById(idRevenueCenter);

      const response = {
        idRevenueCenter: revenueCenter.idRevenueCenter,
        name: revenueCenter.name,
        idCostCenterProject: revenueCenter.idCostCenterProject,
        idRevenueCenterStatus: revenueCenter.idRevenueCenterStatus,
        idQuotation: revenueCenter.idQuotation,
        fromDate: revenueCenter.fromDate,
        toDate: revenueCenter.toDate,
        createdAt: revenueCenter.createdAt,
        updatedAt: revenueCenter.updatedAt,
        // Assuming these fields are calculated or fetched from another source
        // Replace with actual logic to fetch these values 
        invoice: revenueCenter.invoice,
        spend: revenueCenter.spend,
        utility: revenueCenter.utility
      };

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error) {
      console.error("An error occurred while trying to update revenue center", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to update revenue center" });
    }
  };

  

  delete = async (idRevenueCenter: number): Promise<ResponseEntity> => {
    try {
      const revenueCenter = await this.revenueCenterRepository.findById(idRevenueCenter);
      if (!revenueCenter) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Revenue center not found" });
      }

      await this.revenueCenterRepository.delete(idRevenueCenter);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: "Revenue center deleted successfully" });
    } catch (error) {
      console.error("An error occurred while trying to delete revenue center", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to delete revenue center" });
    }
  };

  findAllMaterial = async (request: schemas.FindAllMaterialSchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      const filter = {
        idRevenueCenter: request.idRevenueCenter,
        idInputType: 1
      };
      const inputs = await this.revenueCenterRepository.findAllInput(limit, offset, filter);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: inputs.rows,
        totalItems: inputs.count,
        currentPage: page,
        totalPage: Math.ceil(inputs.count / pageSize),
        total: inputs.totalRows.reduce((acc: number, curr: any) => acc + curr.totalValue, 0),
      });
    } catch (error) {
      console.error("An error occurred while trying to find all materials", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all materials" });
    }
  };

  findAllInputs = async (request: schemas.FindAllInputsSchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      const filter = {
        idRevenueCenter: request.idRevenueCenter,
        idInputType: 3,
      };
      const inputs = await this.revenueCenterRepository.findAllInput(limit, offset, filter);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: inputs.rows,
        totalItems: inputs.count,
        currentPage: page,
        totalPage: Math.ceil(inputs.count / pageSize),
        total: inputs.totalRows.reduce((acc: number, curr: any) => acc + curr.totalValue, 0),
      });
    } catch (error) {
      console.error("An error occurred while trying to find all inputs", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all inputs" });
    }
  };

  findAllEpp = async (request: schemas.FindAllEppSchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      const filter = {
        idRevenueCenter: request.idRevenueCenter,
        idInputType: 2
      };

      const inputs = await this.revenueCenterRepository.findAllInput(limit, offset, filter);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: inputs.rows,
        totalItems: inputs.count,
        currentPage: page,
        totalPage: Math.ceil(inputs.count / pageSize),
        total: inputs.totalRows.reduce((acc: number, curr: any) => acc + curr.totalValue, 0),
      });
    } catch (error) {
      console.error("An error occurred while trying to find all EPP", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all EPP" });
    }
  };

  /**
   * Retrieve all expenditures for a revenue center (no type filter)
   */
  findAllExpenditures = async (request: schemas.FindAllExpendituresSchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      // Get the revenue center to obtain cost center project
      const revenueCenter = await this.revenueCenterRepository.findById(request.idRevenueCenter);
      if (!revenueCenter) {
        return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
          data: [],
          totalItems: 0,
          currentPage: page,
          totalPage: 0,
          total: 0,
        });
      }
      // Filter only by cost center project
      const filter = { idCostCenterProject: revenueCenter.idCostCenterProject };

      // Fetch paginated data and all data for total calculation
      const [expenditures, allExpenditures] = await Promise.all([
        this.expenditureRepository.findAll(limit, offset, filter),
        this.expenditureRepository.findAll(999999, 0, filter) // Get all records for total calculation
      ]);

      const rows = expenditures.rows.map((item) => ({
        idCostCenterProject: item.idCostCenterProject,
        description: item.description,
        unitValue: item.value,
        totalValue: item.value,
        quantity: 1,
        orderNumber: item.orderNumber,
        refundRequestDate: item.refundRequestDate,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        projectName: item.toJSON().CostCenterProject.name,
      }));

      // Calculate total from all records
      const total = allExpenditures.rows.reduce((acc: number, curr: any) => acc + curr.value, 0);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: rows,
        totalItems: expenditures.count,
        currentPage: page,
        totalPage: Math.ceil(expenditures.count / pageSize),
        total: total,
      });
    } catch (error) {
      console.error("An error occurred while trying to find all expenditures", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all expenditures" });
    }
  };

  findAllQuotation = async (request: schemas.FindAllQuotationSchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      const filter = {
        idRevenueCenter: request.idRevenueCenter
      };

      const quotations = await this.revenueCenterRepository.findAllQuotation(limit, offset, filter);

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: quotations.rows,
        totalItems: quotations.count,
        currentPage: page,
        totalPage: Math.ceil(quotations.count / pageSize),
        total: quotations.totalRows.reduce((acc: number, curr: any) => acc + (parseFloat(curr.totalCost) || 0), 0),
      });
    } catch (error) {
      console.error("An error occurred while trying to find all quotations", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all quotations" });
    }
  };

  findAllRevenueCenterStatus = async (): Promise<ResponseEntity> => {
    try {
      const data = await this.revenueCenterRepository.findAllRevenueCenterStatus();
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, data);
    } catch (error) {
      console.error("An error occurred while trying to find all revenue center statuses", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all revenue center statuses" });
    }
  };

  findAllContractedSummary = async (request: schemas.FindAllContractedSummarySchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);

      // First, find the revenue center to get the idCostCenterProject
      const revenueCenter = await this.revenueCenterRepository.findById(request.idRevenueCenter);
      if (!revenueCenter) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, {
          message: "Revenue center not found"
        });
      }

      // Now use the idCostCenterProject to find project items
      const filter = { idCostCenterProject: revenueCenter.idCostCenterProject };
      const data = await this.costCenterRepository.findAllProjectItem(filter, limit, offset);

      const rows = data.rows.map((item) => ({
        material: item.item,
        quantity: item.quantity,
        subTotal: parseFloat(item.unitPrice).toFixed(2),
        totalValue: (parseFloat(item.quantity) * parseFloat(item.unitPrice)).toFixed(2),
        total: (parseFloat(item.quantity) * (parseFloat(item.quantity) * parseFloat(item.unitPrice)) * 1.1557).toFixed(2),
      }));

      const response = {
        data: rows,
        totalItems: data.count,
        currentPage: page,
        totalPages: Math.ceil(data.count / pageSize),
        total: rows.reduce((acc: number, curr: any) => acc + parseFloat(curr.total), 0),
      };

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
    } catch (error) {
      console.error("An error occurred while trying to find project items for revenue center", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "An error occurred while trying to find project items for revenue center"
      });
    }
  };

  /**
   * Find work tracking entries for a revenue center
   */
  findAllWorkTracking = async (request: schemas.FindAllWorkTrackingSchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);
      const filter = {
        idRevenueCenter: request.idRevenueCenter,
        ...(request.idCostCenterProject && { idCostCenterProject: request.idCostCenterProject }),
      };
      const workTrackingData = await this.revenueCenterRepository.findAllWorkTracking(limit, offset, filter);
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: workTrackingData.rows,
        totalItems: workTrackingData.count,
        currentPage: page,
        totalPage: Math.ceil(workTrackingData.count / pageSize),
        total: workTrackingData.totalRows.reduce((acc: number, curr: any) => acc + (parseFloat(curr.monthlyTotal) || 0), 0),
      });
    } catch (error) {
      console.error("An error occurred while trying to find all work tracking data", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find all work tracking data" });
    }
  };

  findAllInvoiceSummaryEfrain = async (request: schemas.FindAllInvoiceSummarySchema): Promise<ResponseEntity> => {
    try {
      // First, find the revenue center to get the idCostCenterProject
      const revenueCenter = await this.revenueCenterRepository.findById(request.idRevenueCenter);
      if (!revenueCenter) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, {
          message: "Revenue center not found"
        });
      }

      // Now use the idCostCenterProject to find project items
      const filter = { idCostCenterProject: revenueCenter.idCostCenterProject };
      const data = await this.costCenterRepository.findAllProjectItem(filter, -1, 0); // Get all items without pagination
      const invoices = await this.invoiceRepository.findAllByRenueveCenter({}, -1, 0);
      const invoiceProjectItemData = await this.invoiceRepository.findAllInvoiceProjectItems(); // Get all invoices without pagination

      // Group items by contract number without aggregation
      const contractGroups: Record<string, Array<{
        idProjectItem: number;
        projectItem: string;
        unitMeasure: string;
        quantity: number;
        unitPrice: number;
        total: number;
        invoicedQuantity: number | null;
        invoiceGroups: Record<string, Array<any>>;
      }>> = {};

      data.rows.forEach((item) => {
        const contractNumber = item.contract;

        // Initialize contract group if it doesn't exist
        if (!contractGroups[contractNumber]) {
          contractGroups[contractNumber] = [];
        }

        // Add the complete item to the contract group
        contractGroups[contractNumber].push({
          idProjectItem: item.idProjectItem,
          projectItem: item.item,
          unitMeasure: item.unitMeasure,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          total: parseFloat(item.total),
          invoicedQuantity: item.invoicedQuantity ? parseFloat(item.invoicedQuantity) : null,
          invoiceGroups: {
            items: invoiceProjectItemData
              .filter((invItem) => invItem.idProjectItem === item.idProjectItem)
              .map((invItem) => ({
                invoice: invoices.rows.find(i => i.idInvoice === invItem.idInvoice)?.invoice || "Unknown",
                quantity: parseFloat(invItem.invoicedQuantity),
                total: parseFloat(invItem.invoicedQuantity) * parseFloat(item.unitPrice)
              }))
          },
        });

      });

      // Convert grouped data to the desired format
      const contracts = Object.entries(contractGroups).map(([contractNumber, items]) => ({
        contractNumber: contractNumber,
        invoices: invoices.rows.filter(i => i.contract === contractNumber).map(i => i.invoice),
        items: items
      }));

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, contracts);
    } catch (error) {
      console.error("An error occurred while trying to find invoice summary for revenue center", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, {
        message: "An error occurred while trying to find invoice summary for revenue center"
      });
    }
  };

  findAllInvoiceSummary = async (
    request: schemas.FindAllInvoiceSummarySchema
  ): Promise<ResponseEntity> => {
    try {
      // Buscar revenue center
      const revenueCenter = await this.revenueCenterRepository.findById(
        request.idRevenueCenter
      );
      if (!revenueCenter) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, {
          message: "Revenue center not found",
        });
      }

      // Buscar items del proyecto
      const filter = { idCostCenterProject: revenueCenter.idCostCenterProject };
      const data = await this.costCenterRepository.findAllProjectItem(
        filter,
        -1,
        0
      );

      // Facturas y sus detalles
      const invoices = await this.invoiceRepository.findAllByRenueveCenter(
        {},
        -1,
        0
      );
      const invoiceProjectItemData =
        await this.invoiceRepository.findAllInvoiceProjectItems();

      // Totales generales
      let totalAcumulado = 0;
      let totalPendiente = 0;

      // Agrupar por contrato
      const contractGroups: Record<
        string,
        Array<{
          idProjectItem: number;
          projectItem: string;
          unitMeasure: string;
          quantity: number;
          unitPrice: number;
          total: number;
          invoicedQuantity: number | null;
          invoiceGroups: {
            items: Array<any>;
            ACUMULADO: { CANT: number; TOTAL: number };
            PENDIENTE: { CANT: number; TOTAL: number };
          };
        }>
      > = {};

      data.rows.forEach((item) => {
        const contractNumber = item.contract;

        // Inicializar contrato
        if (!contractGroups[contractNumber]) {
          contractGroups[contractNumber] = [];
        }

        // Items de facturas por este projectItem
        const invoiceItems = invoiceProjectItemData
          .filter((invItem) => invItem.idProjectItem === item.idProjectItem)
          .map((invItem) => ({
            invoice:
              invoices.rows.find((i) => i.idInvoice === invItem.idInvoice)
                ?.invoice || "Unknown",
            quantity: invItem.invoicedQuantity
              ? parseFloat(invItem.invoicedQuantity)
              : null,
            total: invItem.invoicedQuantity
              ? parseFloat(invItem.invoicedQuantity) * parseFloat(item.unitPrice)
              : null,
          }));

        // Calcular acumulado
        // const acumuladoCant = invoiceItems
        //   .map((x) => x.quantity || 0)
        //   .reduce((a, b) => a + b, 0);
        // 🔹 Calcular acumulado SOLO con facturas válidas (no Unknown)
        const acumuladoCant = invoiceItems
          .filter((x) => x.invoice !== "Unknown") // 👈 solo facturas reales
          .map((x) => x.quantity || 0)
          .reduce((a, b) => a + b, 0);

        const acumuladoTotal = acumuladoCant * parseFloat(item.unitPrice);

        // Calcular pendiente
        const pendienteCant = parseFloat(item.quantity) - acumuladoCant;
        const pendienteTotal = parseFloat(item.total) - acumuladoTotal;

        // Sumar a los totales globales
        totalAcumulado += acumuladoTotal;
        totalPendiente += pendienteTotal;

        // Agregar item al contrato
        contractGroups[contractNumber].push({
          idProjectItem: item.idProjectItem,
          projectItem: item.item,
          unitMeasure: item.unitMeasure,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          total: parseFloat(item.total),
          invoicedQuantity: item.invoicedQuantity
            ? parseFloat(item.invoicedQuantity)
            : null,
          invoiceGroups: {
            items: invoiceItems,
            ACUMULADO: {
              CANT: acumuladoCant,
              TOTAL: acumuladoTotal,
            },
            PENDIENTE: {
              CANT: pendienteCant,
              TOTAL: pendienteTotal,
            },
          },
        });
      });

      // Convertir a array
      const contracts = Object.entries(contractGroups).map(
        ([contractNumber, items]) => ({
          contractNumber: contractNumber,
          invoices: invoices.rows
            .filter((i) => i.contract === contractNumber)
            .map((i) => i.invoice),
          items: items,
        })
      );

      // Respuesta final con totales globales
      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        contracts,
        totals: {
          ACUMULADO: totalAcumulado,
          PENDIENTE: totalPendiente,
        },
      });
    } catch (error) {
      console.error(
        "An error occurred while trying to find invoice summary for revenue center",
        error
      );
      return BuildResponse.buildErrorResponse(
        StatusCode.InternalErrorServer,
        {
          message:
            "An error occurred while trying to find invoice summary for revenue center",
        }
      );
    }
  };


  /**
   * Find material summary detail for a revenue center
   */
  findAllMaterialSummaryDetail = async (request: schemas.FindAllMaterialSummaryDetailSchema): Promise<ResponseEntity> => {
    try {
      const { page, pageSize, limit, offset } = findPagination(request);

      // Step 1: Find the revenue center to get the idQuotation
      const revenueCenter = await this.revenueCenterRepository.findById(request.idRevenueCenter);
      if (!revenueCenter) {
        return BuildResponse.buildErrorResponse(StatusCode.NotFound, { message: "Revenue center not found" });
      }

      const filter = { idRevenueCenter: request.idRevenueCenter };
      const materialSummaryData = await this.revenueCenterRepository.findAllMaterialSummaryDetail(limit, offset, filter);

      // Step 2: Get quotation item details if idQuotation exists
      let quotationItemDetails: { idInput: number; budgeted: number; contracted: number }[] = [];
      if (revenueCenter.idQuotation) {
        quotationItemDetails = await this.quotationRepository.findQuotationItemDetailsByQuotationId(revenueCenter.idQuotation);
      }

      // Step 3: Create a map for quick lookup of budgeted and contracted quantities by idInput
      const budgetedQuantitiesMap = new Map<number, number>();
      const contractedQuantitiesMap = new Map<number, number>();
      quotationItemDetails.forEach(item => {
        budgetedQuantitiesMap.set(item.idInput, item.budgeted);
        contractedQuantitiesMap.set(item.idInput, item.contracted);
      });

      // Step 4: Map the results and set budgeted values
      materialSummaryData.rows = materialSummaryData.rows.map((item: any) => {
        const budgetedQuantity = budgetedQuantitiesMap.get(item.idInput) || 0;
        const contractedQuantity = contractedQuantitiesMap.get(item.idInput) || 0;
        return {
          ...item,
          yield: 1,
          budgeted: budgetedQuantity,
          contracted: contractedQuantity,
          diff: budgetedQuantity - contractedQuantity
        };
      });

      return BuildResponse.buildSuccessResponse(StatusCode.Ok, {
        data: materialSummaryData.rows,
        totalItems: materialSummaryData.count,
        currentPage: page,
        totalPage: Math.ceil(materialSummaryData.count / pageSize),
        total: materialSummaryData.totalRows.reduce((acc: number, curr: any) => acc + (parseFloat(curr.shipped) || 0), 0),
      });
    } catch (error) {
      console.error("An error occurred while trying to find material summary detail", error);
      return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, { message: "An error occurred while trying to find material summary detail" });
    }
  };

  private buildFilter = (
    request: schemas.FindAllSchema
  ): { [key: string]: any } => {
    const filter: { [key: string]: any } = {};

    if (request.name) {
      filter.name = request.name;
    }

    if (request.idRevenueCenter) {
      filter.idRevenueCenter = request.idRevenueCenter;
    }

    if (request.idCostCenterProject) {
      filter.idCostCenterProject = request.idCostCenterProject;
    }

    if (request.idRevenueCenterStatus) {
      filter.idRevenueCenterStatus = request.idRevenueCenterStatus;
    }

    return filter;
  };
}