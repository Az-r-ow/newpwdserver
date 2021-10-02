# Secure Keychain Server

#### Video Demo:

#### Description:

My project is an Express web app that can be downloaded and run on any pc. What it will do, is launch a local web application that allows users to create an account in which they can store all their login informations of other social media accounts safely on a remote database. The technologies used are ***node.js***,  ***Express***, ***bcrypt*** (for encypting and decrypting text), ***ejs*** (Embedded JS) for the templates, ***mongoose*** for interacting with the mongodb, ***paparse*** for parsing csv files.  

Let's get deeper into details :

When the user starts the app, it will connect to the remote db (if the connection failed the app will close) where all the account informations are stored as well as all the users registered on the app. It will verify if a `config.json` file has the unique **key** and **iv** stored in it (Which will be used later on). If one or both of them were not found, they will be added to the file. After creating an account and logging in, the user will be able to start adding account informations to the app by navigating to the `/home/add_accounts` location.

In there the user can add his socials individually or can upload a csv file which will be read and analyzed by the app and then if validated, encrypted and inserted to the db.

The user can search for a specific account information by navigating to `/home/search`.

Now what's special about this app, is the information will be encrypted on the remote server and  can be only decrypted with that one key and initializing vector stored in the user's `config.json` file. And these credentials are randomly generated and unique.


#### Project's file tree :

![Project's file tree](https://cdn.discordapp.com/attachments/723136982993207297/892507338227974154/Screen_Shot_2021-09-28_at_9.26.42_PM.png)
