# Quick Start Guide

Get up and running in 5 minutes!

## 1. Clone or Download

```powershell
git clone <your-repo-url>
cd sql-server-connection
```

## 2. Install Dependencies

```powershell
npm install
```

## 3. Setup Database

**Easy way (Automated):**
```powershell
npm run setup
```

This automatically creates tables and inserts sample data!

**Manual way:**
Open `setup-database.sql` in SQL Server Management Studio (SSMS) or Azure Data Studio and execute it. This creates:
- `info` table with sample data
- `users` table with sample data

## 4. Configure Connection

Edit `dbconfig.js` and update if needed:
- **Server name**: Your SQL Server instance (default: `localhost\SQLEXPRESS`)
- **Database name**: Your database name (default: `users`)
- **ODBC Driver**: Match your installed driver

Check your ODBC drivers:
```powershell
Get-OdbcDriver | Where-Object {$_.Name -like "*SQL*"} | Select-Object Name
```

## 5. Run

```powershell
# Run basic query
npm start

# Or run all examples
npm run examples
```

## Expected Output

```
[
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  ...
]
```

## Troubleshooting

**Error: "Data source name not found"**
- Update the Driver name in `dbconfig.js` to match your installed ODBC driver

**Error: "Login failed for user ''"**
- Verify you're using Windows Authentication mode in SQL Server
- Check SQL Server allows your Windows user to connect

**Error: "Invalid object name"**
- Run the `setup-database.sql` script to create tables
- Verify you're connected to the correct database

## Need More Help?

Check the full [README.md](README.md) for detailed documentation.
