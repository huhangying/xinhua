/**
 * Created by harry on 16/11/29.
 */
var Schema = global.mongoose.Schema;

var _MessageLog = new Schema({

            doctor: {type: Schema.Types.ObjectId, ref: 'doctor', required: true },  // from
            user: {type: String, required: true },      // to: 微信的ID
            type: { type: Number, default: 0 }, // 0: undefined; 1: survey; 2: articlePage
            title: { type: String, trim: true },
            description: { type: String, trim: true },
            url: { type: String },
            picurl: { type: String },
            received: { type: Boolean, default: false },
            tryCount: { type: Number, default: 1 }
    },
    {
        timestamps: true
    });

module.exports =  mongoose.model('message_log', _MessageLog);