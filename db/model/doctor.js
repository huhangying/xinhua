/**
 * Created by hhu on 2016/5/7.
 */

var Schema = global.mongoose.Schema;

var _Doctor = new Schema({

    user_id: {type: String, required: true},
    password: {type: String, required: true},
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
    status: { type: Number, default: 0, min: 0, max: 3 },  // 0: idle, 1: busy; 2: away; 3: offline
    shortcuts: { type: String }, // 快捷回复, separated by '|'

    created: {type : Date, default: Date.now },
    updated: {type : Date, default: Date.now },
    locked_count: Number,
    apply: {type : Boolean, default: true },
    order: { type: Number, default: 0 }
});

module.exports =  mongoose.model('doctor', _Doctor);