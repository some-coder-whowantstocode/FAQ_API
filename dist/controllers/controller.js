"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFAQs = exports.createFAQ = void 0;
const faq_ts_1 = __importDefault(require("../models/faq.ts"));
const ioredis_1 = require("ioredis");
const translatte_1 = __importDefault(require("translatte"));
const languages_ts_1 = require("../config/languages.ts");
const redis = new ioredis_1.Redis();
const createFAQ = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { question, answer } = req.body;
        const faq = new faq_ts_1.default({ question, answer });
        const Promises = languages_ts_1.LANGUAGES.map((val) => {
            return new Promise((resolve, reject) => {
                (0, translatte_1.default)(question, { to: val })
                    .then((res) => {
                    faq[`question_${val}`] = res.text;
                    resolve("resolved");
                })
                    .catch((err) => {
                    reject(`Error while translating to ${val} : ${err}`);
                });
            });
        });
        Promise.all(Promises)
            .catch((err) => {
            console.warn(err);
        });
        yield faq.save();
        res.status(201).json(faq);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createFAQ = createFAQ;
const getFAQs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let lang = req.query.lang || 'en';
        if (!languages_ts_1.LANGUAGES.includes(lang)) {
            lang = 'en';
        }
        const page = Math.max(Math.abs(Number(req.query.p)), 1) || 1;
        const pagelimit = Math.max(Math.abs(Number(req.query.len)), 1) || 10;
        const cachedFAQs = yield redis.get(`faqs:${lang},p:${page},l:${pagelimit}`);
        if (cachedFAQs)
            return res.json(JSON.parse(cachedFAQs));
        const questiontype = `question_${lang}`;
        const faqs = yield faq_ts_1.default.aggregate([
            { $facet: {
                    "data": [
                        { $skip: (page - 1) * pagelimit },
                        { $limit: pagelimit },
                        { $addFields: {
                                question: `$${questiontype}`
                            } },
                        { $project: { questiontype: 1, _id: 1 } }
                    ],
                    "total": [
                        { $count: "count" }
                    ]
                } }
        ]);
        const faq = faqs[0];
        yield redis.set(`faqs:${lang},p:${page},l:${pagelimit}`, JSON.stringify(faq));
        res.json(faq);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getFAQs = getFAQs;
