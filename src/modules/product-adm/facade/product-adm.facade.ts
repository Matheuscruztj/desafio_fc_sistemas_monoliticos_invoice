import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ProductAdminFacadeInterface, { AddProductFacadeInputDto, CheckStockFacadeInputDto, CheckStockFacadeOutputDto } from "./product-adm.facade.interface";

export interface UseCasesProps {
    addUseCase: UseCaseInterface;
    stockUseCase: UseCaseInterface;
}

export default class ProductAdmFacade implements ProductAdminFacadeInterface {
    private _addUseCase: UseCaseInterface;
    private _checkStockUseCase: UseCaseInterface;

    constructor(usecasesProps: UseCasesProps) {
        this._addUseCase = usecasesProps.addUseCase;
        this._checkStockUseCase = usecasesProps.stockUseCase;
    }

    addProduct(input: AddProductFacadeInputDto): Promise<void> {
        return this._addUseCase.execute(input);
    }
    
    checkStock(
        input: CheckStockFacadeInputDto
    ): Promise<CheckStockFacadeOutputDto> {
        return this._checkStockUseCase.execute(input);
    }
}