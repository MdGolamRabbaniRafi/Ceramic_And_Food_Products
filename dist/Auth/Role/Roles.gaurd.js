"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGaurd = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const User_service_1 = require("../../User/User.service");
let RolesGaurd = class RolesGaurd {
    constructor(reflector, userService) {
        this.reflector = reflector;
        this.userService = userService;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        console.log("Required Roles:" + requiredRoles);
        const request = context.switchToHttp().getRequest();
        console.log("rrrrrrrrequest::" + request);
        const user = request.user;
        console.log("user::" + user.username);
        console.log("role::" + user.userId.role);
        if (!user) {
            return false;
        }
        return requiredRoles.some(role => user.userId.role === role);
    }
};
exports.RolesGaurd = RolesGaurd;
exports.RolesGaurd = RolesGaurd = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        User_service_1.UserService])
], RolesGaurd);
//# sourceMappingURL=Roles.gaurd.js.map