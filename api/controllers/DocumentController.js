/**
 * DocumentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
'user strict';


module.exports = {
	uploadAndRegister:  function(req, res){
		console.log("req", req.body);

		let reuslt =  Document.save(req.body);
		// .then(result => {
		// 	console.log("result", result);
		// })
		// .catch(error=>{
		// 	console.log("error", error);
		// })
	}

};

