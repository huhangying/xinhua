/**
 * Created by harry on 16/6/30.
 */
var Schema = global.mongoose.Schema;

var _Period = new Schema({

    name: String, // 可以设置成 上午和下午
    from: {type: Number, required: true }, // time (unit: minute)
    to: {type: Number},
});

module.exports =  mongoose.model('period', _Period);