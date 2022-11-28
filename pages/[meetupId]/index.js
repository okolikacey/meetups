import { MongoClient, ObjectId } from 'mongodb'
import Head from 'next/head';
import MeetupDetail from "../../components/meetups/MeetupDetail";


function MeetupDetails({ meetupData }) {

    return (
        <>
            <Head>
                <title>{meetupData.title}</title>
                <meta name='description' content={meetupData.description} />
            </Head>
            <MeetupDetail
                image={meetupData.image}
                title={meetupData.title}
                address={meetupData.address}
                description={meetupData.description}
            />
        </>
    );
}

export async function getStaticPaths() {
    const client = await MongoClient.connect("mongodb://localhost/meetups");
    const db = client.db();

    const meetupsCollections = db.collection('meetups');

    const meetups = await meetupsCollections.find({}, { _id: 1 }).toArray();

    client.close();
    return {
        fallback: false,
        paths: meetups.map(meetup => ({ params: { meetupId: meetup._id.toString() } }))
    }
}

export async function getStaticProps(context) {
    const meetupId = context.params.meetupId;

    const client = await MongoClient.connect("mongodb://localhost/meetups");
    const db = client.db();

    const meetupsCollections = db.collection('meetups');

    const selectedMeetup = await meetupsCollections.findOne({ _id: ObjectId(meetupId) });

    client.close();
    //fetch data for a single meetup
    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                image: selectedMeetup.image,
                description: selectedMeetup.description
            }
        },
        revalidate: 10
    }
}

export default MeetupDetails;