const bcrypt = require('bcrypt');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const saltRounds = 10;

/**
 * hash function
 * @param {String} string The string that will be hashed
 * @return {String}  The hash created from the string
 */

const hash = async (string) => {
  let hash;
  await bcrypt.genSalt(saltRounds).then(async salt => {
    await bcrypt.hash(string, salt).then(res => {
      hash = res;
    })
  })
  return hash;
}


/**
 * compare_hashes - A function that compares a string an a hash
 *
 * @param {String} string The string that represent's the user's password input
 * @param {String} hash The hash queried from the db that represen't the user's password hashe
 * @return {Boolean || Error} In case of an error it will return the error message, if not it will return the result of the comparison.
 */

const compare_hashes = async (string, hash) => {
  let result;
  let error = false;
  await bcrypt.compare(string, hash).then(res => {
    console.log('The result from the bcrypt function', res);
    result = res;
  }).catch(e => {
    console.log('An error has occured when comparing hashes');
    error = e;
  })
  if (error) return error;
  return result;
}


/**
 * encrypt - encrypt passwords
 * @param password {String} The password that will be encrypted
 * @param key {Buffer} The key should be translated to buffer from hex
 * @param iv {Buffer} The initializing vector buffer of 16 bytes
 *
 * @return {String} The encrypted_password
 */

const encrypt = (password, key, iv) => {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(password);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
}


/**
 * decrypt - decrypt passwords
 * @param encrypted_password {String}
 * @param key {Buffer} Buffer of 32 bytes length
 * @param iv {Buffer} Buffer of 16 bytes length
 *
 * @return {String} decrypted_password
 */

 const decrypt = (encrypted_password, key, iv) => {
   let encryptedText = Buffer.from(encrypted_password, 'hex');
   let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
   let decrypted = decipher.update(encryptedText);
   decrypted = Buffer.concat([decrypted, decipher.final()]);
   return decrypted.toString();
 }


/**
 * sort_data - used for sorting accounts in an array
 * @param sorting_type {String}
 * @param data {Array of Accounts}
 *
 * @return {Array of Accounts} The sorted accounts based on the sorting type given.
 */

 const sort_data = (sorting_type, data) => {

   let sorted_data;

   console.log('sorting type : ', sorting_type)

   switch (sorting_type) {

     case 'default':
     console.log('default has been triggered');
       sorted_data = data;
       break;

    case 'platform-name':
    console.log('platform-name has been triggered.')
      sorted_data = data.sort((a, b) => {
        let stringA = a.platform_name.toUpperCase();
        let stringB = b.platform_name.toUpperCase();

        return (stringA < stringB) ? - 1 : 0;
      })

      console.log(sorted_data);

      break;

    case 'username':
    console.log('Username has been triggered.')
      sorted_data = data.sort((a, b) => {
        let stringA = a.username.toUpperCase();
        let stringB = b.username.toUpperCase();

        return (stringA < stringB) ? - 1 : 0;
      });
      console.log(sorted_data);

      break;

    case 'oldest':
    console.log('Oldest has been triggered.')
      sorted_data = data.sort((a, b) => {
        return new Date(a.upload_date) - new Date(b.upload_date);
      })

      console.log(sorted_data);

      break;

    case 'recent':
    console.log('Recent has been triggered.')
      sorted_data = data.sort((a, b) => {
        return b.upload_date - a.upload_date;
      });

      console.log(sorted_data);


      break;

     default:
     console.log('Default has been triggered.')
     sorted_data = data;
     break;
   }
   console.log('this has been triggered');
   console.log('sorted_data => ', sorted_data); 
   return sorted_data;
 }

module.exports = {hash, compare_hashes, encrypt, decrypt, sort_data};
