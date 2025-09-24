// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()

// Airbnb-style Search Bar Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Search bar elements
    const searchBar = document.getElementById('searchBar');
    const locationInput = document.getElementById('location');
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    const guestsInput = document.getElementById('guests');
    const mobileSearchBtn = document.querySelector('.mobile-search-btn');
    
    // Search state
    let searchState = {
        location: '',
        checkin: null,
        checkout: null,
        guests: {
            adults: 1,
            children: 0,
            infants: 0
        }
    };

    // Popular destinations for location suggestions
    const popularDestinations = [
        'Mumbai, India',
        'Delhi, India', 
        'Bangalore, India',
        'Goa, India',
        'Jaipur, India',
        'Kerala, India',
        'Manali, India',
        'Udaipur, India'
    ];

    // Location autocomplete functionality
    if (locationInput) {
        let locationSuggestions = null;
        
        locationInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            
            // Remove existing suggestions
            if (locationSuggestions) {
                locationSuggestions.remove();
            }
            
            if (query.length > 0) {
                const matches = popularDestinations.filter(dest => 
                    dest.toLowerCase().includes(query)
                );
                
                if (matches.length > 0) {
                    locationSuggestions = createLocationSuggestions(matches);
                    locationInput.parentNode.appendChild(locationSuggestions);
                }
            }
        });

        locationInput.addEventListener('blur', function() {
            // Delay removal to allow clicking on suggestions
            setTimeout(() => {
                if (locationSuggestions) {
                    locationSuggestions.remove();
                    locationSuggestions = null;
                }
            }, 200);
        });
    }

    // Date picker functionality (simplified)
    if (checkinInput) {
        checkinInput.addEventListener('click', function() {
            // For now, use browser's date input
            const tempInput = document.createElement('input');
            tempInput.type = 'date';
            tempInput.style.position = 'absolute';
            tempInput.style.left = '-9999px';
            document.body.appendChild(tempInput);
            
            tempInput.addEventListener('change', function() {
                const selectedDate = new Date(this.value);
                checkinInput.value = formatDate(selectedDate);
                searchState.checkin = selectedDate;
                document.body.removeChild(tempInput);
            });
            
            tempInput.click();
        });
    }

    if (checkoutInput) {
        checkoutInput.addEventListener('click', function() {
            const tempInput = document.createElement('input');
            tempInput.type = 'date';
            tempInput.style.position = 'absolute';
            tempInput.style.left = '-9999px';
            document.body.appendChild(tempInput);
            
            tempInput.addEventListener('change', function() {
                const selectedDate = new Date(this.value);
                checkoutInput.value = formatDate(selectedDate);
                searchState.checkout = selectedDate;
                document.body.removeChild(tempInput);
            });
            
            tempInput.click();
        });
    }

    // Guests counter functionality
    if (guestsInput) {
        let guestsDropdown = null;
        
        guestsInput.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (guestsDropdown) {
                guestsDropdown.remove();
                guestsDropdown = null;
                return;
            }
            
            guestsDropdown = createGuestsDropdown();
            guestsInput.parentNode.appendChild(guestsDropdown);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (guestsDropdown && !guestsDropdown.contains(e.target) && e.target !== guestsInput) {
                guestsDropdown.remove();
                guestsDropdown = null;
            }
        });
    }

    // Mobile search button
    if (mobileSearchBtn) {
        mobileSearchBtn.addEventListener('click', function() {
            // For mobile, redirect to search page or show modal
            window.location.href = '/listings';
        });
    }

    // Helper functions
    function createLocationSuggestions(suggestions) {
        const container = document.createElement('div');
        container.className = 'location-suggestions';
        container.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-height: 200px;
            overflow-y: auto;
        `;
        
        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = suggestion;
            item.style.cssText = `
                padding: 12px 16px;
                cursor: pointer;
                border-bottom: 1px solid #f0f0f0;
                transition: background-color 0.2s;
            `;
            
            item.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#f7f7f7';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'white';
            });
            
            item.addEventListener('click', function() {
                locationInput.value = suggestion;
                searchState.location = suggestion;
                container.remove();
            });
            
            container.appendChild(item);
        });
        
        return container;
    }

    function createGuestsDropdown() {
        const container = document.createElement('div');
        container.className = 'guests-dropdown';
        container.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            padding: 16px;
            min-width: 320px;
        `;
        
        const guestTypes = [
            { key: 'adults', label: 'Adults', sublabel: 'Ages 13 or above' },
            { key: 'children', label: 'Children', sublabel: 'Ages 2-12' },
            { key: 'infants', label: 'Infants', sublabel: 'Under 2' }
        ];
        
        guestTypes.forEach(type => {
            const row = document.createElement('div');
            row.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid #f0f0f0;
            `;
            
            const info = document.createElement('div');
            info.innerHTML = `
                <div style="font-weight: 500; color: #484848;">${type.label}</div>
                <div style="font-size: 14px; color: #767676;">${type.sublabel}</div>
            `;
            
            const controls = document.createElement('div');
            controls.style.cssText = 'display: flex; align-items: center; gap: 12px;';
            
            const minusBtn = document.createElement('button');
            minusBtn.textContent = '-';
            minusBtn.style.cssText = `
                width: 32px;
                height: 32px;
                border: 1px solid #ddd;
                border-radius: 50%;
                background: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            const count = document.createElement('span');
            count.textContent = searchState.guests[type.key];
            count.style.cssText = 'min-width: 20px; text-align: center;';
            
            const plusBtn = document.createElement('button');
            plusBtn.textContent = '+';
            plusBtn.style.cssText = `
                width: 32px;
                height: 32px;
                border: 1px solid #ddd;
                border-radius: 50%;
                background: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            minusBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (searchState.guests[type.key] > 0) {
                    if (type.key === 'adults' && searchState.guests[type.key] === 1) return;
                    searchState.guests[type.key]--;
                    count.textContent = searchState.guests[type.key];
                    updateGuestsInput();
                }
            });
            
            plusBtn.addEventListener('click', function(e) {
                e.preventDefault();
                searchState.guests[type.key]++;
                count.textContent = searchState.guests[type.key];
                updateGuestsInput();
            });
            
            controls.appendChild(minusBtn);
            controls.appendChild(count);
            controls.appendChild(plusBtn);
            
            row.appendChild(info);
            row.appendChild(controls);
            container.appendChild(row);
        });
        
        return container;
    }

    function updateGuestsInput() {
        const total = searchState.guests.adults + searchState.guests.children;
        let text = `${total} guest${total !== 1 ? 's' : ''}`;
        if (searchState.guests.infants > 0) {
            text += `, ${searchState.guests.infants} infant${searchState.guests.infants !== 1 ? 's' : ''}`;
        }
        guestsInput.value = text;
    }

    function formatDate(date) {
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Initialize guests input
    if (guestsInput) {
        updateGuestsInput();
    }

    // Property Card Interactions
    initializePropertyCards();

    function initializePropertyCards() {
        // Favorite button functionality
        const favoriteButtons = document.querySelectorAll('.favorite-btn');
        favoriteButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const icon = this.querySelector('i');
                const isActive = this.classList.contains('active');
                
                if (isActive) {
                    this.classList.remove('active');
                    icon.className = 'fa-regular fa-heart';
                } else {
                    this.classList.add('active');
                    icon.className = 'fa-solid fa-heart';
                }
                
                // Add a small animation
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });

        // Property card hover effects
        const propertyCards = document.querySelectorAll('.property-card');
        propertyCards.forEach(card => {
            const favoriteBtn = card.querySelector('.favorite-btn');
            
            card.addEventListener('mouseenter', function() {
                if (favoriteBtn) {
                    favoriteBtn.style.opacity = '1';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                if (favoriteBtn) {
                    favoriteBtn.style.opacity = '0.8';
                }
            });
        });

        // Image carousel functionality (basic implementation)
        const imageContainers = document.querySelectorAll('.property-image-container');
        imageContainers.forEach(container => {
            const image = container.querySelector('.property-image');
            const indicators = container.querySelector('.image-indicators');
            
            // For now, just add a subtle zoom effect on hover
            container.addEventListener('mouseenter', function() {
                image.style.transform = 'scale(1.05)';
            });
            
            container.addEventListener('mouseleave', function() {
                image.style.transform = 'scale(1)';
            });
        });
    }

    // Filter Bar Functionality
    initializeFilterBar();

    function initializeFilterBar() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const propertyCards = document.querySelectorAll('.property-card');
        
        // Filter button click handlers
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Filter property cards (basic implementation)
                propertyCards.forEach(card => {
                    if (filterValue === 'all') {
                        card.style.display = 'block';
                    } else {
                        // For now, show all cards - in a real implementation,
                        // you would filter based on property categories
                        card.style.display = 'block';
                    }
                });
                
                // Add smooth scroll animation for mobile
                if (window.innerWidth <= 768) {
                    this.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest', 
                        inline: 'center' 
                    });
                }
            });
        });

        // Horizontal scroll for filter bar on mobile
        const filterScrollContainer = document.querySelector('.filter-scroll-container');
        if (filterScrollContainer) {
            let isScrolling = false;
            
            filterScrollContainer.addEventListener('wheel', function(e) {
                if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                    e.preventDefault();
                    this.scrollLeft += e.deltaX;
                }
            });
            
            // Touch scrolling for mobile
            let startX = 0;
            let scrollLeft = 0;
            
            filterScrollContainer.addEventListener('touchstart', function(e) {
                startX = e.touches[0].pageX - this.offsetLeft;
                scrollLeft = this.scrollLeft;
            });
            
            filterScrollContainer.addEventListener('touchmove', function(e) {
                if (!startX) return;
                e.preventDefault();
                const x = e.touches[0].pageX - this.offsetLeft;
                const walk = (x - startX) * 2;
                this.scrollLeft = scrollLeft - walk;
            });
            
            filterScrollContainer.addEventListener('touchend', function() {
                startX = 0;
            });
        }
    }
});

// Wishlist functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle Save button clicks (heart icon in listing details)
    const saveButtons = document.querySelectorAll('.save-btn');
    saveButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const listingId = this.getAttribute('data-listing-id');
            toggleWishlist(listingId, this);
        });
    });

    // Handle Reserve button clicks
    const reserveButtons = document.querySelectorAll('.reserve-btn');
    reserveButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const listingId = this.getAttribute('data-listing-id');
            addToWishlist(listingId, this);
        });
    });

    // Handle remove from wishlist buttons on wishlist page
    const removeWishlistButtons = document.querySelectorAll('.remove-wishlist');
    removeWishlistButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const listingId = this.getAttribute('data-listing-id');
            removeFromWishlist(listingId, this);
        });
    });

    function addToWishlist(listingId, button) {
        fetch(`/wishlists/${listingId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update button appearance
                button.innerHTML = 'Added to Wishlist!';
                button.style.backgroundColor = '#28a745';
                button.style.borderColor = '#28a745';
                
                // Show success message
                showNotification('Added to wishlist!', 'success');
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    button.innerHTML = 'Reserve';
                    button.style.backgroundColor = '#ff385c';
                    button.style.borderColor = '#ff385c';
                }, 2000);
            } else {
                showNotification(data.message || 'Already in wishlist', 'info');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Please login to add to wishlist', 'error');
        });
    }

    function toggleWishlist(listingId, button) {
        const icon = button.querySelector('i');
        const isActive = icon.classList.contains('fa-solid');
        
        if (isActive) {
            // Remove from wishlist
            removeFromWishlist(listingId, button);
        } else {
            // Add to wishlist
            fetch(`/wishlists/${listingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    icon.className = 'fa-solid fa-heart';
                    button.style.color = '#ff385c';
                    showNotification('Added to wishlist!', 'success');
                } else {
                    showNotification(data.message || 'Already in wishlist', 'info');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Please login to add to wishlist', 'error');
            });
        }
    }

    function removeFromWishlist(listingId, button) {
        fetch(`/wishlists/${listingId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // If on wishlist page, remove the card
                if (button.classList.contains('remove-wishlist')) {
                    const card = button.closest('.col-md-4');
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.remove();
                        // Check if no more items
                        const remainingCards = document.querySelectorAll('.listing-card').length;
                        if (remainingCards === 0) {
                            location.reload(); // Reload to show empty state
                        }
                    }, 300);
                } else {
                    // If on listing details page, update heart icon
                    const icon = button.querySelector('i');
                    if (icon) {
                        icon.className = 'fa-regular fa-heart';
                        button.style.color = '';
                    }
                }
                showNotification('Removed from wishlist', 'success');
            } else {
                showNotification('Error removing from wishlist', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error removing from wishlist', 'error');
        });
    }

    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.backgroundColor = '#28a745';
                break;
            case 'error':
                notification.style.backgroundColor = '#dc3545';
                break;
            case 'info':
                notification.style.backgroundColor = '#17a2b8';
                break;
            default:
                notification.style.backgroundColor = '#6c757d';
        }

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
});