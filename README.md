# USERS-PLACES
Visit the website over here [User-Places](https://places-mernn.herokuapp.com/)<br/>
You can view other users' places but you can't edit or delete their places. If you want to create or edit or delete your own places you need to be logged in!

### `Frontend`
#### React: 
hooks used : useState, useEffect, useContext, useReducer, useCallback, and custom hooks.
<br/>
Authentication is handled by JWT Authentication. Users can be auto logged-in and are auto logged out after 1 hr ie. when token is expired. 

### `Backend` 
Node, Express<br/>
Backend Routes are protected too ie. A middleware is added to check if the token is valid or not.

### `Database` 
MongoDB

PS: The Heroku server doesn't store the images on the server that's why the user profile pic and the places pic aren't showing up. To solve this issue I would have to connect the heroku server with something like static file storage for eg. AWS S3 bucket, but my free tier AWS subscription just got over :-(</br>
Another Issue is that the "View On Map" functionality isn't working anymore because my Google API key has been taken down! I'm finding alternatives to solve the issue for the time being please bare with it :-) 
