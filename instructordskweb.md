# Project Name: DSK Transport Service & Travel Tours
# Description: A responsive, modern single-page website for a transport and travel company based on a provided hand-drawn wireframe.

## 1. Technology Stack
* **Structure:** HTML5
* **Styling:** Tailwind CSS (via CDN or CLI for rapid UI development)
* **Interactivity:** Vanilla JavaScript
* **Local Database:** Dexie.js (IndexedDB wrapper to store user booking inquiries locally before syncing or for local dashboard management)
* **Icons:** FontAwesome or Boxicons (for social media, contact icons, and UI elements)
* **Fonts:** Google Fonts - 'Poppins' (for headings) and 'Inter' (for body text).

## 2. Global Design System (Tailwind Configurations)
* **Color Palette:**
    * **Primary Brand Color:** Deep Navy Blue (`#0F172A` - Tailwind `slate-900`) - for headers, footers, primary text.
    * **Accent/Call-to-Action Color:** Vibrant Yellow/Orange (`#F59E0B` - Tailwind `amber-500`) - for "Book Now" buttons, highlights, to give a heavy-machinery/transport vibe.
    * **Backgrounds:** Clean White (`#FFFFFF`) and Light Gray (`#F3F4F6` - Tailwind `gray-100`) for section alternations.
* **Styling Rules:** * Use slight drop shadows (`shadow-md`, `shadow-lg`) for vehicle cards to make them pop.
    * Use rounded corners (`rounded-lg` or `rounded-xl`) for a modern feel.
    * Ensure smooth transitions on hover states for buttons and cards (`transition duration-300`).

## 3. Section-by-Section Requirements

### 3.1. Header / Navigation
* **Layout:** Sticky top navbar (`sticky top-0 z-50`), flexbox layout.
* **Left Side:** Logo placeholder (Text "DSK" or an image icon).
* **Center/Right Links:** Home, About, AC Bus, Vehicles, Contact Us.
* **Styling:** White background, subtle bottom shadow. Hover effects on links (underline or color change to amber).

### 3.2. Hero Section
* **Background:** Full-width, large background image (preferably a high-quality transport/tour road image) with a dark overlay (`bg-black/60`) for text readability.
* **Content (Centered):**
    * Main Heading: "DSK TRANSPORT SERVICE" (Large, bold, uppercase, white text).
    * Subheading: "Moving Ahead with Humanity" (Medium size, light gray or amber text).
* **Social/Contact Badges:** Below the subheading, include small, elegant icon badges for Facebook and TikTok.

### 3.3. About Us & Travel & Tour Section
* **Layout:** CSS Grid or Flexbox, 2 columns on desktop (`grid-cols-2`), 1 column on mobile.
* **Left Column (About Us):** Section heading, followed by a short paragraph or bullet points explaining the company's history and mission.
* **Right Column (Travel & Tour):** Section heading, bullet points detailing the tour packages or travel services offered.
* **Styling:** Use a light gray background (`bg-gray-50`) to separate it from the hero section.

### 3.4. Featured "AC Bus" Section
* **Layout:** 2 columns on desktop (Image Left, Content Right).
* **Left Side:** Large, high-quality image of the AC Bus with soft rounded corners and a shadow.
* **Right Side:**
    * Heading: "Luxury AC Bus Services"
    * Description: Detailed text about comfort, seating capacity, and tour suitability.
    * Actions (Flex row): "Book Now" button (Solid Amber) and "Contact Us" button (Outline Dark Blue).

### 3.5. Vehicle Fleet Grid ("Vehicles We Have")
* **Layout:** CSS Grid. 3 columns on desktop (`grid-cols-3`), 2 on tablet, 1 on mobile.
* **Data/Items to Include:** Jeep, Tipper, Forklift, Tractor, JCB, Excavator, Rock roller, Water bouser.
* **Card Design (For each vehicle):**
    * **Top:** Image of the vehicle (aspect-video, object-cover).
    * **Body:** Vehicle Name (Bold, text-lg).
    * **Description:** 1-2 lines describing the vehicle's use case or capacity.
    * **Footer:** "Book Now" button spanning full width or aligned right.

### 3.6. Contact & Inquiry Section
* **Layout:** 2 columns on desktop.
* **Left Column (Get in Touch):** * Heading: "Contact & Inquiry"
    * List with icons: Location/Address, Phone Numbers, Email Address.
* **Right Column (Contact Form):**
    * Fields: Full Name, Contact Number, Required Service/Vehicle (Dropdown select), Message (Textarea).
    * Submit Button.
* **Dexie.js Integration:** When the form is submitted, use JavaScript and Dexie.js to save the inquiry object to a local IndexedDB database before showing a "Success" alert.

### 3.7. Footer
* **Layout:** Dark background (`bg-slate-900`), white/light gray text.
* **Content:** * Company Logo/Name.
    * Brief copyright text ("© 2026 DSK Transport Service").
    * Social Media Icons: Facebook and TikTok ONLY (Right aligned or centered).

## 4. Technical Implementation Steps for the Developer
1.  Initialize HTML5 boilerplate and add Tailwind CSS CDN.
2.  Set up Dexie.js script tag. Create a DB instance (`const db = new Dexie('DSK_DB'); db.version(1).stores({ inquiries: '++id, name, phone, service, message, date' });`).
3.  Build the Navbar and Hero sections first to establish the visual theme.
4.  Implement the CSS Grid for the Vehicle Cards ensuring responsiveness.
5.  Wire up the Contact Form to the Dexie.js database using an event listener on the form submit button. Prevent default form submission, grab values, save to DB, and clear the form.