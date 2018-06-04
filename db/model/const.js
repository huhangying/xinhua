/**
 * Created by harry on 16/7/12.
 */
var Schema = global.mongoose.Schema;

var _Const = new Schema({
  hid: { type: String },
    name: {type: String, required: true},
    desc: {type: String},
    type: {type: Number, default: 0}, // 0: string; 1: multiple line string; 2: boolean; 3: number;
    value: {type: String, required: true}
});

module.exports =  mongoose.model('const', _Const);