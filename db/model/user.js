/**
 * Created by hhu on 2016/4/27.
 */

var _User = new global.mongoose.Schema({
    cell: String,
    name: String,
    password: String,
    created: {type : Date, default: Date.now},
    updated: {type : Date, default: Date.now},
    icon: String,
    gender: String,
    locked_count: Number,
    apply: {type : Boolean, default: true}
});

module.exports =  mongoose.model('user', _User);