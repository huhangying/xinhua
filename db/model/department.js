/**
 * Created by hhu on 2016/5/8.
 */

var _Department = new global.mongoose.Schema({

    name: String,
    desc: String,
    Order: Number,
    //created: {type : Date, default: Date.now},
    //updated: {type : Date, default: Date.now},
    apply: {type : Boolean, default: true}
});

module.exports =  mongoose.model('department', _Department);