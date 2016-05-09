/**
 * Created by hhu on 2016/5/9.
 */

var Disease = require('../model/disease.js');

module.exports = {


    //todo: order by
    GetAll: function (req, res) {

        Disease.find({apply: true}, function (err, items) {
            if (err) {
                return Status.returnStatus(res, Status.ERROR);
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

            var result = Disease.findOne({_id: req.params.id, apply: true})
                .exec(function (err, items) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR);
                    }

                    if (!items || items.length < 1) {
                        return Status.returnStatus(res, Status.NULL);
                    }

                    res.json(items);
                });
        }
    },


    // 创建疾病类别
    Add: function (req, res) {

        // 获取department请求数据（json）
        var disease = req.body;
        if (!disease) return res.sendStatus(400);

        // name
        if (!disease.name) {
            return Status.returnStatus(res, Status.NO_NAME);
        }

        Disease.create({
            department: disease.department,
            name: disease.name,
            desc: disease.desc,
            order: disease.order
        }, function (err, raw) {
            if (err) {
                return Status.returnStatus(res, Status.ERROR);
            }

            res.send(raw);

            //todo: symptom list

        });

    },

    //todo:
    UpdateById: function (req, res) {
        if (req.params && req.params.id) { // params.id is disease ID
            var id = req.params.id;
            // 获取request数据（json）
            var disease = req.body;
            if (!disease) return res.sendStatus(400);


            Disease.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR);
                }

                if (disease.department)
                    item.department = disease.department;
                if (disease.name)
                    item.name = disease.name;
                if (disease.desc)
                    item.desc = disease.desc;
                if (disease.order)
                    item.order = disease.order;

                //console.log(JSON.stringify(item));

                //
                item.save(function (err, raw) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR);
                    }
                    res.send('updated disease: ', raw);

                    //todo: symptoms
                });

            });
        }
    },

    DeleteById: function (req, res) {
        if (req.params && req.params.id) { // params.id is disease ID
            var id = req.params.id;

            Disease.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR);
                }

                //
                item.remove(function (err, raw) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR);
                    }

                    res.send('deleted disease: ', raw);
                });

            });
        }
    },

}