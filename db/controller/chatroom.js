/**
 * Created by hhu on 2016/5/15.
 */
var Chatroom = require('../model/chatroom.js');

module.exports = {

    GetAll: function (req, res) {

        Chatroom.find({})
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

    // 根据药师ID 获取相关的聊天室记录
    GetByDoctorId: function (req, res) {

        if (req.params && req.params.id) {

            Chatroom.find({doctor: req.params.id})
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
        }
    },

    // 根据患者ID 获取相关的聊天室记录
    GetByUserId: function (req, res) {

        if (req.params && req.params.id) {

            Chatroom.find({user: req.params.id})
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
        }
    },

    // 根据ID获取详细信息
    GetById: function (req, res) {

        if (req.params && req.params.id) {

            var result = Chatroom.findOne({_id: req.params.id, apply: true})
                .exec(function (err, items) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!items || items.length < 1) {
                        return Status.returnStatus(res, Status.NULL);
                    }

                    res.json(items);
                });
        }
    },


    // 创建聊天室
    FindOrAdd: function (req, res) {

        // 获取chatroom请求数据（json）
        var chatroom = req.body;
        if (!chatroom) return res.sendStatus(400);

        // name
        if (!chatroom.name) {
            return Status.returnStatus(res, Status.NO_NAME);
        }


        Chatroom.findOne({name: chatroom.name}) // check if existed
            .exec(function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                // 如果聊天室存在，直接返回
                if (item) {
                    return res.json(item);
                }

                // 不存在，创建
                Chatroom.create({

                    name: chatroom.name,
                    doctor: chatroom.doctor,
                    user: chatroom.user
                }, function (err, raw) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    return res.send(raw);
                });

            });
    },

    UpdateById: function (req, res) {
        if (req.params && req.params.id) { // params.id is chatroom ID
            var id = req.params.id;

            // 获取chatroom数据（json）,只能更新聊天室名
            var chatroom = req.body;
            if (!chatroom) return res.sendStatus(400);

            Chatroom.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item) {
                    return Status.returnStatus(res, Status.NULL);
                }

                if (chatroom.name)
                    item.name = chatroom.name;

                //console.log(JSON.stringify(item));

                //
                item.save(function (err, raw) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }
                    res.send('update chatroom name success: ', raw);
                });

            });
        }
    },


    DeleteById: function (req, res) {
        if (req.params && req.params.id) { // params.id is chatroom ID
            var id = req.params.id;
            // 获取数据（json）
            var doctor = req.body;
            if (!doctor) return res.sendStatus(400);


            Chatroom.findOne({_id: id}, function (err, item) {
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