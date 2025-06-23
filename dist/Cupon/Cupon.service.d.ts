import { Repository } from 'typeorm';
import { CuponEntity } from './Cupon.entity';
import { OrderService } from 'src/Order/Order.service';
export declare class CuponService {
    private cuponRepo;
    private readonly orderService;
    private readonly logger;
    constructor(cuponRepo: Repository<CuponEntity>, orderService: OrderService);
    getAllCupons(): Promise<CuponEntity[]>;
    getCuponById(id: number): Promise<CuponEntity | null>;
    createCupon(cuponData: Partial<CuponEntity>): Promise<CuponEntity>;
    editCupon(id: number, cuponData: Partial<CuponEntity>): Promise<CuponEntity | boolean>;
    deleteCupon(id: number): Promise<boolean>;
    deleteExpiredCupons(): Promise<void>;
}
