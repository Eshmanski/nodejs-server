const { Schema, model } = require('mongoose');
const course = require('./course');

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: String,
  password: {
    type: String,
    require: true
  },
  avatarUrl: String,
  resetToken: String,
  resetTokenExp: Date,
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'Course',
          required: true
        }
      }
    ]
  }
});

userSchema.methods.addToCart = function(course) {
  const items = [...this.cart.items];

  const idx = items.findIndex(c => {
    return c.courseId.toString() === course._id.toString();
  });

  if (idx >= 0) {
    items[idx].count = items[idx].count + 1;
  } else {
    items.push({
      count: 1,
      courseId: course._id
    });
  }

  this.cart = { items };

  return this.save();
}

userSchema.methods.remoteFromCart = function(courseId) {
  let items = [...this.cart.items];

  const idx = items.findIndex(c => c.courseId.toString() === courseId);

  if (items[idx].count === 1) {
    items = items.find(c => c.courseId.toString() != courseId.toString()) || [];
  } else {
    items[idx].count--;
  }

  this.cart = { items };

  return this.save();
}

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };

  return this.save();
}

module.exports = model('User', userSchema);