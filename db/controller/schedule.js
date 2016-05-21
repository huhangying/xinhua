/**
 * Created by hhu on 2016/5/21.
 */

var Schedule = require('../model/schedule.js');

module.exports = {

    GetAll: function (req, res) {

        Schedule.find({from: {$gte: (new Date())}})
            .sort({created: 1})
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

    // 根据药师ID 获取相关的门诊
    GetByDoctorId: function (req, res) {

        if (req.params && req.params.did) {

            Schedule.find({doctor: req.params.did, from: {$gte: (new Date())}})
                .sort({created: 1})
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

    // 根据药师ID和日期 获取相关的门诊
    GetByDoctorIdAndDate: function (req, res) {

        if (req.params && req.params.did && req.params.date) {

            var _date = req.params.date.split('-'); // date format: YYYY-MM-DD
            Schedule.find({doctor: req.params.did, from: (new Date(_date[0], _date[1], _date[2]))})
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

            var result = Schedule.findOne({_id: req.params.id})
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


    // 创建门诊
    Add: function (req, res) {

        // 获取请求数据（json）
        var schedule = req.body;
        if (!schedule) return res.sendStatus(400);

        // doctor, from
        if (!schedule.doctor) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }
        if (!schedule.from) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }
        var dateArray = schedule.from.split('-');
        var _date_from = new Date(dateArray[0], dateArray[1], dateArray[2]);
        dateArray = schedule.to.split('-');
        var _date_to = new Date(dateArray[0], dateArray[1], dateArray[2]);

        // 不存在，创建
        Schedule.create({

            name: schedule.name,
            doctor: schedule.doctor,
            from: _date_from,
            to: _date_to,
            limit: schedule.limit
        }, function (err, raw) {
            if (err) {
                return Status.returnStatus(res, Status.ERROR, err);
            }

            return res.send(raw);
        });

    },

    UpdateById: function (req, res) {
        if (req.params && req.params.id) { // params.id is schedule ID
            var id = req.params.id;

            // 获取数据（json）,只能更新聊天室名
            var schedule = req.body;
            if (!schedule) return res.sendStatus(400);

            Schedule.findById(id)
                .exec( function (err, item) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!item) {
                        return Status.returnStatus(res, Status.NULL);
                    }

                    if (schedule.name)
                        item.name = schedule.name;
                    if (schedule.doctor)
                        item.doctor = schedule.doctor;

                    if (schedule.from){
                        item.from = new Date(schedule.from);
                    }
                    if (schedule.to){
                        item.to = new Date(schedule.to);
                    }
                    if (schedule.limit)
                        item.limit = schedule.limit;
                    //console.log(JSON.stringify(item));

                    //
                    item.save(function (err, raw) {
                        if (err) {
                            return Status.returnStatus(res, Status.ERROR, err);
                        }
                        res.send('update schedule success: ', raw);
                    });

                });
        }
    },


    DeleteById: function (req, res) {
        if (req.params && req.params.id) { // params.id is chatroom ID

            Schedule.findOne({_id: req.params.id}, function (err, item) {
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
                    res.send('remove schedule success: ', raw);
                });

            });
        }
    },


}