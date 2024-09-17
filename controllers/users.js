const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("./users/signup.ejs");
}
module.exports.signup = async(req,res)=>{
    try{
        let {username, email, password} = req.body;
        let newUser = new User({email, username});
        let regUser = await User.register(newUser, password);
        req.login(regUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "user registered successfully");
            res.redirect("/listings");
        })
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("./users/login.ejs");
}
module.exports.login = async(req,res) => {
    req.flash("success", `HI ${req.session.passport.user} welcome back to wonderland`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success", "you are logged out..!!");
        res.redirect("/listings");
    });
}