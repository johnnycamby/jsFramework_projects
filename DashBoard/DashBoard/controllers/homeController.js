
(function (homeController) {
    
    var data = require('../data');
    var auth = require('../auth');''

    homeController.init = function (app) {
        
        app.get('/', function (req, res) {
            
            //this is a callback
            data.getNoteCategories(function (err, results) {
                res.render('index', 
                   {
                    title: 'DashBoard::-',
                    error: err,
                    categories: results,
                    newCatError: req.flash('newCatName'),
                    user: req.user
                });
            });
        });
        
        app.get('/notes/:categoryName', 
            auth.ensureAuthenticated, 
            function (req, res) {
                    
            var categoryName = req.params.categoryName;
            res.render('notes', { title: categoryName, user: req.user });
        });

        app.post('/newCategory', function (req, res) {
        
            var categoryName = req.body.categoryName;

            data.createNewCategory(categoryName, function (err) {
                if (err) {
                    //Handle Error
                    console.log(err);
                    req.flash('newCatName', err);
                    res.redirect('/');

                } else {
                    res.redirect('/notes/' + categoryName);
                }
            });
        });
    };
})(module.exports);