const sql=require('mssql/msnodesqlv8');
const config=require('./dbconfig');
async function connectAndQuery(){
try{
let pool=await sql.connect(config);
let result=await pool.request().query('SELECT TOP 10 * FROM info');
console.log(result.recordset);
await pool.close();
}
catch(err){
    console.error('Database connection failed:', err);}

}

connectAndQuery();