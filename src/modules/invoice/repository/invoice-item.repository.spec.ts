import { Sequelize } from "sequelize-typescript";
import { InvoiceItemModel } from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";
import { ProductModel } from "./product.model";
import InvoiceItemRepository from "./invoice-item.repository";
import InvoiceItem from "../domain/entity/invoice-item";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("InvoiceItemRepository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([InvoiceModel, ProductModel, InvoiceItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a invoice item", async () => {
        const invoice = await InvoiceModel.create({
            id: "1",
            name: "Test",
            document: "Document",
            street: "Street",
            number: "123",
            complement: "Complement",
            city: "City",
            state: "State",
            zipCode: "123",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const product = await ProductModel.create({
            id: "1",
            name: "Test",
            price: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const invoiceItem = new InvoiceItem({
            id: new Id("1"),
            invoiceId: invoice.id,
            productId: product.id,
            quantity: 1,
        });

        const invoiceItemRepository = new InvoiceItemRepository();
        await invoiceItemRepository.create(invoiceItem);

        const invoiceItemDb = await InvoiceItemModel.findOne({
            where: {
                id: invoiceItem.id.id,
            }
        });

        expect(invoiceItemDb).toBeDefined();
        expect(invoiceItemDb.product_id).toBe(invoiceItem.productId);
        expect(invoiceItemDb.invoice_id).toBe(invoiceItem.invoiceId);
        expect(invoiceItemDb.quantity).toBe(invoiceItem.quantity);
    });

    it("should find an invoice item", async () => {
        const invoice = await InvoiceModel.create({
            id: "1",
            name: "Test",
            document: "Document",
            street: "Street",
            number: "123",
            complement: "Complement",
            city: "City",
            state: "State",
            zipCode: "123",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const product = await ProductModel.create({
            id: "1",
            name: "Test",
            price: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const invoiceItem = await InvoiceItemModel.create({
            id: "1",
            invoice_id: invoice.id,
            product_id: product.id,
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const repository = new InvoiceItemRepository();
        const result = await repository.findById(invoiceItem.id);

        expect(result).toBeDefined();
        expect(result.id.id).toBe(invoiceItem.id);
        expect(result.productId).toBe(invoiceItem.product_id);
        expect(result.invoiceId).toBe(invoiceItem.invoice_id);
        expect(result.quantity).toBe(invoiceItem.quantity);
        expect(result.createdAt).toStrictEqual(invoiceItem.createdAt);
        expect(result.updatedAt).toStrictEqual(invoiceItem.updatedAt);
    });

    it("should find an invoice item list by invoice id", async () => {
        const invoice = await InvoiceModel.create({
            id: "1",
            name: "Test",
            document: "Document",
            street: "Street",
            number: "123",
            complement: "Complement",
            city: "City",
            state: "State",
            zipCode: "123",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const product = await ProductModel.create({
            id: "1",
            name: "Test",
            price: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const invoiceItem = await InvoiceItemModel.create({
            id: "1",
            invoice_id: invoice.id,
            product_id: product.id,
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const repository = new InvoiceItemRepository();
        const result = await repository.findByInvoiceId(invoice.id);

        expect(result).toBeDefined();
        expect(result).toHaveLength(1);
        expect(result[0].id.id).toBe(invoiceItem.id);
        expect(result[0].invoiceId).toBe(invoiceItem.invoice_id);
        expect(result[0].productId).toBe(invoiceItem.product_id);
        expect(result[0].quantity).toBe(invoiceItem.quantity);
        expect(result[0].createdAt).toStrictEqual(invoiceItem.createdAt);
        expect(result[0].updatedAt).toStrictEqual(invoiceItem.updatedAt);
    });
});