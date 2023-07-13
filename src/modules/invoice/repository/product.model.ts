import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: "products",
    timestamps: false,
})
export class ProductModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @Column({ allowNull: false })
    declare name: string;

    @Column({ allowNull: false })
    declare price: number;

    @Column({ allowNull: false })
    declare createdAt: Date;

    @Column({ allowNull: false })
    declare updatedAt: Date;
}