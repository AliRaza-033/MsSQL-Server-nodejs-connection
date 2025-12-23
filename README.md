# SQL Server Windows Authentication Connection Guide

This guide provides step-by-step instructions to connect to Microsoft SQL Server using Windows Authentication (without username/password) in Node.js.

## Prerequisites

- Windows OS
- SQL Server or SQL Server Express installed locally
- Node.js installed
- ODBC Driver for SQL Server

## Step 1: Check System Information

Before starting, gather your system information:

### Check Windows Username and Domain
```powershell
echo $env:USERDOMAIN
echo $env:USERNAME
```

### Check Available ODBC Drivers
```powershell
Get-OdbcDriver | Where-Object {$_.Name -like "*SQL*"} | Select-Object Name
```

**Important:** You need one of these drivers installed:
- `ODBC Driver 17 for SQL Server` (Recommended)
- `ODBC Driver 18 for SQL Server`
- `SQL Server Native Client 11.0`
- `SQL Server` (Generic)

### Verify SQL Server Instance Name
Your SQL Server instance is typically named:
- `localhost\SQLEXPRESS` (for SQL Server Express)
- `localhost` or `.\SQLEXPRESS` (alternative formats)

## Step 2: Setup Database and Sample Data

### Option A: Automated Setup (Recommended - Easiest!)

Simply run the automated setup script:

```powershell
npm run setup
```

This will automatically:
- Create the `info` table with 10 sample records
- Create the `users` table with 5 sample records
- Verify the data was inserted correctly
- Show you a preview of the data

**That's it!** Skip to Step 3.

### Option B: Using SQL Server Management Studio (SSMS) or Azure Data Studio

1. Open SSMS or Azure Data Studio
2. Connect to your SQL Server instance (e.g., `localhost\SQLEXPRESS`)
3. Open the `setup-database.sql` file included in this project
4. Execute the entire script (F5 or click Execute)

This will create:
- `info` table with 10 sample records
- `users` table with 5 sample records

### Option C: Manual Table Creation

If you prefer to create tables manually, run these commands:

```sql
-- Create database (if it doesn't exist)
CREATE DATABASE users;
GO

USE users;
GO

-- Create info table
CREATE TABLE info (
    id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(50) NOT NULL
);
GO

-- Insert sample data
INSERT INTO info (name) VALUES 
('John Doe'),
('Jane Smith'),
('Mike Johnson'),
('Sarah Williams'),
('Robert Brown');
GO

-- Verify data
SELECT * FROM info;
GO
```

### Table Structure

**info table:**
- `id` - INT (Primary Key, Auto-increment)
- `name` - VARCHAR(50) (NOT NULL)

**users table:**
- `id` - INT (Primary Key, Auto-increment)
- `name` - VARCHAR(50) (NOT NULL)
- `email` - VARCHAR(100)
- `created_date` - DATETIME (Default: Current timestamp)

## Step 3: Install Required npm Packages

```powershell
npm install mssql msnodesqlv8
```

### Package Details:
- **mssql**: Main SQL Server client for Node.js
- **msnodesqlv8**: Native Windows authentication driver (required for Windows Auth)

## Step 4: Create Database Configuration File

Create `dbconfig.js`:

```javascript
const config = {
    connectionString: "server=localhost\\SQLEXPRESS;Database=users;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}"
};

module.exports = config;
```

### Configuration Parameters Explained:
- **server**: Your SQL Server instance (e.g., `localhost\SQLEXPRESS`)
- **Database**: Name of your database
- **Trusted_Connection=Yes**: Enables Windows Authentication
- **Driver**: ODBC driver name (must match installed driver from Step 1)

### Alternative Connection String Formats:

If using different ODBC drivers, change the Driver parameter:

```javascript
// For SQL Server Native Client 11.0
Driver={SQL Server Native Client 11.0}

// For ODBC Driver 18
Driver={ODBC Driver 18 for SQL Server}

// For generic SQL Server driver
Driver={SQL Server}
```

## Step 5: Create Application File

Create `app.js`:

```javascript
const sql = require('mssql/msnodesqlv8');
const config = require('./dbconfig');

async function connectAndQuery() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT TOP 10 * FROM info'); // table name
        console.log(result.recordset);
        await pool.close();
    }
    catch(err) {
        console.error('Database connection failed:', err);
    }
}

connectAndQuery();
```

**Key Point:** Import `mssql/msnodesqlv8` (NOT just `mssql`) to use Windows Authentication.

### Additional Query Examples

```javascript
// Example 1: Query all records from info table
async function getAllInfo() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM info');
        console.log('All records:', result.recordset);
        await pool.close();
    }
    catch(err) {
        console.error('Query failed:', err);
    }
}

// Example 2: Query with parameters (prevents SQL injection)
async function getInfoById(id) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM info WHERE id = @id');
        console.log('Record:', result.recordset[0]);
        await pool.close();
    }
    catch(err) {
        console.error('Query failed:', err);
    }
}

// Example 3: Insert new record
async function insertInfo(name) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('name', sql.VarChar(50), name)
            .query('INSERT INTO info (name) VALUES (@name); SELECT SCOPE_IDENTITY() AS id;');
        console.log('Inserted record ID:', result.recordset[0].id);
        await pool.close();
    }
    catch(err) {
        console.error('Insert failed:', err);
    }
}

// Example 4: Update record
async function updateInfo(id, name) {
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.VarChar(50), name)
            .query('UPDATE info SET name = @name WHERE id = @id');
        console.log('Record updated successfully');
        await pool.close();
    }
    catch(err) {
        console.error('Update failed:', err);
    }
}

// Example 5: Delete record
async function deleteInfo(id) {
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM info WHERE id = @id');
        console.log('Record deleted successfully');
        await pool.close();
    }
    catch(err) {
        console.error('Delete failed:', err);
    }
}
```

