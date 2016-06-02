/**
 * Created by hhu on 2016/5/14.
 */

var Schema = global.mongoose.Schema;

var _Chat = new Schema({

    chatroom: {type: Schema.Types.ObjectId, ref: 'chatroom', required: true }, // 聊天室
    direction: Number, // 消息方向：   0： user->doctor;      1: doctor->user
    type: Number, // 消息類別： 0：Text；      1：圖片；      2：語音；       4：視頻；
    data: String,
    created: {type : Date, default: Date.now},
    read: {type: Number, default: 0}
});

_Chat.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};

module.exports =  mongoose.model('chat', _Chat);