import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import Invoice from "../domain/entity/invoice";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/value-object/address";
import Product from "../domain/entity/product";
import InvoiceRepository from "./invoice.repository";

describe("InvoiceRepository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([InvoiceModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create an invoice", async () => {
        const invoice = new Invoice({
            id: new Id("1"),
            name: "Test",
            document: "Document",
            address: new Address({
                street: "Street",
                number: "123",
                complement: "Complement",
                city: "City",
                state: "State",
                zipCode: "123",
            }),
            items: [
                new Product({
                    id: new Id("1"),
                    name: "Item 1",
                    price: 1,
                })
            ]
        });

        const repository = new InvoiceRepository();
        await repository.generate(invoice);

        const invoiceDb = await InvoiceModel.findOne({
            where: {
                id: invoice.id.id,
            }
        });

        expect(invoiceDb).toBeDefined();
        expect(invoiceDb.id).toBe(invoice.id.id);
        expect(invoiceDb.name).toBe(invoice.name);
        expect(invoiceDb.document).toBe(invoice.document);
        expect(invoiceDb.street).toBe(invoice.address.street);
        expect(invoiceDb.number).toBe(invoice.address.number);
        expect(invoiceDb.complement).toBe(invoice.address.complement);
        expect(invoiceDb.city).toBe(invoice.address.city);
        expect(invoiceDb.state).toBe(invoice.address.state);
        expect(invoiceDb.zipCode).toBe(invoice.address.zipCode);
    });

    it("should find an invoice", async () => {
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
        })

        const repository = new InvoiceRepository();

        const result = await repository.find(invoice.id);

        expect(result.id.id).toBe(invoice.id);
        expect(result.name).toBe(invoice.name);
        expect(result.document).toBe(invoice.document);
        expect(result.address.street).toBe(invoice.street);
        expect(result.address.number).toBe(invoice.number);
        expect(result.address.complement).toBe(invoice.complement);
        expect(result.address.city).toBe(invoice.city);
        expect(result.address.state).toBe(invoice.state);
        expect(result.address.zipCode).toBe(invoice.zipCode);
    });
});