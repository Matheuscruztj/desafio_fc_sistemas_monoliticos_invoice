import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import InvoiceItemGateway from "../../gateway/invoice-item.gateway";
import InvoiceGateway from "../../gateway/invoice.gateway";
import ProductGateway from "../../gateway/product.gateway";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find-invoice.dto";

export interface FindInvoiceProps {
    invoiceItemRepository: InvoiceItemGateway;
    invoiceRepository: InvoiceGateway;
    productRepository: ProductGateway;
}

export class FindInvoice implements UseCaseInterface {
    private _invoiceItemRepository: InvoiceItemGateway;
    private _invoiceRepository: InvoiceGateway;
    private _productRepository: ProductGateway;

    constructor(props: FindInvoiceProps) {
        this._invoiceItemRepository = props.invoiceItemRepository;
        this._invoiceRepository = props.invoiceRepository;
        this._productRepository = props.productRepository;
    }

    async execute({ id }: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
        const invoice = await this._invoiceRepository.find(id);

        if (!invoice) {
            throw new Error("Invoice not found");
        }

        const invoiceItems = await this._invoiceItemRepository.findByInvoiceId(id);

        const itemsDetails = await Promise.all(
            invoiceItems.map((item) => {
                return item.productId
            }).map(async (id) => {
                const product = await this._productRepository.find(id);
                return {
                    id: product.id.id,
                    name: product.name,
                    price: product.price,
                }
            })
        );

        const { total } = itemsDetails.reduce((acc, item) => {
            acc.total += item.price;

            return acc;
        }, {
            total: 0,
        })

        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            address: {
                street: invoice.address.street,
                number: invoice.address.number,
                complement: invoice.address.complement,
                city: invoice.address.city,
                state: invoice.address.state,
                zipCode: invoice.address.zipCode,
            },
            items: itemsDetails,
            total,
            createdAt: invoice.createdAt,
        }
    }
}