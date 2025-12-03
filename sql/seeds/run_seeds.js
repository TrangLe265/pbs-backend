const { seedUserData } = require('./seed_app_user');
const { seedLiftData } = require('./seed_lift');

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
