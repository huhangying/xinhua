/**
 * Created by harry on 16/7/12.
 */

var Const = require('../model/const.js');

module.exports = {


    GetAll: function (req, res) {

        Const.find()
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

    //
    GetByName: function (req, res) {

        if (req.params && req.params.name) {

            Const.findOne({name: req.params.name})
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

        var _const = req.body;
        if (!_const) return res.sendStatus(400);

        // name
        if (!_const.name) {
            return Status.returnStatus(res, Status.NO_NAME);
        }
        // if (!item.type) {
        //     return Status.returnStatus(res, Status.NO_TYPE);
        // }
        if (!_const.value) {
            return Status.returnStatus(res, Status.NO_VALUE);
        }


        Const.find({name: _const.name}) // check if existed
            .exec(function (err, items) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (items && items.length > 0) {
                    return Status.returnStatus(res, Status.EXISTED);
                }

                Const.create({

                    name: _const.name,
                    desc: _const.desc,
                    type: _const.type,
                    value: _const.value
                }, function (err, raw) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    return res.send(raw);
                });

            });
    },

    // update: desc, type and value, but not name
    UpdateById: function (req, res) {
        if (req.params && req.params.id) {
            var id = req.params.id;
            // 获取user数据（json）
            var _const = req.body;
            if (!_const) return res.sendStatus(400);


            Const.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item){
                    return Status.returnStatus(res, Status.NULL);
                }

                // if (_const.name)
                //     item.name = _const.name;
                if (_const.type)
                    item.type = _const.type;
                if (_const.desc)
                    item.desc = _const.desc;
                if (_const.value)
                    item.value = _const.value;

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
        if (req.params && req.params.id) {
            var id = req.params.id;

            Const.findById(id, function (err, item) {
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