/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	'new': function(req,res){
		res.view();
	},

	create: function(req,res,next){
		var userObj = {
			name:req.param('name'),
			email:req.param('email'),
			password:req.param('password'),
			confirmation:req.param('confirmation')
			}
		User.create(req.params.all(),function userCreated(err,user){
			if (err) {
				console.log(err);
				req.session.flash = {
					err: err.ValidationError
				}
				return res.redirect('/user/new');
			}


			//res.json(user);
			//req.session.flash = {};
			res.redirect('/user/show/'+user.id);
		});
	},

	show: function (req,res,next){
		User.findOne(req.param('id'), function foundUser(err,user){
			if (err) return next(err);
			if(!user) return next();
			res.view({
				user:user
			});
		});
	},

	'index': function (req,res,next){
		//console.log(req.session);
		User.find( function foundUsers(err,users){
			if (err) return next(err);
			//if(!users) return next();
			res.view({
				users:users
			});
		});
	},

	'edit': function (req,res,next){
		console.log(req.session);
		User.findOne( req.param('id'), function foundUser(err,user){
			if (err) {
				return next(err);
			}
			res.view({
				user:user
			});
		});
	},

	'update': function (req,res,next){

		if(req.session.User.admin){
			var userObj = {
				name:req.param('name'),
				email:req.param('email'),
				admin:req.param('admin')
			}
		}else{
			var userObj = {
				name:req.param('name'),
				email:req.param('email')
			}
		}
		User.update( req.param('id'), userObj, function userUpdated(err){
			if (err) {
				return res.redirect('/user/edit/'+req.param('id'));
			}
			return res.redirect('/user/show/'+req.param('id'));
		});
	},

	'destroy': function (req,res,next){
		User.findOne( req.param('id'), function findUser(err,user){
			if (err) {
				return next(err);
			}
			if(!user){
				return next('Nobody has been find');
			}
			User.destroy(req.param('id'),function userDestroyed(err){
				if (err) {
					return next(err);
				}
			});
			return res.redirect('/user');
		});
	}
	
};

