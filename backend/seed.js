const sequelize = require('./config/database');
const User = require('./models/User');

const usersToSeed = [
    {
        username: 'admin',
        password: 'admin123$',
        nama: 'Administrator',
        hakakses: 'admin',
        kdlink: '00',
        kdcbang: '00'
    },
    {
        username: 'hasan',
        password: 'hasan123$',
        nama: 'Hasan',
        hakakses: 'user',
        kdlink: '01',
        kdcbang: '01'
    },
    ...Array.from({ length: 5 }, (_, i) => ({
        username: `user${i + 1}`,
        password: 'password123$',
        nama: `User ${i + 1}`,
        hakakses: 'user',
        kdlink: '01',
        kdcbang: '01'
    }))
];

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Force sync to drop tables and recreate (RESET DB)
        await sequelize.sync({ force: true });

        for (const user of usersToSeed) {
            const exists = await User.findOne({ where: { username: user.username } });
            if (!exists) {
                await User.create(user);
                console.log(`User ${user.username} created.`);
            } else {
                console.log(`User ${user.username} already exists. Updating password/role...`);
                // Update just in case specs changed
                await exists.update({
                    password: user.password,
                    hakakses: user.hakakses
                });
            }
        }

        console.log('Seeding completed.');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        // Close connection to release lock (vital for SQLite)
        await sequelize.close();
    }
};

seed();
