/**
 * Created by harry on 16/11/20.
 */

var Page = require('../model/page.js');

module.exports = {

    GetAll: function (req, res) {

        Page.find()
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

            Page.findOne({_id: req.params.id})
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

    // 根据Cat ID获取Page list
    GetPagesByCatId: function (req, res) {

        if (req.params && req.params.catid) {

            Page.find({cat: req.params.catid})
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

    // 根据Department ID获取Page list
    GetPagesByDepartmentId: function (req, res) {

        if (req.params && req.params.did) {

            Page.find({department: req.params.did})
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

    // 创建关系组
    Add: function (req, res) {

        // 获取请求数据（json）
        var page = req.body;
        if (!page) return res.sendStatus(400);

        // name
        if (!page.name) {
            return Status.returnStatus(res, Status.NO_NAME);
        }
        // department
        if (!page.department) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }
        // category
        if (!page.cat) {
            return Status.returnStatus(res, Status.NO_CAT);
        }

        // questions ? allow to create a survey without questions?



        // 不存在，创建
        Page.create({

            name: page.name,
            department: page.department,
            cat: page.cat,
            title: page.title,
            title_image: page.title_image,
            edit_html: page.edit_html,
            render_html: page.render_html,
            data: page.data
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
            var page = req.body;
            if (!page) return res.sendStatus(400);

            Page.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item) {
                    return Status.returnStatus(res, Status.NULL);
                }

                if (page.name)
                    item.name = page.name;
                if (page.department)
                    item.department = page.department;
                if (page.cat)
                    item.cat = page.cat;
                if (page.title)
                    item.title = page.title;
                if (page.title_image)
                    item.title_image = page.title_image;
                if (page.edit_html)
                    item.edit_html = page.edit_html;
                if (page.render_html)
                    item.render_html = page.render_html;
                if (page.data)
                    item.data = page.data;
                if (page.apply || page.apply === false)
                    item.apply = page.apply;

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

            Page.findOne({_id: req.params.id}, function (err, item) {
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