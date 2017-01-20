/**
 * Created by harry on 17/1/11.
 */

var Diagnose = require('../model/diagnose');

module.exports = {

    // 根据ID获取详细信息
    GetByUserAndDoctor: function (req, res) {

        if (req.params && req.params.user && req.params.doctor) {

            Diagnose.findOne({user: req.params.user, doctor: req.params.doctor})
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

    // 创建关系组
    Add: function (req, res) {

        // 获取请求数据（json）
        var item = req.body;
        if (!item) return res.sendStatus(400);

        // doctor
        if (!item.doctor) {
            return Status.returnStatus(res, Status.NO_DOCTOR);
        }

        // user
        if (!item.user) {
            return Status.returnStatus(res, Status.NO_USER);
        }


        // 不存在，创建
        Diagnose.create({

            doctor: item.doctor,
            user: item.user,
            booking: item.booking,
            surveys: item.surveys,
            assessment: item.assessment,
            prescription: item.prescription,
            notices: item.notices,
            status: item.status
        }, function (err, raw) {
            if (err) {
                return Status.returnStatus(res, Status.ERROR, err);
            }

            return res.send(raw);
        });

    },

    UpdateById: function (req, res) {
        if (req.params && req.params.id) { // params.id is ID
            var id = req.params.id;

            // 获取数据（json）
            var diagnose = req.body;
            if (!diagnose) return res.sendStatus(400);

            Diagnose.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item) {
                    return Status.returnStatus(res, Status.NULL);
                }

                if (diagnose.user)
                    item.user = diagnose.user;
                if (diagnose.doctor)
                    item.doctor = diagnose.doctor;
                if (diagnose.booking)
                    item.booking = diagnose.booking;
                if (diagnose.surveys)
                    item.surveys = diagnose.surveys;
                if (diagnose.assessment)
                    item.assessment = diagnose.assessment;
                if (diagnose.prescription)
                    item.prescription = diagnose.prescription;
                if (diagnose.notices)
                    item.notices = diagnose.notices;
                if (diagnose.status)
                    item.status = diagnose.status;


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

            Diagnose.findOne({_id: req.params.id}, function (err, item) {
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