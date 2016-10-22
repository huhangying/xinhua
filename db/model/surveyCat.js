/**
 * Created by harry on 16/9/13.
 */
var Schema = global.mongoose.Schema;

var _SurveyCat = new Schema({
        department: { type: Schema.Types.ObjectId, ref: 'department', required: true },
        name: { type: String, required: true, trim: true }, // Survey Cat name
        desc: { type: String },
        fixed: { type: Boolean, default: false },
        apply: { type: Boolean, default: true }
    },
    {
        timestamps: true
    });

module.exports =  mongoose.model('survey_cat', _SurveyCat);