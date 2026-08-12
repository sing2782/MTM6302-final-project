// =========================
// QUOTE.JS - Quote Calculator
// =========================

let currentQuoteData = null;

// Calculate quote on page load with default values
document.addEventListener('DOMContentLoaded', function() {
    calculateQuote();
    
    // Auto-calculate on input change
    const inputs = document.querySelectorAll('#quoteForm input, #quoteForm select');
    inputs.forEach(input => {
        input.addEventListener('change', calculateQuote);
        input.addEventListener('input', calculateQuote);
    });
});

function calculateQuote() {
    // Get values
    const rooms = parseInt(document.getElementById('rooms').value) || 1;
    const distance = parseFloat(document.getElementById('distance').value) || 0;
    const floor = parseInt(document.getElementById('floor').value) || 0;
    const stairs = parseInt(document.getElementById('stairs').value) || 0;
    const multipleFloors = parseInt(document.getElementById('multipleFloors').value) || 0;
    const elevator = parseInt(document.getElementById('elevator').value) || 0;
    const parking = parseInt(document.getElementById('parking').value) || 0;
    const walk = parseInt(document.getElementById('walk').value) || 0;
    
    // Validate
    if (distance <= 0 || floor < 0 || stairs < 0) {
        document.getElementById('price').textContent = '$0';
        document.getElementById('breakdown').innerHTML = '⚠️ Please enter valid values (distance > 0, floor >= 0, stairs >= 0)';
        document.getElementById('saveBtn').style.display = 'none';
        return;
    }
    
    // Calculate
    const basePrice = 150;
    const roomPrice = rooms * 120;
    const distancePrice = distance * 2;
    const floorPrice = floor * 45;
    const stairPrice = stairs * 3;
    const total = basePrice + roomPrice + distancePrice + floorPrice + 
                  stairPrice + multipleFloors + elevator + parking + walk;
    
    // Store for saving
    currentQuoteData = {
        rooms: rooms,
        distance: distance,
        floor: floor,
        stairs: stairs,
        multipleFloors: multipleFloors > 0,
        elevatorAccess: elevator < 0,
        parkingAvailable: parking === 0,
        longWalk: walk > 0,
        total: total
    };
    
    // Display
    document.getElementById('price').textContent = formatCurrency(total);
    document.getElementById('breakdown').innerHTML = `
        <strong>📊 Price Breakdown</strong><br>
        ─────────────────────────<br>
        Base Price: ${formatCurrency(basePrice)}<br>
        Rooms (${rooms}): ${formatCurrency(roomPrice)}<br>
        Distance (${distance}km): ${formatCurrency(distancePrice)}<br>
        Floor (${floor}): ${formatCurrency(floorPrice)}<br>
        Stairs (${stairs}): ${formatCurrency(stairPrice)}<br>
        ${multipleFloors > 0 ? `Multiple Floors: ${formatCurrency(multipleFloors)}<br>` : ''}
        ${elevator < 0 ? `Elevator Discount: ${formatCurrency(elevator)}<br>` : elevator > 0 ? `No Elevator: ${formatCurrency(elevator)}<br>` : ''}
        ${parking > 0 ? `No Parking: ${formatCurrency(parking)}<br>` : ''}
        ${walk > 0 ? `Long Walk: ${formatCurrency(walk)}<br>` : ''}
        ─────────────────────────<br>
        <strong style="color: #ffcc00; font-size: 18px;">Total: ${formatCurrency(total)}</strong>
    `;
    
    // Show save button
    document.getElementById('saveBtn').style.display = 'block';
    document.getElementById('quoteStatus').style.display = 'none';
}

async function saveQuote() {
    if (!currentQuoteData) {
        showQuoteStatus('No quote data to save. Calculate a quote first.', 'error');
        return;
    }
    
    // Get customer info
    const customerName = document.getElementById('customerName')?.value?.trim() || '';
    const customerEmail = document.getElementById('customerEmail')?.value?.trim() || '';
    
    // Add customer info to quote
    const quoteData = {
        ...currentQuoteData,
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: ''
    };
    
    const saveBtn = document.getElementById('saveBtn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/quotes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quoteData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to save quote');
        }
        
        showQuoteStatus(`✅ Quote saved successfully! ID: ${result.id || 'N/A'}`, 'success');
        saveBtn.textContent = '✅ Saved!';
        
    } catch (error) {
        console.error('Save quote error:', error);
        showQuoteStatus(`❌ Failed to save quote: ${error.message}`, 'error');
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
    }
}

function showQuoteStatus(message, type) {
    const statusEl = document.getElementById('quoteStatus');
    if (!statusEl) return;
    
    statusEl.textContent = message;
    statusEl.className = `quote-status ${type}`;
    statusEl.style.display = 'block';
    
    // Auto-hide after 5 seconds
    clearTimeout(statusEl._timeout);
    statusEl._timeout = setTimeout(() => {
        statusEl.style.display = 'none';
    }, 5000);
}

function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}