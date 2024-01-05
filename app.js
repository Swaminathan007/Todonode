const express = require('express');
const app = express();
const mongoose = require('mongoose');

require('dotenv').config()
const uri = process.env.MONGO_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;
const todoSchema = new Schema({
  task: String,
});

const TodoModel = mongoose.model('todos', todoSchema);
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views",__dirname + "\\views\\");


app.get("/",function(req,res){
    TodoModel.find({}).limit(null).then((tasks)=>{
        res.render("home.ejs",{tasks});
    });
});

app.post("/add",function(req,res){
    var task = req.body.task;
    let obj = new TodoModel({task:task}); 
    obj.save();
    res.redirect("/");
});
app.get("/delete/:idx",function(req,res){
    var idx = req.params.idx;
    TodoModel.deleteOne({_id:idx}).then(() => {
        res.redirect("/");
    });
});

app.get("/update/:idx",function(req,res){
    var idx = req.params.idx;
    TodoModel.findOne({_id:idx}).then((task) => {
        res.render("update.ejs",{task});
    })
});

app.post("/update/:idx",function(req,res){
    var idx = req.params.idx;
    var task = req.body.task;
    TodoModel.updateOne({_id:idx},{task:task}).then(()=>{
        res.redirect("/");
    });
});

app.listen(3000,()=>{
    console.log("App running on port 3000");
});



