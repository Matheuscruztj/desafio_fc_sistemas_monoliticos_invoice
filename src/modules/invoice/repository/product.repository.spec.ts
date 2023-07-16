import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "./product.model";
import Product from "../domain/entity/product";
import Id from "../../@shared/domain/value-object/id.value-object";
import ProductRepository from "./product.repository";

describe("ProductRepository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const product = new Product({
            id: new Id("1"),
            name: "Test",
            price: 1,
        });

        const repository = new ProductRepository();
        await repository.create(product);

        const productDb = await ProductModel.findOne({
            where: {
                id: product.id.id,
            }
        });

        expect(productDb).toBeDefined();
        expect(productDb.id).toBe(product.id.id);
        expect(productDb.name).toBe(product.name);
        expect(productDb.price).toBe(product.price);
        expect(productDb.createdAt).toStrictEqual(product.createdAt);
        expect(productDb.updatedAt).toStrictEqual(product.updatedAt);
    });

    it("should find a product", async () => {
        const product = await ProductModel.create({
            id: "1",
            name: "Test",
            price: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const repository = new ProductRepository();
        const result = await repository.find(product.id);

        expect(result.id.id).toBe(product.id);
        expect(result.name).toBe(product.name);
        expect(result.price).toBe(product.price);
        expect(result.createdAt).toStrictEqual(product.createdAt);
        expect(result.updatedAt).toStrictEqual(product.updatedAt);
    });
});