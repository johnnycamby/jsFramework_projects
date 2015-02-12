/**
 * Created by johnny on 10/16/2014.
 */


(function(){

    'use strict';

    angular
        .module('mainApp')
        .controller('ProductEditCtrl', ['product','$state','productService', ProductEditCtrl]);

    function ProductEditCtrl(product,$state, productService){
        var vm = this;

        vm.product = product;
        vm.priceOption = 'percent';

        vm.marginPercent = function(){ // its a function so that it recalculates at any changes

            return productService.calculateMarginPercent(vm.product.price, vm.product.cost);
        };

        // calculate the price based on a markup
        vm.calculatePrice = function(){

            var price = 0;

            if(vm.priceOption == 'amount'){

                price = productService.calculatePriceFromMarkupAmount(vm.product.cost, vm.markupAmount);
            }

            if(vm.priceOption == 'percent'){
                price = productService.calculatePriceFromMarkupPercent(vm.product.cost, vm.markupPercent);
            }

            vm.product.price = price;
        };

        if(vm.product && vm.product.productId){
            vm.title = 'Edit: ' + vm.product.productName;
        }else{
            vm.title = 'New Product';
        }

        // this is for EditInfoView state please next time define a new controller and place this code there :: for encapsulation
       // $event = original event object
        // prevent any default event actions from being triggered
        //
        vm.open = function($event){
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = !vm.opened;
        };

        vm.submit = function(isValid){

            if(isValid) {

                vm.product.$save(function (data) {
                    toastr.success('Save was Successful!!');
                });
            }else{
                toastr.error('Please correct the validation errors first!!');
            }
        }

        vm.cancel = function(){
            $state.go('productList');
        }

        vm.addTags = function(tags){
            if(tags){
                var array = tags.split(',');
                vm.product.tags = vm.product.tags ? vm.product.tags.concat(array) : array;
                vm.newTags = "";
            }else{
                alert('Please enter one of more tags separated by commas');
            }
        }

        vm.removeTag = function(idx){
            vm.product.tags.splice(idx, 1);
        }
    }

}());