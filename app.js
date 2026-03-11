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

// -------------------------------------------------------------
// Reviews System (Firebase + Hidden Admin Delete)
// -------------------------------------------------------------

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC9XUC4zn-mhIPwU4R9wc9vlsd7NRxHKpk",
    authDomain: "dskt-64ec8.firebaseapp.com",
    databaseURL: "https://dskt-64ec8-default-rtdb.firebaseio.com",
    projectId: "dskt-64ec8",
    storageBucket: "dskt-64ec8.firebasestorage.app",
    messagingSenderId: "617124818588",
    appId: "1:617124818588:web:3be51200a9ab03f401c759"
};

// Check if Firebase configs are replaced
const isFirebaseReady = firebaseConfig.apiKey !== "YOUR_API_KEY";

if (isFirebaseReady) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}

const reviewsContainer = document.getElementById('reviews-container');
let isAdmin = false;

// Render Stars
function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) stars += "<i class='bx bxs-star'></i>";
        else stars += "<i class='bx bx-star'></i>";
    }
    return stars;
}

// Get Initials
function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
}

// Display Reviews on UI
function displayReviews(reviewsData) {
    if (!reviewsContainer) return;

    reviewsContainer.innerHTML = '';

    // Sort logic (newest first)
    const keys = Object.keys(reviewsData).reverse();

    if (keys.length === 0) {
        reviewsContainer.innerHTML = `<div class="col-span-1 md:col-span-3 text-center text-gray-500 py-10">No reviews yet. Be the first to leave a review!</div>`;
        return;
    }

    keys.forEach(key => {
        const review = reviewsData[key];
        const rawDate = review.timestamp ? new Date(review.timestamp) : new Date();
        const dateStr = rawDate.toLocaleDateString();

        // If admin is true, show delete button instead of quote logo
        const actionHtml = isAdmin
            ? `<button onclick="deleteReview('${key}')" title="Delete Review" class="absolute top-4 right-4 bg-red-100 text-red-600 hover:bg-red-500 hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"><i class='bx bx-trash text-xl'></i></button>`
            : `<i class='bx bxs-quote-left text-4xl text-brand/10 absolute top-6 right-6'></i>`;

        const card = `
            <div class="snap-center shrink-0 w-[85vw] md:w-[400px] bg-white p-8 rounded-2xl shadow-md border border-gray-100 relative group hover:shadow-xl transition-all duration-300">
                ${actionHtml}
                <div class="flex items-center gap-2 mb-4 text-accent text-lg">
                    ${renderStars(review.rating)}
                </div>
                <p class="text-gray-600 mb-6 italic leading-relaxed whitespace-pre-line">"${review.text}"</p>
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center text-brand font-bold text-lg">${getInitials(review.name)}</div>
                    <div>
                        <h4 class="font-bold text-brand text-sm">${review.name}</h4>
                        <span class="text-xs text-gray-500">${dateStr}</span>
                    </div>
                </div>
            </div>
        `;
        reviewsContainer.insertAdjacentHTML('beforeend', card);
    });

    // Start auto scrolling
    startAutoScroll();
}

let autoScrollInterval;
function startAutoScroll() {
    if(!reviewsContainer) return;
    clearInterval(autoScrollInterval);

    // Auto scroll every 3 seconds
    autoScrollInterval = setInterval(() => {
        // Find next card to scroll to
        const cardWidth = reviewsContainer.querySelector('div').offsetWidth + 32; // width + gap
        const currentScroll = reviewsContainer.scrollLeft;
        const maxScroll = reviewsContainer.scrollWidth - reviewsContainer.clientWidth;

        if (currentScroll >= maxScroll - 10) { // reached the end
            reviewsContainer.scrollTo({ left: 0, behavior: 'smooth' }); // go back to start
        } else {
            reviewsContainer.scrollBy({ left: cardWidth, behavior: 'smooth' }); // move to next
        }
    }, 4000);

    // Pause on hover
    reviewsContainer.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
    reviewsContainer.addEventListener('mouseleave', startAutoScroll);
}

