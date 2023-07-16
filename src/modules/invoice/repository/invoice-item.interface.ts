import InvoiceItem from "../domain/entity/invoice-item";

export default interface InvoiceItemInterface {
    create(invoiceItem: InvoiceItem): Promise<void>;
    findByInvoiceId(invoiceId: string): Promise<InvoiceItem[]>;
    findById(id: string): Promise<InvoiceItem>;
}