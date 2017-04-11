

var Faq = require('../model/faq.js');

module.exports = {


    GetAll: function (req, res) {

        Faq.find({apply: true}, 'question answer -_id')
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

    GetEditAll: function (req, res) {

        Faq.find()
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

    // 创建
    Add: function (req, res) {

        var _faq = req.body;
        if (!_faq) return res.sendStatus(400);

        // question
        if (!_faq.question) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }
        if (!_faq.answer) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }


        Faq.create({
            question: _faq.question,
            answer: _faq.answer,
            order: _faq.order
        }, function (err, raw) {
            if (err) {
                return Status.returnStatus(res, Status.ERROR, err);
            }

            return res.send(raw);
        });

    },

    // update: desc, type and value, but not name
    UpdateById: function (req, res) {
        if (req.params && req.params.id) {
            var id = req.params.id;
            // 获取user数据（json）
            var _faq = req.body;
            if (!_faq) return res.sendStatus(400);


            Faq.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item){
                    return Status.returnStatus(res, Status.NULL);
                }

                if (_faq.question)
                    item.question = _faq.question;
                if (_faq.answer)
                    item.answer = _faq.answer;
                if (_faq.order)
                    item.order = _faq.order;
                if (_faq.apply || _faq.apply === false)
                    item.apply = _faq.apply;

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

            Faq.findById(id, function (err, item) {
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