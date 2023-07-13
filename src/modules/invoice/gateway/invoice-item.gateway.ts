import InvoiceItem from "../domain/entity/invoice-item";

export default interface InvoiceItemGateway {
    create(invoiceItem: InvoiceItem): Promise<void>;
    findByInvoiceId(invoiceId: string): Promise<InvoiceItem[]>;
}