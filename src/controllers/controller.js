const FAQ = require("../models/faq.js");
const { Redis } = require("ioredis");
const { LANGUAGES } = require("../utils/languages.js");
const { Translate } = require("../utils/translater.js");
const { ObjectId } = require("mongodb");

const redis = new Redis();

const create = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const faq = new FAQ({ question, answer });

    const { translated_answers, translated_questions } = await Translate(question, answer);

    faq["translated_questions"] = translated_questions;
    faq["translated_answers"] = translated_answers;
    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const get = async (req, res) => {
  try {
    let lang = req.query.lang || "en";
    if (!LANGUAGES.includes(lang)) {
      lang = "en";
    }
    const page = Math.max(Math.abs(Number(req.query.p)), 1) || 1;
    const pagelimit = Math.max(Math.abs(Number(req.query.len)), 1) || 10;

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

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    if (!question && !answer) {
      res.status(400).json({ error: "To update faq either question or answer is required" });
      return;
    }

    const { translated_answers, translated_questions } = await Translate(question, answer);

    const update = {};

    if (question) update["question"] = question;
    if (answer) update["answer"] = answer;
    if (translated_answers) update["translated_answers"] = translated_answers;
    if (translated_questions) update["translated_questions"] = translated_questions;

    const objectId = new ObjectId(id);
    const updatedFAQ = await FAQ.findByIdAndUpdate(objectId, { ...update });

    if (!updatedFAQ) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    res.status(200).json({ msg: "successfully updated." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteone = async (req, res) => {
  try {
    const { id } = req.param;
    await FAQ.findOneAndDelete(id);

    res.status(204).json({ msg: "Deletion was successful." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteall = async (req, res) => {
  try {
    await FAQ.deleteMany({});

    res.status(204).json({ message: "All Deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  create,
  get,
  update,
  deleteone,
  deleteall
};
