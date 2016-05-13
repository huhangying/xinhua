/**
 * Created by hhu on 2016/5/9.
 */

var _Symptom = new global.mongoose.Schema({

        name: String,
        desc: {type : String, select: false},
        //created: {type : Date, default: Date.now},
        //updated: {type : Date, default: Date.now},
        apply: {type : Boolean, default: true, select: false}
    });

module.exports =  mongoose.model('symptom',_Symptom);