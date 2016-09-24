/**
 * Created by harry on 16/9/13.
 */
/**
 * Created by harry on 16/6/30.
 */

var Survey = require('../model/survey.js');

module.exports = {

    GetAll: function (req, res) {

        Survey.find()
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

            Survey.findOne({_id: req.params.id})
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

    // 根据Cat ID获取Survey list
    GetSurveysByCatId: function (req, res) {

        if (req.params && req.params.catid) {

            Survey.find({cat: req.params.catid})
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

    // 根据Department ID获取Survey list
    GetSurveysByDepartmentId: function (req, res) {

        if (req.params && req.params.did) {

            Survey.find({department: req.params.did})
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
        var survey = req.body;
        if (!survey) return res.sendStatus(400);

        // name
        if (!survey.name) {
            return Status.returnStatus(res, Status.NO_NAME);
        }
        // department
        if (!survey.department) {
            return Status.returnStatus(res, Status.MISSING_PARAM);
        }
        // category
        if (!survey.cat) {
            return Status.returnStatus(res, Status.NO_CAT);
        }
        
        // questions ? allow to create a survey without questions?
        


        // 不存在，创建
        Survey.create({

            name: survey.name,
            department: survey.department,
            cat: survey.cat,
            questions: survey.questions
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
            var survey = req.body;
            if (!survey) return res.sendStatus(400);

            Survey.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item) {
                    return Status.returnStatus(res, Status.NULL);
                }

                if (survey.name)
                    item.name = survey.name;
                if (survey.department)
                    item.department = survey.department;
                if (survey.cat)
                    item.cat = survey.cat;
                if (survey.questions && survey.questions.length > 0)
                    item.questions = survey.questions;
                if (survey.apply || survey.apply === false)
                    item.apply = survey.apply;
                
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

            Survey.findOne({_id: req.params.id}, function (err, item) {
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