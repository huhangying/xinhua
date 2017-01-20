/**
 * Created by harry on 17/1/20.
 */
/**
 * Created by harry on 16/9/13.
 */

var LabResult = require('../model/labResult');

module.exports = {

    GetAll: function (req, res) {

        LabResult.find()
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

            LabResult.findOne({_id: req.params.id})
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

    // 根据 user id 获取Survey list
    GetLabResultsByUserId: function (req, res) {

        if (req.params && req.params.uid) {

            LabResult.find({user: req.params.uid})
                .sort({testDate: -1})
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
        var labResult = req.body;
        if (!labResult) return res.sendStatus(400);

        // doctor
        if (!labResult.doctor) {
            return Status.returnStatus(res, Status.NO_DOCTOR);
        }
        // user
        if (!labResult.user) {
            return Status.returnStatus(res, Status.NO_USER);
        }
        // name
        if (!labResult.name) {
            return Status.returnStatus(res, Status.NO_NAME);
        }

        // 不存在，创建
        LabResult.create({

            doctor: labResult.doctor,
            user: labResult.user,
            name: labResult.name,
            list: labResult.list,
            testDate: labResult.testDate
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
            var labResult = req.body;
            if (!labResult) return res.sendStatus(400);

            LabResult.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item) {
                    return Status.returnStatus(res, Status.NULL);
                }

                if (labResult.doctor)
                    item.doctor = labResult.doctor;
                if (labResult.user)
                    item.user = labResult.user;
                if (labResult.name)
                    item.name = labResult.name;
                if (labResult.list)
                    item.list = labResult.list;
                if (labResult.testDate)
                    item.testDate = labResult.testDate;
                if (labResult.apply || labResult.apply === false)
                    item.apply = labResult.apply;

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
        if (req.params && req.params.id) { // params.id is ID

            LabResult.findOne({_id: req.params.id}, function (err, item) {
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