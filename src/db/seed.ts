import { db } from './index';
import { comedians } from './schema/comedians';
import { performances } from './schema/performances';
import * as dotenv from 'dotenv';

dotenv.config();

async function seed() {
  try {
    console.log('Seeding database...');

    // Insert sample comedians
    const insertedComedians = await db
      .insert(comedians)
      .values([
        {
          name: 'Dave Chappelle',
          bio: 'American stand-up comedian, actor, and writer known for his satirical comedy.',
          birthDate: '1973-08-24',
          nationality: 'US',
        },
        {
          name: 'Hannah Gadsby',
          bio: 'Australian comedian, writer, and actress known for her unique storytelling style.',
          birthDate: '1978-01-12',
          nationality: 'AU',
        },
        {
          name: 'Bo Burnham',
          bio: 'American comedian, musician, and filmmaker known for his musical comedy.',
          birthDate: '1990-08-21',
          nationality: 'US',
        },
        {
          name: 'James Acaster',
          bio: 'English comedian known for his surreal and deadpan humor.',
          birthDate: '1985-01-09',
          nationality: 'UK',
        },
        {
          name: 'Ali Wong',
          bio: 'American stand-up comedian, actress, and writer.',
          birthDate: '1982-04-19',
          nationality: 'US',
        },
      ])
      .returning();

    const [comedian1, comedian2, comedian3, comedian4, comedian5] = insertedComedians;

    console.log('Inserted comedians:', insertedComedians.map((c) => c.name).join(', '));

    // Insert sample performances
    await db.insert(performances).values([
      {
        comedianId: comedian1.id,
        title: 'Sticks & Stones',
        venue: 'Netflix Special',
        date: '2019-08-26',
        description: 'A controversial stand-up special addressing cancel culture.',
      },
      {
        comedianId: comedian1.id,
        title: 'The Closer',
        venue: 'Netflix Special',
        date: '2021-10-05',
        description: 'Final Netflix special in his current deal.',
      },
      {
        comedianId: comedian2.id,
        title: 'Nanette',
        venue: 'Netflix Special',
        date: '2018-06-19',
        description: 'Groundbreaking comedy special that deconstructs comedy itself.',
      },
      {
        comedianId: comedian2.id,
        title: 'Douglas',
        venue: 'Netflix Special',
        date: '2020-05-26',
        description: 'Follow-up to Nanette, named after her dog.',
      },
      {
        comedianId: comedian3.id,
        title: 'Inside',
        venue: 'Netflix Special',
        date: '2021-05-30',
        description: 'A comedy special filmed entirely alone during the pandemic.',
      },
      {
        comedianId: comedian4.id,
        title: 'Repertoire',
        venue: 'Netflix Special',
        date: '2018-03-27',
        description: 'Four-part stand-up series.',
      },
      {
        comedianId: comedian5.id,
        title: 'Baby Cobra',
        venue: 'Netflix Special',
        date: '2016-05-06',
        description: 'Stand-up special filmed while 7 months pregnant.',
      },
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();

