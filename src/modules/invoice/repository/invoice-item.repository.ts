import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../domain/entity/invoice-item";
import InvoiceItemGateway from "../gateway/invoice-item.gateway";
import { InvoiceItemModel } from "./invoice-item.model";

export default class InvoiceItemRepository implements InvoiceItemGateway {
    async create(invoiceItem: InvoiceItem): Promise<void> {
        await InvoiceItemModel.create({
            id: invoiceItem.id.id,
            product_id: invoiceItem.productId,
            invoice_id: invoiceItem.invoiceId,
            quantity: invoiceItem.quantity,
            createdAt: invoiceItem.createdAt,
            updatedAt: invoiceItem.updatedAt,
        });
    }
    async findByInvoiceId(invoiceId: string): Promise<InvoiceItem[]> {
        const invoiceItems = await InvoiceItemModel.findAll({
            where: {
                invoice_id: invoiceId,
            }
        });

        if (!invoiceItems.length) {
            throw new Error("Invoice items are not found");
        }

        return invoiceItems.map((item) => 
            new InvoiceItem({
                id: new Id(item.id),
                productId: item.product_id,
                invoiceId: item.invoice_id,
                quantity: item.quantity,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            })
        )
    }    
}