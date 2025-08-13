import { UserEntity } from 'src/User/User.entity';
import { ProductEntity } from 'src/Product/Product.entity';
import { CuponEntity } from 'src/Cupon/Cupon.entity';
import { OrderProductMapperEntity } from 'src/Mapper/Order Product Mapper/OrderProductMapper.entity';
import { PaymentEntity } from 'src/Payment/Payment.entity';
export declare class OrderEntity {
    Id: number;
    date: Date;
    totalAmount: number;
    status: string;
    address: string;
    district: string;
    note: string;
    receiverPhone: string;
    isActive: boolean;
    originalPrice: number;
    discountedPrice: number;
    user: UserEntity;
    expireTime: Date;
    products: ProductEntity[];
    orderProductMappers: OrderProductMapperEntity[];
    cupon: CuponEntity;
    payment: PaymentEntity;
}
