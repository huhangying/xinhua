/**
 * Created by harry on 16/10/2.
 */
var Prescription = require('../model/prescription');

module.exports = {

    GetAll: function (req, res) {

        Prescription.find()
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

            Prescription.findOne({_id: req.params.id})
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

    // 根据Doctor ID获取 prescription list
    GetByDoctorId: function (req, res) {

        if (req.params && req.params.id) {

            Prescription.find({doctor: req.params.id})
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

    // 根据User ID获取 prescription list
    GetByUserId: function (req, res) {

        if (req.params && req.params.id) {

            Prescription.find({user: req.params.id})
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

    // 根据User ID获取 prescription list
    GetByBookingId: function (req, res) {

        if (req.params && req.params.id) {

            Prescription.find({booking: req.params.id})
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


    // 创建
    Add: function (req, res) {

        // 获取请求数据（json）
        var item = req.body;
        if (!item) return res.sendStatus(400);

        // booking
        if (!item.booking) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }
        // doctor
        if (!item.doctor) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }
        // user
        if (!item.user) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }

        // 不存在，创建
        Prescription.create({

            booking: item.booking,
            doctor: item.doctor,
            user: item.user,
            medicines: item.medicines,
            notices: item.notices
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
            var prescription = req.body;
            if (!prescription) return res.sendStatus(400);

            Prescription.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item) {
                    return Status.returnStatus(res, Status.NULL);
                }

                if (prescription.booking)
                    item.booking = prescription.booking;
                if (prescription.doctor)
                    item.doctor = prescription.doctor;
                if (prescription.user)
                    item.user = prescription.user;
                if (prescription.medicines && prescription.medicines.length > 0)
                    item.medicines = prescription.medicines;
                if (prescription.notices && prescription.notices.length > 0)
                    item.notices = prescription.notices;
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
        if (req.params && req.params.id) { 

            Prescription.findOne({_id: req.params.id}, function (err, item) {
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