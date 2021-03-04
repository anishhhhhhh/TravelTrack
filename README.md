# USERS-PLACES
###### https://places-mernn.herokuapp.com/
You can view other users' places but you can't edit or delete their places. If you want to create or edit or delete your own places you need to be logged in!

## Frontend:
#### React: 
##### hooks used : useState, useEffect, useContext, useReducer, useCallback, and custom hooks
##### Authentication is handled by JWT Authentication. Users can be auto logged-in and are auto logged out after 1 hr ie. when token is expired 

## Backend: 
##### Node, Express
##### Backend Routes are protected too ie. A middleware is added to check if the token is valid or not.

## Database 
#### MongoDB
