/**
 * Created by hhu on 2016/5/14.
 */

var Schema = global.mongoose.Schema;

var _Chat = new Schema({

    room: {type: Schema.Types.ObjectId, ref: 'chatroom' }, // 聊天室
    direction: Number, // 消息方向：   0： user->doctor;      1: doctor->user
    type: Number, // 消息類別： 0：Text；      1：圖片；      2：語音；       4：視頻；
    data: String,
    created: {type : Date, default: Date.now}
});

module.exports =  mongoose.model('chat', _Chat);