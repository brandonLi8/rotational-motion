const express = require( 'express' );
const app = express();

app.get( '/' , ( req, res ) => res.sendFile( __dirname + '/index.html' ) );
app.use( express.static( __dirname ) );

app.listen( 3000, () => console.log( `Starting up server, serving ./
  Available on:
  http://localhost:3000` ) );