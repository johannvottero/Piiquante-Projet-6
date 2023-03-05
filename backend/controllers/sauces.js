const Sauces = require('../models/sauces');
const fs = require('fs');

exports.createSauces = (req, res, next) => {
  console.log(req.body)
  const saucesObject = JSON.parse(req.body.sauces);
  delete saucesObject._id;
  delete saucesObject._userId;
  const sauces = new sauces({
      ...saucesObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  //console.log(sauces);

  sauces.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { console.log(error); res.status(400).json( { error })})
};

exports.getOneSauce = (req, res, next) => {
  sauces.findOne({
    _id: req.params.id
  }).then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  const saucesObject = req.file ? {
      ...JSON.parse(req.body.sauces),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
}

  exports.deleteSauce = (req, res, next) => {
    sauces.findOne({ _id: req.params.id})
        .then(sauces => {
            if (sauces.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = sauces.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    sauces.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };
/* 
exports.deleteSauces = (req, res, next) => {
  sauces.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
 */
exports.getAllStuff = (req, res, next) => {
  sauces.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};