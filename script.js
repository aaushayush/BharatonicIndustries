// Global State Management
let currentUser = null;
let currentRole = null;

// Sample Data
const workers = [
    { id: 1, name: 'Rajesh Kumar', skill: 'Mason', phone: '9876543210', status: 'Available', rating: 4.5, salary: 22500 },
    { id: 2, name: 'Amit Singh', skill: 'Electrician', phone: '9876543211', status: 'On Site', rating: 4.8, salary: 25000 },
    { id: 3, name: 'Suresh Patel', skill: 'Plumber', phone: '9876543212', status: 'Available', rating: 4.3, salary: 20000 }
];

const projects = [
    { id: 1, name: 'Villa Construction - Sector 45', contractor: 'ABC Builders', progress: 65, status: 'Active', budget: 600000, spent: 420000 },
    { id: 2, name: 'Apartment Renovation', contractor: 'XYZ Contractors', progress: 30, status: 'Active', budget: 300000, spent: 150000 }
];

const jobs = [
    { id: 1, title: 'Villa Construction - Sector 45', required: '5 Masons', duration: '15 days', posted: '2 days ago' },
    { id: 2, title: 'Apartment Renovation', required: '3 Painters', duration: '7 days', posted: '1 day ago' },
    { id: 3, title: 'Commercial Building', required: '2 Electricians', duration: '20 days', posted: '3 days ago' }
];

// Navigation Functions
function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(el => el.classList.add('hidden'));
    
    // Show selected page
    const pageElement = document.getElementById(page + 'Page');
    if (pageElement) {
        pageElement.classList.remove('hidden');
        pageElement.classList.add('fade-in');
    }
    
    // Close mobile menu if open
    closeMobileMenu();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (!mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
    }
}

