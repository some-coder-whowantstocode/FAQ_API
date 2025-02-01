import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';

interface Tranlations {
    [key: string]: string;
}

interface IFaq extends Document {
    question: string;
    answer: string;
    translated_questions:Tranlations;
    translated_answers:Tranlations;
}

const faqSchema = new MongooseSchema<IFaq>({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    translated_questions:{type:Map, of: String},
    translated_answers:{type:Map, of:String}
});


export default mongoose.model<IFaq>('FAQ', faqSchema);
