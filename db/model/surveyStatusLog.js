var Schema = global.mongoose.Schema;

var _SurveyStatusLog = new Schema({
        key: { type: String },
        // doctor: { type: Schema.Types.ObjectId, ref: 'doctor', required: true },
        // user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
        type: { type: Number, required: true, min: 0, max: 6 },
        status: { type: Number, default: 0 }
    },
    {
        timestamps: true
    });

module.exports =  mongoose.model('survey_status_log', _SurveyStatusLog);