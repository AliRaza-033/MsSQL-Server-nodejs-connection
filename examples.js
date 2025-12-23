const sql = require('mssql/msnodesqlv8');
const config = require('./dbconfig');

// ================================================
// Example 1: Basic SELECT query
// ================================================
async function getAllRecords() {
    try {
        console.log('\n=== Example 1: Get All Records ===');
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM info');
        console.log('Total records:', result.recordset.length);
        console.log(result.recordset);
        await pool.close();
    }
    catch(err) {
        console.error('Query failed:', err.message);
    }
}

// ================================================
// Example 2: SELECT with WHERE clause
// ================================================
async function getRecordById(id) {
    try {
        console.log('\n=== Example 2: Get Record By ID ===');
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM info WHERE id = @id');
        
        if (result.recordset.length > 0) {
            console.log('Found record:', result.recordset[0]);
        } else {
            console.log('No record found with id:', id);
        }
        await pool.close();
    }
    catch(err) {
        console.error('Query failed:', err.message);
    }
}

// ================================================
// Example 3: INSERT new record
// ================================================
async function insertRecord(name) {
    try {
        console.log('\n=== Example 3: Insert New Record ===');
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('name', sql.VarChar(50), name)
            .query('INSERT INTO info (name) VALUES (@name); SELECT SCOPE_IDENTITY() AS id;');
        
        console.log('Successfully inserted! New record ID:', result.recordset[0].id);
        await pool.close();
        return result.recordset[0].id;
    }
    catch(err) {
        console.error('Insert failed:', err.message);
    }
}

// ================================================
// Example 4: UPDATE existing record
// ================================================
async function updateRecord(id, name) {
    try {
        console.log('\n=== Example 4: Update Record ===');
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.VarChar(50), name)
            .query('UPDATE info SET name = @name WHERE id = @id; SELECT @@ROWCOUNT AS affected;');
        
        if (result.recordset[0].affected > 0) {
            console.log(`Successfully updated record ID ${id} to "${name}"`);
        } else {
            console.log('No record found with id:', id);
        }
        await pool.close();
    }
    catch(err) {
        console.error('Update failed:', err.message);
    }
}

// ================================================
// Example 5: DELETE record
// ================================================
async function deleteRecord(id) {
    try {
        console.log('\n=== Example 5: Delete Record ===');
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM info WHERE id = @id; SELECT @@ROWCOUNT AS affected;');
        
        if (result.recordset[0].affected > 0) {
            console.log('Successfully deleted record ID:', id);
        } else {
            console.log('No record found with id:', id);
        }
        await pool.close();
    }
    catch(err) {
        console.error('Delete failed:', err.message);
    }
}

// ================================================
// Example 6: Search with LIKE
// ================================================
async function searchByName(searchTerm) {
    try {
        console.log('\n=== Example 6: Search Records ===');
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('searchTerm', sql.VarChar(50), `%${searchTerm}%`)
            .query('SELECT * FROM info WHERE name LIKE @searchTerm');
        
        console.log(`Found ${result.recordset.length} record(s) matching "${searchTerm}":`);
        console.log(result.recordset);
        await pool.close();
    }
    catch(err) {
        console.error('Search failed:', err.message);
    }
}

// ================================================
// Example 7: Count records
// ================================================
async function countRecords() {
    try {
        console.log('\n=== Example 7: Count Records ===');
        let pool = await sql.connect(config);
        let result = await pool.request()
            .query('SELECT COUNT(*) AS total FROM info');
        
        console.log('Total records in info table:', result.recordset[0].total);
        await pool.close();
    }
    catch(err) {
        console.error('Count failed:', err.message);
    }
}

// ================================================
// Example 8: Multiple queries in transaction
// ================================================
async function transactionExample() {
    try {
        console.log('\n=== Example 8: Transaction Example ===');
        let pool = await sql.connect(config);
        let transaction = new sql.Transaction(pool);
        
        await transaction.begin();
        
        try {
            // Insert first record
            await new sql.Request(transaction)
                .input('name', sql.VarChar(50), 'Transaction User 1')
                .query('INSERT INTO info (name) VALUES (@name)');
            
            // Insert second record
            await new sql.Request(transaction)
                .input('name', sql.VarChar(50), 'Transaction User 2')
                .query('INSERT INTO info (name) VALUES (@name)');
            
            await transaction.commit();
            console.log('Transaction completed successfully!');
        }
        catch(err) {
            await transaction.rollback();
            console.error('Transaction rolled back due to error:', err.message);
        }
        
        await pool.close();
    }
    catch(err) {
        console.error('Transaction failed:', err.message);
    }
}

// ================================================
// Example 9: Join query (if you have users table)
// ================================================
async function joinExample() {
    try {
        console.log('\n=== Example 9: Join Query Example ===');
        let pool = await sql.connect(config);
        
        // This is a sample - modify based on your actual table relationships
        let result = await pool.request().query(`
            SELECT TOP 5 
                i.id, 
                i.name AS info_name,
                u.name AS user_name,
                u.email
            FROM info i
            FULL OUTER JOIN users u ON i.id = u.id
        `);
        
        console.log('Join result:');
        console.log(result.recordset);
        await pool.close();
    }
    catch(err) {
        console.error('Join query failed:', err.message);
    }
}

// ================================================
// Example 10: Stored Procedure (if you create one)
// ================================================
async function storedProcedureExample() {
    try {
        console.log('\n=== Example 10: Stored Procedure Example ===');
        let pool = await sql.connect(config);
        
        // First, let's create a simple stored procedure
        await pool.request().query(`
            IF OBJECT_ID('GetInfoByName', 'P') IS NOT NULL
                DROP PROCEDURE GetInfoByName;
        `);
        
        await pool.request().query(`
            CREATE PROCEDURE GetInfoByName
                @name VARCHAR(50)
            AS
            BEGIN
                SELECT * FROM info WHERE name LIKE '%' + @name + '%'
            END
        `);
        
        // Now execute the stored procedure
        let result = await pool.request()
            .input('name', sql.VarChar(50), 'John')
            .execute('GetInfoByName');
        
        console.log('Stored procedure result:');
        console.log(result.recordset);
        await pool.close();
    }
    catch(err) {
        console.error('Stored procedure failed:', err.message);
    }
}

// ================================================
// Main execution
// ================================================
async function runAllExamples() {
    console.log('========================================');
    console.log('SQL Server Connection Examples');
    console.log('========================================');
    
    // Run basic examples
    await getAllRecords();
    await getRecordById(1);
    await countRecords();
    await searchByName('John');
    
    // Uncomment to test INSERT/UPDATE/DELETE
    // let newId = await insertRecord('Test User');
    // await updateRecord(newId, 'Updated Test User');
    // await deleteRecord(newId);
    
    // Uncomment to test advanced examples
    // await transactionExample();
    // await joinExample();
    // await storedProcedureExample();
    
    console.log('\n========================================');
    console.log('All examples completed!');
    console.log('========================================\n');
}

// Run all examples
runAllExamples();
