// Navbar sticky effect & Mobile Menu Toggle
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

// Sticky Navbar Logic
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-md');
        navbar.classList.add('bg-white/95');
    } else {
        navbar.classList.remove('shadow-md');
    }
});

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    if (!mobileMenu.classList.contains('hidden')) {
        setTimeout(() => {
            mobileMenu.classList.remove('max-h-0', 'opacity-0');
            mobileMenu.classList.add('max-h-screen', 'opacity-100');
        }, 10);
    } else {
        mobileMenu.classList.add('max-h-0', 'opacity-0');
        mobileMenu.classList.remove('max-h-screen', 'opacity-100');
    }
});

// Close Mobile Menu on Link Click
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('max-h-0', 'opacity-0');
        mobileMenu.classList.remove('max-h-screen', 'opacity-100');
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 300);
    });
});

// Book Vehicle helper to populate dropdown and scroll to form
window.bookVehicle = function (vehicleName) {
    const serviceDropdown = document.getElementById('service-dropdown');
    serviceDropdown.value = vehicleName;
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

// -------------------------------------------------------------
// Image Slider Logic (AC Bus Section)
// -------------------------------------------------------------
let currentSlide = 0;
const sliderTrack = document.getElementById('slider-track');
const totalSlides = sliderTrack ? sliderTrack.children.length : 0;

window.nextSlide = function () {
    if (!sliderTrack) return;
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSliderPosition();
}

window.prevSlide = function () {
    if (!sliderTrack) return;
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSliderPosition();
}

function updateSliderPosition() {
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Auto slide every 5 seconds
if (totalSlides > 0) {
    setInterval(window.nextSlide, 5000);
}

// -------------------------------------------------------------
// Dexie.js Database Integration
// -------------------------------------------------------------

// Initialize Database
const db = new Dexie('DSK_DB');

// Define Schema
db.version(1).stores({
    inquiries: '++id, name, phone, service, message, date'
});

// Form Submission Event Listener
const form = document.getElementById('inquiry-form');
const formLoader = document.getElementById('form-loader');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show Loader
    formLoader.classList.remove('hidden');
    formLoader.classList.add('flex');

    // Gather Data
    const name = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('contactNo').value.trim();
    const service = document.getElementById('service-dropdown').value;
    const message = document.getElementById('message').value.trim();
    const date = new Date().toISOString();

    try {
        // Save to DB
        await db.inquiries.add({
            name,
            phone,
            service,
            message,
            date
        });

        // Send email via Formsubmit API
        try {
            await fetch("https://formsubmit.co/ajax/dsktransportservice@gmail.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "Full Name": name,
                    "Contact Number": phone,
                    "Requested Service": service,
                    "Message": message,
                    _subject: `New Inquiry from ${name} - DSK Transport Website`
                })
            });
        } catch (emailErr) {
            console.error("Email sending stopped by Browser (Open via Live Server instead of double-clicking the HTML file):", emailErr);
        }

        // Hide Loader
        setTimeout(() => {
            formLoader.classList.remove('flex');
            formLoader.classList.add('hidden');

            // Clear Form
            form.reset();

            // Nice UI alert
            alert('Success! Redirecting you to WhatsApp to send the details securely.');

            // Open WhatsApp with pre-filled details
            const whatsappMessage = `*New Inquiry from DSK Transport Website*\n\n*Name:* ${name}\n*Contact Number:* ${phone}\n*Requested Service:* ${service}\n*Message:* ${message}`;
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/94763773201?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
            
        }, 1000); // Artificial delay to show processing state for premium feel

    } catch (err) {
        console.error("Dexie DB Error:", err);
        formLoader.classList.remove('flex');
        formLoader.classList.add('hidden');
        alert('An error occurred while saving your inquiry. Please try again.');
    }
});
