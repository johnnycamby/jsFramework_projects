/**
 * Created by johnny on 10/16/2014.
 */

(function(){

    'use strict';
    angular
        .module('mainApp')
        .controller('ProductDetailCtrl', ['product','productService',ProductDetailCtrl]);

    function ProductDetailCtrl(product, productService){

        var vm = this;

        vm.product = product;
        /*{
            'productId' : 5,
            'productName' : 'Hammer',
            'productCode' : 'TBX-0048',
            'releaseDate' : 'May 19, 2014',
            'description' : 'Curved claw steel hammer',
            'cost' : 10.00,
            'price' : 20.95,
            'category' : 'toolbox',
            'tags': ['tool'],
            'imageUrl' : 'https://openclipart.org/image/300px/svg_to_png/14358/mystica_Hammer.png'
        };
         */
        vm.title = 'Product Detail: ' + vm.product.productName;

        vm.marginPercent = productService.calculateMarginPercent(vm.product.price, vm.product.cost);

        if(vm.product.tags){
            vm.product.tagList = vm.product.tags.toString();
        }
    }
}());


