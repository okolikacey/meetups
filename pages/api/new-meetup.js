import { MongoClient } from 'mongodb'

// /api/new-meetup

//POST /api/new-meetup
async function handler(req, res) {
    if (req.method === 'POST') {
        const data = req.body;

        const client = await MongoClient.connect("mongodb://localhost/meetups");
        const db = client.db();

        const meetupsCollections = db.collection('meetups');
        const result = await meetupsCollections.insertOne(data);
        console.log(result);

        client.close();

        res.status(201).json({ message: 'Meetup inserted!' })
    }
}

export default handler;