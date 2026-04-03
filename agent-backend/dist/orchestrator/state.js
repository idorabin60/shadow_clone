"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessInputSchema = void 0;
const zod_1 = require("zod");
/**
 * Validated shape of the business input submitted by the user.
 * Uses .passthrough() so unknown fields from the frontend don't fail validation.
 */
exports.BusinessInputSchema = zod_1.z.object({
    businessName: zod_1.z.string().min(1),
    projectId: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    tone: zod_1.z.string().optional(),
    targetAudience: zod_1.z.string().optional(),
    services: zod_1.z.array(zod_1.z.string()).optional(),
}).passthrough();
