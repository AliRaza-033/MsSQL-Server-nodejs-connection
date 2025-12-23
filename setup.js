const sql = require('mssql/msnodesqlv8');
const config = require('./dbconfig');

async function setupDatabase() {
    console.log('Starting database setup...\n');
    
    try {
        let pool = await sql.connect(config);
        console.log('✓ Connected to database successfully\n');
        
        // Drop and create 'info' table
        console.log('Creating "info" table...');
        await pool.request().query(`
            IF OBJECT_ID('info', 'U') IS NOT NULL
                DROP TABLE info;
        `);
        
        await pool.request().query(`
            CREATE TABLE info (
                id INT PRIMARY KEY IDENTITY(1,1),
                name VARCHAR(50) NOT NULL
            );
        `);
        console.log('✓ "info" table created\n');
        
        // Insert sample data into 'info' table
        console.log('Inserting sample data into "info" table...');
        await pool.request().query(`
            INSERT INTO info (name) VALUES 
            ('John Doe'),
            ('Jane Smith'),
            ('Mike Johnson'),
            ('Sarah Williams'),
            ('Robert Brown'),
            ('Emily Davis'),
            ('Michael Wilson'),
            ('Jessica Martinez'),
            ('David Anderson'),
            ('Jennifer Taylor');
        `);
        console.log('✓ Inserted 10 records into "info" table\n');
        
        // Drop and create 'users' table
        console.log('Creating "users" table...');
        await pool.request().query(`
            IF OBJECT_ID('users', 'U') IS NOT NULL
                DROP TABLE users;
        `);
        
        await pool.request().query(`
            CREATE TABLE users (
                id INT PRIMARY KEY IDENTITY(1,1),
                name VARCHAR(50) NOT NULL,
                email VARCHAR(100),
                created_date DATETIME DEFAULT GETDATE()
            );
        `);
        console.log('✓ "users" table created\n');
        
        // Insert sample data into 'users' table
        console.log('Inserting sample data into "users" table...');
        await pool.request().query(`
            INSERT INTO users (name, email) VALUES 
            ('Alice Johnson', 'alice.j@example.com'),
            ('Bob Smith', 'bob.smith@example.com'),
            ('Charlie Brown', 'charlie.b@example.com'),
            ('Diana Prince', 'diana.p@example.com'),
            ('Edward Norton', 'edward.n@example.com');
        `);
        console.log('✓ Inserted 5 records into "users" table\n');
        
        // Verify data
        console.log('Verifying data...\n');
        
        let infoCount = await pool.request().query('SELECT COUNT(*) AS count FROM info');
        console.log(`✓ "info" table has ${infoCount.recordset[0].count} records`);
        
        let usersCount = await pool.request().query('SELECT COUNT(*) AS count FROM users');
        console.log(`✓ "users" table has ${usersCount.recordset[0].count} records\n`);
        
        // Show sample data
        console.log('Sample data from "info" table:');
        let infoSample = await pool.request().query('SELECT TOP 5 * FROM info');
        console.table(infoSample.recordset);
        
        console.log('\nSample data from "users" table:');
        let usersSample = await pool.request().query('SELECT TOP 5 * FROM users');
        console.table(usersSample.recordset);
        
        await pool.close();
        
        console.log('\n========================================');
        console.log('✓ Database setup completed successfully!');
        console.log('========================================');
        console.log('\nYou can now run:');
        console.log('  npm start        - Run basic query');
        console.log('  npm run examples - Run all examples\n');
        
    } catch(err) {
        console.error('\n✗ Database setup failed:', err.message);
        console.error('\nPlease check:');
        console.error('  1. SQL Server is running');
        console.error('  2. Database "users" exists');
        console.error('  3. You have permissions to create tables');
        console.error('  4. Connection settings in dbconfig.js are correct\n');
    }
}

setupDatabase();
