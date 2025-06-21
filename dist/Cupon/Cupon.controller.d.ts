import { CuponService } from './Cupon.service';
import { CuponEntity } from './Cupon.entity';
export declare class CuponController {
    private readonly cuponService;
    constructor(cuponService: CuponService);
    getAllCupons(): Promise<CuponEntity[]>;
    getCuponById(id: number): Promise<CuponEntity | null>;
    createCupon(cuponData: Partial<CuponEntity>): Promise<CuponEntity>;
    editCupon(id: number, cupontData: Partial<CuponEntity>): Promise<CuponEntity | boolean>;
    deleteCupon(id: number): Promise<boolean>;
}
