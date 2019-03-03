/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */
const bcrypt = require('bcrypt');


module.exports.bootstrap = function(cb) {

  // By convention, this is a good place to set up fake data during development.
 	pass = 'admin@123';
  	bcrypt.hash(pass, 10, function(err, hash) {
        if (err) return cb(err);
        
        encryptedPassword = hash;

        //Delete the passwords so that they are not stored in the DB
        delete pass;

	  	User.findOrCreate({email: 'admin@kyc.com'}, {'type':'admin', 'email':'admin@kyc.com', 'pass': encryptedPassword}).exec(function(err, user){
	  		if(err){
	  			sails.log.error("error", err);
	  		}else{
	  			return sails.log.debug("Admin User Added! from bootstrap");
	  		}
	  	});
        //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
    });

	cb();  

};
