"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_ts_1 = require("../controllers/controller.ts");
const router = express_1.default.Router();
router.post('/create', controller_ts_1.createFAQ);
router.get('/get', controller_ts_1.getFAQs);
exports.default = router;
