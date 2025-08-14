# Design Document

## Overview

This design transforms the current navbar and home page to match Airbnb's modern interface, focusing on the signature search experience, clean visual design, and improved property presentation. The design emphasizes usability, visual hierarchy, and responsive behavior across all devices.

## Architecture

### Component Structure
```
Navbar Component
├── Logo Section
├── Search Bar Component
│   ├── Location Input
│   ├── Check-in Date Picker
│   ├── Check-out Date Picker
│   ├── Guests Counter
│   └── Search Button
└── User Menu Component
    ├── Become a Host Link
    ├── User Profile Menu
    └── Authentication Links

Home Page Component
├── Filter Bar Component
├── Property Grid Component
│   └── Property Card Components
│       ├── Image Carousel
│       ├── Property Info
│       ├── Rating Display
│       └── Price Display
└── Search Results Component
```

### Design System

#### Color Palette
- Primary Brand: #FF5A5F (Airbnb Red)
- Secondary: #00A699 (Teal accent)
- Text Primary: #484848 (Dark Gray)
- Text Secondary: #767676 (Medium Gray)
- Background: #FFFFFF (White)
- Border: #DDDDDD (Light Gray)
- Hover States: #E31C23 (Darker Red)

#### Typography
- Primary Font: Circular, -apple-system, BlinkMacSystemFont, Roboto, sans-serif
- Headings: 600-700 weight
- Body Text: 400 weight
- Small Text: 300-400 weight

## Components and Interfaces

### Navbar Component

#### Search Bar Design
The search bar will be the centerpiece of the navbar, featuring:

**Collapsed State:**
- Rounded pill-shaped container with white background
- Shadow: 0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)
- Three sections: "Where", "When", "Who" with dividers
- Compact search icon button on the right

**Expanded State:**
- Larger container with individual input fields
- Location autocomplete with popular destinations
- Date picker with calendar interface
- Guest counter with +/- controls for adults, children, infants
- Large red search button

#### Logo Section
- Airbnb logo (custom or similar icon) positioned on the left
- Clickable link to home page
- Maintains brand recognition

#### User Menu Section
- "Become a Host" link (when not logged in)
- Hamburger menu icon with user avatar
- Dropdown menu with user options

### Property Card Component

#### Card Structure
```
Card Container (hover effects)
├── Image Section
│   ├── Image Carousel (multiple photos)
│   ├── Heart Icon (favorites)
│   └── Image Indicators
├── Property Info Section
│   ├── Location & Title
│   ├── Rating & Reviews Count
│   ├── Property Type & Amenities
│   └── Price Section
│       ├── Price per night
│       └── Total price (optional)
```

#### Visual Design
- Rounded corners (8px border-radius)
- No border, clean white background
- Subtle hover elevation
- Image aspect ratio: 4:3
- Consistent spacing and typography

### Filter Bar Component

#### Filter Categories
- Trending, Rooms, Iconic Cities, Mountains, Pools, Castles, Beaches, etc.
- Horizontal scrollable on mobile
- Active state highlighting
- Icon + text format

## Data Models

### Search State Model
```javascript
{
  location: {
    query: string,
    coordinates: { lat: number, lng: number },
    suggestions: Array<LocationSuggestion>
  },
  dates: {
    checkIn: Date | null,
    checkOut: Date | null,
    flexibility: string
  },
  guests: {
    adults: number,
    children: number,
    infants: number
  },
  filters: {
    category: string,
    priceRange: { min: number, max: number },
    amenities: Array<string>
  }
}
```

### Property Card Model
```javascript
{
  id: string,
  images: Array<{ url: string, alt: string }>,
  title: string,
  location: string,
  rating: number,
  reviewCount: number,
  propertyType: string,
  price: {
    amount: number,
    currency: string,
    period: string
  },
  amenities: Array<string>,
  isFavorite: boolean
}
```

## Error Handling

### Search Functionality
- Invalid date ranges: Display inline error messages
- Location not found: Show "No results found" with suggestions
- Network errors: Graceful fallback with retry options
- Empty search results: Display helpful message with filter suggestions

### Image Loading
- Lazy loading for property images
- Placeholder images during loading
- Fallback for broken images
- Progressive image enhancement

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Testing Strategy

### Unit Testing
- Search component state management
- Date picker functionality
- Guest counter logic
- Filter application
- Property card rendering

### Integration Testing
- Search flow end-to-end
- Filter interaction with property display
- Responsive behavior across breakpoints
- User authentication flow

### Visual Testing
- Component visual regression
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility compliance

### Performance Testing
- Image loading optimization
- Search response times
- Smooth animations and transitions
- Bundle size optimization

## Implementation Considerations

### CSS Framework Integration
- Maintain Bootstrap compatibility where possible
- Custom CSS for Airbnb-specific styling
- CSS Grid and Flexbox for layouts
- CSS custom properties for theming

### JavaScript Enhancements
- Vanilla JavaScript for search interactions
- Event delegation for performance
- Debounced search input
- Smooth scrolling and animations

### Accessibility
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance (WCAG 2.1 AA)

### SEO Considerations
- Semantic HTML structure
- Proper heading hierarchy
- Meta tags for property pages
- Structured data for properties