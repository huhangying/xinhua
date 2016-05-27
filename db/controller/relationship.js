/**
 * Created by hhu on 2016/5/20.
 */
var Relationship = require('../model/relationship.js');

module.exports = {

    GetAll: function (req, res) {

        Relationship.find()
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

            var result = Relationship.findOne({_id: req.params.id, apply: true})
                .exec(function (err, item) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!item) {
                        return Status.returnStatus(res, Status.NULL);
                    }

                    res.json(item);
                });
        }
    },

    // 根据医生ID 获取相关的关系组
    GetByDoctorId: function (req, res) {

        if (req.params && req.params.id) {

            Relationship.find({doctor: req.params.id, apply: true})
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

    // 根据患者ID 获取医患关系
    GetByUserId: function (req, res) {

        if (req.params && req.params.id) {

            Relationship.find({user: req.params.id, apply: true})
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


    // 创建医患关系
    FindOrAdd: function (req, res) {

        // 获取请求数据（json）
        var relationship = req.body;
        if (!relationship) return res.sendStatus(400);

        // check doctor, user
        if (!relationship.doctor) {
            return Status.returnStatus(res, Status.NO_DOCTOR);
        }
        if (!relationship.user) {
            return Status.returnStatus(res, Status.NO_USER);
        }


        Relationship.findOne({doctor: relationship.doctor, user: relationship.user}) // check if existed
            .exec(function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                // 如果存在，直接返回
                if (item) {

                    // check if group is different, update it.
                    if (item.group != relationship.group){
                        item.group = relationship.group;
                        item.save();
                    }

                    return res.json(item);
                }

                // 不存在，创建
                Relationship.create({

                    user: relationship.user,
                    doctor: relationship.doctor,
                    group: relationship.group
                }, function (err, raw) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    return res.send(raw);
                });

            });
    },

    UpdateById: function (req, res) {
        if (req.params && req.params.id) { // params.id is group ID
            var id = req.params.id;

            // 获取数据（json）,只能更新关系组名
            var relationship = req.body;
            if (!relationship) return res.sendStatus(400);

            Relationship.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item) {
                    return Status.returnStatus(res, Status.NULL);
                }

                item.group = relationship.group;

                //console.log(JSON.stringify(item));

                //
                item.save(function (err, raw) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }
                    res.json(raw);
                });

            });
        }
    },


    DeleteById: function (req, res) {
        if (req.params && req.params.id) { // params.id is chatroom ID

            Relationship.findOne({_id: req.params.id}, function (err, item) {
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