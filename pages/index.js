import Head from 'next/head';
import { MongoClient } from 'mongodb';
import MeetupList from '../components/meetups/MeetupList'

function HomePage(props) {
    return (
        <>
            <Head>
                <title>React Meetups</title>
                <meta name='description' content='Browse a hug list of highly active meetups!' />
            </Head>
            <MeetupList meetups={props.meetups} />
        </>
    );
}

// export async function getServerSideProps(context) {
//     const req = context.req;
//     const res = context.res;

//     return {
//         props:{ meetups: DATA}
//     };
// }

export async function getStaticProps() {
    const client = await MongoClient.connect("mongodb://localhost/meetups");
    const db = client.db();

    const meetupsCollections = db.collection('meetups');

    const meetups = await meetupsCollections.find().toArray();

    client.close();

    return {
        props: {
            meetups: meetups.map(meetup => ({
                id: meetup._id.toString(),
                title: meetup.title,
                address: meetup.address,
                image: meetup.image
            }))
        },
        revalidate: 10
    }
}

export default HomePage;