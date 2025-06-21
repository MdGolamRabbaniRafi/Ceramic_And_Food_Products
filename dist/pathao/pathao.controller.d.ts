import { PathaoService } from './pathao.service';
export declare class PathaoController {
    private readonly pathaoService;
    constructor(pathaoService: PathaoService);
    createOrder(orderData: any): Promise<any>;
}