## Step 6: Run the Application

```powershell
node app.js
```

**Expected Output:**
```
[
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Mike Johnson' },
  { id: 4, name: 'Sarah Williams' },
  { id: 5, name: 'Robert Brown' },
  { id: 6, name: 'Emily Davis' },
  { id: 7, name: 'Michael Wilson' },
  { id: 8, name: 'Jessica Martinez' },
  { id: 9, name: 'David Anderson' },
  { id: 10, name: 'Jennifer Taylor' }
]
```

## Troubleshooting

### Issue 1: "Data source name not found"
**Solution:** Check your ODBC driver name matches exactly what's installed on your system using the PowerShell command from Step 1.

### Issue 2: "Login failed for user ''"
**Solution:** Ensure:
- You're importing `mssql/msnodesqlv8` (not just `mssql`)
- `Trusted_Connection=Yes` is in the connection string
- SQL Server allows Windows Authentication

### Issue 3: "Failed to connect - timeout"
**Solution:** 
- Enable TCP/IP in SQL Server Configuration Manager
- Start SQL Server Browser service
- Verify SQL Server instance name is correct

### Issue 4: "Invalid object name 'TableName'"
**Solution:** Check available tables:

```javascript
let tables = await pool.request().query(
    "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'"
);
console.log('Available tables:', tables.recordset);
```

## Replicating on Another PC

To set up on a different machine:

1. **Install Node.js**
2. **Verify SQL Server is installed** with the same instance name
3. **Check ODBC drivers** are installed:
   ```powershell
   Get-OdbcDriver | Where-Object {$_.Name -like "*SQL*"} | Select-Object Name
   ```
4. **Copy your project files** (`app.js`, `dbconfig.js`, `package.json`)
5. **Update `dbconfig.js`** with the correct:
   - Database name
   - SQL Server instance name
   - ODBC Driver name (from step 3)
6. **Install packages:**
   ```powershell
   npm install
   ```
7. **Run the application:**
   ```powershell
   node app.js
   ```

## Configuration Checklist

- [ ] SQL Server is running
- [ ] ODBC driver is installed
- [ ] Windows user has database permissions
- [ ] Correct database name in connection string
- [ ] Correct SQL Server instance name
- [ ] Using `mssql/msnodesqlv8` import
- [ ] `Trusted_Connection=Yes` in connection string
- [ ] Correct ODBC driver name in connection string

## Quick Reference Commands

```powershell
# Check system info
echo $env:USERDOMAIN
echo $env:USERNAME

# Check ODBC drivers
Get-OdbcDriver | Where-Object {$_.Name -like "*SQL*"} | Select-Object Name

# Install packages
npm install mssql msnodesqlv8

# Run application
node app.js

# Check SQL Server services
Get-Service | Where-Object {$_.Name -like "*SQL*"}
```

## Package.json Example

```json
{
  "name": "sql-server-windows-auth",
  "version": "1.0.0",
  "description": "SQL Server connection using Windows Authentication",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "mssql": "^10.x.x",
    "msnodesqlv8": "^4.x.x"
  }
}
```

## Notes

- **Windows Authentication** uses your current Windows login credentials automatically
- **No password required** - connection uses Windows security tokens
- **msnodesqlv8** package is essential for Windows Authentication to work
- Connection strings are case-sensitive for some parameters
- Always verify ODBC driver name matches installed drivers exactly

## Project Files Overview

```
connection js/
├── app.js                  # Main application file
├── dbconfig.js            # Database configuration
├── examples.js            # 10+ query examples (INSERT, UPDATE, DELETE, etc.)
├── setup-database.sql     # SQL script to create tables and sample data
├── package.json           # Node.js dependencies
├── .gitignore            # Git ignore rules
└── README.md             # This documentation
```

## Running Advanced Examples

To see more query examples (INSERT, UPDATE, DELETE, transactions, joins):

```powershell
node examples.js
```

This will run 10 different SQL operations demonstrating:
1. SELECT all records
2. SELECT by ID with parameters
3. INSERT new records
4. UPDATE existing records
5. DELETE records
6. LIKE search queries
7. COUNT operations
8. Transactions (multiple operations)
9. JOIN queries
10. Stored procedures

## Git Setup and Sharing

### Initial Git Setup

```powershell
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: SQL Server Windows Auth connection example"

# Add remote repository (replace with your repo URL)
git remote add origin https://github.com/yourusername/sql-server-connection.git

# Push to GitHub
git push -u origin main
```

### For Teammates Cloning the Repository

```powershell
# Clone the repository
git clone https://github.com/yourusername/sql-server-connection.git
cd sql-server-connection

# Install dependencies
npm install

# Setup database using the SQL script
# Open setup-database.sql in SSMS and execute

# Verify ODBC drivers and update dbconfig.js if needed
Get-OdbcDriver | Where-Object {$_.Name -like "*SQL*"} | Select-Object Name

# Run the application
node app.js

# Or run examples
node examples.js
```

## Success Indicators

When connection is successful, you should see:
- Query results printed to console
- No error messages
- Process exits cleanly

Example output:
```
[
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' }
]
```

## Additional Resources

- [mssql npm package documentation](https://www.npmjs.com/package/mssql)
- [msnodesqlv8 documentation](https://www.npmjs.com/package/msnodesqlv8)
- [SQL Server Connection Strings](https://www.connectionstrings.com/sql-server/)
- [T-SQL Reference](https://docs.microsoft.com/en-us/sql/t-sql/)

## Contributing

Feel free to share this with your team! If you find any issues or want to add more examples, create a pull request or open an issue.
