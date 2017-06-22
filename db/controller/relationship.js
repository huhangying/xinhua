/**
 * Created by hhu on 2016/5/20.
 */
var Relationship = require('../model/relationship.js');

module.exports = {

    GetAll: function (req, res) {

        Relationship.find()
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

            var result = Relationship.findOne({_id: req.params.id, apply: true})
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

    // 根据医生ID 和 病患ID，判断relationship是否存在
    CheckIfRelationshipExisted: function (req, res) {

        if (req.params && req.params.did && req.params.uid) {

            Relationship.findOne({doctor: req.params.did, user: req.params.uid, apply: true})
                .exec(function (err, item) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!item) {
                        return res.json({existed: false});
                    }

                    res.json({existed: true});
                });
        }
    },

    // 根据医生ID 获取相关的关系组
    GetByDoctorId: function (req, res) {

        if (req.params && req.params.id) {

            Relationship.find({doctor: req.params.id, apply: true})
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


    // 根据医生ID 获取相关的关系组
    // 返回用户组和用户信息: [group name, group id,] user name, user id
    GetSelectionByDoctorId: function (req, res) {

        if (req.params && req.params.id) {

            Relationship.find({doctor: req.params.id, apply: true}, 'group user -_id', {sort: {group: -1} })
                .populate('user', 'link_id name -_id')
                .populate('group', 'name -_id')
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

    // 根据医生ID 获取相关的关系组
    // 返回用户详细信息: [user name, cell, gender, birthdate, role]
    GetUserDetailsByDoctorId: function (req, res) {

        if (req.params && req.params.id) {

            Relationship.find({doctor: req.params.id, apply: true} )//, 'user -_id')
                // .populate('user', 'name cell gender birthdate role created -_id')
                // .sort({'user.created': 1})
                .populate({
                    path: 'user',
                    select: 'name cell gender birthdate role created -_id'
                })
                .sort({'user.created': 1})
                .exec(function (err, items) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!items || items.length < 1) {
                        return Status.returnStatus(res, Status.NULL);
                    }

                    // var _items = [];
                    // items.map(function(item) {
                    //     _items.push(item.user);
                    // });
                    // _items = _.sortBy(_items, 'created').reverse();

                    res.json(items);
                });
        }
    },

    // 根据患者ID 获取医患关系
    GetByUserId: function (req, res) {

        if (req.params && req.params.id) {

            Relationship.find({user: req.params.id, apply: true})
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

    // 根据Group ID 获取医患关系
    GetByGroupId: function (req, res) {

        if (req.params && req.params.group) {

            Relationship.find({group: req.params.group, apply: true})
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

    // 创建医患关系
    FindOrAdd: function (req, res) {

        // 获取请求数据（json）
        var relationship = req.body;
        if (!relationship) return res.sendStatus(400);

        // check doctor, user
        if (!relationship.doctor) {
            return Status.returnStatus(res, Status.NO_DOCTOR);
        }
        if (!relationship.user) {
            return Status.returnStatus(res, Status.NO_USER);
        }


        Relationship.find({doctor: relationship.doctor, user: relationship.user, apply: true}) // check if existed
            .exec(function (err, items) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                // 一个患者能被加到多个组中
                if (items) {

                    var found = false;
                    for(var i = 0; i < items.length; i++) {
                        if (items[i].group == relationship.group) {
                            found = true;
                            break;
                        }
                    }

                    // 如果存在，直接返回
                    if (found){
                        return res.json(items);
                    }

                }

                // 不存在，创建
                Relationship.create({

                    user: relationship.user,
                    doctor: relationship.doctor,
                    group: relationship.group
                }, function (err, raw) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    return res.send(raw);
                });

            });
    },

    UpdateById: function (req, res) {
        if (req.params && req.params.id) { // params.id is group ID
            var id = req.params.id;

            // 获取数据（json）,只能更新关系组名
            var relationship = req.body;
            if (!relationship) return res.sendStatus(400);

            Relationship.findById(id, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item) {
                    return Status.returnStatus(res, Status.NULL);
                }

                if (relationship.doctor)
                    item.doctor = relationship.doctor;
                if (relationship.group){
                    if (relationship.group == '0000'){
                        item.group = null;
                    }
                    else
                        item.group = relationship.group;
                }

                if (relationship.user)
                    item.user = relationship.user;
                if (relationship.apply || relationship.apply === false)
                    item.apply = relationship.apply;

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
        if (req.params && req.params.id) { // params.id is chatroom ID

            Relationship.findOne({_id: req.params.id}, function (err, item) {
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

    DeleteByUserId: function (req, res) {
        if (req.params && req.params.id) { // params.id is user ID

            Relationship.remove({user: req.params.id}, function (err) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                res.sendStatus(200);
            });
        }
    },

    DeleteByDoctorId: function (req, res) {
        if (req.params && req.params.id) { // params.id is doctor ID

            Relationship.remove({doctor: req.params.id}, function (err) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                res.sendStatus(200);
            });
        }
    },

}