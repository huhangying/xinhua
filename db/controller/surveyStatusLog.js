

var SurveyStatusLog = require('../model/surveyStatusLog.js');

module.exports = {


    GetAll: function (req, res) {

        SurveyStatusLog.find()
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

    GetByKey: function (req, res) {

        if (req.params && req.params.key) {

            SurveyStatusLog.findOne({key: req.params.key})
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

    // 创建
    Add: function (req, res) {

        var item = req.body;
        if (!item) return res.sendStatus(400);

        // key
        if (!item.key) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }
        if (!item.type) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }


        SurveyStatusLog.create({
            key: item.key,
            type: item.type,
            status: item.status || 0
        }, function (err, raw) {
            if (err) {
                return Status.returnStatus(res, Status.ERROR, err);
            }

            return res.send(raw);
        });

    },

    // update:
    UpdateById: function (req, res) {
        if (req.params && req.params.id) {
            var id = req.params.id;
            // 获取user数据（json）
            var _surveyStatusLog = req.body;
            if (!_surveyStatusLog) return res.sendStatus(400);


            SurveyStatusLog.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item){
                    return Status.returnStatus(res, Status.NULL);
                }

                if (_surveyStatusLog.key)
                    item.key = _surveyStatusLog.key;
                if (_surveyStatusLog.type)
                    item.type = _surveyStatusLog.type;
                if (_surveyStatusLog.status)
                    item.status = _surveyStatusLog.status;
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

            SurveyStatusLog.findById(id, function (err, item) {
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