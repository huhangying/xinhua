/**
 * 内部使用, 相当于 cached singleton objects
 * Created by harry on 16/12/3.
 */

var _ConstService = require('../db/controller/const');
var _constList = [];
var Q = require('q');
module.exports =  {

    AWAY_RESPONSE: 'away_response',

    get: function(name){
        var deferred = Q.defer();

        // check if value is existed.
        for (var i=0; i<_constList.length; i++) {
            if (_constList[i] && name === _constList[i].name) {
                deferred.resolve(_constList[i].value);
                return deferred.promise;
            }
        }


        // get value from db
        _ConstService._GetByName(name)
            .then(function(item) {
                if (!item) {
                    deferred.resolve('');
                }
                else {
                    _constList.push(item);
                    deferred.resolve(item.value);
                }
            });

        return deferred.promise;
    },

    // 内部使用。 by
    clearCacheByName: function (name) {
        for (var i=0; i<_constList.length; i++) {
            if (_constList[i] && name === _constList[i].name) {
                _constList.splice(i, 1);
            }
        }
    },

}