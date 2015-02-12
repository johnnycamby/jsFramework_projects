/**
 * Created by johnny on 10/15/2014.
 */

(function(){

    'use strict';

    var app = angular
        .module('productResourceMock', ['ngMockE2E']);

    // app.run :: performs the initialization, it executes the passed function when the module is loaded
    app.run(function($httpBackend){

        // define default setup data(mocked)
        var products = [
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
            },
            {
                'productId' : 10,
                'productName' : 'Handheld game console',
                'productCode' : 'GMG-0042',
                'releaseDate' : 'November 01, 2014',
                'description' : 'a svg of a handheld game console from Gamepark Holdings(R) --- I do not hope that the graphic conflicts with rights. If it should be like that, it can be removed by an admin. ',
                'cost' : 2.22,
                'price' : 45.95,
                'category' : 'gaming',
                'tags': ['gaming','controller','video game','console' ,' fun' ,'gp2x' , 'handheld'],
                'imageUrl' : 'https://openclipart.org/image/300px/svg_to_png/4021/needcoffee_handheld_game_console.png'
            },
            {
                'productId' : 5,
                'productName' : 'Headphones',
                'productCode' : 'JKI-0001',
                'releaseDate' : 'December 20, 2013',
                'description' : 'A simple headphone clipart, wireless headsets.',
                'cost' : 35.00,
                'price' : 60.95,
                'category' : 'music',
                'tags': ['OCAL' , 'Public Domain' , 'audio' , 'computer' , 'hardware' , 'headphone' , 'headset' , 'music'],
                'imageUrl' : 'https://openclipart.org/image/300px/svg_to_png/170946/headphone.png'
            }

        ];

       // fake responses to webservice calls
       var productUrl = '/api/products';

        $httpBackend.whenGET(productUrl).respond(products);

        // works for productDetailView, productEditView that retrieve only one product
        var editingRegex = new RegExp(productUrl + "/[0-9][0-9]*", '');
        $httpBackend.whenGET(editingRegex).respond(function(method, url, data){

            var product = {"productId":0};
            var parameters = url.split('/');
            var length = parameters.length;
            var id = parameters[length - 1];

            if(id > 0){
                for(var i = 0; i < products.length; i++){
                    if(products[i].productId == id){
                        product = products[i];
                        break;
                    }
                };
            }
            return [200, product, {}];
        });

        // this is used for save functionality thus POST calls to fake out adding and editing items in a list
        $httpBackend.whenPOST(productUrl).respond(function(method, url, data){

            var product = angular.fromJson(data);

            if(!product.productId){
                //new product Id
                product.productId = products[products.length - 1].productId + 1;
                products.push(product);
            }else{
                // updated product
                for(var i = 0; i < products.length; i++){
                    if(products[i].productId == product.productId){
                        products[i] = product;
                        break;
                    }
                };
            }

            return [200, product, {}];
        });

        // Pass through any request for application files (thus e.g file 'app/products/productListView.html')
        $httpBackend.whenGET(/app/).passThrough();

    });
}());
