import mongoose, { Schema } from 'mongoose';

const questionSchema = new Schema({
  question: {
    type: String,
    default: null,
  },
  isCorrect: {
    type: Boolean,
    default: null,
  },
  studentAnswer: {
    type: String,
    default: null,
  }
}, { _id: false });

const testSchema = new Schema({
  questions: [questionSchema],
  dateStart: {
    type: Date,
    default: Date.now,
  },
  isTest: {
    type: Boolean,
    default: true,
  },
}, { _id: false });

const userSchema = new Schema({
  googleId: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  favoriteRockGenre: {
    type: String,
    enum: [
      'rock clásico',
      'hard rock',
      'punk rock',
      'heavy meal',
      'death metal',
      'new metal',
      'grunge',
      'rock alternativo',
      'rock progresivo',
      'indie rock',
      'glam rock',
      'southern rock'
    ],
    default: 'rock clásico',
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: function () {
      // @ts-ignore
      return !this.googleId;
    },
  },
  photo: {
    type: String,
    default: ''
  },
  location: {
    type: new Schema({
      city: {
        type: String,
        default: '',
      },
      region: {
        type: String,
        default: '',
      },
      country: {
        type: String,
        default: '',
      },
    }, { _id: false }),
    default: {}
  },
  role: {
    type: String,
    enum: ['ADMIN', 'STUDENT'],
    default: 'STUDENT',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true
  },
  test: testSchema,
});

const User = mongoose.model('User', userSchema);

export default User;
