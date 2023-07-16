import ProductRepository from "../repository/product.repository";
import InvoiceItemRepository from "../repository/invoice-item.repository";
import InvoiceRepository from "../repository/invoice.repository";
import InvoiceFacade from "../facade/invoice.facade";
import { GenerateInvoiceUseCase } from "../usecase/generate-invoice/generate-invoice.usecase";
import { FindInvoiceUseCase } from "../usecase/find-invoice/find-invoice.usecase";


export default class InvoiceFacadeFactory {
    static create() {
        const productRepository = new ProductRepository();
        const invoiceRepository = new InvoiceRepository();
        const invoiceItemRepository = new InvoiceItemRepository();

        const generateInvoiceUseCase = new GenerateInvoiceUseCase({
            invoiceRepository,
            productRepository,
            invoiceItemRepository,
        });

        const findInvoiceUseCase = new FindInvoiceUseCase({
            invoiceRepository,
            invoiceItemRepository,
            productRepository,
        });

        const facade = new InvoiceFacade({
            generateInvoiceUseCase,
            findInvoiceUseCase,
        });

        return facade;
    }
}