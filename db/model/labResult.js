/**
 * Created by harry on 17/1/20.
 */
var Schema = global.mongoose.Schema;

var _labResult = new Schema({

        doctor: { type: Schema.Types.ObjectId, ref: 'doctor', required: true },
        user: { type: Schema.Types.ObjectId, ref: 'user', required: true },

        name: { type: String, required: true, trim: true },
        list: [
            {
                item: { type: String, required: true, trim: true },
                result: { type: String, required: true },
                type: { type: Number }
            }
        ],
        testDate: { type: Date },
        apply: { type: Boolean, default: true }
    },
    {
        timestamps: true
    });

module.exports =  mongoose.model('lab_result', _labResult);