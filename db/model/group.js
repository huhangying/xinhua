/**
 * Created by hhu on 2016/5/20.
 */

var Schema = global.mongoose.Schema;

var _Group = new Schema({

    doctor: {type: Schema.Types.ObjectId, ref: 'doctor', required: true },
    name: {type: String, required: true},
    apply: {type : Boolean, default: true}
});

module.exports =  mongoose.model('group', _Group);