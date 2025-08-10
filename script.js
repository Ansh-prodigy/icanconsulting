// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const tabContents = document.querySelectorAll('.tab-content');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const bookingForm = document.getElementById('bookingForm');
const bookingModal = document.getElementById('bookingModal');
const closeModal = document.querySelector('.close');

// Tab Switching Functionality
function switchTab(tabName) {
    // Remove active class from all tabs and nav links
    tabContents.forEach(content => content.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to selected tab and nav link
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Close mobile menu if open
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
}

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Modal Functions
function openModal() {
    bookingModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModalFunction() {
    bookingModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking on X or outside modal
closeModal.addEventListener('click', closeModalFunction);
window.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
        closeModalFunction();
    }
});

// AI Agent Booking System
class BookingAI {
    constructor() {
        this.availability = {
            monday: { start: '18:00', end: '20:00', slots: [] },
            wednesday: { start: '18:00', end: '20:00', slots: [] },
            friday: { start: '18:00', end: '20:00', slots: [] },
            saturday: { start: '13:00', end: '16:00', slots: [] },
            sunday: { start: '13:00', end: '16:00', slots: [] }
        };
        this.initializeAvailability();
    }

    initializeAvailability() {
        // Generate available time slots for the next 4 weeks
        const today = new Date();
        for (let week = 0; week < 4; week++) {
            Object.keys(this.availability).forEach(day => {
                const dayDate = this.getNextDayOfWeek(day, today, week);
                if (dayDate) {
                    this.generateTimeSlots(day, dayDate);
                }
            });
        }
    }

    getNextDayOfWeek(dayName, startDate, weekOffset) {
        const days = {
            'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
            'friday': 5, 'saturday': 6, 'sunday': 0
        };
        
        const targetDay = days[dayName.toLowerCase()];
        const currentDay = startDate.getDay();
        const daysToAdd = (targetDay - currentDay + 7) % 7 + (weekOffset * 7);
        
        const targetDate = new Date(startDate);
        targetDate.setDate(startDate.getDate() + daysToAdd);
        
        return targetDate;
    }

    generateTimeSlots(day, date) {
        const config = this.availability[day];
        const startHour = parseInt(config.start.split(':')[0]);
        const endHour = parseInt(config.end.split(':')[0]);
        
        for (let hour = startHour; hour < endHour; hour++) {
            const slot = {
                date: new Date(date),
                time: `${hour}:00`,
                available: true,
                duration: 60
            };
            config.slots.push(slot);
        }
    }

    findBestSlot(preferredDays, sessionType) {
        const availableSlots = [];
        
        preferredDays.forEach(day => {
            if (this.availability[day]) {
                this.availability[day].slots.forEach(slot => {
                    if (slot.available && slot.date > new Date()) {
                        availableSlots.push({
                            ...slot,
                            day: day
                        });
                    }
                });
            }
        });

        if (availableSlots.length === 0) {
            return null;
        }

        // Sort by date (earliest first)
        availableSlots.sort((a, b) => a.date - b.date);
        
        // Return the first available slot
        return availableSlots[0];
    }

    processBooking(bookingData) {
        const preferredDays = bookingData.preferredDays;
        const sessionType = bookingData.sessionType;
        
        const bestSlot = this.findBestSlot(preferredDays, sessionType);
        
        if (!bestSlot) {
            return {
                success: false,
                message: "No available slots found for your preferred days. Please try different days or contact us directly."
            };
        }

        // Mark slot as booked
        bestSlot.available = false;
        
        return {
            success: true,
            slot: bestSlot,
            message: `Booking confirmed! Your session is scheduled for ${bestSlot.day.charAt(0).toUpperCase() + bestSlot.day.slice(1)} at ${bestSlot.time} on ${bestSlot.date.toLocaleDateString()}.`
        };
    }
}

// Initialize AI Agent
const bookingAI = new BookingAI();

// Form Submission Handler
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading state
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    // Collect form data
    const formData = new FormData(bookingForm);
    const bookingData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        industry: formData.get('industry'),
        currentRole: formData.get('currentRole'),
        experienceYears: formData.get('experienceYears'),
        careerGoals: formData.get('careerGoals'),
        currentChallenges: formData.get('currentChallenges'),
        specificQuestions: formData.get('specificQuestions'),
        preferredDays: formData.getAll('preferredDays'),
        sessionType: formData.get('sessionType')
    };

    // Validate required fields
    if (bookingData.preferredDays.length === 0) {
        alert('Please select at least one preferred day.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        return;
    }

    try {
        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Process booking with AI agent
        const result = bookingAI.processBooking(bookingData);
        
        if (result.success) {
            // Update modal content with booking details
            const modalContent = bookingModal.querySelector('.modal-content');
            modalContent.innerHTML = `
                <span class="close">&times;</span>
                <h3>Booking Confirmed! 🎉</h3>
                <p><strong>${result.message}</strong></p>
                <div class="booking-details">
                    <h4>Session Details:</h4>
                    <p><strong>Name:</strong> ${bookingData.firstName} ${bookingData.lastName}</p>
                    <p><strong>Email:</strong> ${bookingData.email}</p>
                    <p><strong>Session Type:</strong> ${bookingData.sessionType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    <p><strong>Industry:</strong> ${bookingData.industry}</p>
                </div>
                <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
                    You will receive a confirmation email with meeting details and preparation materials within 24 hours.
                </p>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="closeModalFunction()">Close</button>
                </div>
            `;
            
            // Reattach close functionality
            const newCloseBtn = bookingModal.querySelector('.close');
            newCloseBtn.addEventListener('click', closeModalFunction);
            
            openModal();
            
            // Reset form
            bookingForm.reset();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Booking error:', error);
        alert('An error occurred while processing your booking. Please try again or contact us directly.');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Form validation and enhancement
document.addEventListener('DOMContentLoaded', () => {
    // Add real-time validation
    const requiredFields = bookingForm.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', () => {
            validateField(field);
        });
        
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                validateField(field);
            }
        });
    });
    
    // Add character counters for textareas
    const textareas = bookingForm.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = 'font-size: 0.8rem; color: #666; text-align: right; margin-top: 0.25rem;';
        textarea.parentNode.appendChild(counter);
        
        textarea.addEventListener('input', () => {
            const remaining = 500 - textarea.value.length;
            counter.textContent = `${remaining} characters remaining`;
            counter.style.color = remaining < 50 ? '#e74c3c' : '#666';
        });
    });
});

function validateField(field) {
    const value = field.value.trim();
    const errorClass = 'error';
    
    // Remove existing error styling
    field.classList.remove(errorClass);
    
    // Check if field is empty
    if (field.hasAttribute('required') && !value) {
        field.classList.add(errorClass);
        field.style.borderColor = '#e74c3c';
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add(errorClass);
            field.style.borderColor = '#e74c3c';
            return false;
        }
    }
    
    // Reset border color if valid
    field.style.borderColor = '#e1e5e9';
    return true;
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation for form submission
function showLoading(element) {
    element.style.opacity = '0.7';
    element.style.pointerEvents = 'none';
}

function hideLoading(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
}

// Add some interactive animations
document.addEventListener('DOMContentLoaded', () => {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    document.querySelectorAll('.empowerment-card, .benefit, .feature').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Export functions for global access
window.switchTab = switchTab;
window.closeModal = closeModalFunction;