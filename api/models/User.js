/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
const bcrypt = require('bcrypt');
module.exports = {

	attributes: {
	    first_name: {type: 'string'},
	    last_name: { type: 'string'},
	    email: { type: 'string', required: true, unique: true}
	},

	save: function (data, cb){
		// sails.log.debug("User model ", data);
		this.create(data).exec(function(err, result){
			if(err){
				sails.log.debug("err --->", err.code, err.raw.errmsg);
				cb({code: err.code, msg: err.raw.errmsg})
			}else{
				cb(null, result);
			}
		});
	},

	findAndListOfUsers: function(input, cb){
		sails.log.debug("data", input);
		User.findOne({email: input.email}).exec(function(err, user){
			if(err){
				cb(err);
			}else if(!user){
				cb({err: 'Could not find email,' + input.email + ' sorry.'});
			}else{
				sails.log.debug("user found", user);

				bcrypt.compare(input.pass, user.pass, function(err, result){
					if(result) {
                		//password is a match
                		sails.log.debug("pass match", result);
                		
                		cb(null, user);
                	}else {
                		//password is not a match
                		sails.log.error("pass not match", err);
                		cb({err: 'Email and password combination do not match'});
                	}
				})
			}
		})
	}


};

