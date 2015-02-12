

(function () {
    
    'use strict';
    
    angular.module('mainApp')
           .controller('notesViewController',['$window','$http', notesViewController]);
    
    function notesViewController($window, $http) {
        
        var vm = this;

        vm.notes = [];
        
        vm.newNote = createBlankNote();

            // Get the category name
        vm.urlParts = $window.location.pathname.split('/');
        vm.categoryName = vm.urlParts[vm.urlParts.length - 1];

        vm.notesUrl = '/api/notes/' + vm.categoryName;
        $http.get(vm.notesUrl)
              .then(function (result) { 
        
                  //success
            vm.notes = result.data;
        }, function (err) { 
           //Error
            alert(err);
        });
        
        var socket = io.connect();
         // socket.on('showThis', function (msg) {
        
         //   alert(msg);
        // });
        
        socket.emit('join category', vm.categoryName);
        
        socket.on('broadcast note', function (note) {
        
            vm.notes.push(note);
            vm.$apply(); // force databinding to update
        });
        

        vm.save = function (){
            
            $http.post(vm.notesUrl, vm.newNote)
            .then(function (result) {
                // success
                vm.notes.push(result.data);
                vm.newNote = createBlankNote();
                socket.emit('newNote', 
                    {
                    category: vm.categoryName,
                    note: result.data
                    }
              );
            }, function (err) { 
               // Failure
            });
        }
    }

    function createBlankNote(){
    
        return {
            
            note: '',
            color: 'yellow'
        };
    }


}());