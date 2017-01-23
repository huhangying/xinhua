/**
 * Created by harry on 17/1/17.
 */
var ArticleSearch = require('../model/articleSearch');

module.exports = {

    GetAll: function (req, res) {

        ArticleSearch.find()
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

            ArticleSearch.findOne({_id: req.params.id})
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

    // 根据keyword 获取article list
    GetSerachResults: function (req, res) {

        if (req.params && req.params.keyword) {
            var keywordRE = new RegExp(req.params.keyword, 'i');
            ArticleSearch.find({$or: [{keywords: keywordRE }, {name: keywordRE}, {title: keywordRE} ]}, '-__v')
                .sort({updatedAt: -1})
                .limit(20)
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

    // 创建文章搜索对应表
    Add: function (req, res) {

        // 获取请求数据（json）
        var item = req.body;
        if (!item) return res.sendStatus(400);

        // name
        if (!item.name) {
            return Status.returnStatus(res, Status.NO_NAME);
        }

        // title
        if (!item.title) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }

        // targetUrl
        if (!item.targetUrl) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }

        // 不存在，创建
        ArticleSearch.create({

            name: item.name,
            cat: item.cat,
            title: item.title,
            title_image: item.title_image,
            targetUrl: item.targetUrl,
            keywords: item.keywords
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
            var search = req.body;
            if (!search) return res.sendStatus(400);

            ArticleSearch.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item) {
                    return Status.returnStatus(res, Status.NULL);
                }

                if (search.name)
                    item.name = search.name;
                if (search.cat)
                    item.cat = search.cat;
                if (search.title)
                    item.title = search.title;
                if (search.title_image)
                    item.title_image = search.title_image;
                if (search.targetUrl)
                    item.targetUrl = search.targetUrl;
                if (search.keywords)
                    item.keywords = search.keywords;

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

            ArticleSearch.findOne({_id: req.params.id}, function (err, item) {
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