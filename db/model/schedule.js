/**
 * Created by hhu on 2016/5/20.
 */
var Schema = global.mongoose.Schema;

var _Schedule = new Schema({

    doctor: {type: Schema.Types.ObjectId, ref: 'doctor', required: true }, // 药师
    period: {type: Schema.Types.ObjectId, ref: 'period', required: true },
    date: {type: Date, required: true }, // 日期
    limit: {type: Number, min: 0, max: 100 },
    created: {type : Date, default: Date.now },
    apply: { type: Boolean, default: true }
});

module.exports =  mongoose.model('schedule', _Schedule);