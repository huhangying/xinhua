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
        if ((!chat.user || !chat.doctor) && (!chat.chatroom) || !chat.data) {
            //console.log(JSON.stringify(chat));
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }

        // find chatroom. create one if not existed.

        // 如果用户发给药师的消息, 先检查药师的状态,如果不是空闲, 则会发送自动回复消息
        ChatroomService.GetAndUpdateChatroom(chat.user, chat.doctor, chat.direction, chat.chatroom)
            .then(
                function(chatroom) { // promise resolved

                    if (!chatroom){
                        return Status.returnStatus(res, Status.CHATROOM_ERROR);
                    }

                    //console.log(JSON.stringify(chatroom));

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

                            // 确保比上个消息慢
                            // doctor。status 是 ChatroomService.GetAndUpdateChatroom 返回的
                            if (chat.direction === "0" && chatroom.doctor && chatroom.doctor.status && chatroom.doctor.status > 0) {
                                // 自动回复消息
                                Chat.create({
                                        chatroom: raw.chatroom,
                                        direction: 1,
                                        type: raw.type,
                                        read: 0,
                                        data: '自动回复消息' //todo:
                                    },
                                    function (__err, _raw) {
                                        if (__err) {
                                            return Status.returnStatus(res, Status.ERROR, _err);
                                        }

                                        return res.send(raw);
                                    });
                            }
                            else {
                                return res.send(raw);
                            }

                        });

                },
                function(err){ // promise rejected
                    return Status.returnStatus(res, Status.ERROR, err);
                });

    },

    // 根据Chatroom ID 获取聊天记录(包括自己的)
    LoadMsg: function (req, res) {
        if (req.params && req.params.chatroom) {

            Chat.find({chatroom: req.params.chatroom})
                .sort({created: -1}) // 取最新的消息
                .limit(20)
                .exec(function (err, items) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!items || items.length < 1) {
                        return Status.returnStatus(res, Status.NULL);
                    }

                    return res.json(items.reverse());
                });
        }

    },

    // 根据Chatroom ID 获取聊天记录(包括自己的)
    LoadDoctorMsg: function (req, res) {
        if (req.params && req.params.chatroom) {

            Chat.find({chatroom: req.params.chatroom, direction: 1 })
                .sort({created: 1})
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
        }

    },

    // 根据Chatroom ID 获取聊天记录(包括自己的)
    LoadUserMsg: function (req, res) {
        if (req.params && req.params.chatroom) {

            Chat.find({chatroom: req.params.chatroom, direction: 0 })
                .sort({created: 1})
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
        }

    },

    ReceiveMsg: function (req, res) {

        var chat = req.body;
        if (!chat) return res.sendStatus(400);

        // check input(chatroom, direction)
        if (!chat.chatroom) {
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

            Chat.find({chatroom: chat.chatroom, read: 0})
                .sort({created: 1})
                .limit(limit)
                .exec(function (err, items) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!items || items.length < 1) {
                        return Status.returnStatus(res, Status.NULL);
                    }

                    //todo: 这里的效率很差，以后改进。
                    // read 的计数器 +1
                    items.forEach(function(item){
                        item.read++;
                        item.save();
                    });

                    return res.json(items);
                });

            //Chat.findAndModify(
            //    {chatroom: chat.chatroom, read: 0},
            //    [],
            //    { $inc: { read: 1 } },
            //    {},
            //    function (err, items) {
            //        if (err) {
            //            return Status.returnStatus(res, Status.ERROR, err);
            //        }
            //
            //        if (!items || items.length < 1) {
            //            return Status.returnStatus(res, Status.NULL);
            //        }
            //        return res.json(items);
            //    }
            //);

        }

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
        if (!chat.chatroom || !chat.data) {
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

    UpdateById: function (req, res) {
        if (req.params && req.params.id) { // params.id is chat ID
            var id = req.params.id;

            var chat = req.body;
            if (!chat) return res.sendStatus(400);

            Chat.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item) {
                    return Status.returnStatus(res, Status.NULL);
                }

                if (chat.type)
                    item.type = chat.type;
                if (chat.data){
                    item.data = chat.data;
                }

                item.save(function (err, raw) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }
                    res.json(raw);
                });

            });
        }
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

    DeleteByChatroom: function (req, res) {
        if (req.params && req.params.chatroom) { // params.chatroom is chatroom

            Chat.remove({chatroom: req.params.chatroom}, function (err, items) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!items){
                    return Status.returnStatus(res, Status.NULL);
                }

                res.json(items);

            });
        }
    },

}