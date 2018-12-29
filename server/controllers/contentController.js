const content = require('../services/contentService');

require('dotenv').config();

class ContentController {
    static create(request, response) {
        content.create(request.body.sectionNumber, request.body.sectionName, request.body.title, request.body.description, request.body.link)
          .then(message => response.send(message))
          .catch(err => response.status(500).send(`${err}`));
    };

    static getAll(request, response) {
        console.log('ContentController starts !');
        content.getAll()
          .then(content => response.send(content))
          .catch(err => response.status(500).send(`${err}`));
    };

     // get single ListObject  -  this is an old implementation - it needs some refactoring
    static getOne(req, res) {
        const id = req.params.listObjectId;
        ListObject.findById(id)
            .then((listObject) => {
                res.status(200).json({
                    success: true,
                    message: `video: ${Video.title}`,
                    ListObject: listObject,
                });
            })
            .catch((err) => {
                res.status(500).json({
                    success: false,
                    message: 'This video does not exist',
                    error: err.message,
                });
            });
    }

    static update(request, response) {
        content.update(request.params.listObjectId, request.body)
          .then(message => response.send(message))
          .catch(err => response.status(500).send(`${err}`));
    };

    static delete(request, response) {
        console.log('contentController delete starts!')
        content.delete(request.params.listObjectId)
          .then(message => response.send(message))
          .catch(err => response.status(500).send(`${err}`));
    };
}

module.exports = ContentController;