// Modal Functions
function openLoginModal() {
    const modalHtml = `
        <div id="loginModal" class="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onclick="closeModalOnOutsideClick(event)">
            <div class="modal-content bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold">Login Portal</h3>
                    <button onclick="closeLoginModal()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                <div class="space-y-3">
                    <button onclick="showDashboard('worker')" class="w-full bg-blue-50 border-2 border-blue-200 p-4 rounded-lg hover:bg-blue-100 transition text-left">
                        <p class="font-bold">👷 Worker</p>
                        <p class="text-sm text-gray-600">Access your profile and find jobs</p>
                    </button>
                    <button onclick="showDashboard('contractor')" class="w-full bg-green-50 border-2 border-green-200 p-4 rounded-lg hover:bg-green-100 transition text-left">
                        <p class="font-bold">💼 Contractor</p>
                        <p class="text-sm text-gray-600">Manage sites and workers</p>
                    </button>
                    <button onclick="showDashboard('homeowner')" class="w-full bg-purple-50 border-2 border-purple-200 p-4 rounded-lg hover:bg-purple-100 transition text-left">
                        <p class="font-bold">🏠 Homeowner</p>
                        <p class="text-sm text-gray-600">Track your project progress</p>
                    </button>
                    <button onclick="showDashboard('admin')" class="w-full bg-red-50 border-2 border-red-200 p-4 rounded-lg hover:bg-red-100 transition text-left">
                        <p class="font-bold">⚙️ Admin</p>
                        <p class="text-sm text-gray-600">System management and analytics</p>
                    </button>
                </div>
                <p class="text-center text-sm text-gray-500 mt-6">Demo Mode - Select any role to explore</p>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.remove();
    }
}

function closeModalOnOutsideClick(event) {
    if (event.target.id === 'loginModal') {
        closeLoginModal();
    }
}

// Dashboard Functions
function showDashboard(role) {
    currentRole = role;
    currentUser = { name: getDefaultUserName(role), role: role };
    
    // Hide all pages and navigation
    document.querySelectorAll('.page').forEach(el => el.classList.add('hidden'));
    document.getElementById('mainNav').classList.add('hidden');
    
    // Show appropriate dashboard
    const dashboardId = role + 'Dashboard';
    const dashboard = document.getElementById(dashboardId);
    if (dashboard) {
        dashboard.classList.remove('hidden');
        dashboard.classList.add('fade-in');
    }
    
    closeLoginModal();
    
    // Load dashboard data
    loadDashboardData(role);
    
    showNotification(`Welcome ${currentUser.name}!`, 'success');
}

function getDefaultUserName(role) {
    const names = {
        'worker': 'Rajesh Kumar',
        'contractor': 'ABC Builders',
        'homeowner': 'Mr. Sharma',
        'admin': 'Bharatonic Admin'
    };
    return names[role] || 'User';
}

function logout() {
    currentUser = null;
    currentRole = null;
    
    // Show navigation
    document.getElementById('mainNav').classList.remove('hidden');
    
    // Hide all dashboards
    document.querySelectorAll('[id$="Dashboard"]').forEach(el => el.classList.add('hidden'));
    
    // Show home page
    navigateTo('home');
    
    showNotification('Logged out successfully', 'info');
}

// Dashboard Data Loading
function loadDashboardData(role) {
    switch(role) {
        case 'worker':
            loadWorkerData();
            break;
        case 'contractor':
            loadContractorData();
            break;
        case 'homeowner':
            loadHomeownerData();
            break;
        case 'admin':
            loadAdminData();
            break;
    }
}

function loadWorkerData() {
    // Load attendance history
    const attendanceHtml = `
        <h3 class="text-xl font-bold mb-4">Attendance History</h3>
        <div class="space-y-2">
            <div class="flex justify-between border-b pb-2">
                <span>Jan 4, 2026</span>
                <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">Present</span>
            </div>
            <div class="flex justify-between border-b pb-2">
                <span>Jan 3, 2026</span>
                <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">Present</span>
            </div>
            <div class="flex justify-between border-b pb-2">
                <span>Jan 2, 2026</span>
                <span class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">Absent</span>
            </div>
            <div class="flex justify-between border-b pb-2">
                <span>Jan 1, 2026</span>
                <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">Present</span>
            </div>
        </div>
    `;
    
    const attendanceContainer = document.querySelector('#workerDashboard .grid.md\\:grid-cols-2 .bg-white:last-child');
    if (attendanceContainer) {
        attendanceContainer.innerHTML = attendanceHtml;
    }
}

function loadContractorData() {
    // Contractor data is already in HTML
    console.log('Contractor dashboard loaded');
}

function loadHomeownerData() {
    // Homeowner data is already in HTML
    console.log('Homeowner dashboard loaded');
}

function loadAdminData() {
    // Admin data is already in HTML
    console.log('Admin dashboard loaded');
}

// Job Application
function applyJob(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
        showNotification(`Application submitted for: ${job.title}`, 'success');
        // In a real app, this would send data to backend
    }
}

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

function handleContactSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const phone = document.getElementById('contactPhone').value;
    const message = document.getElementById('contactMessage').value;
    
    // In a real app, this would send data to backend
    console.log('Contact Form Submitted:', { name, email, phone, message });
    
    showNotification('Message sent successfully! We will contact you soon.', 'success');
    
    // Reset form
    e.target.reset();
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Utility Functions
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// Search Functionality
function searchWorkers(query) {
    return workers.filter(worker => 
        worker.name.toLowerCase().includes(query.toLowerCase()) ||
        worker.skill.toLowerCase().includes(query.toLowerCase())
    );
}

function searchProjects(query) {
    return projects.filter(project => 
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.contractor.toLowerCase().includes(query.toLowerCase())
    );
}

// Export data for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        navigateTo,
        showDashboard,
        logout,
        applyJob,
        showNotification
    };
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Bharatonic Industries Website Loaded');
    
    // Set initial page
    navigateTo('home');
    
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (mobileMenu && !mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
        closeMobileMenu();
    }
});

// Handle browser back button
window.addEventListener('popstate', function() {
    if (currentRole) {
        logout();
    }
});