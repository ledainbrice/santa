/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'new': function(req, res){
		res.view('session/new');
	},

	create: function(req,res,next){
		var bcrypt = require('bcryptjs');

		if(!req.param('email') || !req.param('password')){
			var usernamepasswordRequiredError = [{name:'usernamePasswordrequired',message:'You must enter both username and password.'}];
			req.session.flash ={ err: usernamepasswordRequiredError}
			res.redirect('session/new');
			return;
		}
		User.findOneByEmail(req.param('email'),function foundUser(err,user){
			if(err) return next(err);
			if(!user){
				var noAccountError= [{name: 'noAccount', message: 'The email adress '+req.param('email')+' not found.'}];
				req.session.flash ={
					err: noAccountError
				}
				res.redirect('session/new');
				return;
			}

			bcrypt.compare(req.param('password'),user.encryptedPassword,function(err,valid){
				if(err) return next(err);
				if(!valid){
					var usernamepasswordMismatchError = [{name:'usernamePasswordMismatch',message:'Invalid username and password combination.'}];
					req.session.flash ={ err: usernamepasswordMismatchError}
					res.redirect('session/new');
					return;
				}
				req.session.authenticated = true;
				req.session.User = user;

				user.online =true;
				user.save(function(err,user){
					if(err) return next(err);
				});
				User.publishUpdate(user.id,{
					loggedIn:true,
					id: user.id
				});
				console.log(user);
				if(!user.admin){
					res.redirect('/user/show/'+user.id);	
					return;
				}
				res.redirect('/user/index/');
			});
		});	
	},

	destroy: function(req,res,next){
		User.findOne(req.session.User.id, function foundUser(err,user){
			var userId = req.session.User.id;
			User.update(userId, {online:false}, function(err){
				if(err) return next(err);
				req.session.destroy();
				res.redirect('session/new');
			});
		});	
	}
};

