const mysql = require('mysql2/promise');

async function testConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'localapp',
    password: 'Admin@123',
    database: 'testapp'
  });

  try {
    console.log('Trying to connect to MySQL...');
    await connection.connect();
    console.log('Successfully connected to MySQL!');
    
    const [rows] = await connection.execute('SHOW DATABASES;');
    console.log('Available databases:', rows);
    
    await connection.end();
    return true;
  } catch (err) {
    console.error('Database connection failed:', err);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('Test completed successfully!');
  } else {
    console.log('Test failed.');
  }
});
