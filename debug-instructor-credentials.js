/**
 * Instructor Credentials Debugging Script
 * 
 * This script will help identify and fix issues with the instructor credentials functionality.
 * It checks both frontend and backend components.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

console.log(`${colors.magenta}======== Instructor Credentials Debugging ========${colors.reset}`);

// Check if backend server is running
function checkServerRunning() {
    console.log(`\n${colors.cyan}Checking if backend server is running...${colors.reset}`);
    try {
        const response = execSync('curl -s http://localhost:5000', { stdio: 'pipe' });
        console.log(`${colors.green}✓ Backend server is running at http://localhost:5000${colors.reset}`);
        return true;
    } catch (error) {
        console.log(`${colors.red}✗ Backend server is not running at http://localhost:5000${colors.reset}`);
        console.log(`${colors.yellow}→ Start your backend server with: cd Backend && node server.js${colors.reset}`);
        return false;
    }
}

// Check required backend dependencies
function checkBackendDependencies() {
    console.log(`\n${colors.cyan}Checking backend dependencies...${colors.reset}`);
    const backendPackageJsonPath = path.join(__dirname, 'Backend', 'package.json');
    
    if (!fs.existsSync(backendPackageJsonPath)) {
        console.log(`${colors.red}✗ Backend package.json not found${colors.reset}`);
        return false;
    }
    
    const packageJson = JSON.parse(fs.readFileSync(backendPackageJsonPath, 'utf8'));
    const dependencies = packageJson.dependencies || {};
    
    const requiredDeps = ['bcryptjs', 'cors', 'express', 'mongoose'];
    const missingDeps = [];
    
    requiredDeps.forEach(dep => {
        if (!dependencies[dep]) {
            missingDeps.push(dep);
        }
    });
    
    if (missingDeps.length > 0) {
        console.log(`${colors.red}✗ Missing dependencies: ${missingDeps.join(', ')}${colors.reset}`);
        console.log(`${colors.yellow}→ Install missing dependencies with: cd Backend && npm install ${missingDeps.join(' ')} --save${colors.reset}`);
        return false;
    }
    
    console.log(`${colors.green}✓ All required backend dependencies are installed${colors.reset}`);
    return true;
}

// Check frontend dependencies
function checkFrontendDependencies() {
    console.log(`\n${colors.cyan}Checking frontend dependencies...${colors.reset}`);
    const frontendPackageJsonPath = path.join(__dirname, 'frontend', 'package.json');
    
    if (!fs.existsSync(frontendPackageJsonPath)) {
        console.log(`${colors.red}✗ Frontend package.json not found${colors.reset}`);
        return false;
    }
    
    const packageJson = JSON.parse(fs.readFileSync(frontendPackageJsonPath, 'utf8'));
    const dependencies = packageJson.dependencies || {};
    
    const requiredDeps = ['antd', '@ant-design/icons', 'axios', 'react-router-dom'];
    const missingDeps = [];
    
    requiredDeps.forEach(dep => {
        if (!dependencies[dep]) {
            missingDeps.push(dep);
        }
    });
    
    if (missingDeps.length > 0) {
        console.log(`${colors.red}✗ Missing dependencies: ${missingDeps.join(', ')}${colors.reset}`);
        console.log(`${colors.yellow}→ Install missing dependencies with: cd frontend && npm install ${missingDeps.join(' ')} --save${colors.reset}`);
        return false;
    }
    
    console.log(`${colors.green}✓ All required frontend dependencies are installed${colors.reset}`);
    return true;
}

// Check required files
function checkRequiredFiles() {
    console.log(`\n${colors.cyan}Checking if all required files exist...${colors.reset}`);
    
    const requiredFiles = [
        ['Backend/Controllers/InstructorCredentialsController.js', 'Backend controller'],
        ['Backend/Route/InstructorCredentialsRoutes.js', 'Backend routes'],
        ['frontend/src/services/InstructorCredentialsService.js', 'Frontend service'],
        ['frontend/src/Components/InstructorCredentials/InstructorCredentialsTable.js', 'Frontend table component'],
        ['frontend/src/Components/InstructorCredentials/InstructorCredentialsForm.js', 'Frontend form component'],
        ['frontend/src/Components/InstructorCredentials/InstructorCredentials.css', 'Frontend CSS']
    ];
    
    let allFilesExist = true;
    
    for (const [filePath, description] of requiredFiles) {
        const fullPath = path.join(__dirname, filePath);
        
        if (fs.existsSync(fullPath)) {
            console.log(`${colors.green}✓ ${description} exists: ${filePath}${colors.reset}`);
        } else {
            console.log(`${colors.red}✗ ${description} is missing: ${filePath}${colors.reset}`);
            allFilesExist = false;
        }
    }
    
    return allFilesExist;
}

// Check if server.js includes the instructor credentials routes
function checkServerRoutesConfiguration() {
    console.log(`\n${colors.cyan}Checking server routes configuration...${colors.reset}`);
    
    const serverJsPath = path.join(__dirname, 'Backend', 'server.js');
    
    if (!fs.existsSync(serverJsPath)) {
        console.log(`${colors.red}✗ server.js not found${colors.reset}`);
        return false;
    }
    
    const serverContents = fs.readFileSync(serverJsPath, 'utf8');
    
    const importPattern = /instructorCredentialsRoutes\s*=\s*require\(['"](\.\/Route\/InstructorCredentialsRoutes)['"]\)/;
    const usePattern = /app\.use\(instructorCredentialsRoutes\)/;
    
    const hasImport = importPattern.test(serverContents);
    const hasUse = usePattern.test(serverContents);
    
    if (hasImport) {
        console.log(`${colors.green}✓ InstructorCredentialsRoutes is imported in server.js${colors.reset}`);
    } else {
        console.log(`${colors.red}✗ InstructorCredentialsRoutes is not imported in server.js${colors.reset}`);
    }
    
    if (hasUse) {
        console.log(`${colors.green}✓ InstructorCredentialsRoutes is used in server.js${colors.reset}`);
    } else {
        console.log(`${colors.red}✗ InstructorCredentialsRoutes is not used in server.js${colors.reset}`);
    }
    
    return hasImport && hasUse;
}

// Check if App.js includes the route to instructor credentials
function checkAppRoutesConfiguration() {
    console.log(`\n${colors.cyan}Checking frontend App.js configuration...${colors.reset}`);
    
    const appJsPath = path.join(__dirname, 'frontend', 'src', 'App.js');
    
    if (!fs.existsSync(appJsPath)) {
        console.log(`${colors.red}✗ App.js not found${colors.reset}`);
        return false;
    }
    
    const appContents = fs.readFileSync(appJsPath, 'utf8');
    
    const importPattern = /import\s+InstructorCredentialsTable\s+from\s+['"](\.\/Components\/InstructorCredentials\/InstructorCredentialsTable)['"]/;
    const routePattern = /<Route\s+path="\/instructor-credentials"\s+element={<InstructorCredentialsTable\s+\/?>}\s*\/>/;
    
    const hasImport = importPattern.test(appContents);
    const hasRoute = routePattern.test(appContents);
    
    if (hasImport) {
        console.log(`${colors.green}✓ InstructorCredentialsTable is imported in App.js${colors.reset}`);
    } else {
        console.log(`${colors.red}✗ InstructorCredentialsTable is not imported in App.js${colors.reset}`);
    }
    
    if (hasRoute) {
        console.log(`${colors.green}✓ Route to instructor-credentials exists in App.js${colors.reset}`);
    } else {
        console.log(`${colors.red}✗ Route to instructor-credentials is missing in App.js${colors.reset}`);
    }
    
    return hasImport && hasRoute;
}

// Check Modal property in Table component
function checkModalProperty() {
    console.log(`\n${colors.cyan}Checking Modal property in InstructorCredentialsTable.js...${colors.reset}`);
    
    const tableJsPath = path.join(__dirname, 'frontend', 'src', 'Components', 'InstructorCredentials', 'InstructorCredentialsTable.js');
    
    if (!fs.existsSync(tableJsPath)) {
        console.log(`${colors.red}✗ InstructorCredentialsTable.js not found${colors.reset}`);
        return false;
    }
    
    const tableContents = fs.readFileSync(tableJsPath, 'utf8');
    
    const visiblePattern = /visible={isModalVisible}/;
    const openPattern = /open={isModalVisible}/;
    
    const hasVisible = visiblePattern.test(tableContents);
    const hasOpen = openPattern.test(tableContents);
    
    if (hasOpen) {
        console.log(`${colors.green}✓ Modal uses correct 'open' property in InstructorCredentialsTable.js${colors.reset}`);
    } else if (hasVisible) {
        console.log(`${colors.red}✗ Modal uses deprecated 'visible' property in InstructorCredentialsTable.js${colors.reset}`);
        console.log(`${colors.yellow}→ In Ant Design v5, 'visible' has been renamed to 'open'. Update the Modal component.${colors.reset}`);
    } else {
        console.log(`${colors.yellow}! Could not find Modal visibility property in InstructorCredentialsTable.js${colors.reset}`);
    }
    
    return hasOpen;
}

// Generate summary and recommendations
function generateSummary(results) {
    console.log(`\n${colors.magenta}======== Summary ========${colors.reset}`);
    
    const allPassed = Object.values(results).every(result => result);
    
    if (allPassed) {
        console.log(`${colors.green}All checks passed! If you're still experiencing issues:${colors.reset}`);
        console.log(`${colors.yellow}1. Check the browser console for errors${colors.reset}`);
        console.log(`${colors.yellow}2. Ensure your MongoDB is running and accessible${colors.reset}`);
        console.log(`${colors.yellow}3. Try restarting both frontend and backend servers${colors.reset}`);
    } else {
        console.log(`${colors.red}Some checks failed. Fix the issues highlighted above.${colors.reset}`);
        
        if (!results.serverRunning) {
            console.log(`${colors.yellow}• Start your backend server with: cd Backend && node server.js${colors.reset}`);
        }
        
        if (!results.backendDependencies) {
            console.log(`${colors.yellow}• Install missing backend dependencies${colors.reset}`);
        }
        
        if (!results.frontendDependencies) {
            console.log(`${colors.yellow}• Install missing frontend dependencies${colors.reset}`);
        }
        
        if (!results.requiredFiles) {
            console.log(`${colors.yellow}• Recreate the missing files or restore them from backup${colors.reset}`);
        }
        
        if (!results.serverRoutesConfig) {
            console.log(`${colors.yellow}• Update server.js to include instructor credentials routes${colors.reset}`);
        }
        
        if (!results.appRoutesConfig) {
            console.log(`${colors.yellow}• Update App.js to include the instructor credentials route${colors.reset}`);
        }
        
        if (!results.modalProperty) {
            console.log(`${colors.yellow}• Update the Modal component to use 'open' instead of 'visible'${colors.reset}`);
        }
    }
    
    console.log(`\n${colors.magenta}======== Next Steps ========${colors.reset}`);
    console.log(`${colors.cyan}1. Fix any issues identified above${colors.reset}`);
    console.log(`${colors.cyan}2. Run backend server with: cd Backend && node server.js${colors.reset}`);
    console.log(`${colors.cyan}3. Run frontend server with: cd frontend && npm start${colors.reset}`);
    console.log(`${colors.cyan}4. Navigate to http://localhost:3000/instructor-credentials${colors.reset}`);
    console.log(`${colors.cyan}5. Check browser console for any errors${colors.reset}`);
}

// Run all checks
function runAllChecks() {
    const results = {
        serverRunning: checkServerRunning(),
        backendDependencies: checkBackendDependencies(),
        frontendDependencies: checkFrontendDependencies(),
        requiredFiles: checkRequiredFiles(),
        serverRoutesConfig: checkServerRoutesConfiguration(),
        appRoutesConfig: checkAppRoutesConfiguration(),
        modalProperty: checkModalProperty()
    };
    
    generateSummary(results);
}

runAllChecks(); 