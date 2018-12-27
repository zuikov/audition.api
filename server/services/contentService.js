const mongoose = require('mongoose');

const ListObject = require('../models/listObject');
require('dotenv').config();

class ContentActions {
    static async create (sectionNumber, sectionName, title, description, link) {
        const checkList = await ListObject.checkList(link);
        if (checkList) throw new Error('Video is already uploaded');
        const listObject = await ListObject.create({ _id: new mongoose.Types.ObjectId(), 'sectionNumber': sectionNumber, 'sectionName': sectionName, 'title': title, 'description': description, 'link': link});
        if (listObject) {
            return {'message': 'listObject created successfully'};
          } else {
            throw new Error('listObject creation failed'); 
          }
    }; 

    static async update (id, updateObject) {
        const checkList = await ListObject.findById(id);
        if (!checkList) throw new Error('Video does not exist');
        const listObject = await ListObject.update({ _id:id }, { $set:updateObject }).exec();
        if (listObject) {
            return {'message': 'listObject updated successfully'};
          } else {
            throw new Error('listObject update failed'); 
          }
    };

    static async delete (id) {
        const listObject = await ListObject.findByIdAndRemove(id).exec();
        if (listObject) {
            return {'message': `listObject ${id} deleted successfully`};
          } else {
            throw new Error(`listObject ${id} deleting failed`); 
          }
    };

    static async getAll () {
        const playList = await ListObject.getAll();
        if(!playList) throw new Error('playList is empty');
        return playList;
    };
}

module.exports = ContentActions;