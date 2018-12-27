const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const listObjectSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  sectionNumber: {
    type: Number,
    required: true,
  },
  sectionName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

listObjectSchema.query.byLink = function (link) {
  return this.where({'link': link});
};

listObjectSchema.statics.checkList = async function (link) {
  const listObject = await this.findOne({link:link});
  return listObject? listObject._id: null;
};

listObjectSchema.statics.getAll = async function () {
  const playList = await this.find().select('_id sectionNumber sectionName title description link');
  return playList? playList: null;
};

module.exports = mongoose.model('ListObject', listObjectSchema);
