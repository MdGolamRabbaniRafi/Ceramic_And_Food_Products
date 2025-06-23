"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    common_1.Logger.log('------------------------------------------------------------');
    common_1.Logger.log('------------------------------------------------------------');
    common_1.Logger.log(`PG Database`);
    common_1.Logger.log('------------------------------------------------------------');
    common_1.Logger.log(`Host: ${process.env.DATABASE_HOST}`);
    common_1.Logger.log(`Port: ${process.env.DATABASE_PORT}`);
    common_1.Logger.log(`User: ${process.env.DATABASE_USER}`);
    common_1.Logger.log(`Database: ${process.env.DATABASE_NAME}`);
    common_1.Logger.log(`User: ${process.env.DATABASE_PASSWORD}`);
    common_1.Logger.log('------------------------------------------------------------');
    common_1.Logger.log('------------------------------------------------------------');
    common_1.Logger.log('------------------------------------------------------------');
    common_1.Logger.log(`Email`);
    common_1.Logger.log('------------------------------------------------------------');
    common_1.Logger.log(`Host: ${process.env.EMAIL_HOST}`);
    common_1.Logger.log(`Port: ${process.env.EMAIL_FROM}`);
    common_1.Logger.log(`User: ${process.env.EMAIL_USER}`);
    common_1.Logger.log(`Database: ${process.env.EMAIL_PASS}`);
    common_1.Logger.log(`User: ${process.env.EMAIL_PORT}`);
    common_1.Logger.log('------------------------------------------------------------');
    await app.listen(7000);
}
bootstrap();
//# sourceMappingURL=main.js.map