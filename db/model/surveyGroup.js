/**
 * Created by harry on 16/9/13.
 */
var Schema = global.mongoose.Schema;

var _SurveyGroup = new Schema({

    //
        name: { type: String, required: true, trim: true }, // Survey group name
        desc: { type: String },
        surveys: [
            {
                survey: { type: Schema.Types.ObjectId, ref: 'survey', required: true }
            }
        ],
    },
    {
        timestamps: true
    });

module.exports =  mongoose.model('survey_group', _SurveyGroup);