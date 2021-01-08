

process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

let urlDB;
if( process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee';
    } else {
    urlDB = 'mongodb+srv://adan:Butthead12@sexta-gen.an16o.mongodb.net/test'
}
process.env.URLDB = urlDB