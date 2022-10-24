const express = require("express");
const app = express();
app.use(express.json());


var admin = require("firebase-admin");
const { getFirestore } = require('firebase-admin/firestore');
var serviceAccount = require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();
app.post('/add/user', async function(req, res) {
    const data = req.body;
    const r = await db.collection('login detials').add(data);
    res.send("data added sucessfully");
});
app.get('/get/:id', async function(req, res) {
    const id = req.params.id.toString();
    const Ref = db.collection('login detials').doc(id);
    const doc = await Ref.get();
    if (!doc.exists) {
        res.status(404).send("user details with the given id not found !!");
    } else {
        res.send([doc.data()]);
    }
});
app.get('/users', async function(req, res) {
    try {
        const ref = db.collection('login detials');
        const responds = await ref.get();
        let arr = [];
        responds.forEach(element => {
            arr.push(element.data());
        });
        res.send(arr);
    } catch (error) {
        res.send(error);
    }
});
app.patch('/update', async function(req, res) {
    const Ref = db.collection('login detials').doc(req.body.id);
    Ref.update({
        'name': req.body.name,
    });
    res.send("updated !!!");
});
app.delete('/delete', async function(req, res) {
    const Ref = db.collection('login detials').doc(req.body.id);
    Ref.delete();
    res.send("delete !!!");
});
app.listen(3000);