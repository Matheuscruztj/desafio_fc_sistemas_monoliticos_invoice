import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/entity/invoice";
import InvoiceItem from "../../domain/entity/invoice-item";
import Product from "../../domain/entity/product";
import Address from "../../domain/value-object/address";
import InvoiceGateway from "../../gateway/invoice.gateway";
import ProductInterface from "../../repository/product.interface";
import InvoiceItemInterface from "../../repository/invoice-item.interface";
import { FindInvoiceUseCase } from "./find-invoice.usecase";

const inputFind = {
    id: "1"
};

const itemList = [
    {
        id: "1",
        name: "Item 1",
        price: 1,
    }, {
        id: "2",
        name: "Item 2",
        price: 2,
    }
];

const { total } = itemList.reduce((acc, item) => {
    acc.total += item.price;

    return acc;
}, {
    total: 0,
});

const baseOutput = {
    id: inputFind.id,
    name: "Test",
    document: "Document",
    address: {
        street: "Street",
        number: "123",
        complement: "Complement",
        city: "City",
        state: "State",
        zipCode: "123",
    },
    items: [...itemList],
    total,
};

const MockProductList = [
    new Product({
        id: new Id(baseOutput.items[0].id),
        name: baseOutput.items[0].name,
        price: baseOutput.items[0].price,
    }),
    new Product({
        id: new Id(baseOutput.items[1].id),
        name: baseOutput.items[1].name,
        price: baseOutput.items[1].price,
    }),
];

const MockInvoice = new Invoice({
    id: new Id(inputFind.id),
    name: baseOutput.name,
    document: baseOutput.document,
    address: new Address({
        street: baseOutput.address.street,
        number: baseOutput.address.number,
        complement: baseOutput.address.complement,
        city: baseOutput.address.city,
        state: baseOutput.address.state,
        zipCode: baseOutput.address.zipCode,
    }),
    items: MockProductList,
});

const MockOutput = {
    ...baseOutput,
    createdAt: MockInvoice.createdAt,
}

const MockInvoiceItemList = [
    new InvoiceItem({
        invoiceId: inputFind.id,
        productId: baseOutput.items[0].id,
        quantity: 1,
    }),
    new InvoiceItem({
        invoiceId: inputFind.id,
        productId: baseOutput.items[1].id,
        quantity: 1,
    })
];

const MockInvoiceRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn(),
    }
};

const MockInvoiceItemRepository = () => {
    return {
        create: jest.fn(),
        findByInvoiceId: jest.fn()
        .mockReturnValue(Promise.resolve(MockInvoiceItemList)),
        findById: jest.fn(),
    }
}

const MockProductRepository = () => {
    return {
        create: jest.fn(),
        find: jest.fn()
        .mockReturnValueOnce(Promise.resolve(MockProductList[0]))
        .mockReturnValueOnce(Promise.resolve(MockProductList[1])),
    }
}

describe("Find Invoice Usecase unit test", () => {
    let productRepository: ProductInterface;
    let invoiceRepository: InvoiceGateway;
    let invoiceItemRepository: InvoiceItemInterface;

    beforeEach(async () => {
        invoiceRepository = MockInvoiceRepository();
        productRepository = MockProductRepository();
        invoiceItemRepository = MockInvoiceItemRepository();
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should find an invoice", async () => {
        invoiceRepository.find = jest.fn().mockReturnValue(Promise.resolve(MockInvoice))

        const usecase = new FindInvoiceUseCase({
            invoiceRepository,
            productRepository,
            invoiceItemRepository,
        });

        const output = await usecase.execute(inputFind);

        expect(output).toStrictEqual(MockOutput);
    });

    it("should not find an invoice", async () => {
        const usecase = new FindInvoiceUseCase({
            invoiceRepository,
            productRepository,
            invoiceItemRepository,
        });

        await expect(usecase.execute(inputFind)).rejects.toThrow(new Error("Invoice not found"));
    });
});