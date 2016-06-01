/**
 * Created by hhu on 2016/5/14.
 */
var Chat = require('../model/chat.js');
var ChatroomService =  require('./chatroom.js');

module.exports = {

    // for API access
    SendMsg: function (req, res) {

        var chat = req.body;
        if (!chat) return res.sendStatus(400);


        // check input(chatroom, direction, type, data)
        if (!chat.user || !chat.doctor || !chat.data) {
            console.log(JSON.stringify(chat));
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }

        // find chatroom. create one if not existed.

        ChatroomService.GetAndUpdateChatroom(chat.user, chat.doctor, chat.direction, chat.username)
            .then(function(chatroom) { // promise resolved
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!chatroom){
                    return Status.returnStatus(res, Status.CHATROOM_ERROR);
                }

                console.log(JSON.stringify(chatroom));

                Chat.create({
                        chatroom: chatroom._id,
                        direction: chat.direction,
                        type: chat.type,
                        data: chat.data
                    },
                    function (_err, raw) {
                        if (_err) {
                            return Status.returnStatus(res, Status.ERROR, _err);
                        }

                        return res.send(raw);
                    });
            },
            function(err){ // promise rejected
                return Status.returnStatus(res, Status.ERROR, err);
            });

    },

    LoadDoctorMsg: function (req, res) {
        if (req.params && req.params.id) {
            req.body = {
                direction: 1,
                chatroom: req.parames.id
            };
            return this.LoadMsgByChatroom(req, res);
        }
    },

    LoadUserMsg: function (chatroom) {
        if (req.params && req.params.id) {
            req.body = {
                direction: 0,
                chatroom: req.parames.id
            };
            return this.LoadMsgByChatroom(req, res);
        }
    },

    ReceiveMsg: function (req, res) {

        var chat = req.body;
        if (!chat) return res.sendStatus(400);

        // check input(chatroom, direction)
        if (!chat.chatroom || !chat.direction) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }

        // reset chatroom
        var ret = ChatroomService.ResetChatroom(chat.chatroom, chat.direction);
        if (ret < 0) {
            return Status.returnStatus(res, Status.FAILED);
        }
        else if (ret == 0) {
            return Status.returnStatus(res, Status.NO_MESSAGE);
        }
        else {
            //todo: should not count the peers.
            var limit = 20; // 20 is a default
            if (chat.limit){
                var _limit = _.parseInt(chat.limit);
                if (_limit > limit) {
                    limit = _limit;
                }
            }

            Chat.find({chatroom: chat.chatroom})
                .sort({created: -1})
                .limit(limit)
                .exec(function (err, items) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!items || items.length < 1) {
                        return Status.returnStatus(res, Status.NULL);
                    }

                    return res.json(items);
                });

        }

    },


    // 根据Chatroom ID 获取聊天记录(包括自己的)
    LoadMsgByChatroom: function (req, res) {
        // 获取请求数据（json）
        var chat = req.body;
        if (!chat) return res.sendStatus(400);

        Chat.find({chatroom: chat.chatroom, direction: chat.direction })
            .sort({created: -1})
            .limit(20)
            .exec(function (err, items) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!items || items.length < 1) {
                    return Status.returnStatus(res, Status.NULL);
                }

                return res.json(items);
            });
    },


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
        if (!chat.chatroom || !chat.direction || !chat.type || !chat.data) {
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

            Chat.findOne({_id: req.params.id}, function (err, item) {
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
                    res.json(raw);
                });

            });
        }
    },

}