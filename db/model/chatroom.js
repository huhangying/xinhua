/**
 * Created by hhu on 2016/5/14.
 */

var Schema = global.mongoose.Schema;

var _ChatRoom = new Schema({

    name: String, // 聊天室名
    user: {type: Schema.Types.ObjectId, ref: 'user' },
    doctor: {type: Schema.Types.ObjectId, ref: 'doctor' },
    created: {type : Date, default: Date.now}
});

module.exports =  mongoose.model('chatroom', _ChatRoom);