const mongoose = require('mongoose');
require('dotenv').config();

const sessionSchema = new mongoose.Schema(
  {
    _id: {
      type: Object,
      required: true
    },
    refreshExp:
      {
        type: Number,
      },
    accessExp:
      {
        type: Number,
      },
    registrationExp: {
      type: Number,
    },
    counter:{
      type:Number,
      // required: true
    }
  },
  {
    collection: 'auth',
    autoIndex: false,
    versionKey: false
  }
);
sessionSchema.method('Equal', function (level, decodedExp) {
  // console.log('this.accessExp', this.accessExp);
  // console.log('decodedExp', decodedExp);
  // console.log('this.refreshExp', this.refreshExp);
  if (level === process.env.ACCESS) return decodedExp === this.accessExp;
  if (level === process.env.REFRESH) return decodedExp === this.refreshExp;

  return decodedExp === this.registrationExp;
});
sessionSchema.statics.toId = function (id) {
  return mongoose.Types.ObjectId(id)
};
sessionSchema.method('isBlock', function () {
  return this.counter >= 100;
});
sessionSchema.method('giveNotice', function() {
 this.counter++;
});
module.exports = mongoose.model('Session', sessionSchema);
