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



/**
 * @description
 * Returns a function which will sort an
 * array of objects by the given key.
 *
 * @param  {String}  key
 * @param  {Boolean} reverse
 * @return {Function}
 */
function sortBy(key, reverse) {

    // Move smaller items towards the front
    // or back of the array depending on if
    // we want to sort the array in reverse
    // order or not.
    var moveSmaller = reverse ? 1 : -1;

    // Move larger items towards the front
    // or back of the array depending on if
    // we want to sort the array in reverse
    // order or not.
    var moveLarger = reverse ? -1 : 1;

    /**
     * @param  {*} a
     * @param  {*} b
     * @return {Number}
     */
    return function(a, b) {
        if (a[key] < b[key]) {
            return moveSmaller;
        }
        if (a[key] > b[key]) {
            return moveLarger;
        }
        return 0;
    };

}

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

            var doctors = items.map(function(a) {return a.doctor;}).sort(sortBy('order'));
            deferred.resolve(doctors);
        });

    return deferred.promise;
};

module.exports =  Relationship;