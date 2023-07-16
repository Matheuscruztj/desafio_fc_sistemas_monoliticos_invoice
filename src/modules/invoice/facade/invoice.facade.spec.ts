import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "../repository/invoice.model";
import InvoiceRepository from "../repository/invoice.repository";
import { GenerateInvoiceUseCase } from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import ProductRepository from "../repository/product.repository";
import InvoiceItemRepository from "../repository/invoice-item.repository";
import ProductInterface from "../repository/product.interface";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemInterface from "../repository/invoice-item.interface";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/value-object/address";
import Product from "../domain/entity/product";
import Invoice from "../domain/entity/invoice";
import { ProductModel } from "../repository/product.model";
import { InvoiceItemModel } from "../repository/invoice-item.model";
import { FindInvoiceUseCase } from "../usecase/find-invoice/find-invoice.usecase";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

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

const { total } = input.items.reduce((acc, item) => {
    acc.total += item.price;

    return acc;
}, {
    total: 0
});

const MockProductRepository = () => {
    return {
        create: jest.fn(),
        find: jest.fn()
    }
}

describe("InvoiceFacade test", () => {
    let sequelize: Sequelize;
    let productRepository: ProductInterface;
    let invoiceRepository: InvoiceGateway;
    let invoiceItemRepository: InvoiceItemInterface;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([
            InvoiceModel,
            ProductModel,
            InvoiceItemModel,
        ]);
        await sequelize.sync();

        productRepository = new ProductRepository();
        invoiceRepository = new InvoiceRepository();
        invoiceItemRepository = new InvoiceItemRepository();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create an invoice", async () => {
        await Promise.all([
            ProductModel.create({
                id: input.items[0].id,
                name: input.items[0].name,
                price: input.items[0].price,
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
            ProductModel.create({
                id: input.items[1].id,
                name: input.items[1].name,
                price: input.items[1].price,
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
        ]);

        const facade = InvoiceFacadeFactory.create();

        await facade.generate(input);

        const invoice = await InvoiceModel.findOne({
            where: {
                id: input.id,
            }
        });

        expect(invoice).toBeDefined();
        expect(invoice.id).toBe(input.id);
        expect(invoice.name).toBe(input.name);
        expect(invoice.document).toBe(input.document);
        expect(invoice.street).toBe(input.street);
        expect(invoice.number).toBe(input.number);
        expect(invoice.complement).toBe(input.complement);
        expect(invoice.city).toBe(input.city);
        expect(invoice.state).toBe(input.state);
        expect(invoice.zipCode).toBe(input.zipCode);
    });

    it("should find an invoice", async () => {
        await Promise.all([
            ProductModel.create({
                id: input.items[0].id,
                name: input.items[0].name,
                price: input.items[0].price,
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
            ProductModel.create({
                id: input.items[1].id,
                name: input.items[1].name,
                price: input.items[1].price,
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
        ]);

        const facade = InvoiceFacadeFactory.create();

        await facade.generate(input);

        const invoice = await facade.find({
            id: input.id,
        });

        expect(invoice).toBeDefined();
        expect(invoice.id).toBe(input.id);
        expect(invoice.name).toBe(input.name);
        expect(invoice.document).toBe(input.document);
        expect(invoice.address.street).toBe(input.street);
        expect(invoice.address.number).toBe(input.number);
        expect(invoice.address.complement).toBe(input.complement);
        expect(invoice.address.city).toBe(input.city);
        expect(invoice.address.state).toBe(input.state);
        expect(invoice.address.zipCode).toBe(input.zipCode);
        expect(invoice.items.length).toBe(2);

        expect(invoice.items[0].id).toBe(input.items[0].id);
        expect(invoice.items[0].name).toBe(input.items[0].name);
        expect(invoice.items[0].price).toBe(input.items[0].price);
        
        expect(invoice.items[1].id).toBe(input.items[1].id);
        expect(invoice.items[1].name).toBe(input.items[1].name);
        expect(invoice.items[1].price).toBe(input.items[1].price);
        
        expect(invoice.total).toBe(total);
        expect(invoice.createdAt).toBeDefined();
    });
});