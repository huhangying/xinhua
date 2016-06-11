/**
 * Created by hhu on 2016/5/9.
 */

var Disease = require('../model/disease.js');
var Symptom = require('../model/symptom');
var Q = require('q');

var self = module.exports = {


    //todo: order by
    GetAll: function (req, res) {

        //Disease.find({apply: true}, function (err, items) {
        Disease.find()
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

    // 获得科室下的疾病类别
    GetByDepartmentId: function(req, res){

        if (req.params && req.params.did) {
            Disease.find({apply: true, department: req.params.did})
                .sort({order: 1})
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

    // 根据ID获取详细信息
    GetById: function (req, res) {

        if (req.params && req.params.id) {

            var result = Disease.findOne({_id: req.params.id, apply: true})
                .sort({order: 1})
                .populate('department')
                .populate('symptoms')
                .exec(function (err, items) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!items || items.length < 1) {
                        return Status.returnStatus(res, Status.NULL);
                    }

                    console.log(JSON.stringify(items));
                    res.json(items);
                });
        }
    },


    // 创建疾病类别
    Add: function (req, res) {

        // 获取department请求数据（json）
        // Note: symptom的格式
        //          symptom 名称1|symptom 名称2
        var disease = req.body;

        //console.log(JSON.stringify(disease));
        if (!disease) return res.sendStatus(400);

        // name
        if (!disease.name) {
            return Status.returnStatus(res, Status.NO_NAME);
        }

        var item = {};

        if (disease.department)
            item.department = disease.department;
        if (disease.name)
            item.name = disease.name;
        if (disease.desc)
            item.desc = disease.desc;
        if (disease.order)
            item.order = disease.order;

        item.symptoms = [];
        item.symptoms.length = 0;

        console.log(JSON.stringify(item));

        self.CheckSymptomsForUpdate(item, disease.symptoms)
            .then(function (_item){
                //console.log(JSON.stringify(_item));

                //_item.save();
                Disease.create(
                    {symptoms: _item.symptoms, name: _item.name, desc: _item.desc, order: _item.order,
                        department: _item.department},
                    function (err, raw) {
                        console.log(JSON.stringify(raw));
                        if (err) {
                            return Status.returnStatus(res, Status.ERROR, err);
                        }
                        res.send(raw);
                    });

            });


    },

    //todo:
    UpdateById: function (req, res) {
        if (req.params && req.params.id) { // params.id is disease ID
            var id = req.params.id;
            // 获取request数据（json）
            var disease = req.body;
            if (!disease) return res.sendStatus(400);


            Disease.findById(id)
                .populate('symptom')
                //.distinct('')
                .exec(function (err, item) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!item){
                        return Status.returnStatus(res, Status.NULL);
                    }

                    if (disease.department)
                        item.department = disease.department;
                    if (disease.name)
                        item.name = disease.name;
                    if (disease.desc)
                        item.desc = disease.desc;
                    if (disease.order)
                        item.order = disease.order;
                    if (disease.apply != null){
                        item.apply = disease.apply;
                    }else{
                        item.apply = false;
                    }

                    item.symptoms.length = 0;


                    self.CheckSymptomsForUpdate(item, disease.symptoms)
                        .then(function (_item){
                            //console.log(JSON.stringify(_item));

                            //_item.save();
                            Disease.update({_id: _item._id},
                                {$set: {symptoms: _item.symptoms,
                                    department: _item.department,
                                    name: _item.name,
                                    desc: _item.desc,
                                    order: _item.order,
                                    apply: _item.apply}},
                                {upsert: true},
                                function (err, raw) {
                                //console.log(JSON.stringify(raw));
                                if (err) {
                                    return Status.returnStatus(res, Status.ERROR, err);
                                }
                                res.send(raw);
                            });

                        });

                });
        }
    },

    DeleteById: function (req, res) {
        if (req.params && req.params.id) { // params.id is disease ID
            var id = req.params.id;

            Disease.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item){
                    return Status.returnStatus(res, Status.NULL);
                }

                //
                item.remove(function (err, raw) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    res.send(raw);
                });

            });
        }
    },

    CheckSymptomsForUpdate: function (item, symptomsStr){
        var _deferred = Q.defer();
        var promises = [];

        if (symptomsStr && symptomsStr.length > 0){ // symptomsStr is a string containing symptoms.

            var symptoms = symptomsStr.split('|');

            symptoms.forEach(function(symptom){
                var deferred = Q.defer();

                self.FindAndUpdateSymptomByName(symptom)//;     // sym is symptom object
                    .then(function(sym){
                        if (sym){
                            //console.log(JSON.stringify(sym));
                            item.symptoms.push(sym._id);
                            deferred.resolve(sym);
                        }
                    });

                promises.push(deferred.promise);
            });

        }

        Q.all(promises).then(
            // success
            // results: an array of data objects from each deferred.resolve(data) call
            function(results) {

                _deferred.resolve(item);
            },
            // error
            function(response) {
                _deferred.resolve(item);
            }
        );

        return _deferred.promise;
    },

    //
    FindAndUpdateSymptomByName: function(sym_name) {
        var deferred = Q.defer();

        // 先check这个symptom是不是存在，如果存在，直接使用，如果不存在，创建一个新的，然后使用。
        Symptom.findOne({name: sym_name}, function(err, sym){
            if (err){
                deferred.reject(err);
            }

            // no record, create one
            if (!sym) {
                sym = self.CreateSymptom(sym_name);
                //console.log('create: ' + JSON.stringify(sym));
            }

            deferred.resolve(sym);
        });

        return deferred.promise;
    },

    CreateSymptom: function (symptom_name){
        var deferred = Q.defer();

        Symptom.create({name: symptom_name}, function(err, symptom){
            if (err){
                deferred.reject(err);
            }

            deferred.resolve(symptom);
        });

        return deferred.promise;
    }

}