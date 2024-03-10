const express = require('express');
const admin_route = express();
const session = require('express-session');
const config = require('../config/config');
const bodyParser = require('body-parser');

// admin_route.use((req, res, next) => {
//     res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
//     next();
//   });

  admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));


admin_route.use(session({ secret: config.sessionSecret ,
    saveUninitialized:true,
    resave:false,

}));




admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin');



const auth =require('../middleware/adminAuth')

const adminController = require('../controllers/adminController');

admin_route.get('/',auth.isLogout, adminController.loadLogin);
admin_route.post('/', adminController.verifyLogin);
admin_route.get('/adhome',auth.isLogin, adminController.loadDashboard);

//logout
admin_route.get('/logout', auth.isLogin, adminController.logout);
admin_route.get('/dashboard',adminController.adminDashboard);


admin_route.get('/new-user',auth.isLogin,adminController.newUserLoad);
admin_route.post('/new-user',adminController.addUser);

admin_route.get('/edit-user',auth.isLogin,adminController.editUserLoad);
admin_route.post('/edit-user', adminController.updateUsers);
//delete
admin_route.get('/delete-user',adminController.deleteUser)




admin_route.get('*', function(req, res) {
    res.redirect('/admin/adhome');
});

module.exports = admin_route;
