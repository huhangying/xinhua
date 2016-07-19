/**
 * Created by hhu on 2016/5/21.
 */

var Schedule = require('../model/schedule.js');
var $q = require('q');

module.exports = {

    GetAll: function (req, res) {

        Schedule.find({date: {$gte: (new Date())}})
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

    GetAllPopulated: function (req, res) {

        Schedule.find({date: {$gte: (new Date())}})
            .populate('period')
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

            Schedule.find({doctor: req.params.did, date: {$gte: (+new Date())}})
                .sort({date: 1, period: 1})
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

    // for test
    // 根据药师ID 获取相关的门诊, 没有时间限制
    GetAllByDoctorId: function (req, res) {

        if (req.params && req.params.did) {

            Schedule.find({doctor: req.params.did})
                .sort({date: 1, period: 1})
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

            var _date = +new Date(req.params.date);
            Schedule.find({doctor: req.params.did, date: {$gte: _date, $lt: (new Date(_date + 24*60*60*1000)) }}) // select the selected day
                .sort({date: 1, period: 1})
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

        // doctor, date, period
        if (!schedule.doctor) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }
        if (!schedule.period) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }
        if (!schedule.date) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }

        // 不存在，创建
        Schedule.create({

            doctor: schedule.doctor,
            period: schedule.period,
            date: schedule.date,
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

                    if (schedule.period)
                        item.period = schedule.period;
                    if (schedule.doctor)
                        item.doctor = schedule.doctor;

                    if (schedule.date){
                        item.date = new Date(schedule.date);
                    }
                    if (schedule.limit)
                        item.limit = schedule.limit;
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
        if (req.params && req.params.id) { // params.id is schedule ID

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
                    res.json(raw);
                });

            });
        }
    },

    //todo: enhance the performance later
    FindScheduleDoctorsByDepartmentId: function (req, res) {
        if (req.params && req.params.departmentid) {

            var date_end = new Date();
            date_end.setDate(date_end.getDate() + 7);
            Schedule.find({date: {$lte: date_end, $gt: new Date()}, limit: {$gt: 0}})
                .populate(
                    {
                    path: 'doctor',
                    match: {department: req.params.departmentid},
                    select: '_id user_id name'
                    }
                )
                .exec(function(err, schedules){
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    var doctorsPromise = schedules
                        .map(function(schedule){
                            return schedule.doctor; // get only doctor field
                        })
                        .filter(function(doctor){
                            return doctor;      // remove  null
                        });

                    $q.all(doctorsPromise)
                        .then(function(doctors) {
                            res.json(
                                doctors
                                    .filter(function(doctor, pos){
                                        return doctors.indexOf(doctor) == pos; // remove duplicate ones
                                    })
                            );
                        });

                    // var doctors = schedules
                    //     .map(function(schedule){
                    //         return schedule.doctor; // get only doctor field
                    //     });

                    //
                    //
                    // res.json(
                    //     doctors.filter(function(doctor){
                    //         return doctor;      // remove  null
                    //     }).filter(function(doctor, pos){
                    //         return doctors.indexOf(doctor) == pos; // remove duplicate ones
                    //     })
                    // );
                });
        }
    },


}