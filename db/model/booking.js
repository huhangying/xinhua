/**
 * Created by hhu on 2016/5/20.
 */

var Schema = global.mongoose.Schema;

var _Booking = new Schema({

    user: {type: Schema.Types.ObjectId, ref: 'user', required: true }, // 病患
    doctor: {type: Schema.Types.ObjectId, ref: 'doctor', required: true }, // 药师
    schedule: {type: Schema.Types.ObjectId, ref: 'schedule', required: true }, // 预约
    date: { type: Date }, // for 搜索
    status: {type: Number, default: 0}, // 1: 预约完成,可用状态 2: user cancel; 3: doctor cancel; 4: user not show; 5: finished
    score: {type: Number, min: 0, max: 10, default: 0},//0: not started yet.
    created: {type : Date, default: Date.now}
});

module.exports =  mongoose.model('booking', _Booking);