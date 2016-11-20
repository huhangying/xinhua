/**
 * Created by harry on 16/11/20.
 */
var Schema = global.mongoose.Schema;

var _PageCat = new Schema({
        department: { type: Schema.Types.ObjectId, ref: 'department', required: true },
        name: { type: String, required: true, trim: true }, // page Cat name
        desc: { type: String },
        apply: { type: Boolean, default: true }
    },
    {
        timestamps: true
    });

module.exports =  mongoose.model('page_cat', _PageCat);