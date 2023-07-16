import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO, GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./invoice.facade.interface";

export interface UseCaseProps {
    findInvoiceUseCase: UseCaseInterface;
    generateInvoiceUseCase: UseCaseInterface
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
    private _findInvoiceUseCase: UseCaseInterface;
    private _generateInvoiceUseCase: UseCaseInterface;

    constructor(usecaseProps: UseCaseProps) {
        this._findInvoiceUseCase = usecaseProps.findInvoiceUseCase;
        this._generateInvoiceUseCase = usecaseProps.generateInvoiceUseCase;
    }

    async generate(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        return await this._generateInvoiceUseCase.execute(input);
    }

    async find(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
        return await this._findInvoiceUseCase.execute(input);
    }
}