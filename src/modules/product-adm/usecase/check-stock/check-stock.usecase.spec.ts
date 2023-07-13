import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import CheckStockUseCase from "./check-stock.usecase";

const MockProduct = new Product({
    id: new Id("1"),
    name: "Product 1",
    description: "Product 1 description",
    purchasePrice: 100,
    stock: 10,
});

const MockRepositoy = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(MockProduct)),
    }
}

describe("CheckStock usecase unit test", () => {
    it("should get stock of a product", async () => {
        const productRepository = MockRepositoy();
        const usecase = new CheckStockUseCase(productRepository);

        const input = {
            productId: String(MockProduct.id.id),
        };

        const result = await usecase.execute(input);

        expect(productRepository.find).toHaveBeenCalled();
        expect(result.productId).toBe(input.productId);
        expect(result.stock).toBe(MockProduct.stock);
    });
});