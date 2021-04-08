# USERS-PLACES

<p align="center">
   <a href="https://nodejs.org/en/">
      <img src="https://camo.githubusercontent.com/aed4ddb11f5f67484bd0f6278bf5c45967d1828bfefdbc6a277eb38337c4cab9/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4d6164655f776974682d4e6f64656a732d677265656e3f7374796c653d666f722d7468652d6261646765266c6f676f3d6e6f64652e6a73" />
   </a>
  
   <a href="https://reactjs.org/docs/getting-started.html">
      <img src="https://camo.githubusercontent.com/33a8c0cdec9b420c57eb6eda192682c87c887eedf59552913fe07b846eb25d04/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4d6164655f776974682d52656163744a532d626c75653f7374796c653d666f722d7468652d6261646765266c6f676f3d7265616374" />
  
   </a>
   <a href="https://docs.mongodb.com/manual/tutorial/getting-started/">
      <img                    src="https://camo.githubusercontent.com/e3801c2c64bf88b30fb9138685513224c3017e7b188823bb05dc487a11493754/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f44617461626173652d4d6f6e676f44422d7265643f7374796c653d666f722d7468652d6261646765266c6f676f3d6d6f6e676f6462" />
   </a>
</p>


Visit the website over [here](https://places-mernn.herokuapp.com/)<br/>
A web application to track the places which the users have visited.

## Functionalities

<ul>
  <li>CRUD operation of places</li>
  <li>JWT Authentication</li>
  <li>Google Maps</li>
</ul>

## Tech Stack of this project

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

PS: The Heroku server doesn't store the images on the server that's why the user profile pic and the places pic aren't showing up. To solve this issue I would have to connect the heroku server with something like static file storage for eg. AWS S3 bucket, but my free tier AWS subscription is terminated :-(</br>
Another Issue is that the "View On Map" functionality isn't working anymore because my Google API key has been taken down! I'm finding alternatives to solve the issue for the time being please bare with it :-) 
