/**
 * Created by harry on 16/11/29.
 */
var Schema = global.mongoose.Schema;

var _AdverseReaction = new Schema({
        department: { type: Schema.Types.ObjectId, ref: 'department', required: true },
        name: { type: String, required: true, trim: true },
        isCommon: { type: Boolean },
        apply: { type: Boolean, default: true }
    });

module.exports =  mongoose.model('adverse_reaction', _AdverseReaction);