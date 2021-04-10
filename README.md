-- INCOMPLETE --

all the backend + front end for http://shoestring.cafe
Uses Node.JS for the backend with Express framwork. Hobby projected hosted on AWS Lightsail.


The Menu page uses google sheets API to fetch and display data. The sheet in question is: https://docs.google.com/spreadsheets/d/145tlw2Ke55loXVjo9CfjHaCeZM1b5cISBoB9ZVvGu6U/edit#gid=0

Wanted to use a database where anyone can easily change menu items/price so even the non techy people can change it.


Method of retrieving menu:
    Google Sheets
        1) Entering data into a sheet then reading 
        2) https://docs.google.com/spreadsheets/d/145tlw2Ke55loXVjo9CfjHaCeZM1b5cISBoB9ZVvGu6U/edit#gid=0
    
            Everytime /menu/update is executed, authorize, fetch, display.

