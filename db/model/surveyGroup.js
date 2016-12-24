/**
 * Created by harry on 16/9/13.
 */
var Schema = global.mongoose.Schema;

var _SurveyGroup = new Schema({
        department: { type: Schema.Types.ObjectId, ref: 'department', required: true },
        type: { type: Number, required: true, min: 0, max: 5 },
        name: { type: String, required: true, trim: true }, // Survey group name
        desc: { type: String },
        order: { type: Number },
        apply: { type: Boolean, default: true }
    },
    {
        timestamps: true
    });

module.exports =  mongoose.model('survey_group', _SurveyGroup);