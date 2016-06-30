/**
 * Created by harry on 16/6/30.
 */

var Period = require('../model/period.js');

module.exports = {

    GetAll: function (req, res) {

        Period.find()
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

            Period.findOne({_id: req.params.id})
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
        var period = req.body;
        if (!period) return res.sendStatus(400);

        // name
        if (!period.name) {
            return Status.returnStatus(res, Status.NO_NAME);
        }
        // from
        if (!period.from) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }


        // 不存在，创建
        Period.create({

            name: period.name,
            from: period.from,
            to: period.to
        }, function (err, raw) {
            if (err) {
                return Status.returnStatus(res, Status.ERROR, err);
            }

            return res.send(raw);
        });

    },

    UpdateById: function (req, res) {
        if (req.params && req.params.id) { // params.id is group ID
            var id = req.params.id;

            // 获取数据（json）,只能更新关系组名
            var period = req.body;
            if (!period) return res.sendStatus(400);


            Period.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item) {
                    return Status.returnStatus(res, Status.NULL);
                }
                if (period.name)
                    item.name = period.name;
                if (period.from)
                    item.from = period.from;
                if (period.to)
                    item.to = period.to;


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

            Period.findOne({_id: req.params.id}, function (err, item) {
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