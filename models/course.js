const { Schema, model } = require('mongoose');

const courseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imgURL: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

courseSchema.method('toClient', function() {
  console.log('toClient method was call');
})

module.exports = model('Course', courseSchema);
