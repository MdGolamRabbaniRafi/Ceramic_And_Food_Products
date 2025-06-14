// import { ProductCollectionMapperEntity } from "src/Mapper/Product Collection Mapper/PCM.entity";
import { ProductEntity } from "src/Product/Product.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";

@Entity("Collection")
export class CollectionEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ name: 'name', type: "varchar", length: 150 })
  name: string;

  // Many-to-Many relationship with Product
  @ManyToMany(() => ProductEntity, product => product.collections)
  @JoinTable({
    name: "ProductCollectionMapper",
    joinColumn: { name: "collectionId", referencedColumnName: "Id" },
    inverseJoinColumn: { name: "productId", referencedColumnName: "Id" },
  })
  products: ProductEntity[];
}
