import InvoiceGateway from "../../gateway/invoice.gateway";
import ProductInterface from "../../repository/product.interface";
import InvoiceItemInterface from "../../repository/invoice-item.interface";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto";
import Invoice from "../../domain/entity/invoice";
import Address from "../../domain/value-object/address";
import Product from "../../domain/entity/product";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/entity/invoice-item";

export interface GenerateInvoiceProps {
    invoiceItemRepository: InvoiceItemInterface;
    invoiceRepository: InvoiceGateway;
    productRepository: ProductInterface;
}

export class GenerateInvoiceUseCase implements UseCaseInterface{
    private _invoiceItemRepository: InvoiceItemInterface;
    private _invoiceRepository: InvoiceGateway;
    private _productRepository: ProductInterface;

    constructor(props: GenerateInvoiceProps) {
        this._invoiceItemRepository = props.invoiceItemRepository;
        this._invoiceRepository = props.invoiceRepository;
        this._productRepository = props.productRepository;
    }

    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        const { list: productList, total } = input?.items.reduce((acc, item) => {
            let index = acc.list.findIndex((i) => item.id === i?.product?.id);

            let obj = index < 0 ? {
                product: new Product({
                    id: new Id(item.id),
                    name: item.name,
                    price: item.price,
                }),
                quantity: 0,
            } : acc.list[index];

            obj.quantity++;
            
            index < 0 ? acc.list.push(obj) : acc.list[index] = obj;

            acc.total += item.price;

            return acc;
        }, {
            list: [],
            total: 0
        });

        await Promise.all(
            productList.map(async ({ product }) => {
                await this._productRepository.find(product.id.id);
            }),
        )

        let invoice = new Invoice({
            id: new Id(input.id),
            name: input.name,
            document: input.document,
            address: new Address({
                street: input.street,
                number: input.number,
                complement: input.complement,
                city: input.city,
                state: input.state,
                zipCode: input.zipCode,
            }),
            items: productList.map(({ product }) => {
                return product;
            })
        });

        const invoiceItemList = productList.map((item) => {
            const { product, quantity } = item;

            return new InvoiceItem({
                invoiceId: invoice.id.id,
                productId: product.id.id,
                quantity,
            });
        });

        await this._invoiceRepository.generate(invoice);
        invoice = await this._invoiceRepository.find(invoice.id.id);

        await invoiceItemList.forEach(async (item) => {
            await this._invoiceItemRepository.create(item);
        });

        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: productList.map(({product}) => {
                return {
                    id: product.id.id,
                    name: product.name,
                    price: product.price,
                };
            }),
            total,
        };
    }
}