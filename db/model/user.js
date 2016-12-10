/**
 * Created by hhu on 2016/4/27.
 */

var _User = new global.mongoose.Schema({
    link_id: String,
    cell: String,
    name: String,
    password: String,
    role: { type: Number, default: 0, min:0, max:1 }, // 0: registered; 1: authorized;
    created: {type : Date, default: Date.now},
    updated: {type : Date, default: Date.now},
    icon: String,
    gender: String,
    birthdate:{type: Date},
    sin: String,
    locked_count: Number,
    apply: {type : Boolean, default: true}
});

module.exports =  mongoose.model('user', _User);