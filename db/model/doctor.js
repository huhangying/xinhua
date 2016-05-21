/**
 * Created by hhu on 2016/5/7.
 */

var Schema = global.mongoose.Schema;

var _Doctor = new Schema({

    user_id: String,
    password: String,
    name: String,
    department: String,
    title: String,
    tel: String,
    cell: String,
    gender: String,
    expertise:  String,
    bulletin: String,
    icon: String,

    created: {type : Date, default: Date.now},
    updated: {type : Date, default: Date.now},
    locked_count: Number,
    apply: {type : Boolean, default: true}
});

module.exports =  mongoose.model('doctor', _Doctor);