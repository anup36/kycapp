/**
 * UsersControllerController
 *
 * @description :: Server-side logic for managing Userscontrollers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


const async = require('async');

module.exports = {
	register:  function(req, res){

		sails.log.debug(req.body);

		let input = req.body;
		const fileInputFileds = ['passport', 'pancard'];
		let inputObjectForAsync = [];
		let docsUrls = [];

		async.map(fileInputFileds, function(field, callback){
			inputObjectForAsync.push(function(cb){
										req.file(field).upload({
											maxBytes: 10000000,
											dirname: require('path').resolve(sails.config.appPath, 'assets/images')
										},function (err, uploadedFiles) {
										  	if(err){
										  		sails.log.error("err Uploading Docs", err);
										  		return cb(err);
										  	}else if (uploadedFiles.length === 0){
										      	return cb(null, null);
										    }else{
										    	// sails.log.debug("uploadedFiles[0]", uploadedFiles[0]);
										    	let urlsObj = {};
										    	urlsObj[uploadedFiles[0].field] = { 'filename': uploadedFiles[0].filename, 'path': 'assets/images', 'status': 'NotVerified' };
										    	docsUrls.push(urlsObj);

										    	cb(null, null);

										    }
										})
									})
			callback();
		}, function(err, object){
			if(err){
				sails.log.error("err", err);
				return res.serverError(err);
			}else{
				async.parallel(inputObjectForAsync, function(err, urls){
					if(err){
						sails.log.error("err", err);
						return res.serverError(err);
					}else{
						// sails.log.debug("url", imageUrls);
						input.docs = docsUrls;
						User.save(input, function(err, reuslt){
							if(err){
								sails.log.error("User create error", err);
								res.json(err);
							}else{
								res.json({statusCode:200, msg: "User Registered Succesfully!"});
							}
						});						
					}
				});
			}
		});
	},

	login: function(req, res){
		sails.log.debug("req.body", req.body);
		User.findAndListOfUsers(req.body, function(err, user){
			if(err){
				res.json(err);
			}else{
				req.session.authenticated = true;
				req.session.User = user;				
				res.redirect('/dashboared');
			}
		})
	},

	getAllUsers: function(req, res){
		User.find().exec(function(err, users){
			if(err){
				res.serverError(err);
			}else{
				res.view('pages/userList', {users: users})
			}
		})
	},

	update: function(req, res){
		var input = {id: req.body.id, type: req.body.type};
		sails.log.debug("input", input);

		User.findOne(input.id).exec(function(err, user){
			if(err){
				res.json(err);
			}else if(!user){
				sails.log.error("user not found", user);
				res.json({err: "User Not found"});
			}else{
				sails.log.debug("user", user.docs);

				_.map(user.docs, function(doc){
					// sails.log.debug("doc[input.type]", doc[input.type]);
					if(doc[input.type]){
						doc[input.type].status = "Verified";
					}
				})
				sails.log.debug("update", user)
				User.update({id: input.id}, {docs: user.docs}).exec(function(err, result){
					if(err){
						sails.log.error("err", err);
						res.serverError(err);
					}else{
						sails.log.debug("result", result);
						res.json({statusCode: 200});
					}
				})

			}
		})
	}

};
