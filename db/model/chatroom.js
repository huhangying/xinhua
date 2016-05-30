/**
 * Created by hhu on 2016/5/14.
 */

var Schema = global.mongoose.Schema;

var _ChatRoom = new Schema({

    name: String, // 聊天室名([user name]|[doctor name])
    user: {type: Schema.Types.ObjectId, ref: 'user', required: true },
    doctor: {type: Schema.Types.ObjectId, ref: 'doctor', required: true },
    doctor_unread: { type: Number, default: 0 },
    user_unread: { type: Number, default: 0 },
    created: {type : Date, default: Date.now },
    updated: {type : Date, default: Date.now }

});

module.exports =  mongoose.model('chatroom', _ChatRoom);