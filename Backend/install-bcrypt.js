const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Checking for bcryptjs installation...');

// Parse package.json to check if bcryptjs is already installed
const packageJsonPath = path.join(__dirname, 'package.json');
let packageJson;

try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = packageJson.dependencies || {};
    
    if (dependencies.bcryptjs) {
        console.log(`bcryptjs is already installed (version: ${dependencies.bcryptjs})`);
    } else {
        console.log('bcryptjs is not in package.json, installing...');
        try {
            console.log(execSync('npm install bcryptjs --save', { encoding: 'utf8' }));
            console.log('bcryptjs installed successfully!');
        } catch (error) {
            console.error('Failed to install bcryptjs:', error.message);
        }
    }
} catch (error) {
    console.error('Error reading package.json:', error.message);
}

// Try to require bcryptjs to verify it's installed correctly
try {
    require('bcryptjs');
    console.log('bcryptjs can be imported successfully.');
} catch (error) {
    console.error('Error importing bcryptjs:', error.message);
}

console.log('Done.'); 