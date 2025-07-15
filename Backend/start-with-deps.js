const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Checking dependencies before starting server...');

// Required dependencies
const requiredDeps = ['bcryptjs', 'cors', 'express', 'mongoose'];

// Parse package.json to check dependencies
const packageJsonPath = path.join(__dirname, 'package.json');
let packageJson;
let missingDeps = [];

try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = packageJson.dependencies || {};
    
    requiredDeps.forEach(dep => {
        if (!dependencies[dep]) {
            missingDeps.push(dep);
        }
    });
    
    if (missingDeps.length > 0) {
        console.log(`Installing missing dependencies: ${missingDeps.join(', ')}`);
        try {
            console.log(execSync(`npm install ${missingDeps.join(' ')} --save`, { encoding: 'utf8' }));
            console.log('Dependencies installed successfully!');
        } catch (error) {
            console.error('Failed to install dependencies:', error.message);
            process.exit(1);
        }
    } else {
        console.log('All required dependencies are installed.');
    }
} catch (error) {
    console.error('Error checking dependencies:', error.message);
    process.exit(1);
}

// Test MongoDB connection
try {
    require('./config/db');
    console.log('MongoDB connection module loaded.');
} catch (error) {
    console.error('Error loading MongoDB connection module:', error.message);
}

// Start server
console.log('Starting server...');
try {
    const serverProcess = require('child_process').spawn('node', ['server.js'], {
        stdio: 'inherit'
    });
    
    serverProcess.on('error', (error) => {
        console.error('Failed to start server:', error.message);
    });
    
    process.on('SIGINT', () => {
        console.log('Stopping server...');
        serverProcess.kill('SIGINT');
        process.exit(0);
    });
} catch (error) {
    console.error('Error starting server:', error.message);
} 