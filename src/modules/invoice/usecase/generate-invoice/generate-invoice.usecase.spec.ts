import InvoiceItemRepository from "../../repository/invoice-item.repository";
import InvoiceRepository from "../../repository/invoice.repository";
import ProductRepository from "../../repository/product.repository";
import { GenerateInvoiceUseCase } from "./generate-invoice.usecase";
import InvoiceGateway from "../../gateway/invoice.gateway";
import ProductInterface from "../../repository/product.interface";
import InvoiceItemInterface from "../../repository/invoice-item.interface";
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
        find: jest.fn(),
    }
}

const MockInvoiceItemRepository = () => {
    return {
        create: jest.fn(),
        findByInvoiceId: jest.fn(),
        findById: jest.fn(),
    }
}

const MockProductRepository = () => {
    return {
        create: jest.fn(),
        find: jest.fn()
    }
}


describe("Generate Invoice Usecase unit test", () => {
    let productRepository: ProductInterface;
    let invoiceRepository: InvoiceGateway;
    let invoiceItemRepository: InvoiceItemInterface;

    beforeEach(async () => {
        productRepository = MockProductRepository();
        invoiceRepository = MockInvoiceRepository();
        invoiceItemRepository = MockInvoiceItemRepository();
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it("should generate an invoice", async () => {
        invoiceRepository.find = jest.fn().mockReturnValue(Promise.resolve(new Invoice({
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
            })
        })));

        productRepository.find = jest.fn() .mockReturnValueOnce(
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

        const usecase = new GenerateInvoiceUseCase({
            invoiceRepository,
            productRepository,
            invoiceItemRepository,
        });

        const output = await usecase.execute(input);

        expect(output).toStrictEqual(mockOutput);
    });

    it("should throw error if a product is not found", async () => {
        productRepository.find = jest.fn()
            .mockRejectedValue(new Error("Product not found"));

        const usecase = new GenerateInvoiceUseCase({
            invoiceItemRepository,
            invoiceRepository,
            productRepository,
        });

        await expect(usecase.execute(input))
        .rejects
        .toThrow(
            new Error("Product not found")
        );
    });

    it("should throw error if negative price on product", async () => {
        const usecase = new GenerateInvoiceUseCase({
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