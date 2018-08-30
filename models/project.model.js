import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  submitDate: {
    type: Date,
    required: true
  },
  submittedBy:{
    type: String,
    required: true
  }
});

const model = mongoose.model('Project', ProjectSchema);
export const cleanCollection = () => model.deleteMany({}).exec();
export default model;