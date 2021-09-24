
/**
 * In this file we will make sure that this device has an encryption key
 * for encrypting and decrypting the passwords.
 * @key {Buffer of 32 bytes}
 * @iv {Buffer of 16 bytes} https://en.wikipedia.org/wiki/Initialization_vector
 */

 const fs = require('fs');

 const crypto = require('crypto');
 const algorithm = 'aes-256-cbc';

 const { crypto_requirements } = require('../config.json');

 if(!crypto_requirements.key || !crypto_requirements.iv){
   fs.readFile('./config.json', 'utf8', (err, data) =>{
     if (err){
       console.log("An error has occured while reading the config.json file : ", err);
       return;
     }
     console.log('Reading the config.json file....')
     try {
       console.log("Parsing the config.json file....")
       const dataObject = JSON.parse(data);

       console.log("Generating a random key and an iv....")
       let key = crypto.randomBytes(32).toString('hex');
       let iv = crypto.randomBytes(16).toString('hex');

       dataObject.crypto_requirements.iv = iv;
       dataObject.crypto_requirements.key = key;


       fs.writeFile('./config.json', JSON.stringify(dataObject), err => {
         if(err){
           console.log("An error has occured while writing in the config.json file : ", err);
           return;
         }
         console.log("Adding the key and iv to the config file.")
       })

       console.log(dataObject.crypto_requirements);

     } catch (e) {
       console.log("An error has occured while parsing the config.json file : ", e);
       return;
     }
   })
 }else{
   console.log("> Crypto requirements already initialized !")
 }
