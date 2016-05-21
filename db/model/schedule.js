/**
 * Created by hhu on 2016/5/20.
 */
var Schema = global.mongoose.Schema;

var _Schedule = new Schema({

    doctor: {type: Schema.Types.ObjectId, ref: 'doctor' }, // 药师
    name: String, // 可以设置成 上午和下午
    from: {type: Date}, // 日期
    to: {type: Date},
    limit: {type: Number, min: 1, max: 100 },
    created: {type : Date, default: Date.now}
});

module.exports =  mongoose.model('schedule', _Schedule);