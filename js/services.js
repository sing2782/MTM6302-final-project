// =========================
// SERVICES.JS - Services Page
// =========================

document.addEventListener('DOMContentLoaded', function() {
    // Load detailed services
    loadDetailedServices();
});

async function loadDetailedServices() {
    try {
        const response = await fetch(`${API_BASE_URL}/services`);
        if (!response.ok) throw new Error('Failed to load services');
        
        const services = await response.json();
        renderDetailedServices(services);
    } catch (error) {
        console.error('Error loading services:', error);
        renderFallbackDetailedServices();
    }
}

function renderDetailedServices(services) {
    const grid = document.getElementById('serviceGrid');
    if (!grid) return;
    
    grid.innerHTML = services.map(service => `
        <div class="card" data-service="${service.id}">
            <div class="icon">${service.icon || '📦'}</div>
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            ${service.features ? `
                <ul class="service-features">
                    ${service.features.map(f => `<li>✓ ${f}</li>`).join('')}
                </ul>
            ` : ''}
        </div>
    `).join('');
}

function renderFallbackDetailedServices() {
    const fallbackServices = [
        {
            id: '1',
            icon: '📦',
            name: 'Packing & Unpacking',
            description: 'Professional packing and unpacking services using quality materials to protect your belongings.',
            features: ['Premium packing materials', 'Fragile item specialists', 'Furniture disassembly']
        },
        {
            id: '2',
            icon: '🏠',
            name: 'Full House Moves',
            description: 'Complete residential moving services for families and homeowners.',
            features: ['Same-day service', 'Furniture assembly', 'Room organization']
        },
        {
            id: '3',
            icon: '🏢',
            name: 'Apartment Moves',
            description: 'Fast and organized apartment moving with stair and elevator handling.',
            features: ['Elevator scheduling', 'Building coordination', 'Time-efficient']
        },
        {
            id: '4',
            icon: '💼',
            name: 'Office Moves',
            description: 'Secure office relocation for desks, computers, and equipment.',
            features: ['After-hours service', 'IT equipment handling', 'Office setup']
        },
        {
            id: '5',
            icon: '🚚',
            name: 'Long Distance Moves',
            description: 'Reliable long-distance moving services up to 500KM.',
            features: ['Vehicle tracking', 'Insurance coverage', 'Storage options']
        },
        {
            id: '6',
            icon: '🛋️',
            name: 'Furniture Protection',
            description: 'Furniture wrapping and protection services to prevent damage.',
            features: ['Custom wrapping', 'Anti-scratch covers', 'Climate control']
        }
    ];
    renderDetailedServices(fallbackServices);
}