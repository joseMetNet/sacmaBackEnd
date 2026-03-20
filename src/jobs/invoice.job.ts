// src/jobs/invoice.job.ts
import cron from "node-cron";
import { invoiceService } from "../features/invoice/invoice.service";
import { Invoice } from "../features/invoice/invoice.model";
import { Incomin } from "../features/incomin/incomin.model";
import { Op, Sequelize } from "sequelize";

// "*/1 * * * *" ,cada minuto
// "0 * * * *" ,cada hhora
//opcion original
// cron.schedule("*/1 * * * *", async () => {
//     console.log("⏳ Ejecutando job de actualización de facturas...");

//     try {
//         // 1. Facturas que ya tienen ingresos -> marcar como pagadas (estado 1)
//         const paidInvoices = await Invoice.findAll({
//             where: {
//                 idInvoice: {
//                     [Op.in]: Sequelize.literal(`(SELECT idInvoice FROM [mvp1].[TB_Income])`),
//                 },
//                 idInvoiceStatus: { [Op.ne]: 1 },
//             },
//         });

//         for (const inv of paidInvoices) {
//             await invoiceService.update({
//                 idInvoice: inv.idInvoice,
//                 idInvoiceStatus: 1,
//             });
//         }

//         // 2. Facturas con más de 60 días -> estado 3
//         const overdue60 = await Invoice.findAll({
//             where: {
//                 idInvoiceStatus: { [Op.ne]: 1 },
//                 createdAt: {
//                     [Op.lte]: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
//                 },
//             },
//         });

//         for (const inv of overdue60) {
//             await invoiceService.update({
//                 idInvoice: inv.idInvoice,
//                 idInvoiceStatus: 3,
//             });
//         }

//         // 3. Facturas con más de 30 días -> estado 2
//         const overdue30 = await Invoice.findAll({
//             where: {
//                 idInvoiceStatus: { [Op.notIn]: [1, 3] },
//                 createdAt: {
//                     [Op.lte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
//                 },
//             },
//         });

//         for (const inv of overdue30) {
//             await invoiceService.update({
//                 idInvoice: inv.idInvoice,
//                 idInvoiceStatus: 2,
//             });
//         }

//         console.log("✅ Job de facturas completado.");
//     } catch (error) {
//         console.error("❌ Error en el job de facturas:", error);
//     }
// });


// import cron from "node-cron";
// import { Invoice } from "../invoice/invoice.model";
// import { Op, Sequelize } from "sequelize";
// import { invoiceService } from "../invoice/invoice.service";

cron.schedule("*/1 * * * *", async () => {
    console.log("⏳ Ejecutando job de actualización de facturas...");

    try {
        // 1. Facturas que ya tienen ingresos -> marcar como pagadas (estado 1)
        const paidInvoices = await Invoice.findAll({
            where: {
                idInvoice: {
                    [Op.in]: Sequelize.literal(`(SELECT idInvoice FROM [mvp1].[TB_Income])`),
                },
                idInvoiceStatus: { [Op.ne]: 1 },
            },
        });

        for (const inv of paidInvoices) {
            await invoiceService.update({
                idInvoice: inv.idInvoice,
                idInvoiceStatus: 1,
            });
        }

        // 2. Facturas que están como pagadas (1) pero ya no tienen ingresos -> volver a estado 2
        const unpaidInvoices = await Invoice.findAll({
            where: {
                idInvoice: {
                    [Op.notIn]: Sequelize.literal(`(SELECT idInvoice FROM [mvp1].[TB_Income])`),
                },
                idInvoiceStatus: 1, // actualmente marcadas como pagadas
            },
        });

        for (const inv of unpaidInvoices) {
            await invoiceService.update({
                idInvoice: inv.idInvoice,
                idInvoiceStatus: 2, // o el estado que tú definas
            });
        }

        // 3. Facturas con más de 60 días -> estado 3
        const overdue60 = await Invoice.findAll({
            where: {
                idInvoiceStatus: { [Op.ne]: 1 },
                createdAt: {
                    [Op.lte]: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
                },
            },
        });

        for (const inv of overdue60) {
            await invoiceService.update({
                idInvoice: inv.idInvoice,
                idInvoiceStatus: 3,
            });
        }

        // 4. Facturas con más de 30 días -> estado 2
        const overdue30 = await Invoice.findAll({
            where: {
                idInvoiceStatus: { [Op.notIn]: [1, 3] },
                createdAt: {
                    [Op.lte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
            },
        });

        for (const inv of overdue30) {
            await invoiceService.update({
                idInvoice: inv.idInvoice,
                idInvoiceStatus: 2,
            });
        }

        console.log("✅ Job de facturas completado.");
    } catch (error) {
        console.error("❌ Error en el job de facturas:", error);
    }
});


// cron.schedule("*/1 * * * *", async () => {
//     console.log("⏳ Ejecutando job de actualización de facturas...");

//     try {
//         // 1. Facturas que cambiaron en el último minuto
//         const recentInvoices = await Invoice.findAll({
//             where: {
//                 updatedAt: {
//                     [Op.gte]: Sequelize.literal("DATEADD(MINUTE, -1, GETDATE())"),
//                 },
//             },
//         });

//         for (const inv of recentInvoices) {
//             // 1a. Facturas con ingreso -> estado 1
//             const income = await Incomin.findOne({ where: { idInvoice: inv.idInvoice } });
//             if (income && inv.idInvoiceStatus !== 1) {
//                 await invoiceService.update({
//                     idInvoice: inv.idInvoice,
//                     idInvoiceStatus: 1,
//                 });
//                 continue;
//             }

//             // 1b. Facturas > 60 días -> estado 3
//             if (inv.idInvoiceStatus !== 1 && inv.createdAt <= new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)) {
//                 await invoiceService.update({
//                     idInvoice: inv.idInvoice,
//                     idInvoiceStatus: 3,
//                 });
//                 continue;
//             }

//             // 1c. Facturas > 30 días -> estado 2
//             if (![1, 3].includes(inv.idInvoiceStatus) && inv.createdAt <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
//                 await invoiceService.update({
//                     idInvoice: inv.idInvoice,
//                     idInvoiceStatus: 2,
//                 });
//             }
//         }

//         console.log("✅ Job de facturas completado.");
//     } catch (error) {
//         console.error("❌ Error en el job de facturas:", error);
//     }
// });
