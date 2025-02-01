import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';

interface IFaq extends Document {
    question: string;
    answer: string;
    question_hi?: string;
    question_bn?: string;
    getTranslations: (lang: string) => string;
}

const faqSchema = new MongooseSchema<IFaq>({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    question_hi: { type: String },
    question_bn: { type: String }
});

faqSchema.methods.getTranslations = function (this: IFaq, lang = 'en'): string {
    let ques: string | null = null;
    if (lang === 'hi') {
        ques = this.question_hi ?? null;
    } else if (lang === 'bn') {
        ques = this.question_bn ?? null;
    }
    if (ques === null) {
        ques = this.question;
    }
    return ques;
};

export default mongoose.model<IFaq>('FAQ', faqSchema);
