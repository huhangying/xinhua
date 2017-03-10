/**
 * Created by hhu on 2016/4/27.
 */
var User = require('../model/user.js');

module.exports = {


    GetAll: function (req, res) {
        var number = 999; // set max return numbers

        if (req.params && req.params.number) {
            number = _.parseInt(req.params.number);
            //console.log(number);
        }

        User.find({})
            .sort({updated: -1})
            .limit(number)
            .exec(function(err, users){
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!users || users.length < 1) {
                    return Status.returnStatus(res, Status.NULL);
                }

                res.json(users);
            });
    },

    // 根据ID获取用户信息
    GetById: function (req, res) {

        if (req.params && req.params.id) {

            var result = User.findOne({_id: req.params.id})
                .exec(function(err, user) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!user) {
                        return Status.returnStatus(res, Status.NULL);
                    }

                    res.json(user);
                });
        }
    },

    // 根据微信号获取用户信息
    GetByLinkId: function (req, res) {

        if (req.params && req.params.id) {

            var result = User.findOne({link_id: req.params.id, apply: true})
                .exec(function(err, user) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!user) {
                        return Status.returnStatus(res, Status.NULL);
                    }

                    res.json(user);
                });
        }
    },

    // 根据ID获取用户信息
    Search: function (req, res) {
        var option = req.body;

        var filter_options = {};
        if (option.name) {
            filter_options.name = new RegExp(option.name, "i");
        }
        else if (option.cell) {
            filter_options.cell = new RegExp(option.cell, "i");
        }
        else if (option.admissionNumber) {
            filter_options.admissionNumber = new RegExp(option.admissionNumber, "i");
        }
        else if (option.sin) {
            filter_options.sin = new RegExp(option.sin, "i");
        }

        // console.log(filter_options);

        User.find(filter_options)
            .exec(function(err, users) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!users) {
                    return Status.returnStatus(res, Status.NULL);
                }

                res.json(users);
            });

    },

    // 根据手机号码获取用户信息
    GetByCell: function (req, res) {

        if (req.params && req.params.cell) {
            User.find({cell: req.params.cell, apply: true})
                .exec(function(err, users) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (!users || users.length < 1) {
                        return Status.returnStatus(res, Status.NULL);
                    }

                    res.json(users);
                    //res.json(users[0]);
                });

        }
    },

    // 根据微信号创建用户
    AddByLinkId: function(req, res){
        if (req.params && req.params.id) { // params.id is WeChat ID
            var linkId = req.params.id;

            if (!linkId) return Status.returnStatus(res, Status.NO_ID);

            // 获取user数据（json）
            var user = req.body;
            if (!user) return res.sendStatus(400);

            // 用户参数验证

            //验证手机号码
            if (!user.cell) {
                return Status.returnStatus(res, Status.NO_CELL);
            }

            // name
            if (!user.name) {
                return Status.returnStatus(res, Status.NO_NAME);
            }

            // gender

            // birth date

            // sin

            // admission number

            User.findOne({link_id: linkId}) // check if registered
                .exec(function (err, _user) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (_user && _user.apply) {
                        return Status.returnStatus(res, Status.EXISTED);
                    }

                    if (!_user) {
                        User.create({link_id: linkId,
                                cell: user.cell,
                                name: user.name,
                                password: user.password,
                                gender: user.gender,
                                icon: user.icon,
                                birthdate: user.birthdate,
                                sin: user.sin,
                                apply: user.apply || true},
                            function (err, raw) {
                                if (err) {
                                    return Status.returnStatus(res, Status.ERROR, err);
                                }

                                return res.json(raw);
                            });
                    }
                    else { // user.apply == false
                        _user.cell = user.cell;
                        _user.name = user.name;
                        //_user.password = user.password;
                        _user.gender = user.gender;
                        _user.icon = user.icon;
                        _user.birthdate = user.birthdate;
                        _user.apply = true;
                        
                        _user.save();

                        return res.json(_user);
                    }
                    

                });
        }
    },

    // 用于用户注册前,关联用户与药师的关系
    AddPresetByLinkId: function(req, res){
        if (req.params && req.params.id) { // params.id is WeChat ID
            var linkId = req.params.id;

            if (!linkId) return Status.returnStatus(res, Status.NO_ID);

            User.create({link_id: linkId,
                    apply: false},
                function (err, raw) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    return res.json(raw);

                });
        }
    },

    UpdateByLinkId: function(req, res){
        if (req.params && req.params.id) { // params.id is WeChat ID
            var linkId = req.params.id;

            // 获取user数据（json）
            var user = req.body;
            if (!user) return res.sendStatus(400);

            User.findOne({link_id: linkId}, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item){
                    return Status.returnStatus(res, Status.NULL);
                }

                if (user.name)
                    item.name = user.name;
                if (user.cell)
                    item.cell = user.cell;
                if (user.gender)
                    item.gender = user.gender;
                if (user.birthdate)
                    item.birthdate = user.birthdate;
                if (user.role || user.role == 0)
                    item.role = user.role;
                if (user.sin)
                    item.sin = user.sin;
                if (user.admissionNumber)
                    item.admissionNumber = user.admissionNumber;
                if (user.icon)
                    item.icon = user.icon || '';
                if (user.apply || user.apply === false)
                    item.apply = user.apply;

                if (user.visitedDepartments) {
                    item.visitedDepartments = user.visitedDepartments;
                }

                //console.log(JSON.stringify(item));

                //
                item.save(function(err, raw){
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }
                    res.json(raw); //update user success
                });

            });
        }
    },

    // for test
    DeleteById: function (req, res) {
        if (req.params && req.params.id) { // params.id is ID

            User.findOne({_id: req.params.id}, function (err, item) {
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

    UpdateIcon: function (req, res) {
        if (req.params && req.params.cell) {
            var query = {cell: req.params.cell};
            var update = {icon: 'http://101.200.81.99:808/server/icons/' + req.params.cell + '.jpg'};
            var options = {new: false};

            var result = User.findOneAndUpdate(query, update, options,
                function(err, usr){
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    res.json(usr);
                });
        }
    },

    //====================================================== for service

    GetNameById : function(id) {
        User.findOne({_id: id})
            .exec(function (err, item) {
                console.log(JSON.stringify((item)));

                if (err) {
                    return '';
                }

                if (!item) {
                    return '';
                }

                return item.name;
            });
    }


}

