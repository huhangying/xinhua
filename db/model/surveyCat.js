/**
 * Created by harry on 16/9/13.
 */
var Schema = global.mongoose.Schema;

var _SurveyCat = new Schema({

        name: { type: String, required: true, trim: true }, // Survey Cat name
        desc: { type: String },
        apply: { type: Boolean, default: true }
    },
    {
        timestamps: true
    });

module.exports =  mongoose.model('survey_cat', _SurveyCat);