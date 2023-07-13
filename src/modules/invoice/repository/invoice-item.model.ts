import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { ProductModel } from "./product.model";
import { InvoiceModel } from "./invoice.model";

@Table({
    tableName: "invoice_items",
    timestamps: false,
})
export class InvoiceItemModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @ForeignKey(() => ProductModel)
    @Column({ allowNull: false })
    declare product_id: string;

    @BelongsTo(() => ProductModel)
    declare product: ProductModel;

    @ForeignKey(() => InvoiceModel)
    @Column({ allowNull: false })
    declare invoice_id: string;
  
    @BelongsTo(() => InvoiceModel)
    declare invoice: InvoiceModel;

    @Column({ allowNull: false })
    declare quantity: number;

    @Column({ allowNull: false })
    declare createdAt: Date;

    @Column({ allowNull: false })
    declare updatedAt: Date;
}