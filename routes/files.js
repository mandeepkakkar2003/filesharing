const router=require('express').Router();
const multer=require('multer');
const path=require('path');
const File=require('../models/file')
const{v4:uuid4}=require('uuid');

let storage=multer.diskStorage({
    destination: (req,file,cb)=>cb(null,'uploads/'),
    filename:(req,file,cb)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName);
         
    }
})


let upload=multer({
    storage:storage,
    limit:{fileSize:1000000*100}

}).single('myfile');


router.post('/', function(req,res){
    
    

    //store in upload
      upload(req,res,async function(err){
        if(!req.file){
            return res.json({error: 'Ki bheji jana!!'})
        }
        if(err){
            return res.status(500);
        }
        
//store into database 
            const file=new File({
                filename:req.file.filename,
                uuid:uuid4(),
                path:req.file.path,
                size:req.file.size


            })
            const response = await file.save();
        res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
        

      })


    


    //link bhejn

})



router.post('/send', async (req, res) => {
    const { uuid, emailTo, emailFrom, expiresIn } = req.body;
    if(!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: 'All fields are required except expiry.'});
    }
    // Get data from db 
    try {
      const file = await File.findOne({ uuid: uuid });
      if(file.sender) {
        return res.status(422).send({ error: 'Email already sent once.'});
      }
      file.sender = emailFrom;
      file.receiver = emailTo;
      const response = await file.save();
      // send mail
      const sendMail = require('../services/emailService');
      sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'inShare file sharing',
        text: `${emailFrom} shared a file with you.`,
        html: require('../services/emailTemplate')({
                  emailFrom, 
                  downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email` ,
                  size: parseInt(file.size/1000) + ' KB',
                  expires: '24 hours'
              })
      }).then(() => {
        return res.json({success: true});
      }).catch(err => {
        return res.status(500).json({error: 'Error in email sending.'});
      });
  } catch(err) {
    return res.status(500).send({ error: 'Something went wrong.'});
  }
  
  });

module.exports=router;