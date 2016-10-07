/**
 * Created by harry on 16/10/2.
 */
var Medicine = require('../model/medicine.js');

module.exports = {

    GetAll: function (req, res) {

        Medicine.find()
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

            Medicine.findOne({_id: req.params.id})
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

    // 获取所有药的列表, 用于 autoComplete 功能
    GetAllAvailable: function (req, res) {

        Medicine.find({apply: true}
        //todo:
        )
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

    // 创建
    Add: function (req, res) {

        // 获取请求数据（json）
        var medicine = req.body;
        if (!medicine) return res.sendStatus(400);

        // name
        if (!medicine.name) {
            return Status.returnStatus(res, Status.NO_NAME);
        }
        // unit
        if (!medicine.unit) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }

        // dosage
        if (!medicine.dosage) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }
        // category
        // if (!medicine.cat) {
        //     return Status.returnStatus(res, Status.NO_CAT);
        // }


        // 不存在，创建
        Medicine.create({

            name: medicine.name,
            desc: medicine.desc,
            unit: medicine.unit,
            capacity: medicine.capacity,
            usage: medicine.usage,
            dosage: medicine.dosage,
            //cat: medicine.cat,
            notices: medicine.notices
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
            var medicine = req.body;
            if (!medicine) return res.sendStatus(400);

            Medicine.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item) {
                    return Status.returnStatus(res, Status.NULL);
                }

                if (medicine.name)
                    item.name = medicine.name;
                if (medicine.desc)
                    item.desc = medicine.desc;
                if (medicine.unit)
                    item.unit = medicine.unit;
                if (medicine.capacity)
                    item.capacity = medicine.capacity;
                if (medicine.usage)
                    item.usage = medicine.usage;
                if (medicine.dosage)
                    item.dosage = medicine.dosage;
                if (medicine.notices)
                    item.notices = medicine.notices;
                if (medicine.apply || medicine.apply === false)
                    item.apply = medicine.apply;

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

            Medicine.findOne({_id: req.params.id}, function (err, item) {
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