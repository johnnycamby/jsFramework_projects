/**
 * Created by johnny on 10/15/2014.
 */

/*
   the last () make the function is self executing, so this becomes function expression
 productResourceMock its removal then our code can call then web service
 */

(function(){

    'use strict';
    var app = angular.module('mainApp',
        [
            'common.services',
            'ui.router',
            'ui.mask',
            'ui.bootstrap',
            'angularCharts',
            'productResourceMock'

            ]);

    // global exception handler e.g $state
    app.config(function($provide){

        $provide.decorator('$exceptionHandler', ['$delegate', function($delegate){
            return function(exception, cause){
                exception.message = "Please contact the Help Desk! \n Message: " + exception.message;

                $delegate(exception, cause);
                //alert(exception.message);
                toastr.error(exception.message);
            };
        }]);
    });


    app.config(
      ['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider){

          $urlRouterProvider.otherwise('/');
          $stateProvider
              //home
              .state('home',
              {
                  url : '/',
                  templateUrl : 'app/welcomeView.html'
              })

              // Products
              .state('productList',
              {
                  url : '/products',
                  templateUrl: 'app/products/productListView.html',
                  controller : 'ProductListCtrl as vm'
              })
             // Edit
              .state('productEdit',
              {
                  abstract: true,
                  url : '/products/edit/:productId',
                  templateUrl : 'app/products/productEditView.html',
                  controller : 'ProductEditCtrl as vm',
                  resolve : {
                      productResource : 'productResource',
                      product : function(productResource, $stateParams){
                          var productId = $stateParams.productId;
                          return productResource.get({ productId : productId }).$promise;
                      }
                  }

              })

              /*
               Nested state ::
                              - l'l use the parent controller
                              - when its activated the parent is also activated
                              - the resolve calls the web server and returns the product for edit
                              - the returned product is then injected into the parent controller
                */

              .state('productEdit.info',
              {
                  url : '/info',
                  templateUrl : 'app/products/productEditInfoView.html'
              })
              .state('productEdit.price',
              {
                  url : '/price',
                  templateUrl : 'app/products/productEditPriceView.html'
              })
              .state('productEdit.tags',
              {
                  url : '/tags',
                  templateUrl : 'app/products/productEditTagsView.html'
              })

             //details
              .state('productDetail',{
                  url : '/products/:productId',
                  templateUrl : 'app/products/productDetailView.html',
                  controller : 'ProductDetailCtrl as vm',
                  resolve : {
                      productResource : 'productResource',
                      product : function(productResource, $stateParams){
                          var productId = $stateParams.productId;
                          return productResource.get({ productId : productId }).$promise;
                      }
                  }

              })

              .state('priceAnalytics',{
                  url: '/priceAnalytics',
                  templateUrl: 'app/prices/priceAnalyticsView.html',
                  controller: 'PriceAnalyticsCtrl',
                  resolve: { // ensure all data is loaded b4 bring-up of the page
                      productResource: 'productResource',
                      products: function(productResource){
                          return productResource.query(function(response){
                              //success
                          },function(response){ /// handle asynchronous exception e.g backend webservice issues
                              if(response.status == 404){
                                  toastr.error('Error accessing resource: ' +
                                  response.config.method + ' ' + response.config.url);
                              }else{
                                  toastr.info(response.statusText);
                              }
                          }).$promise; // products in an array
                      }
                  }
          })

      }]
    );

}());


