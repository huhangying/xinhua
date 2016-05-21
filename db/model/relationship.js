/**
 * Created by hhu on 2016/5/20.
 */

var Schema = global.mongoose.Schema;

var _Relationship = new Schema({

    group:  {type: Schema.Types.ObjectId, ref: 'group' },
    doctor: {type: Schema.Types.ObjectId, ref: 'doctor' },
    user: {type: Schema.Types.ObjectId, ref: 'user' },
    apply: {type : Boolean, default: true}
});

module.exports =  mongoose.model('relationship', _Relationship);