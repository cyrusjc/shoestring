var express     = require("express");
const readline = require('readline'); 
const {google} = require('googleapis');
const fs = require('fs');
var async = require("async");

//===================================================================================
//========================GOOGLE AUTHENTICATION CODE ================================
//===================================================================================
const TOKEN_PATH = './credentials/token.json';
const SCOPES = ['https://www.googleapis.com/auth/drive'];

// If modifying these scopes, delete token.json.

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

module.exports={
    readandupdate: 
    
        function(){
          // Load client secrets from a local file.
          fs.readFile('./credentials/credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Drive API.
            authorize(JSON.parse(content), findAndDownload);
          });
          
          /**
           * Create an OAuth2 client with the given credentials, and then execute the
           * given callback function.
           * @param {Object} credentials The authorization client credentials.
           * @param {function} callback The callback to call with the authorized client.
           */
          function authorize(credentials, callback) {
            const {client_secret, client_id, redirect_uris} = credentials.installed;
            const oAuth2Client = new google.auth.OAuth2(
                client_id, client_secret, redirect_uris[0]);
          
            // Check if we have previously stored a token.
            fs.readFile(TOKEN_PATH, (err, token) => {
              if (err) return getAccessToken(oAuth2Client, callback);
              oAuth2Client.setCredentials(JSON.parse(token));
              callback(oAuth2Client);
            });
          }
          
          /**
           * Get and store new token after prompting for user authorization, and then
           * execute the given callback with the authorized OAuth2 client.
           * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
           * @param {getEventsCallback} callback The callback for the authorized client.
           */
          function getAccessToken(oAuth2Client, callback) {
            const authUrl = oAuth2Client.generateAuthUrl({
              access_type: 'offline',
              scope: SCOPES,
            });
            console.log('Authorize this app by visiting this url:', authUrl);
            const rl = readline.createInterface({
              input: process.stdin,
              output: process.stdout,
            });
            rl.question('Enter the code from that page here: ', (code) => {
              rl.close();
              oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                  if (err) return console.error(err);
                  console.log('Token stored to', TOKEN_PATH);
                });
                callback(oAuth2Client);
              });
            });
          }
          
          function findAndDownload(auth, done) {
            const drive = google.drive({version: 'v3', auth});
            // ================================================================================================
            // ==========================================FILE FINDING ==========================================
            // ================================================================================================
            
            // WE QUERY API FOR FILES THAT HAVE IMAGE TYPE JPEG AND CONTAINS NAME MENU AND RETURN US WITH NAME, ID
            drive.files.list({
              q: "mimeType='image/jpeg' and name contains 'Menu'",
              fields: 'nextPageToken, files(name, id)',
            }, (err, res) => {
              if (err) return console.log('The API returned an error: ' + err);
              const data = res.data.files;
              
              // THIS RETURNS US WITH A ARRAY OF  OBJECCTS OF NAME AND ID AS SPECIFIED ABOVE
              if (data.length) {
                console.log(data.length);
                var menuID = [];
                //EXTRACT ALL IDS AND PUSH INTO ARRAY FOR DOWNLOAD
                for (var i = 0; i < data.length;i++){
                  menuID.push(data[i].id);
                }
            // ================================================================================================
            // ====================================FILE DOWNLOADING===============================================
            // ================================================================================================
                
                var fileId = menuID[0];
                var dest = fs.createWriteStream('./tmp/menu.jpg');
                drive.files.get({fileId: fileId, alt: 'media'}, {responseType: 'stream'},
                  function(err, res){
                      if (err) console.log(err);
                      else {
                        res.data
                        .on('end', () => {console.log('Done');})
                        .on('error', err => {console.log('Error', err);})
                        .pipe(dest);
                      }
                      
                  });
            // ================================================================================================
            // ====================================FILE UPLOADING===============================================
            // ================================================================================================    
              //     var fileMetadata = {
              //       'name': 'download.jpg'
              //     };
              //     var media = {
              //       mimeType: 'image/jpeg',
              //       body: fs.createReadStream('./tmp/download.jpg')
              //     };
              //     drive.files.create({
              //       resource: fileMetadata,
              //       media: media,
              //       fields: 'id'
              //     }, function (err, file) {
              //       if (err) {
              //         // Handle error
              //         console.error(err);
              //       } else {
              //         console.log('File Id: ', file.id);
              //       }
              //     });
               
              } else {
                console.log('No files found.');
              }
              
             });
          }
    }
    
}


