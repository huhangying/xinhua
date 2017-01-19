/**
 * Created by hhu on 2016/4/27.
 */
var Schema = global.mongoose.Schema;

var _User = new Schema({
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
    admissionNumber: { type: String},
    visitedDepartments: [
        { type: Schema.Types.ObjectId, ref: 'department' }
    ], //用来判定应该使用初诊问卷还是复诊问卷
    locked_count: Number,
    apply: {type : Boolean, default: true}
});

module.exports =  mongoose.model('user', _User);