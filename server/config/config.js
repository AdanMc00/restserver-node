

process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
process.env.SEED = process.env.SEED || 'seed-desarrollo'
process.env.CLIENT_ID = process.env.CLIENT_ID || '262875674340-vgig3ad4jrmlvke8hj4qerrpgsbfv032.apps.googleusercontent.com';

let urlDB;


if( process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee';
    } else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB