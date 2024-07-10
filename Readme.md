# API to perform Password Reset for the User

## Description :

This API fetches data from the mongoDB database and performs below operations

## Getting Started :

**Below EndPoints to perform the required operations and their respective fields**

## API Link and Endpoints:

*https://password-reset-hm66.onrender.com*

_/register_

_Register the user in the DB with below data_

> name

> email

> phone

> dob

> password

> confirmPassword

_/login_

_Login with below credentials allows user to dashboard page only if the credentials matches the user_

> email

> password

_/forgotpassword_

_Matches the email in the Server and proceed to final password reset only if the user present in the Server_

> email

_/passwordreset_

_Final Password reset page checks the expiry of the token valid for 1hour_

> newPassword

> confirmNewPassword

## Technologies used :

_nodemailer :_ To send the password reset email so provide a valid email

_bcrypt :_ Used to encrypt the password and store in the database

_JWT :_ Token used valid the link with the expiry time

## Links :

_This API is used in the FE :_ https://passwordresetbyraj.netlify.app/

_To view this API in Postman :_ https://documenter.getpostman.com/view/34103499/2sA3e48oL6
