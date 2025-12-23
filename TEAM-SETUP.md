# Team Setup Instructions

Hi Team! 👋

This project demonstrates how to connect to SQL Server using **Windows Authentication** (no password needed!).

## What's Included

- ✅ Database setup script with sample data
- ✅ Basic connection example
- ✅ 10+ query examples (SELECT, INSERT, UPDATE, DELETE, etc.)
- ✅ Complete documentation
- ✅ Ready to run and test

## Quick Setup (5 minutes)

### Step 1: Install Node.js
Make sure you have Node.js installed: https://nodejs.org/

### Step 2: Clone This Repository
```powershell
git clone <repository-url>
cd connection-js
```

### Step 3: Install Packages
```powershell
npm install
```

### Step 4: Setup Database

**Easy way (Recommended):**
```powershell
npm run setup
```

This automatically creates both tables (`info` and `users`) with sample data. You'll see a nice table output showing the data was created!

**Manual way (if you prefer):**
1. Open **SQL Server Management Studio (SSMS)** or **Azure Data Studio**
2. Connect to your SQL Server instance (usually `localhost\SQLEXPRESS`)
3. Open the file `setup-database.sql`
4. Execute the entire script (press F5)
5. Verify tables were created: `info` and `users`

### Step 5: Configure Your Connection
Check what ODBC drivers you have:
```powershell
Get-OdbcDriver | Where-Object {$_.Name -like "*SQL*"} | Select-Object Name
```

Edit `dbconfig.js` and update the Driver name if needed:
```javascript
Driver={ODBC Driver 17 for SQL Server}  // Change this to match YOUR driver
```

### Step 6: Test It!
```powershell
# Run basic example
npm start

# Or run all examples
npm run examples
```

## What You'll See

If everything works, you should see data from your database:
```
[
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  ...
]
```

## Files Breakdown

| File | Purpose |
|------|---------|
| `app.js` | Main application - simple query example |
| `examples.js` | 10+ examples of different SQL operations |
| `dbconfig.js` | Database connection configuration |
| `setup-database.sql` | Creates tables and inserts sample data |
| `README.md` | Full documentation |
| `QUICKSTART.md` | Quick start guide |
| `package.json` | Node.js dependencies |

## Common Issues

### "Data source name not found"
Your ODBC driver name doesn't match. Run the PowerShell command above to check your drivers, then update `dbconfig.js`.

### "Login failed"
Your SQL Server might not allow Windows Authentication. Check SQL Server authentication settings.

### "Invalid object name"
You forgot to run the `setup-database.sql` script. Go back to Step 4!

### "Failed to connect - timeout"
Your SQL Server might not be running. Check Services → SQL Server (SQLEXPRESS) is started.

## Need Help?

1. Check [QUICKSTART.md](QUICKSTART.md) for quick setup
2. Read [README.md](README.md) for detailed documentation
3. Ask the team!

## Next Steps

After you get it working:
- Try modifying the queries in `examples.js`
- Create your own tables and test queries
- Share your screen with the team to show it working!

## Important Notes

- **Windows Authentication** = No password needed
- Your Windows login automatically authenticates you
- Works only on Windows machines with SQL Server
- Perfect for local development

## Success Checklist

- [ ] Node.js installed
- [ ] Repository cloned
- [ ] npm install completed
- [ ] Database tables created (`setup-database.sql` executed)
- [ ] ODBC driver name verified and updated
- [ ] `npm start` runs without errors
- [ ] You see query results in the console

🎉 **You're all set!** Now you can use this as a reference for all SQL Server Windows Authentication projects.

---

Happy Coding! 🚀
