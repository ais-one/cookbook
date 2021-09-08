"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use(cookieParser());
    app.enableCors({
        origin: ['http://127.0.0.1:3001'],
        credentials: true
    });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map