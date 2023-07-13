import BaseEntity from "../../../@shared/domain/entity/base.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";

type InvoiceItemProps = {
    id?: Id;
    productId: string;
    invoiceId: string;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export default class InvoiceItem extends BaseEntity {
    private _productId: string;
    private _invoice_id: string;
    private _quantity: number;

    constructor(props: InvoiceItemProps) {
        super(props.id, props.createdAt, props.updatedAt);
        this._invoice_id = props.invoiceId;
        this._productId = props.productId;
        this._quantity = props.quantity;
    }

    get invoiceId(): string {
        return this._invoice_id;
    }

    get productId(): string {
        return this._productId;
    }

    get quantity(): number {
        return this._quantity;
    }
}