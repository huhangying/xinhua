/**
 * Created by hhu on 2018/5/31.
 */

var Hospital = require('../model/hospital.js');

module.exports = {


  GetAll: function (req, res) {

    Hospital.find()
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

  // 根据ID获取详细信息
  GetById: function (req, res) {

    if (req.params && req.params.id) {

      var result = Hospital.findOne({_id: req.params.id, apply: true})
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

  // 根据HID获取详细信息
  GetByHid: function (req, res) {

    if (req.params && req.params.hid) {

      var result = Hospital.findOne({hid: req.params.hid})
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


  // 创建医院
  Add: function (req, res) {

    // 获取hospital请求数据（json）
    var hospital = req.body;
    if (!hospital) return res.sendStatus(400);

    // name
    if (!hospital.name) {
      return Status.returnStatus(res, Status.NO_NAME);
    }


    Hospital.find({hid: hospital.hid}) // check if existed
      .exec(function (err, items) {
        if (err) {
          return Status.returnStatus(res, Status.ERROR, err);
        }

        if (items && items.length > 0) {
          return Status.returnStatus(res, Status.EXISTED);
        }

        Hospital.create({

          hid: hospital.hid,
          name: hospital.name,
          desc: hospital.desc,
          order: hospital.order,
          apply: hospital.apply || true
        }, function (err, raw) {
          if (err) {
            return Status.returnStatus(res, Status.ERROR, err);
          }

          return res.send(raw);
        });

      });
  },

  UpdateById: function (req, res) {
    if (req.params && req.params.id) { // params.id is doctor's user ID
      var id = req.params.id;
      // 获取hospital数据（json）
      var hospital = req.body;
      if (!hospital) return res.sendStatus(400);


      Hospital.findById(id, function (err, item) {
        if (err) {
          return Status.returnStatus(res, Status.ERROR, err);
        }

        if (!item){
          return Status.returnStatus(res, Status.NULL);
        }

        if (hospital.hid)
          item.hid = hospital.hid;
        if (hospital.name)
          item.name = hospital.name;
        if (hospital.desc)
          item.desc = hospital.desc;
        if (hospital.order)
          item.order = hospital.order;
        if (hospital.apply || hospital.apply === false)
          item.apply = hospital.apply;

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
    if (req.params && req.params.id) { // params.id is doctor's user ID
      var id = req.params.id;

      Hospital.findById(id, function (err, item) {
        if (err) {
          return Status.returnStatus(res, Status.ERROR, err);
        }

        if (!item){
          return Status.returnStatus(res, Status.NULL);
        }

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