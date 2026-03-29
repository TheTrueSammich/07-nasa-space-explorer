// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// NASA APOD API key (use DEMO_KEY for demo purposes)
const API_KEY = 'xoNrLgeCOS7RYg0XqGfxGq3rqluyzTlTdjHRkejL';
const API_URL = 'https://api.nasa.gov/planetary/apod';

// Find the button and gallery elements
const getImagesBtn = document.querySelector('button');
const gallery = document.getElementById('gallery');

// Function to fetch images from NASA API
async function fetchImages(startDate, endDate) {
	// Build the API URL with query parameters
	const url = `${API_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;
	const response = await fetch(url);
	const data = await response.json();
	return data;
}

// Function to clear the gallery
function clearGallery() {
	gallery.innerHTML = '';
}

// Function to create a gallery item
function createGalleryItem(item) {
	// Only show images (not videos)
	if (item.media_type !== 'image') return null;

	// Create the gallery item div
	const div = document.createElement('div');
	div.className = 'gallery-item';

	// Create the image element
	const img = document.createElement('img');
	img.src = item.url;
	img.alt = item.title;
	img.style.cursor = 'pointer';

	// Add click event to show modal
	img.addEventListener('click', () => {
		showModal(item);
	});

	// Add a simple title below the image
	const title = document.createElement('p');
	title.textContent = item.title;
	title.style.fontWeight = 'bold';

	div.appendChild(img);
	div.appendChild(title);
	return div;
}

// Function to display images in the gallery
function displayImages(items) {
	clearGallery();
	let hasImage = false;
	items.forEach(item => {
		const galleryItem = createGalleryItem(item);
		if (galleryItem) {
			gallery.appendChild(galleryItem);
			hasImage = true;
		}
	});
	if (!hasImage) {
		gallery.innerHTML = '<div class="placeholder"><div class="placeholder-icon">🚫</div><p>No images found for this date range.</p></div>';
	}
}

// Function to show a modal with image details
function showModal(item) {
	// Create modal background
	const modalBg = document.createElement('div');
	modalBg.style.position = 'fixed';
	modalBg.style.top = 0;
	modalBg.style.left = 0;
	modalBg.style.width = '100vw';
	modalBg.style.height = '100vh';
	modalBg.style.background = 'rgba(0,0,0,0.7)';
	modalBg.style.display = 'flex';
	modalBg.style.alignItems = 'center';
	modalBg.style.justifyContent = 'center';
	modalBg.style.zIndex = 1000;

	// Create modal content
	const modal = document.createElement('div');
	modal.style.background = 'linear-gradient(135deg, #000 0%, #6a1b9a 100%)';
	modal.style.padding = '20px';
	modal.style.borderRadius = '10px';
	modal.style.maxWidth = '90vw';
	modal.style.maxHeight = '90vh';
	modal.style.overflowY = 'auto';
	modal.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
	modal.style.textAlign = 'center';

	// Image
	const img = document.createElement('img');
	img.src = item.hdurl || item.url;
	img.alt = item.title;
	img.style.maxWidth = '100%';
	img.style.maxHeight = '400px';
	img.style.borderRadius = '6px';


	// Title and date
	const title = document.createElement('h2');
	title.innerHTML = `${item.title} <span style=\"display:block;font-size:1rem;font-weight:bold;color:#3f8efc;margin-top:6px;\">${item.date}</span>`;
	title.style.color = '#3f8efc'; // Lighter NASA blue
	title.style.fontWeight = 'bold';
	title.style.textAlign = 'center';

	// Description
	const desc = document.createElement('p');
	desc.textContent = item.explanation;
	desc.style.marginTop = '15px';
	desc.style.fontSize = '16px';
	desc.style.textAlign = 'center';
	desc.style.color = '#3f8efc'; // Lighter NASA blue
	desc.style.fontWeight = 'bold';

	// Close button
	const closeBtn = document.createElement('button');
	closeBtn.textContent = 'Close';
	closeBtn.style.marginTop = '20px';
	closeBtn.style.padding = '10px 20px';
	closeBtn.style.background = '#0b3d91';
	closeBtn.style.border = 'none';
	closeBtn.style.borderRadius = '4px';
	closeBtn.style.cursor = 'pointer';
	closeBtn.addEventListener('click', () => {
		document.body.removeChild(modalBg);
	});

	modal.appendChild(img);
	modal.appendChild(title);
	modal.appendChild(desc);
	modal.appendChild(closeBtn);
	modalBg.appendChild(modal);
	document.body.appendChild(modalBg);
}

// When the button is clicked, fetch and display images
getImagesBtn.addEventListener('click', async () => {
	// Get selected dates
	const startDate = startInput.value;
	const endDate = endInput.value;

	// Show loading message
	gallery.innerHTML = '<div class="placeholder"><div class="placeholder-icon">⏳</div><p>Loading images...</p></div>';

	try {
		const images = await fetchImages(startDate, endDate);
		displayImages(Array.isArray(images) ? images : [images]);
	} catch (error) {
		gallery.innerHTML = '<div class="placeholder"><div class="placeholder-icon">❌</div><p>Failed to load images. Please try again.</p></div>';
	}
});
