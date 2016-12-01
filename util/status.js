/**
 * Created by hhu on 2016/5/7.
 */

module.exports =  {
    SUCCESS: "success",
    FAILED: "failed",
    ERROR: "error",
    NOT_EXISTED: 'not_existed',
    EXISTED: 'existed',
    EXISTED_NAME: 'existed_name',
    NULL: 'null', // 记录没有找到

    // parameter validation
    NO_CELL: 'no_cell',
    NO_NAME: 'no_name',
    NO_ID: 'no_id',
    NO_PASSWORD: 'no_password',
    NO_USER: 'no_user',
    NO_DEPARTMENT: 'no_department',
    NO_DOCTOR: 'no_doctor',
    NO_ROLE: 'no role',
    NO_TYPE: 'no type',
    NO_CAT: 'no category',
    NO_VALUE: 'no value',
    MISSING_PARAM: 'missing_param',
    INVALID_PARAM: 'invalid_param',
    NOT_REGISTERED: 'not_registered',
    WRONG_PASSWORD: 'WRONG_PASSWORD',
    PASS:　'PASS',

    CHATROOM_ERROR: 'CHATROOM_ERROR',
    NO_MESSAGE: 'NO_MESSAGE',


    returnStatus: function(res, status, err){
        var ret  = _.extend({return: status}, err);
        res.send(ret);
    },

}