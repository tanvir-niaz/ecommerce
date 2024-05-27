/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/modules/product/entities/product.entity';



@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.items)
  order: Order;

  // @Column({
  //   type: 'enum',
  //   enum: DeliveryType,
  //   default: DeliveryType.STANDARD
  // })
  // delivery_type: DeliveryType;

  @Column({type: 'jsonb',nullable:true})
  productDetails: object;

  @ManyToOne(() => Product,{nullable:true})
  product: Product;

  @Column()
  quantity: number;
}
