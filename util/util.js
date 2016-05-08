/**
 * Created by hhu on 2016/5/8.
 */

var CryptoJS = require("crypto-js");

module.exports =  {

    ENCRYPT_KEY: 'xinhua e yao',

    encrypt: function(str){
        var ciphertext = CryptoJS.AES.encrypt(str, this.ENCRYPT_KEY);
        //console.log(ciphertext.toString());
        return ciphertext.toString();
    },

    decrypt: function(str){
        var bytes  = CryptoJS.AES.decrypt(str, this.ENCRYPT_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

}