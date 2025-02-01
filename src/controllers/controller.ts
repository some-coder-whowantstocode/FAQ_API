import FAQ from '../models/faq.ts';
import { Redis } from 'ioredis';
import translatte from 'translatte';
import { LANGUAGES } from '../config/languages.ts';

const redis = new Redis();

type createreqbody = {
    question:string,
    answer:string
}

export const createFAQ = async (req, res): Promise<void> => {
    try {
        const { question, answer } = req.body as createreqbody;
        const faq = new FAQ({ question, answer });
        const Promises = LANGUAGES.map((val)=>{
            return new Promise((resolve, reject)=>{
                translatte(question,{to:val})
                .then((res)=>{
                    console.log(res.text)
                    faq[`question_${val}`] = res.text;
                    console.log(faq)
                    resolve("resolved");
                })
                .catch((err)=>{
                    reject(`Error while translating to ${val} : ${err}`);
                })
            })
        })
        Promise.all(Promises)
        .catch((err)=>{
            console.warn(err);
        })
        .finally(async()=>{
            await faq.save();
            res.status(201).json(faq);
        })
      
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFAQs = async (req, res): Promise<void> => {
    try {
        let lang = req.query.lang as string || 'en';
        if(!LANGUAGES.includes(lang)){
            lang = 'en'
        }
        const page = Math.max( Math.abs( Number( req.query.p as string ) ) ,1) || 1;
        const pagelimit = Math.max(Math.abs(Number(req.query.len as string)),1) || 10;

        const cachedFAQs = await redis.get(`faqs:${lang},p:${page},l:${pagelimit}`);
        if (cachedFAQs) return res.json(JSON.parse(cachedFAQs));

        
        const questiontype = `question_${lang}`;
        const faqs = await FAQ.aggregate([
            {$facet:{
                "data":[
                    {$match:{}},
                    {$skip:(page-1) * pagelimit},
                    {$limit:pagelimit},
                    {$addFields:{
                        question:`$${questiontype}`
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