// Fetch Reviews
if (isFirebaseReady) {
    const dbRef = firebase.database().ref('reviews');
    dbRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if(!data) {
            // Seed DB with dummy data if empty
             const dummyReviews = [
                { name: 'Saman Perera', text: 'Excellent service! The AC bus was incredibly comfortable and the driver was highly professional. Definitely our top choice for future long trips.', rating: 5, timestamp: Date.now() },
                { name: 'Nimal Rathnayake', text: 'We rented an excavator for our new construction site. The machinery was in top condition and delivered right on time. Highly recommended!', rating: 5, timestamp: Date.now() - 86400000 },
                { name: 'Kamal Fernando', text: 'Great travel and tour service. Our family enjoyed the custom tour package very much. The booking process was smooth. Thank you DSK Transport!', rating: 4, timestamp: Date.now() - 172800000 }
             ];
             dummyReviews.forEach(r => firebase.database().ref('reviews').push(r));
        } else {
             displayReviews(data);
        }
    });
} else {
    // Timeout gives a natural loading effect before showing dummy data
    setTimeout(loadDummyReviews, 800);
}

// Modal Logic
const reviewModal = document.getElementById('review-modal');
const openReviewBtn = document.getElementById('open-review-modal');
const closeReviewBtn = document.getElementById('close-review-modal');
const reviewModalContent = document.getElementById('review-modal-content');
const addReviewForm = document.getElementById('add-review-form');

function closeReviewModal() {
    reviewModal.classList.add('opacity-0');
    reviewModalContent.classList.add('scale-95');
    setTimeout(() => {
        reviewModal.classList.add('hidden');
        reviewModal.classList.remove('flex');
    }, 300);
}

if (openReviewBtn) {
    openReviewBtn.addEventListener('click', () => {
        reviewModal.classList.remove('hidden');
        reviewModal.classList.add('flex');
        setTimeout(() => {
            reviewModal.classList.remove('opacity-0');
            reviewModalContent.classList.remove('scale-95');
        }, 10);
    });

    closeReviewBtn.addEventListener('click', closeReviewModal);

    // Form Submit
    addReviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!isFirebaseReady) {
            alert('Firebase Database is not configured! Please replace API keys in app.js. (Dummy mode is active)');
            return;
        }

        const name = document.getElementById('review-name').value;
        const rating = parseInt(document.getElementById('review-rating').value);
        const text = document.getElementById('review-text').value;
        const btn = document.getElementById('submit-review-btn');

        btn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Submitting...";
        btn.disabled = true;

        firebase.database().ref('reviews').push({
            name,
            rating,
            text,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            alert('Thank you for your review!');
            addReviewForm.reset();
            closeReviewModal();
        }).catch((err) => {
            console.error(err);
            alert('Failed to submit review.');
        }).finally(() => {
            btn.innerHTML = "<span>Submit Review</span> <i class='bx bx-send'></i>";
            btn.disabled = false;
        });
    });
}

// -------------------------------------------------------------
// Admin Mode Activation (Double click "What Our Clients Say")
// -------------------------------------------------------------
const reviewTitle = document.getElementById('review-title');
if (reviewTitle) {
    reviewTitle.addEventListener('dblclick', () => {
        const password = prompt('Enter Admin Password to delete reviews:');
        if (password === 'dsk123') { // Admin password
            isAdmin = true;
            alert('Admin mode active! You can now delete reviews.');
            // Re-render
            if (isFirebaseReady) {
                firebase.database().ref('reviews').once('value').then(snap => displayReviews(snap.val() || {}));
            }
        } else if (password !== null) {
            alert('Incorrect password!');
        }
    });
}

// Delete Review (Global scope for inline onclick)
window.deleteReview = function (key) {
    if (confirm('Are you sure you want to delete this review?')) {
        if (isFirebaseReady) {
            firebase.database().ref('reviews/' + key).remove()
                .then(() => alert('Review deleted successfully.'))
                .catch(err => alert('Failed to delete review.'));
        } else {
            alert('This is a dummy review. Cannot delete without Firebase connection.');
        }
    }
}
