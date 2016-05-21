/**
 * Created by hhu on 2016/5/20.
 */

var Schema = global.mongoose.Schema;

var _Booking = new Schema({

    user: {type: Schema.Types.ObjectId, ref: 'user', required: true }, // 病患
    doctor: {type: Schema.Types.ObjectId, ref: 'doctor', required: true }, // 药师
    schedule: {type: Schema.Types.ObjectId, ref: 'schedule', required: true }, // 预约
    status: Number,
    score: {type: Number, min: 1, max: 10},
    created: {type : Date, default: Date.now}
});

module.exports =  mongoose.model('booking', _Booking);