const sql = require('mssql'); // Assuming you are using mssql package
const { exec } = require('child_process');
const dbConfig =  require('./dbConfig');


async function checkVPNConnection() {
  return new Promise((resolve, reject) => {
    // Execute the Bash script
    exec('/root/OEinventory/project/backend/check_connection_status.sh', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing the script: ${error}`);
        reject(error);
        return;
      }

      // Parse the output of the Bash script
      const isActive = stdout.trim() === 'true';
      if (isActive) {
        console.log('Already connected to VPN.');
        resolve();
      } else {
        console.log('Not connected to VPN. Connecting...');
        startVPN().then(resolve).catch(reject);  // Assuming startVPN is another function that starts the VPN
      }
    });
  });
}

// // Usage
// checkVPNConnection().then(() => {
//   console.log('Done checking VPN status.');
// }).catch((err) => {
//   console.error(`Failed to check VPN status: ${err}`);
// });


function startVPN() {
  return new Promise((resolve, reject) => {
    
    exec('sudo systemctl start netextender', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting VPN: ${error}`);
        reject(error);
        return;
      }
      console.log(`VPN started. stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      setTimeout(() => {
        resolve();

      }, 5000);
    });
  });
}

async function connectToDB() {
  try {
    await checkVPNConnection();
    let pool = await sql.connect(dbConfig);
    return pool;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to connect to DB');
  }
}

// Usage
module.exports = connectToDB
