/**
 * Created by johnny on 8/18/2014.
 */

    /*
       extend underscore with customed functions and implementations
     */
var _mixIns = (function(){

    _.mixin({

        numberWithCommas : function(value){
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g,","); //regExp : take a number create common groups every third digit e.g rendering currency
        },

        sum : function(value, key){

            var returnValue = 0;
            //_.reduce works like summing up values
            returnValue = _.reduce(value, function(memo, value){
                value = _.isNumber(value) ? value : value[key];

                return memo + value;
            }, 0);

            return returnValue;
        }

    });

}());