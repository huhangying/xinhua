/**
 * Created by harry on 16/7/12.
 */
var Schema = global.mongoose.Schema;

var _Const = new Schema({

    name: {type: String, required: true},
    type: {type: Number, default: 0}, // 0: string; 1: boolean; 2: number;
    value: {type: String, required: true}
});

module.exports =  mongoose.model('const', _Const);