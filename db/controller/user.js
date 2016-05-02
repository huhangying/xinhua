/**
 * Created by hhu on 2016/4/27.
 */
var User = require('../model/user.js');


module.exports = {

    GetAll: function (req, res) {
        var result = User.find();
        // res.send(result);
        res.send('get all');
    },

    Get: function (req, res) {
        if (req.params && req.params.cell) {
            var result = User.find({cell: req.params.cell, apply: true});
            res.send(result);
        }
    },

    GetById: function (req, res) {
        if (req.params && req.params.uid) {
            User.find({_id: req.params.uid, apply: true})
                .exec(function(err, users) {
                    if (err) {
                        return res.send('error');
                    }
                    if (!users || users.length < 1) {
                        return res.send('null');
                    }
                    res.send(users[0]);
                });

        }
    },

    Add: function(req, res){
        // 获取user数据（json）
        var user = req.body;
        if (!user) return res.sendStatus(400);

        //验证手机号码
        if (!user.cell){
            res.send('error');
            return;
        }

        User.find({cell: user.cell, apply: true}) // check if registered
            .exec(function(err, users){
                if (err) {
                    res.send('error');
                    return;
                }
                if (users && users.length > 0){
                    res.send('existed');
                    return;
                }

                User.create({cell: user.cell, name: user.name, password: user.password}, function (err, raw) {
                    if (err) return console.error(err);
                    res.send(raw);
                });

            });
    },

    Update: function(req, res){
        var user = req.body;

        var conditions = {cell :user.cell};
        var fields     = {name : user.name, gender: user.gender};
        var options    = {};

        User.update(conditions, fields, options, function (err, raw) {
            if (err) return console.error(err);
            res.send('update user success: ', raw);
        });
    },

    UpdateIcon: function (req, res) {
        if (req.params && req.params.cell) {
            var query = {cell: req.params.cell};
            var update = {icon: 'http://101.200.81.99:808/server/icons/' + req.params.cell + '.jpg'};
            var options = {new: false};

            var result = User.findOneAndUpdate(query, update, options,
                function(err, usr){
                    if (err) return console.error(err);
                    res.json(usr);
                });
        }
    },
}

