/**
 * Created by harry on 16/9/13.
 */
var Schema = global.mongoose.Schema;

var _Survey = new Schema({

        name: { type: String, required: true, trim: true }, // Survey section name
        department: { type: Schema.Types.ObjectId, ref: 'department', required: true },
        cat: { type: Schema.Types.ObjectId, ref: 'survey_cat', required: true },
        questions: [
            {
                question: { type: String, required: true, trim: true },
                is_inline: { type: Boolean, default: false },
                weight: { type: Number, default: 0 },
                required: { type: Boolean, default: true },
                order: { type: Number },
                answer_type: { type: Number, required: true, min: 0, max: 3 }, // 0: boolean; 1: radio; 2: multiple; 3: text
                options: [
                    {
                        answer: { type: String, required: true },
                        input_required: { type: Boolean, default: false },
                        input: { type: String, trim: true },
                        hint: { type: String },
                        weight: { type: Number },
                        selected: { type: Boolean }
                    }
                ],
                apply: { type: Boolean }
            }
        ],
        apply: { type: Boolean, default: true }
    },
    {
        timestamps: true
    });

module.exports =  mongoose.model('survey_template', _SurveyTemplate);