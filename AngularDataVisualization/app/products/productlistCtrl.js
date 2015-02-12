/**
 * Created by johnny on 10/15/2014.
 */

(function(){

    'use strict';

    angular
        .module('mainApp')
        .controller('ProductListCtrl',['productResource',ProductListCtrl] );

    function ProductListCtrl(productResource){
        var vm = this;

        productResource.query(function(data){
            vm.products = data;
        });

      /*  products array
           vm.products = [
            {
                'productId' : 1,
                'productName' : 'Leaf Rake',
                'productCode' : 'GDN-0011',
                'releaseDate' : 'March 19, 2010',
                'description' : 'Leaf rake with 48-inch handle',
                'cost' : 9.00,
                'price' : 19.95,
                'category' : 'garden',
                'tags': ['leaf', 'tool'],
                'imageUrl' : 'https://openclipart.org/image/300px/svg_to_png/58471/garden_cart.png'
            },
            {
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
            }


        ];
        */

        // turn the images on/off
        vm.showImage = false;

        vm.toggleImage = function(){
            vm.showImage = !vm.showImage;
        }
    }
}());
