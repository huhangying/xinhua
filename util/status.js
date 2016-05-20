/**
 * Created by hhu on 2016/5/7.
 */

module.exports =  {
    SUCCESS: "success",
    FAILED: "failed",
    ERROR: "error",
    NOT_EXISTED: 'not_existed',
    EXISTED: 'existed',
    NULL: 'null', // 记录没有找到

    // parameter validation
    NO_CELL: 'no_cell',
    NO_NAME: 'no_name',
    NO_ID: 'no_id',
    NO_PASSWORD: 'no_password',
    NO_USER: 'no_user',
    NO_DOCTOR: 'no_doctor',
    MISSING_PARAM: 'missing_param',
    NOT_REGISTERED: 'not_register',
    WRONG_PASSWORD: 'WRONG_PASSWORD',
    PASS:　'PASS',


    returnStatus: function(res, status, err){
        var ret  = _.extend({return: status}, err);
        res.send(ret);
    },

}