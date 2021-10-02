# Secure Keychain Server

#### Video Demo: https://youtu.be/tdh1oAP5lGg

#### Description:

My project is an Express web app that can be downloaded and run on any pc. What it will do, is launch a local web application that allows users to create an account in which they can store all their login informations of other social media accounts safely on a remote database. The technologies used are ***node.js***,  ***Express***, ***bcrypt*** (for encypting and decrypting text), ***ejs*** (Embedded JS) for the templates, ***mongoose*** for interacting with the mongodb, ***paparse*** for parsing csv files.  

Let's get deeper into details :

When the user starts the app, it will connect to the remote db (if the connection failed the app will close) where all the account informations are stored as well as all the users registered on the app. It will verify if a `config.json` file has the unique **key** and **iv** stored in it (Which will be used later on). If one or both of them were not found, they will be added to the file. After creating an account and logging in, the user will be able to start adding account informations to the app by navigating to the `/home/add_accounts` location.

In there the user can add his socials individually or can upload a csv file which will be read and analyzed by the app and then if validated, encrypted and inserted to the db.

The user can search for a specific account information by navigating to `/home/search`.

Now what's special about this app, is the information will be encrypted on the remote server and  can be only decrypted with that one key and initializing vector stored in the user's `config.json` file. And these credentials are randomly generated and unique.


#### Project's file tree :

![Project's file tree](https://cdn.discordapp.com/attachments/723136982993207297/892507338227974154/Screen_Shot_2021-09-28_at_9.26.42_PM.png)


##### `./public` :
Where all the public *js* and styling files are stored.

`package.json`: The file in which npm will use to manage the project's file dependencies.

##### `./views` :
Where the templates are stored (written in ejs).

- **login.ejs:** The login form.
- **add_accounts.ejs:** The add_accounts page.
- **navbar.ejs:** The navbar template that will be included in all the other templates using the : ```<%- include('navabar'); -%>``` line.
- **register.ejs:** The register page that has it's own register form.
- **search.ejs:** The page where searches for platforms are perfomed.
- **home.ejs:** Where all the account will be displayed.
- **header.ejs:** The header file for all the pages, which is included in all the templates just like `navbar.ejs`. Contains the header block and all the tags for linking jquery and the `style.css` stylesheet located in `./public/stylesheets/style.css`.
- **error.ejs:** The error block that is included in some templates where errors are handled.
- **data-display.ejs:** The ejs file that is responsible for handling data and showing them to the user. (It is also included in some of the files).
- **form_error.ejs:** Just like `error.ejs` but for forms.

##### `./routes` :
- **register.js:** The route for handling **GET** and **POST** methods for the register page.
- **home.js:** The route for handling all **GET** and **POST** requests after the user has logged in.
- **login.js:** Same as the others but for the login page.

##### `./helpers` :
The folder of all the functions and classes that are being used in the routes.

- **dbConnection.js:** The file in which the connection to the cloud db is being established (by doing ```require('./helpers/dbConnection.js')``` in the `app.js` file) and from which we export the `Account` model (for fetching accounts from the db) and the `User` model (for handling the registration and the login of the users in the db).

> In case the connection to db fails for some reason, the application will be killed by the  `process.kill(1)` function.

- **security_key_checker.js:** The file which make sure there's a `config.json` file in the directory that has a *private_key* and an *iv* if not it will go ahead and add them. **PS:** *It will console log the steps that it's going through* if not it will just log `> Crypto requirements already initialized !`.

- **helper_functions.js:** The file from which we export the most used functions throughout the project to avoid repetition. ***Eg :*** `encrypt`, `decrypt`, `sort` *etc...*

- **Locals.js:** While working on the project I found that passing local variables can be tedious so I created a Locals class inside this file from which I can manage local variables pretty easily by exporting the class to other files.

- **app.js:** The main file where everything is being set to place in other words, the core of the project.

> **PS:** There should be a `config.json` file that should be set up in which the *private_key* and the *iv* will be set as well as the link and some information required to connect to the cloud db. 
