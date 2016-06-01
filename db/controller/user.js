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

        User.find({apply: true})
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

            User.find({link_id: linkId}) // check if registered
                .exec(function (err, users) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (users && users.length > 0) {
                        return Status.returnStatus(res, Status.EXISTED);
                    }

                    User.create({link_id: linkId, cell: user.cell, name: user.name, password: user.password, gender: user.gender, birthdate: user.birthdate, sin: user.sin}, function (err, raw) {
                        if (err) {
                            return Status.returnStatus(res, Status.ERROR, err);
                        }

                        return res.json(raw);
                    });

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
                if (user.sin)
                    item.sin = user.sin;

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

