"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasPermission = void 0;
const common_1 = require("@nestjs/common");
const HasPermission = (access) => (0, common_1.SetMetadata)('access', access);
exports.HasPermission = HasPermission;
//# sourceMappingURL=has-permission.decorator.js.map