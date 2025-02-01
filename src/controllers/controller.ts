import FAQ from "../models/faq.ts";
import { Redis } from "ioredis";
import { LANGUAGES } from "../utils/languages.ts";
import { Translate } from "../utils/translater.ts";
import { ObjectId } from "mongodb";

const redis = new Redis();

type createreqbody = {
  question: string;
  answer: string;
  translated_questions: {};
  translated_answers: {};
};

type updatereqbody = {
  question?: string;
  answer?: string;
};

export const create = async (req, res): Promise<void> => {
  try {
    const { question, answer } = req.body as createreqbody;
    const faq = new FAQ({ question, answer });

    const { translated_answers, translated_questions } = await Translate(
      question,
      answer
    );

    faq["translated_questions"] = translated_questions;
    faq["translated_answers"] = translated_answers;
    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const get = async (req, res): Promise<void> => {
  try {
    let lang = (req.query.lang as string) || "en";
    if (!LANGUAGES.includes(lang)) {
      lang = "en";
    }
    const page = Math.max(Math.abs(Number(req.query.p as string)), 1) || 1;
    const pagelimit =
      Math.max(Math.abs(Number(req.query.len as string)), 1) || 10;

    const cachedFAQs = await redis.get(`faqs:${lang},p:${page},l:${pagelimit}`);
    if (cachedFAQs) return res.json(JSON.parse(cachedFAQs));

    const faqs = await FAQ.aggregate([
      {
        $facet: {
          data: [
            { $match: {} },
            { $skip: (page - 1) * pagelimit },
            { $limit: pagelimit },
            {
              $addFields: {
                question: { $cond: { if: { $eq: [lang, 'en'] }, then: '$question', else: { $ifNull: [`$translated_questions.${lang}`, '$question'] } } },
                answer: { $cond: { if: { $eq: [lang, 'en'] }, then: '$answer', else: { $ifNull: [`$translated_answers.${lang}`, '$answer'] } } },
              },
            },
            { $project: { question: 1, answer: 1, _id: 1 } },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const faq = faqs[0];
    await redis.set(
      `faqs:${lang},p:${page},l:${pagelimit}`,
      JSON.stringify(faq),
      'EX',
      6
    );
    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res): Promise<void> => {
  try {
    const {id} = req.params;
    const { question, answer } = req.body as updatereqbody;

    if(!question && !answer) {
        res.status(400).json({ error: "To update faq either question or answer is required" });
        return;
    }

    
    const {translated_answers, translated_questions} = await Translate(question, answer);
    
    const update = {};
    
    question && (update["question"] = question);
    answer && (update["answer"] = answer);
    translated_answers && (update["translated_answers"] = translated_answers);
    translated_questions && (update["translated_questions"] = translated_questions);
    
    const objectId = new ObjectId(id);
    const updatedFAQ = await FAQ.findByIdAndUpdate(objectId, {...update});

    if (!updatedFAQ) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    res.status(200).json({msg:"successfully updated."});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteone = async (req, res): Promise<void> => {
  try {
    const {id} = req.param;
    await FAQ.findOneAndDelete(id);

    res.status(204).json({msg:"Deletion was successful."});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteall = async (req, res): Promise<void> => {
  try {
    
    await FAQ.deleteMany({});

    res.status(204).json({ message: `All Deleted successfully.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
