
var User = require('../model/user');
var UserFeedback = require('../model/userFeedback');
var Relationship = require('../model/relationship');
var Diagnose = require('../model/diagnose');
var Booking = require('../model/booking');
var Chatroom = require('../model/chatroom');
var Chat = require('../model/chat');
var Q = require('q');

module.exports = {

    DeleteUserAndRelatedData: function (req, res) {
        if (req.params && req.params.id) { // params.id is page ID
            var promises = [];

            User.findOne({_id: req.params.id}, function (err, item) {
                if (err) {
                    return Status.returnStatus(res, Status.ERROR, err);
                }
                var log = [];

                if (!item){
                    return Status.returnStatus(res, Status.NULL);
                }
                log.push('User ' + item.name + ' removed.');
                //
                item.remove(function(err, raw){
                    if (err) {
                        return Status.returnStatus(res, Status.ERROR, err);
                    }

                    // Delete related data
                    promises.push(UserFeedback.remove({user: req.params.id}, function (err) {
                        if (err) return console.error(err);
                        // removed!
                        log.push('UserFeedback removed.');
                    }));
                    promises.push(Relationship.remove({user: req.params.id}, function (err) {
                        if (err) return console.error(err);
                        // removed!
                        log.push('Relationship removed.');

                    }));
                    promises.push(Diagnose.remove({user: req.params.id}, function (err) {
                        if (err) return console.error(err);
                        // removed!
                        log.push('Diagnose removed.');
                    }));
                    promises.push(Booking.remove({user: req.params.id}, function (err) {
                        if (err) return console.error(err);
                        // removed!
                        log.push('Booking removed.');
                    }));

                    //delete chatroom and related chats
                    promises.push(Chatroom.find({user: req.params.id}, function (err, items) {
                        if (items && items.length > 0){
                            for (var i=0; i<items.length; i++) {

                                Chat.remove({chatroom: items[i]._id}, function (err) {
                                    if (err) return console.error(err);
                                    // removed!
                                    log.push('Chat ' + items[i]._id + ' removed.');
                                });
                                log.push('Chatroom ' + items[i].chatroom + ' removed.');
                                items[i].remove();
                            }
                        }
                    }));

                    Q.all(promises).then(
                        function(rsp) {
                            res.json({log: log});
                        },
                        function(err) {
                            res.json({error: true, log: log});
                        }
                    )
                });

            });
        }
    },

}