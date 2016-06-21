/**
 * Created by hhu on 2016/5/21.
 */

var Booking = require('../model/booking.js');
var Schedule = require('../model/schedule.js');

module.exports = {

    GetAll: function (req, res) {

        Booking.find()
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
                .populate('schedule')
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

            Booking.find({user: req.params.uid})
                .sort({created: 1})
                .populate('schedule')
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

            Booking.find({doctor: req.params.did})
                .sort({created: 1})
                .populate('schedule')
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

    //TODO: not working
    // 根据药师ID和日期 获取相关的预约
    GetByDoctorIdAndDate: function (req, res) {

        if (req.params && req.params.did && req.params.date) {

            var _date = +new Date(req.params.date);

            Booking.find({doctor: req.params.did }) //from: {$gte: _date, $lt: (new Date(_date + 24*60*60*1000)) }}
                .populate('schedule')
                //.where({from: {$gte: _date, $lt: (new Date(_date + 24*60*60*1000)) }})
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
    GetByScheduleId: function (req, res) {

        if (req.params && req.params.sid) {

            Booking.find({schedule: req.params.sid, apply: true})
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
            status: booking.status || 0 // 0: 创建
        }, function (err, raw) {
            if (err) {
                return Status.returnStatus(res, Status.ERROR, err);
            }

            // limit-- in schedule
            Schedule.findById(booking.schedule)
                .exec( function (err, schedule) {
                    schedule.limit--;
                    schedule.save();
                });

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
                    res.json(raw);
                });

            });
        }
    },

}