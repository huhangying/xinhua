/**
 * Created by hhu on 2016/5/20.
 */

var Schema = global.mongoose.Schema;
var Q = require('q');

var _Relationship = new Schema({

    group:  {type: Schema.Types.ObjectId, ref: 'group' },
    doctor: {type: Schema.Types.ObjectId, ref: 'doctor' },
    user: {type: Schema.Types.ObjectId, ref: 'user' },
    apply: {type : Boolean, default: true}
});



var Relationship = mongoose.model('relationship', _Relationship);
Relationship.getFocusDoctors = function(userId) {
    var deferred = Q.defer();

    Relationship.find({user: userId, apply: true})
        .exec(function (err, items) {
            if (err) {
                deferred.resolve([]);
            }

            if (!items || items.length < 1) {
                deferred.resolve([]);

            }

            var doctors = items.map(function(a) {return a.doctor;});
            deferred.resolve(doctors);
        });

    return deferred.promise;
}
module.exports =  Relationship;