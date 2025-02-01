import request from 'supertest';
import app from '../src/index.ts';
import FAQ from '../src/models/faq.ts';
import { Redis } from 'ioredis';
import sinon from 'sinon';
import { expect } from 'chai';
import mongoose from 'mongoose';

sinon.mock('../src/models/faq');
sinon.mock('ioredis');

describe('FAQ API', () => {
  let redisClient: sinon.SinonMock;

  beforeEach(() => {
    redisClient = sinon.mock(new Redis());
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('POST /api/create', () => {
    it('should create a new FAQ', async () => {
      const faq = { question: 'Sample Question', answer: 'Sample Answer' };
      const translatedFAQ = { ...faq, translated_questions: {}, translated_answers: {} };

      sinon.stub(FAQ, 'create').resolves(translatedFAQ);

      const res = await request(app).post('/api/create').send(faq);

      expect(res.status).to.equal(201);
      expect(res.body).to.include(faq);
    });
  });

  describe('GET /api/get', () => {
    it('should get paginated FAQs', async () => {
      const faqs = [{ _id: new mongoose.Types.ObjectId().toHexString(), question: 'Sample Question', answer: 'Sample Answer' }];

      sinon.stub(FAQ, 'aggregate').resolves([{
        data: faqs,
        total: [{ count: 1 }]
      }]);

      const res = await request(app).get('/api/get').query({ p: 1, len: 10, lang: 'en' });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('data').that.is.an('array');
    });
  });

  describe('PUT /api/update/:id', () => {
    it('should update an existing FAQ', async () => {
      const id = new mongoose.Types.ObjectId().toHexString();
      const faq = { question: 'Updated Question', answer: 'Updated Answer' };
      const translatedFAQ = { ...faq, translated_questions: {}, translated_answers: {} };

      sinon.stub(FAQ, 'findByIdAndUpdate').resolves(translatedFAQ);

      const res = await request(app).put(`/api/update/${id}`).send(faq);

      expect(res.status).to.equal(200);
      expect(res.body.msg).to.equal('successfully updated.');
    });
  });

  describe('DELETE /api/deleteone/:id', () => {
    it('should delete an existing FAQ', async () => {
      const id = new mongoose.Types.ObjectId().toHexString();
      sinon.stub(FAQ, 'findOneAndDelete').resolves(true);

      const res = await request(app).delete(`/api/deleteone/${id}`);

      expect(res.status).to.equal(204);
    });
  });

  describe('DELETE /api/deleteall', () => {
    it('should delete all FAQs', async () => {
      sinon.stub(FAQ, 'deleteMany').resolves({ deletedCount: 1 });

      const res = await request(app).delete('/api/deleteall');

      expect(res.status).to.equal(204);
    });
  });
});
