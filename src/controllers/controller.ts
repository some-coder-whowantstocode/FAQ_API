import FAQ from '../models/faq.ts';
import { Redis } from 'ioredis';
import translatte from 'translatte';
import { LANGUAGES } from '../config/languages.ts';

const redis = new Redis();

type createreqbody = {
    question:string,
    answer:string,
    translated_questions:{},
    translated_answers:{}
}

export const create = async (req, res): Promise<void> => {
    try {
        const { question, answer } = req.body as createreqbody;
        const faq = new FAQ({ question, answer });
        const translated_questions = {};
        const translated_answers = {};
        const questionPromises = LANGUAGES.map((val)=>{
            return new Promise((resolve, reject)=>{
                translatte(question,{to:val})
                .then((res)=>{
                    translated_questions[val]=res.text;
                    resolve("resolved");
                })
                .catch((err)=>{
                    console.warn(`Error while translating question to ${val} : ${err}`)
                    resolve("resolved");
                })
            })
        })

        const answerPromises = LANGUAGES.map((val)=>{
            return new Promise((resolve, reject)=>{
                translatte(answer,{to:val})
                .then((res)=>{
                    translated_answers[val]=res.text;
                    resolve("resolved");
                })
                .catch((err)=>{
                    console.warn(`Error while translating answer to ${val} : ${err}`)
                    resolve("resolved");
                })
            })
        })

        const Promises = [...answerPromises,...questionPromises];

        Promise.all(Promises)
        .catch((err)=>{
            console.warn("Something unexpected occured:",err);
        })
        .finally(async()=>{
            faq["translated_questions"] = translated_questions;
            faq["translated_answers"] = translated_answers;
            await faq.save();
            res.status(201).json(faq);
        })
      
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const get = async (req, res): Promise<void> => {
    try {
        let lang = req.query.lang as string || 'en';
        if(!LANGUAGES.includes(lang)){
            lang = 'en'
        }
        const page = Math.max( Math.abs( Number( req.query.p as string ) ) ,1) || 1;
        const pagelimit = Math.max(Math.abs(Number(req.query.len as string)),1) || 10;

        const cachedFAQs = await redis.get(`faqs:${lang},p:${page},l:${pagelimit}`);
        if (cachedFAQs) return res.json(JSON.parse(cachedFAQs));

        
        const faqs = await FAQ.aggregate([
            {$facet:{
                "data":[
                    {$match:{}},
                    {$skip:(page-1) * pagelimit},
                    {$limit:pagelimit},
                    {$addFields:{
                        question:`$translated_questions[${lang}]`,
                        answer:`$translated_answers[${lang}]`
                    }},
                    {$project:{question:1,answer:1, _id:1}}
                ],
                "total":[
                    {$count:"count"}
                ]
            }}
        ])

        const faq = faqs[0];
        console.log(faq)
        await redis.set(`faqs:${lang},p:${page},l:${pagelimit}`, JSON.stringify(faq));
        res.json(faq);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
