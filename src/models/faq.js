const mongoose = require('mongoose');

const Tranlations = {
    type: Map,
    of: String
};

const faqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    translated_questions: Tranlations,
    translated_answers: Tranlations
});

module.exports = mongoose.model('FAQ', faqSchema);
