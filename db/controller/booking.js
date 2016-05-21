/**
 * Created by hhu on 2016/5/21.
 */

var Booking = require('../model/booking.js');

module.exports = {

    GetAll: function (req, res) {

        Booking.find({from: {$gte: (new Date())}})
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


    // 根据ID获取详细信息
    GetById: function (req, res) {

        if (req.params && req.params.id) {

            var result = Booking.findOne({_id: req.params.id})
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

    // 根据患者ID 获取相关的预约
    GetByUserId: function (req, res) {

        if (req.params && req.params.uid) {

            Booking.find({user: req.params.uid, from: {$gte: (new Date())}})
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

    // 根据药师ID 获取相关的预约
    GetByDoctorId: function (req, res) {

        if (req.params && req.params.did) {

            Booking.find({doctor: req.params.did, from: {$gte: (new Date())}})
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

    // 根据药师ID和日期 获取相关的预约
    GetByDoctorIdAndDate: function (req, res) {

        if (req.params && req.params.did && req.params.date) {

            var _date = req.params.date.split('-'); // date format: YYYY-MM-DD
            Booking.find({doctor: req.params.did, from: (new Date(_date[0], _date[1], _date[2]))})
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



    // 创建预约
    Add: function (req, res) {

        // 获取请求数据（json）
        var booking = req.body;
        if (!booking) return res.sendStatus(400);

        // doctor, user, schedule
        if (!booking.doctor) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }
        if (!booking.user) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }
        if (!booking.schedule) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }

        // 不存在，创建
        Booking.create({

            doctor: booking.doctor,
            user: booking.user,
            schedule: booking.schedule,
            status: 0 // 0: 创建
        }, function (err, raw) {
            if (err) {
                return Status.returnStatus(res, Status.ERROR, err);
            }

            return res.send(raw);
        });

    },

    // 现不支持更新booking


    DeleteById: function (req, res) {
        if (req.params && req.params.id) { // params.id is booking ID

            Booking.findOne({_id: req.params.id}, function (err, item) {
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
                    res.send('remove booking success: ', raw);
                });

            });
        }
    },



}