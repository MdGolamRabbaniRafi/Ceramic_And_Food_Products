"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Farseit API')
        .setDescription('API documentation for Farseit backend')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    console.log('------------------------------------------------------------');
    console.log('PG Database');
    console.log('------------------------------------------------------------');
    console.log(`Host: ${process.env.DATABASE_HOST}`);
    console.log(`Port: ${process.env.DATABASE_PORT}`);
    console.log(`User: ${process.env.DATABASE_USER}`);
    console.log(`Password: ${process.env.DATABASE_PASSWORD}`);
    console.log(`Database: ${process.env.DATABASE_NAME}`);
    console.log('------------------------------------------------------------');
    console.log('Email');
    console.log('------------------------------------------------------------');
    console.log(`Host: ${process.env.EMAIL_HOST}`);
    console.log(`From: ${process.env.EMAIL_FROM}`);
    console.log(`User: ${process.env.EMAIL_USER}`);
    console.log(`Pass: ${process.env.EMAIL_PASS}`);
    console.log(`Port: ${process.env.EMAIL_PORT}`);
    console.log('------------------------------------------------------------');
    await app.listen(7000);
}
bootstrap();
//# sourceMappingURL=main.js.map