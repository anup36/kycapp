/**
 * Document.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
        first_name: {type: 'string'},
        last_name: { type: 'string'},
        email: {type:'string', required: true, isEmail: true}
  },

  // save: async function (data){
  //   return await Document.create(data);
  // }


};

