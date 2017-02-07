/**
 * Created by ehuhang on 12/2/2016.
 */
var Schema = global.mongoose.Schema;

var _UserFeedback = new Schema({
        user: {type: Schema.Types.ObjectId, ref: 'user', required: true },      // from
        doctor: {type: Schema.Types.ObjectId, ref: 'doctor', required: true },  // to
        type: { type: Number, required: true }, // 1: 不良反应反馈; 2: 联合用药
        name: { type: String, required: true }, // adverse reaction name if type==1; medicine name if type==2
        how: { type: String }, // 如何用药, available only type==2
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date },
        notes: { type: String },
        status: { type: Number, default: 0 } // 0: after user sent; 1. after doctor read;
    },
    {
        timestamps: true
    });

module.exports =  mongoose.model('user_feedback', _UserFeedback);