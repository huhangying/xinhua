/**
 * Created by hhu on 2016/5/7.
 */

var Schema = global.mongoose.Schema;

var _Doctor = new Schema({

    user_id: {type: String, required: true},
    password: String,
    name: {type: String, required: true},
    role: {type: Number, required: true, default: 0 },
    department: {type: Schema.Types.ObjectId, ref: 'department', required: true },
    title: String,
    tel: String,
    cell: String,
    gender: String,
    hours: String,
    expertise:  String,
    bulletin: String,
    honor: String,
    icon: String,

    created: {type : Date, default: Date.now},
    updated: {type : Date, default: Date.now},
    locked_count: Number,
    apply: {type : Boolean, default: true}
});

module.exports =  mongoose.model('doctor', _Doctor);