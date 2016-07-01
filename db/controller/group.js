/**
 * Created by hhu on 2016/5/20.
 */
var Group = require('../model/group.js');

module.exports = {

    GetAll: function (req, res) {

        Group.find()
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

    GetAllPopulated: function (req, res) {

        Group.find()
            .populate('doctor')
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

            var result = Group.findOne({_id: req.params.id, apply: true})
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

            Group.find({doctor: req.params.id, apply: true})
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


    // 创建关系组
    FindOrAdd: function (req, res) {

        // 获取请求数据（json）
        var group = req.body;
        if (!group) return res.sendStatus(400);

        // name
        if (!group.name) {
            return Status.returnStatus(res, Status.NO_NAME);
        }


        Group.findOne({name: group.name}) // check if existed
            .exec(function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                // 如果存在，直接返回
                if (item) {
                    return Status.returnStatus(res, Status.EXISTED_NAME);
                }

                // 不存在，创建
                Group.create({

                    name: group.name,
                    doctor: group.doctor,
                    apply: group.apply || true
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
            var group = req.body;
            if (!group) return res.sendStatus(400);

            Group.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item) {
                    return Status.returnStatus(res, Status.NULL);
                }

                if (group.name)
                    item.name = group.name;
                if (group.doctor)
                    item.doctor = group.doctor;
                item.apply = group.apply || true;


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
        if (req.params && req.params.id) { // params.id is group ID

            Group.findOne({_id: req.params.id}, function (err, item) {
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