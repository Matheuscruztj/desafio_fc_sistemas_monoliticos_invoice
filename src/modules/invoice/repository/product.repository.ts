import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/entity/product";
import ProductInterface from "../repository/product.interface";
import { ProductModel } from "./product.model";

export default class ProductRepository implements ProductInterface {
    async create(product: Product): Promise<void> {
        await ProductModel.create({
            id: product.id.id,
            name: product.name,
            price: product.price,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        });
    }
    async find(id: string): Promise<Product> {
        const product = await ProductModel.findOne({
            where: {
                id,
            }
        });

        if (!product) {
            throw new Error("Product not found");
        }

        return new Product({
            id: new Id(product.id),
            name: product.name,
            price: product.price,
            updatedAt: product.updatedAt,
            createdAt: product.createdAt,
        });
    }
}