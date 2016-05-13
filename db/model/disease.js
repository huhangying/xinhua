/**
 * Created by hhu on 2016/5/9.
 */

var Schema = global.mongoose.Schema;

var _Disease = new Schema({

    department: {type: Schema.Types.ObjectId, ref: 'department' },
    name: String,
    desc: String,
    symptoms:[{type: Schema.Types.ObjectId, ref: 'symptom' }],
    //symptoms:[{symptom:{type: Schema.Types.ObjectId, ref: 'symptom' }}],
    order: Number,
    //created: {type : Date, default: Date.now},
    //updated: {type : Date, default: Date.now},
    apply: {type : Boolean, default: true}
});

module.exports =  mongoose.model('disease', _Disease);