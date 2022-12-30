const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

let items=["breakfast","lunch","snacks"];
let workitems = [];

app.set('view-engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));  //to use public folder as express doesnt directly access css folder 

app.get("/",function(req,res){
    let day = date.getDate;

    res.render("list.ejs",{kindOfDay : day, newItem : items});
});

app.post("/",function(req,res){
    item = req.body.todoitem;
   // console.log(req.body.list);
    if (req.body.list === "Work") {
        workitems.push(item);
        res.redirect("/work");
    } else {

        items.push(item);
        res.redirect("/");
    }

});

app.get("/work",function(req,res){
    res.render("list.ejs",{kindOfDay:"Work Day", newItem : workitems});
});


app.listen(3000,function(){
    console.log("server started at port 3000");
});