const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

// let items=["breakfast","lunch","snacks"];
// let workitems = [];

app.set('view-engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));  //to use public folder as express doesnt directly access css folder 


mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://shivam0303:test123@cluster0.0ksx6k4.mongodb.net/todolistDB",{useNewUrlParser:true});

const itemSchema = {
    name : String
};
const listSchema = {
    name : String,
    items : [itemSchema]
}

const Item = mongoose.model("Item",itemSchema);
const List = mongoose.model("list",listSchema);

const item1 = new Item({
    name : "Welcome to To-Do List!"
});

const item2 = new Item({
    name : "Click + to add new item"
});

const item3 = new Item({
    name : "<-Hit this to delete an item"
});
const defaultItems = [item1,item2,item3];


app.get("/",function(req,res){
    Item.find({},function(err,foundItems){
        if(foundItems.length===0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err);
                } else {
                    console.log("successfully process the data");
                }
            });
            res.redirect("/");
        } else{
            res.render("list.ejs",{listTitle : "ToDo-List", newItem : foundItems});
        }
        
    })
    
});

app.post("/",function(req,res){
    const item = req.body.todoitem;
    const listName = req.body.list;
    
    const newItem = new Item({
        name:item
    });
    
    if(listName === "ToDo-List"){
        
       // console.log(req.body.list);
       newItem.save();
       res.redirect("/");
    
    } else{
        List.findOne({name:listName},function(err,foundList){
            //console.log(foundList.items[0].name);
            foundList.items.push(newItem);
            foundList.save();
            console.log(foundList.items);
            res.redirect("/"+listName);

        });
    }
});

app.post("/delete",function(req,res){
    const deleteitem = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "ToDo-List"){
        Item.findByIdAndDelete(deleteitem,function(err){
            if(err){
                console.log(err);
            } else {
                console.log("seccessfully deleted");
            }
            res.redirect("/");
        })
    } else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:deleteitem}}},function(err,foundList){
            if(!err){
                res.redirect("/"+listName);
            }
        });
    }
});

app.get("/:customList",function(req,res){
    const customList = req.params.customList;

    List.findOne({name:customList},function(err,foundList){
        if(!err){
            if(!foundList){
                //console.log("doesnot exist")
                const list = new List({
                    name : customList,
                    items : defaultItems
                });
                list.save();
                res.redirect("/"+customList);
            } else{
                //console.log("exist")
                res.render("list.ejs",{listTitle : foundList.name, newItem : foundList.items});
            }
        }
    });
});



app.listen(3000,function(){
    console.log("server started at port 3000");
});