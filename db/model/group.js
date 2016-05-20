/**
 * Created by hhu on 2016/5/20.
 */

var _Group = new global.mongoose.Schema({

    doctor: {type: Schema.Types.ObjectId, ref: 'doctor' },
    name: String,
    apply: {type : Boolean, default: true}
});

module.exports =  mongoose.model('group', _Group);