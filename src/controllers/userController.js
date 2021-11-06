import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req,res) => res.render("join", {pageTitle:"Join"});
export const postJoin = async(req,res) => {
    const {name,username,email,password,password2,location} = req.body;
    const pageTItle = "join";
    if(password !== password2){
        return res.status(400).res.render("join", {pageTitle:"Join", errorMessage: "Password confirmation does not match"});
    }
    const exists = await User.exists({$or: [{username}, {email}]});
    if(exists){
        return res.status(400).res.render("join", {pageTitle:"Join", errorMessage: "This username/email is already"});
    }
    await User.create({
        name,
        username,
        email,
        password,
        location,
    });
    return res.redirect("/login");
};

export const postLogin = async(req,res) =>{
    const {username,password} = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({username});
    console.log(user);
    if(!user){
        return res.status(400).render("login", {pageTitle, errorMessage: " An account with this username does not exists."});
    }
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        if(!ok){
            return res.status(400).render("login", {pageTitle, errorMessage: "Wrong password"});
        }
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
}

export const getLogin = (req,res) => res.render("login", {pageTitle:"Login"});
export const edit = (req,res) => res.send("Edit User");
export const remove = (req,res) => res.send("Remove User");
export const logout = (req,res) => res.send("Logout");
export const see = (req,res) => res.send("See");