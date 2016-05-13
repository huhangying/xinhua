/**
 * Created by hhu on 2016/5/7.
 */
var Doctor = require('../model/doctor.js');

module.exports = {


    GetAll: function (req, res) {
        var number = 999; // set max return numbers

        if (req.params && req.params.number) {
            number = _.parseInt(req.params.number);
            //console.log(number);
        }

        Doctor.find({apply: true}).limit(number)
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

    // 根据药师用户ID获取用户信息
    GetByUserId: function (req, res) {

        if (req.params && req.params.id) {

            var result = Doctor.findOne({user_id: req.params.id, apply: true})
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

    // 根据手机号码获取药师用户信息
    GetByCell: function (req, res) {

        if (req.params && req.params.cell) {
            Doctor.find({cell: req.params.cell, apply: true})
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

    // 创建药师用户
    AddByUserId: function (req, res) {

        if (req.params && req.params.id) { // params.id is doctor's user ID
            var uid = req.params.id;

            if (!uid) return Status.returnStatus(res, Status.NO_ID);

            // 获取doctor数据（json）
            var doctor = req.body;
            if (!doctor) return res.sendStatus(400);

            // 用户参数验证

            // password
            if (!doctor.password) {
                return Status.returnStatus(res, Status.NO_PASSWORD);
            }

            // name
            if (!doctor.name) {
                return Status.returnStatus(res, Status.NO_NAME);
            }

            //验证手机号码
            if (!doctor.cell) {
                return Status.returnStatus(res, Status.NO_CELL);
            }


            // gender

            // expertise

            // bulletin

            // icon

            Doctor.find({user_id: uid}) // check if registered
                .exec(function (err, items) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    if (items && items.length > 0) {
                        return Status.returnStatus(res, Status.EXISTED);
                    }

                    Doctor.create({
                        user_id: uid,
                        password: Util.encrypt(doctor.password),

                        name: doctor.name,
                        department: doctor.department,
                        title: doctor.title,
                        tel: doctor.tel,
                        cell: doctor.cell,
                        gender: doctor.gender,
                        expertise: doctor.expertise,
                        bulletin: doctor.bulletin,
                        icon: doctor.icon
                    }, function (err, raw) {
                        if (err) {
                            return Status.returnStatus(res, Status.ERROR, err);
                        }

                        return res.send(raw);
                    });

                });
        }
    },

    UpdateByUserId: function (req, res) {
        if (req.params && req.params.id) { // params.id is doctor's user ID
            var uid = req.params.id;
            // 获取user数据（json）
            var doctor = req.body;
            if (!doctor) return res.sendStatus(400);


            Doctor.findOne({user_id: uid}, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }

                if (!item){
                    return Status.returnStatus(res, Status.NULL);
                }

                if (doctor.password)
                    item.password = Util.encrypt(doctor.password);
                if (doctor.name)
                    item.name = doctor.name;
                if (doctor.department)
                    item.department = doctor.department;
                if (doctor.title)
                    item.title = doctor.title;
                if (doctor.tel)
                    item.tel = doctor.tel;
                if (doctor.cell)
                    item.cell = doctor.cell;
                if (doctor.gender)
                    item.gender = doctor.gender;
                if (doctor.expertise)
                    item.expertise = doctor.expertise;
                if (doctor.bulletin)
                    item.bulletin = doctor.bulletin;
                if (doctor.icon)
                    item.icon = doctor.icon;

                //console.log(JSON.stringify(item));

                //
                item.save(function(err, raw){
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }
                    res.send('update doctor success: ', raw);
                });

            });
        }
    },

    DeleteByUserId: function (req, res) {
        if (req.params && req.params.id) { // params.id is doctor's user ID
            var uid = req.params.id;
            // 获取user数据（json）
            var doctor = req.body;
            if (!doctor) return res.sendStatus(400);


            Doctor.findOne({user_id: uid}, function (err, item) {
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
                    res.send('remove doctor success: ', raw);
                });

            });
        }
    },

    UpdateIcon: function (req, res) {
        if (req.params && req.params.cell) {
            var query = {cell: req.params.cell};
            var update = {icon: 'http://101.200.81.99:808/server/icons/' + req.params.cell + '.jpg'};
            var options = {new: false};

            var result = Doctor.findOneAndUpdate(query, update, options,
                function (err, usr) {
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    res.json(usr);
                });
        }
    },

    //================== login ===================

    Login: function(req, res){
        // 获取 login 数据（json）
        var login = req.body;
        if (!login) return res.sendStatus(400);

        // user_id
        if (!login.user_id) {
            return Status.returnStatus(res, Status.NO_ID);
        }

        // password
        if (!login.password) {
            return Status.returnStatus(res, Status.NO_PASSWORD);
        }

        Doctor.find({user_id: login.user_id}, function(err, items){
            if (err) {
                return Status.returnStatus(res, Status.ERROR, err);
            }

            if (!items || items.length < 1) {
                return Status.returnStatus(res, Status.NOT_REGISTERED);
            }

            //console.log(Util.decrypt(items[0].password));
            //console.log(Util.encrypt(login.password) + ' : ' + items[0].password);
            // check password
            if (login.password != Util.decrypt(items[0].password)){
                return Status.returnStatus(res, Status.WRONG_PASSWORD);
            }

            return Status.returnStatus(res, Status.PASS);
        });

    }


}