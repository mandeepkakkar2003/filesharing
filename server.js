const express=require ("express");
const app=express();
const path =require('path')
const connectDB=require('./config/db');
connectDB();
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

const PORT=process.env.PORT || 3000;


app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));



app.listen(3000,()=>{
    console.log("LISTENING ON PORT 3000");
})