/**
 * Created by harry on 17/1/9.
 */
var Schema = global.mongoose.Schema;

var _Notices = new Schema({
        
        notices: [
            {
                notice: { type: String, required: true, trim: true },
                days_to_start: { type: Number, required: true },
                during: { type: Number, required: true },
                require_confirm: { type: Boolean, default: true },
                apply: { type: Boolean, default: true }
            }
        ],
        apply: { type: Boolean, default: true }
    },
    {
        timestamps: true
    });

module.exports =  mongoose.model('notices', _Notices);