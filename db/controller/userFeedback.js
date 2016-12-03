/**
 * Created by ehuhang on 12/2/2016.
 */

var UserFeedback = require('../model/userFeedback');

module.exports = {

    GetAll: function (req, res) {

        UserFeedback.find()
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

            UserFeedback.findOne({_id: req.params.id})
                //.populate('schedule')
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

    // 根据患者 ID, 类型 获取相关类型的反馈
    GetByUserId: function (req, res) {

        if (req.params && req.params.uid && req.params.type) {

            UserFeedback.find({user: req.params.uid, type: req.params.type })
                .sort({created: -1})
                //.populate('doctor')
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

    // 根据药师 ID, 类型 获取相关类型的反馈
    GetByDoctorId: function (req, res) {

        if (req.params && req.params.did && req.params.type) {

            UserFeedback.find({ doctor: req.params.did, type: req.params.type })
                .sort({created: -1})
                //.populate('user')
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

    // 根据药师 ID, 类型 获取相关类型的反馈
    GetUnreadByDoctorId: function (req, res) {

        if (req.params && req.params.did) {

            UserFeedback.find({ doctor: req.params.did, status: 0 }) // only 1 and 0 for now.
                .sort({created: -1})
                //.populate('user')
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

    // 创建Feedback
    Add: function (req, res) {

        // 获取请求数据（json）
        var feedback = req.body;
        if (!feedback) return res.sendStatus(400);

        // doctor, user, schedule
        if (!feedback.doctor) {
            return Status.returnStatus(res, Status.NO_DOCTOR);
        }
        if (!feedback.user) {
            return Status.returnStatus(res, Status.NO_USER);
        }
        if (!feedback.type) {
            return Status.returnStatus(res, Status.NO_TYPE);
        }
        if (!feedback.name) {
            return Status.returnStatus(res, Status.NO_NAME);
        }

        // 不存在，创建
        UserFeedback.create({

            doctor: feedback.doctor,
            user: feedback.user,
            type: feedback.type,
            name: feedback.name,
            how: feedback.how,
            startDate: feedback.startDate,
            endDate: feedback.endDate,
            notes: feedback.notes,
            status: feedback.status || 0 // 0: 创建
        }, function (err, raw) {
            if (err) {
                return Status.returnStatus(res, Status.ERROR, err);
            }

            return res.send(raw);
        });

    },

    // 更新Feedback Status ONLY!
    UpdateById: function (req, res) {
        if (req.params && req.params.id) { // params.id is feedback ID
            var id = req.params.id;

            // 获取数据（json）,只能更新status and score
            var feedback = req.body;
            if (!feedback) return res.sendStatus(400);

            UserFeedback.findById(id)
                .exec( function (err, item) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!item) {
                        return Status.returnStatus(res, Status.NULL);
                    }

                    if (feedback.status) {
                        item.status = feedback.status;
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

    DeleteById: function (req, res) {
        if (req.params && req.params.id) { // params.id is booking ID

            UserFeedback.findOne({_id: req.params.id}, function (err, item) {
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