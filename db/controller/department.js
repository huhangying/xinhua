/**
 * Created by hhu on 2016/5/9.
 */

var Department = require('../model/department.js');

module.exports = {


    GetAll: function (req, res) {

        Department.find()
            .sort({order: 1})
            .exec( function (err, items) {
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

            var result = Department.findOne({_id: req.params.id, apply: true})
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


    // 创建医院科室
    Add: function (req, res) {

        // 获取department请求数据（json）
        var department = req.body;
        if (!department) return res.sendStatus(400);

        // name
        if (!department.name) {
            return Status.returnStatus(res, Status.NO_NAME);
        }


        Department.find({name: department.name}) // check if existed
            .exec(function (err, items) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (items && items.length > 0) {
                    return Status.returnStatus(res, Status.EXISTED);
                }

                Department.create({

                    name: department.name,
                    desc: department.desc,
                    order: department.order,
                    apply: department.apply || true
                }, function (err, raw) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    return res.send(raw);
                });

            });
    },

    UpdateById: function (req, res) {
        if (req.params && req.params.id) { // params.id is doctor's user ID
            var id = req.params.id;
            // 获取user数据（json）
            var department = req.body;
            if (!department) return res.sendStatus(400);


            Department.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item){
                    return Status.returnStatus(res, Status.NULL);
                }

                if (department.name)
                    item.name = department.name;
                if (department.desc)
                    item.desc = department.desc;
                if (department.order)
                    item.order = department.order;
                item.apply = department.apply || true;

                console.log(JSON.stringify(item));

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

    DeleteById: function(req, res){
        if (req.params && req.params.id) { // params.id is doctor's user ID
            var id = req.params.id;

            Department.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item){
                    return Status.returnStatus(res, Status.NULL);
                }

                //console.log(JSON.stringify(item))
                //
                item.remove(function (err, raw) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    res.json(raw);
                });

            });
        }
    },

}