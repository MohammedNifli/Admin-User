const  User =require('../models/userModel');
const bcrypt = require('bcrypt');


const securePassword = async(password)=>{
    try{
        const passwordHash = await bcrypt.hash(password,10); 
        return passwordHash;

    }catch(error){
        console.log(error.message)
    }
}
const loadLogin = async(req,res)=>{
    try{
        res.render('adlogin')
        
    }catch(error){
        console.log(error.message)

    }
}
const verifyLogin = async (req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
       const userData = await User.findOne({email:email});

       if(userData){
        const passwordMatch = await bcrypt.compare(password,userData.password);
        if(passwordMatch){
            if(userData.is_admin===0){
                res.render('adlogin',{message:"Email and password are incorrect."});

            }else{
                req.session.admin_id = userData._id;
                res.redirect('/admin/adhome');

            }


        }else{
            res.render('adlogin',{message:"Email and password is incorrect."});

        }

       }else{
         res.render('adlogin',{message:"Email and password is incorrect."});
       }

    }catch(error){
        console.log(error.message);

    }
}
const loadDashboard = async(req,res)=>{
    try{
        const userData=await User.findById({_id:req.session.admin_id});

        res.render('adhome',{admin:userData});
    }catch(error){
        console.log(error.message)
    }
}
const logout = async (req, res) => {
    try {
        req.session.destroy();
        // res.redirect('/adlogin');
    } catch (error) {
        console.log(error.message);
    }
};

const adminDashboard = async(req,res)=>{
    try {
       const userData=await User.find({is_admin:0})
        res.render("dashboard",{users:userData}); 
        
    } catch (error) {
        console.log(error.message);
        
    }
}
 //add new user
 const newUserLoad = async(req,res)=>{
    try{

       res.render('new-user');
    }catch{
        console.log(error.message);

    }
 }

 const addUser= async(req,res)=>{
    try{
      const name = req.body.name;
      const email = req.body.email;
      const mobile = req.body.mob ;
      const password= req.body.password;
    
       const spassword = await securePassword(password);
      const user = new User({
        name:name,
        email:email,
        mobile:mobile,
        password:spassword,


      });
      const userData = await user.save();

        // Handle the result of save operation
        if (userData) {
            res.render('new-user', { message: 'New user added' });
        } else {
            res.render('new-user', { message: 'Something went wrong during user creation' });
        }
    } catch (error) {
        console.log(error.message);
        res.render('new-user', { message: 'An error occurred during user creation' });
    }
};

//edit user
const editUserLoad = async (req,res)=>{
    try {
        const id = req.query.id;
        const userData = await User. findById({_id:id});
        if(userData){
            res.render('edit-user',{user:userData});
        }else{
            res.redirect('/admin/dashboard ')
        }
        
    } catch (error) {
        console.log(error.message);
        
    }
}

const updateUsers = async (req,res) => {
    try {
        const userData = await User.findByIdAndUpdate(
            { _id: req.body.id },
            { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mob } }
        );
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message);
        // Handle the error appropriately, e.g., send an error response to the client.
    }
};


 
const deleteUser = async(req,res)=>{
    try {
        const id = req.query.id;
       const userData= await User.deleteOne({_id:id})
       req.session.destroy()
        res.redirect('/admin/dashboard');
        
    } catch (error) {
        console.log(error.message)
        
    }
}

module.exports = {
    loadLogin, 
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard, 
    newUserLoad,
    addUser,
    editUserLoad,
    deleteUser,
    updateUsers


}