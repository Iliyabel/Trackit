This file contains instructions to modify the Authentication handler for the API gateway. 
_________________________________________________________________________________

NOTE: The Firebase config is not committed to the git repo as it contains secrets.
_________________________________________________________________________________





If modifying authentication function or need to reupload the auth handler in AWS:


1. Generate a new key with Firebase authentication. This will download a JSON file in the format of firebase_config_template.json.

2. Place the downloaded JSON in the same folder as the lambda handler for auth (index.js) and rename to "firebase_config.json".

3. Place the contents for the server/auth folder into a Zip file.

4. Upload the Zip to the Authorizer lambda as assigned in API Gateway.

5. Delete the old key in firebase for security.  


