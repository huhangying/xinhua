/**
 * Created by harry on 16/12/26.
 */
var Schema = global.mongoose.Schema;

var _Diagnose = new Schema({

        doctor: { type: Schema.Types.ObjectId, ref: 'doctor', required: true },
        user: { type: Schema.Types.ObjectId, ref: 'user', required: true },

        booking: { type: Schema.Types.ObjectId, ref: 'booking' },
        surveys: [
            {type: Schema.Types.ObjectId, ref: 'survey'}
        ],
        // labResult: [
        //     {type: Schema.Types.ObjectId, ref: 'survey'}
        // ],
        assessment:  {
            score: { type: Number, min: 1, max: 10 },
            assessment: {type: Schema.Types.ObjectId, ref: 'survey'}
        },

        prescription: [

        ],
        notices: [
            {
                name: { type: String }
            }
        ],
        statue: { type: Number, min: 0, max: 3, default: 0 }    // 0: assigned to user;  1: user finished; 2: doctor saved; 3: archived
    },
    {
        timestamps: true
    }
);

module.exports =  mongoose.model('diagnose', _Diagnose);