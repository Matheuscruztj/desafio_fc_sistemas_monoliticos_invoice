import InvoiceItemRepository from "../../repository/invoice-item.repository";
import InvoiceRepository from "../../repository/invoice.repository";
import ProductRepository from "../../repository/product.repository";
import { GenerateInvoice } from "./generate-invoice.usecase";
import InvoiceGateway from "../../gateway/invoice.gateway";
import ProductGateway from "../../gateway/product.gateway";
import InvoiceItemGateway from "../../gateway/invoice-item.gateway";
import Invoice from "../../domain/entity/invoice";
import InvoiceItem from "../../domain/entity/invoice-item";
import Product from "../../domain/entity/product";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../domain/value-object/address";
import { GenerateInvoiceUseCaseInputDto } from "./generate-invoice.dto";

const input = {
    id: "1",
    name: "Test",
    document: "Document",
    street: "Street",
    number: "123",
    complement: "Complement",
    city: "City",
    state: "State",
    zipCode: "123",
    items: [
        {
            id: "1",
            name: "Item 1",
            price: 1,
        }, {
            id: "2",
            name: "Item 2",
            price: 2,
        }
    ]
};

const mockInputProductWithNegativePrice = {
    id: "1",
    name: "Test",
    document: "Document",
    street: "Street",
    number: "123",
    complement: "Complement",
    city: "City",
    state: "State",
    zipCode: "123",
    items: [
        {
            id: "1",
            name: "Item 1",
            price: -1,
        }
    ]
};


const { total } = input.items.reduce((acc, item) => {
    acc.total += item.price;

    return acc;
}, {
    total: 0
});

const mockOutput = {
    ...input,
    total,
};

const MockInvoiceRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(new Invoice({
            id: new Id(input.id),
            name: "Test",
            document: "Document",
            address: new Address({
                street: "Street",
                number: "123",
                complement: "Complement",
                city: "City",
                state: "State",
                zipCode: "123",
            })
        })))
    }
}

const MockInvoiceItemRepository = () => {
    return {
        create: jest.fn(),
        findByInvoiceId: jest.fn()
    }
}

const MockProductRepository = () => {
    return {
        create: jest.fn(),
        find: jest.fn()
            .mockReturnValueOnce(
                Promise.resolve(
                    new Product({
                        id: new Id(input.items[0].id),
                        name: input.items[0].name,
                        price: input.items[0].price,
                    })
                )
            )
            .mockReturnValueOnce(
                Promise.resolve(
                    new Product({
                        id: new Id(input.items[1].id),
                        name: input.items[1].name,
                        price: input.items[1].price,
                    })
                )
            )
    }
}


describe("Generate Invoice Usecase unit test", () => {
    let productRepository: ProductGateway;
    let invoiceRepository: InvoiceGateway;
    let invoiceItemRepository: InvoiceItemGateway;

    beforeEach(async () => {
        productRepository = MockProductRepository();
        invoiceRepository = MockInvoiceRepository();
        invoiceItemRepository = MockInvoiceItemRepository();
    });

    it("should generate an invoice", async () => {
        const usecase = new GenerateInvoice({
            invoiceRepository,
            productRepository,
            invoiceItemRepository,
        });

        const output = await usecase.execute(input);

        expect(output).toStrictEqual(mockOutput);
    });

    it("should throw error if negative price on product", async () => {
        const usecase = new GenerateInvoice({
            invoiceItemRepository,
            invoiceRepository,
            productRepository,
        });

        await expect(
            usecase.execute(mockInputProductWithNegativePrice)
        )
        .rejects
        .toThrow(
            new Error("Price must be greater than 0")
        );
    });
});