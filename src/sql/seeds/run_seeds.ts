import  seedUserData from './seed_app_user';
import  seedLiftData from './seed_lift';

const runSeeds = async () => {
  try {
    await seedUserData();
    await seedLiftData();
    console.log('Seeding completed!');
  } catch (err) {
    console.error('Seeding failed:', err);
  }
};

runSeeds();
