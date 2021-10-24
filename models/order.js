const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
  courses: [
    {
      courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
      },
      count: {
        type: Number,
        required: true
      }
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    dafault: Date.now
  }
});


module.exports = model('Order', orderSchema);