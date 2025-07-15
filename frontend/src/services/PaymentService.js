import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Map package names to possible course name patterns
const PACKAGE_COURSE_MAPPING = {
  'Basic': ['Basic', 'Basic Course', 'Basic Driving Course', 'Basic Package', 'Basic Package Course', 'Beginner'],
  'Standard': ['Standard', 'Standard Course', 'Standard Driving Course', 'Standard Package', 'Standard Package Course', 'Intermediate', 'Bike and Car Only'],
  'Premium': ['Premium', 'Premium Course', 'Premium Driving Course', 'Premium Package', 'Premium Package Course', 'Advanced'],
};

// Helper to check if a course name matches a specific package
const matchesCourseToPackage = (courseName, packageName) => {
  if (!courseName) return false;
  
  const possibleCourseNames = PACKAGE_COURSE_MAPPING[packageName] || [packageName];
  const lowerCourseName = courseName.toLowerCase();
  
  return possibleCourseNames.some(pattern => {
    const lowerPattern = pattern.toLowerCase();
    return lowerCourseName.includes(lowerPattern);
  });
};

class PaymentService {
  // Get all payments for a student
  async getPaymentsByStudentId(studentId) {
    if (!studentId) {
      console.log('No student ID provided for payment lookup');
      return [];
    }
    
    try {
      console.log(`Fetching payments for student ID: ${studentId}`);
      const response = await axios.get(`${API_URL}/payments/student/${studentId}`);
      const payments = response.data.payments || [];
      console.log(`Retrieved ${payments.length} payments from server`);
      return payments;
    } catch (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
  }

  // Get all active packages for a student
  async getActivePackages(studentId) {
    if (!studentId) return { hasAnyActive: false, packages: {} };
    
    try {
      const payments = await this.getPaymentsByStudentId(studentId);
      const completedPayments = payments.filter(payment => payment.status === 'Completed');
      
      console.log(`Found ${completedPayments.length} completed payments`);
      
      // Create a result object to track active status for each package
      const result = {
        hasAnyActive: false,
        packages: {
          Basic: { isPaid: false, expiryDate: null },
          Standard: { isPaid: false, expiryDate: null },
          Premium: { isPaid: false, expiryDate: null }
        }
      };
      
      // Check active status for each payment and associated package
      completedPayments.forEach(payment => {
        const { courseName, paymentDate, amount } = payment;
        if (!courseName || !paymentDate) return;
        
        // Calculate if payment is still active (within 30 days)
        const paymentDateTime = new Date(paymentDate);
        const currentDate = new Date();
        const timeDiff = currentDate.getTime() - paymentDateTime.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        const isActive = daysDiff < 30;
        
        if (!isActive) return;
        
        // Determine which package this payment is for
        for (const packageName of Object.keys(PACKAGE_COURSE_MAPPING)) {
          if (matchesCourseToPackage(courseName, packageName)) {
            // Set the package as paid
            result.packages[packageName].isPaid = true;
            
            // Calculate expiry date
            const expiryDate = new Date(paymentDateTime);
            expiryDate.setDate(expiryDate.getDate() + 30);
            result.packages[packageName].expiryDate = expiryDate;
            
            // Track that at least one package is active
            result.hasAnyActive = true;
            
            console.log(`Package ${packageName} is active until ${expiryDate.toLocaleDateString()} (payment for ${courseName})`);
          }
        }
      });
      
      return result;
    } catch (error) {
      console.error('Error getting active packages:', error);
      return { hasAnyActive: false, packages: {} };
    }
  }

  // Check if a student has an active payment for a specific package
  async hasActivePayment(studentId, packageName) {
    try {
      const activePackages = await this.getActivePackages(studentId);
      return activePackages.packages[packageName]?.isPaid || false;
    } catch (error) {
      console.error(`Error checking active payment for ${packageName}:`, error);
      return false;
    }
  }
}

export default new PaymentService(); 