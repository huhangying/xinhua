/**
 * Created by hhu on 2016/5/21.
 */

var Booking = require('../model/booking.js');
var Schedule = require('../model/schedule.js');

module.exports = {

    GetAll: function (req, res) {

        Booking.find()
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

    // cms 用
    GetAllPopulated: function (req, res) {

        Booking.find()
            .populate('schedule')
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
                .sort({created: -1})
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
                .sort({created: -1})
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

    // 根据药师ID和日期 获取相关的预约
    GetTodaysByDoctorId: function (req, res) {

        if (req.params && req.params.did) {

            var today = global.moment().startOf('day').format();
            var tomorrow = global.moment(today).add(4, 'days').format();
            // Booking.find({ doctor: req.params.did })
            Booking.find({doctor: req.params.did, date: {$gte: today, $lt: tomorrow} })
                .sort({created: -1})
                //.populate('schedule')
                .populate('user') //, 'name cell')
                .exec(function (err, items) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    // if (!items || items.length < 1) {
                    //     return Status.returnStatus(res, Status.NULL);
                    // }

                    res.json(items);
                });
        }
    },

    //
    GetByScheduleId: function (req, res) {

        if (req.params && req.params.sid) {

            Booking.find({schedule: req.params.sid, apply: true})
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



    // 创建预约
    Add: function (req, res) {

        // 获取请求数据（json）
        var booking = req.body;
        if (!booking) return res.sendStatus(400);

        // doctor, user, schedule
        if (!booking.doctor) {
            return Status.returnStatus(res, Status.NO_DOCTOR);
        }
        if (!booking.user) {
            return Status.returnStatus(res, Status.NO_USER);
        }
        if (!booking.schedule) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }



        // 不存在，创建
        Booking.create({

            doctor: booking.doctor,
            user: booking.user,
            schedule: booking.schedule,
            date: booking.date,
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

    // 更新booking
    UpdateById: function (req, res) {
        if (req.params && req.params.id) { // params.id is booking ID
            var id = req.params.id;

            // 获取数据（json）,只能更新status and score
            var booking = req.body;
            if (!booking) return res.sendStatus(400);

            Booking.findById(id)
                .exec( function (err, item) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!item) {
                        return Status.returnStatus(res, Status.NULL);
                    }

                    if (booking.date) {
                        item.date = booking.date;
                    }

                    var original_status = item.status;
                    if (booking.status) {
                        item.status = booking.status;
                    }

                    if (booking.score)
                        item.score = booking.score;

                    //console.log(JSON.stringify(item));

                    //
                    item.save(function (err, raw) {
                        if (err) {
                            return Status.returnStatus(res, Status.ERROR, err);
                        }

                        // if status changed from 1 to 2, or 1 to 3, limit++ in schedule table
                        if (original_status === 1 && (item.status === 2 || item.status === 3)) {
                            // limit++ in schedule
                            Schedule.findById(item.schedule)
                                .exec( function (err, schedule) {
                                    schedule.limit++;
                                    schedule.save();
                                });
                        }

                        res.json(raw);
                    });

                });
        }
    },

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