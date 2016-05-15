/**
 * Created by hhu on 2016/5/14.
 */
var Chat = require('../model/chat.js');

module.exports = {

    // for test
    GetAll: function (req, res) {

        Chat.find({})
            .sort({created: -1})
            .exec(function (err, items) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!items || items.length < 1) {
                    return Status.returnStatus(res, Status.NULL);
                }

                res.json(items);
            });
    },

    // 根据ID获取详细信息
    GetById: function (req, res) {

        if (req.params && req.params.id) {

            var result = Chat.findOne({_id: req.params.id})
                .exec(function (err, item) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!items) {
                        return Status.returnStatus(res, Status.NULL);
                    }

                    res.json(item);
                });
        }
    },


    // 创建聊天
    Add: function (req, res) {

        // 获取请求数据（json）
        var chat = req.body;
        if (!chat) return res.sendStatus(400);

        // check input(chatroom, direction, type, data)
        if (!chat.chatroom | !chat.direction | !chat.type | !chat.data) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }

        Chat.create({

            chatroom: chat.chatroom,
            direction: chat.direction,
            type: chat.type,
            data: chat.data
        }, function (err, raw) {
            if (err) {
                return Status.returnStatus(res, Status.ERROR, err);
            }

            return res.send(raw);
        });

    },

    //todo: reverse the last one


    DeleteById: function (req, res) {
        if (req.params && req.params.id) { // params.id is chat ID
            var id = req.params.id;
            // 获取数据（json）
            var doctor = req.body;
            if (!doctor) return res.sendStatus(400);


            Chat.findOne({_id: id}, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item){
                    return Status.returnStatus(res, Status.NULL);
                }

                //
                item.remove(function(err, raw){
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }
                    res.send('remove chatroom success: ', raw);
                });

            });
        }
    },

}