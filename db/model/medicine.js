/**
 * Created by harry on 16/10/2.
 */
var Schema = global.mongoose.Schema;

var _Medicine = new Schema({

        name: { type: String, required: true, trim: true },
        desc: { type: String, trim: true },
        unit: { type: String },
        capacity: { type: Number },
        usage: { type: String }, // 内服外用等
        dosage: {
            period: { type: Number, min: 0, required: true }, // 每几天
            way: { type: String, trim: true }, // 饭前/饭后/隔几小时
            frequency: { type: Number, required: true },
            count: { type: Number, min: 0 }
        },
        // cat: { type: Schema.Types.ObjectId, ref: 'medicine_cat', required: true },
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

module.exports =  mongoose.model('medicine', _Medicine);