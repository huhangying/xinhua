/**
 * Created by harry on 16/11/29.
 */
/**
 * Created by harry on 16/11/20.
 */
var AdverseReaction = require('../model/adverseReaction');

module.exports = {

    GetAll: function (req, res) {

        AdverseReaction.find()
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

            AdverseReaction.findOne({_id: req.params.id})
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

    // 根据Department ID获取 page list
    GetByDepartmentId: function (req, res) {

        if (req.params && req.params.did) {

            AdverseReaction.find({department: req.params.did})
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

    // 创建问卷类别
    Add: function (req, res) {

        // 获取请求数据（json）
        var ar = req.body;
        if (!ar) return res.sendStatus(400);

        // department
        if (!ar.department) {
            return Status.returnStatus(res, Status.NO_DEPARTMENT);
        }

        // name
        if (!ar.name) {
            return Status.returnStatus(res, Status.NO_NAME);
        }


        // 不存在，创建
        AdverseReaction.create({

            department: ar.department,
            name: ar.name
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

            // 获取数据（json）
            var ar = req.body;
            if (!ar) return res.sendStatus(400);


            AdverseReaction.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item) {
                    return Status.returnStatus(res, Status.NULL);
                }
                if (ar.department)
                    item.department = ar.department;
                if (ar.name)
                    item.name = ar.name;
                if (ar.apply || ar.apply === false)
                    item.apply = ar.apply;


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
        if (req.params && req.params.id) { // params.id is page ID

            AdverseReaction.findOne({_id: req.params.id}, function (err, item) {
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