import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/entity/invoice";
import Address from "../domain/value-object/address";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
    async generate(invoice: Invoice): Promise<void> {
        await InvoiceModel.create({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
        })
    }

    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne({
            where: {
                id,
            }
        });

        if (!invoice) {
            throw new Error("Invoice not found");
        }

        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            address: new Address({
                street: invoice.street,
                number: invoice.number,
                complement: invoice.complement,
                city: invoice.city,
                state: invoice.state,
                zipCode: invoice.zipCode
            }),
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
        });
    }
}