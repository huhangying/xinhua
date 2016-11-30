/**
 * Created by harry on 16/11/20.
 */
var ArticleCat = require('../model/articleCat.js');

module.exports = {

    GetAll: function (req, res) {

        ArticleCat.find()
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

            ArticleCat.findOne({_id: req.params.id})
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
    GetArticleCatsByDepartmentId: function (req, res) {

        if (req.params && req.params.did) {

            ArticleCat.find({department: req.params.did})
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
        var cat = req.body;
        if (!cat) return res.sendStatus(400);

        // department
        if (!cat.department) {
            return Status.returnStatus(res, Status.NO_DEPARTMENT);
        }

        // name
        if (!cat.name) {
            return Status.returnStatus(res, Status.NO_NAME);
        }


        // 不存在，创建
        ArticleCat.create({

            department: cat.department,
            name: cat.name,
            desc: cat.desc
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
            var cat = req.body;
            if (!cat) return res.sendStatus(400);


            ArticleCat.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item) {
                    return Status.returnStatus(res, Status.NULL);
                }
                if (cat.department)
                    item.department = cat.department;
                if (cat.name)
                    item.name = cat.name;
                if (cat.desc)
                    item.desc = cat.desc;
                if (cat.apply || cat.apply === false)
                    item.apply = cat.apply;


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

            ArticleCat.findOne({_id: req.params.id}, function (err, item) {
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