#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to hash a password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Function to prompt for credentials with validation
function promptCredentials() {
  return new Promise((resolve) => {
    rl.question('Enter admin username: ', (username) => {
      if (!username.trim()) {
        console.error('❌ Error: Username cannot be empty. Please try again.');
        rl.close();
        process.exit(1);
      }
      
      rl.question('Enter admin password (minimum 8 characters): ', (password) => {
        if (!password.trim() || password.length < 8) {
          console.error('❌ Error: Password must be at least 8 characters long. Please try again.');
          rl.close();
          process.exit(1);
        }
        
        rl.question('Confirm password: ', (confirmPassword) => {
          if (password !== confirmPassword) {
            console.error('❌ Error: Passwords do not match. Please try again.');
            rl.close();
            process.exit(1);
          }
          
          rl.close();
          resolve({ username, password });
        });
      });
    });
  });
}

// Function to update or create .env.local file
async function setupAdminCredentials() {
  try {
    console.log('🔐 Setting up admin credentials...\n');
    
    // Get credentials from user
    const { username, password } = await promptCredentials();
    
    // Hash the password
    const passwordHash = hashPassword(password);
    
    // Path to .env.local file
    const envFilePath = path.resolve(process.cwd(), '.env.local');
    
    // Check if file exists and read it
    let envContent = '';
    if (fs.existsSync(envFilePath)) {
      envContent = fs.readFileSync(envFilePath, 'utf8');
    }
    
    // Create or update admin credentials in env content
    const envLines = envContent.split('\n').filter(line => line.trim() !== '');
    const updatedLines = [];
    
    let usernameAdded = false;
    let passwordHashAdded = false;
    
    // Update existing lines
    for (const line of envLines) {
      if (line.startsWith('ADMIN_USERNAME=')) {
        updatedLines.push(`ADMIN_USERNAME=${username}`);
        usernameAdded = true;
      } else if (line.startsWith('ADMIN_PASSWORD_HASH=')) {
        updatedLines.push(`ADMIN_PASSWORD_HASH=${passwordHash}`);
        passwordHashAdded = true;
      } else {
        updatedLines.push(line);
      }
    }
    
    // Add new lines if needed
    if (!usernameAdded) {
      updatedLines.push(`ADMIN_USERNAME=${username}`);
    }
    
    if (!passwordHashAdded) {
      updatedLines.push(`ADMIN_PASSWORD_HASH=${passwordHash}`);
    }
    
    // Write back to .env.local
    fs.writeFileSync(envFilePath, updatedLines.join('\n'));
    
    console.log('\n✅ Admin credentials setup successfully!');
    console.log(`👤 Username: ${username}`);
    console.log('🔑 Password: [HIDDEN]');
    console.log('\n📝 Credentials have been saved to .env.local file');
    console.log('🌐 You can now log in at http://localhost:3000/admin/login');
    
  } catch (error) {
    console.error('❌ Error setting up admin credentials:', error);
    process.exit(1);
  }
}

// Run the script
setupAdminCredentials();