const Sauce = require('../models/sauces');
const fs = require('fs');


// Create sauce
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	delete sauceObject._userId;
	const sauce = new Sauce({
		...sauceObject,
		userId: req.auth.userId,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	});
	sauce.save()
	.then(() => { res.status(201).json({message: 'Objet enregistré !'})})
	.catch(error => { console.log(error); res.status(400).json( { error })})
};

// find one sauce
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({
		_id: req.params.id
	}).then((sauce) => {
		res.status(200).json(sauce);
	}).catch((error) => {
		res.status(404).json({
			error: error
		});
	});
};

//modify sauce
exports.modifySauce = (req, res, next) => {
	const sauceObject = req.file ? {
		...JSON.parse(req.body.sauce),
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	} : { ...req.body };
	delete sauceObject._userId;
	Sauce.findOne({_id: req.params.id})
	.then((sauce) => {
		if (sauce.userId != req.auth.userId) {
			res.status(401).json({ message : 'Not authorized'});
		} else {
			Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
			Sauce.deleteOne({_id: req.params.id})
			/* Sauce.findOneAndReplace({imageUrl, `${req.protocol}://${req.get('host')}/images/${req.file.filename}`})  */
			.then(() => res.status(200).json({message : 'Objet modifié!'}))
			.catch(error => res.status(401).json({ error }));
		}
	})
	.catch((error) => {
		res.status(400).json({ error });
	});
};


//like et dislike 
exports.likeSauce = (req, res, next) => {    
    const like = req.body.like;
	// User likes the sauce
		if(like === 1) { 
			Sauce.updateOne({_id: req.params.id}, { $inc: { likes: 1}, $push: { usersLiked: req.body.userId}, _id: req.params.id })
			.then( () => res.status(200).json({ message: 'You liked this sauce' }))
			.catch( error => res.status(400).json({ error }))

		// User dislikes the sauce
		} else if(like === -1) {  
			Sauce.updateOne({_id: req.params.id}, { $inc: { dislikes: 1}, $push: { usersDisliked: req.body.userId}, _id: req.params.id })
			.then( () => res.status(200).json({ message: 'You disliked this sauce' }))
			.catch( error => res.status(400).json({ error }))

		// User cancel like
		} else {    
			Sauce.findOne( {_id: req.params.id})
			.then( sauce => {
				if( sauce.usersLiked.indexOf(req.body.userId)!== -1){
					Sauce.updateOne({_id: req.params.id}, { $inc: { likes: -1},$pull: { usersLiked: req.body.userId}, _id: req.params.id })
					.then( () => res.status(200).json({ message: 'You don\'t like this sauce anymore' }))
					.catch( error => res.status(400).json({ error }))
					}
		// User cancel dislike
				else if( sauce.usersDisliked.indexOf(req.body.userId)!== -1) {
					Sauce.updateOne( {_id: req.params.id}, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId}, _id: req.params.id})
					.then( () => res.status(200).json({ message: 'You don\'t dislike this sauce anymore' }))
					.catch( error => res.status(400).json({ error }))
					}           
			})
			.catch( error => res.status(400).json({ error }))             
    }   
};

// delete sauce
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id})
	.then(sauce => {
		if (sauce.userId != req.auth.userId) {
			res.status(401).json({message: 'Not authorized'});
		} else {
			const filename = sauce.imageUrl.split('/images/')[1];
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({_id: req.params.id})
				.then(() => { res.status(200).json({message: 'Objet supprimé !'})})
				.catch(error => res.status(401).json({ error }));
			});
		}
	})
	.catch(error => {
		res.status(500).json({ error });
	});
};

//get all sauces
exports.getAllSauces = (req, res, next) => {
	Sauce.find().then((sauces) => {
		res.status(200).json(sauces);
	})
	.catch((error) => {
		res.status(400).json({
			error: error
		});
	});
};