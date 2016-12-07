/**
 * Created by harry on 16/11/20.
 */

var ArticleTemplate = require('../model/articleTemplate');

module.exports = {

    GetAll: function (req, res) {

        ArticleTemplate.find()
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

            ArticleTemplate.findOne({_id: req.params.id})
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
    
    //todo: move to articlePage
    RenderById: function(req, res) {
        if (req.params && req.params.id) {

            ArticleTemplate.findOne({_id: req.params.id})
                .exec(function (err, item) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!item) {
                        return Status.returnStatus(res, Status.NULL);
                    }
                    
                    res.set('Content-Type', 'text/html');
                    res.render('article', { content: item.content, name: item.name, title: item.title });
                });
        }
    },

    // 根据Cat ID获取 article template list
    GetArticleTemplatesByCatId: function (req, res) {

        if (req.params && req.params.catid) {

            ArticleTemplate.find({cat: req.params.catid})
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

    // 根据Department ID获取article template list
    GetArticleTemplatesByDepartmentId: function (req, res) {

        if (req.params && req.params.did) {

            ArticleTemplate.find({department: req.params.did})
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
        var item = req.body;
        if (!item) return res.sendStatus(400);

        // name
        if (!item.name) {
            return Status.returnStatus(res, Status.NO_NAME);
        }
        // department
        if (!item.department) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }
        // category
        if (!item.cat) {
            return Status.returnStatus(res, Status.NO_CAT);
        }

        if (!item.updatedBy) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }

        // 不存在，创建
        ArticleTemplate.create({

            name: item.name,
            department: item.department,
            cat: item.cat,
            title: item.title,
            title_image: item.title_image,
            content: item.content,
            updatedBy: item.updatedBy
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
            var template = req.body;
            if (!template) return res.sendStatus(400);

            ArticleTemplate.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item) {
                    return Status.returnStatus(res, Status.NULL);
                }

                if (template.name)
                    item.name = template.name;
                if (template.department)
                    item.department = template.department;
                if (template.cat)
                    item.cat = template.cat;
                if (template.title)
                    item.title = template.title;
                if (template.title_image)
                    item.title_image = template.title_image;
                if (template.content)
                    item.content = template.content;
                if (template.updatedBy)
                    item.updatedBy = template.updatedBy;
                if (template.apply || template.apply === false)
                    item.apply = template.apply;

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

            ArticleTemplate.findOne({_id: req.params.id}, function (err, item) {
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