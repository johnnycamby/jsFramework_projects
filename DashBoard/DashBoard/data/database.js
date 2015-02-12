
(function (database) {
    
    var mongodb = require('mongodb');
    var mongoUrl = 'mongodb://localhost:27017/dashBoard';
    var theDb = null;

    database.getDb = function (next){

        if (!theDb) {
           //connect to the database
            mongodb.MongoClient.connect(mongoUrl, function (err, db) {
                
                if (err) {
                    next(err, null);
                } else {
                    theDb = {
                        db : db,
                        notes : db.collection('notes'),
                        users: db.collection('users')
                    };
                    next(null, theDb);
                }
            });

        } else {
            // null for the error 
            next(null, theDb);
        }
    }


})(module.exports);