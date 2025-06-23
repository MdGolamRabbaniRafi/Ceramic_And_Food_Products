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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Category_entity_1 = require("./Category.entity");
let CategoryService = class CategoryService {
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    getHello() {
        return 'Hello Order!';
    }
    async findById(id) {
        let categoryEntity = await this.categoryRepo.findOne({ where: { Id: id } });
        if (categoryEntity != null) {
            return categoryEntity;
        }
        return { message: "Not found" };
    }
    async findAll() {
        let categoryEntities = await this.categoryRepo.find();
        if (categoryEntities.length > 0) {
            return categoryEntities;
        }
        return [];
    }
    async addCategory(categoryEntity) {
        let Category = await this.categoryRepo.save(categoryEntity);
        if (Category != null) {
            return Category;
        }
        return { message: "Category not added" };
    }
    async editCategory(id, categoryData) {
        const existingCategory = await this.categoryRepo.findOne({ where: { Id: id } });
        if (!existingCategory) {
            return { message: "Category not found" };
        }
        await this.categoryRepo.update(id, categoryData);
        return { message: "Category updated successfully" };
    }
    async deleteCategory(id) {
        const existingCategory = await this.categoryRepo.findOne({ where: { Id: id } });
        if (!existingCategory) {
            return { message: "Category not found" };
        }
        await this.categoryRepo.delete(id);
        return { message: "Category deleted successfully" };
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Category_entity_1.CategoryEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoryService);
//# sourceMappingURL=Category.service.js.map