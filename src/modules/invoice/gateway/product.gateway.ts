import Product from "../domain/entity/product";

export default interface ProductGateway {
    create(product: Product): Promise<void>;
    find(id: string): Promise<Product>;
}