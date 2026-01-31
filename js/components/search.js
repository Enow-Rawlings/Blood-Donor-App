import { getCurrentLocation, calculateDistance, getCompatibleDonors } from '../utils/geo.js';

export function renderDonorSearch() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="search-page fade-in">
            <header class="section-header">
                <h2>Find Donors</h2>
                <p>Nearby life-savers</p>
            </header>

            <div class="search-filters card">
                <div class="form-group">
                    <label>Blood Type Needed</label>
                    <select id="search-blood-type" class="blood-type-select">
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>
                <div class="form-group" style="margin-top: 1rem;">
                    <label>Distance Radius</label>
                    <select id="search-radius">
                        <option value="5">Within 5 km</option>
                        <option value="10" selected>Within 10 km</option>
                        <option value="25">Within 25 km</option>
                        <option value="50">Within 50 km</option>
                    </select>
                </div>
                <button class="btn btn-primary" id="btn-perform-search" style="margin-top: 1.5rem;">Search Nearby</button>
            </div>

            <div id="search-results" class="results-container">
                <!-- Results will appear here -->
                <div class="empty-state">
                    <p>Enter criteria to find compatible donors</p>
                </div>
            </div>
        </div>
    `;

    // Add styles for search
    if (!document.getElementById('search-styles')) {
        const style = document.createElement('style');
        style.id = 'search-styles';
        style.innerHTML = `
            .results-container { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
            .donor-card { padding: 1rem; border-left: 5px solid var(--primary-red); }
            .donor-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
            .donor-info h4 { margin: 0; color: var(--primary-red); }
            .donor-distance { font-size: 0.85rem; color: var(--text-medium); font-weight: 600; }
            .donor-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; border-top: 1px solid var(--border-color); padding-top: 0.75rem; }
            .donor-status { font-size: 0.8rem; padding: 0.2rem 0.6rem; border-radius: 20px; font-weight: 500; }
            .status-active { background: #E8F5E9; color: #2E7D32; }
            .btn-request { padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; border: none; background: var(--primary-red); color: white; }
            .empty-state { text-align: center; color: var(--text-light); padding: 3rem 0; }
        `;
        document.head.appendChild(style);
    }

    document.getElementById('btn-perform-search').addEventListener('click', async () => {
        const resultsHeader = document.getElementById('search-results');
        resultsHeader.innerHTML = '<div class="loader-container"><div class="blood-drop-loader"></div><p>Locating compatible donors...</p></div>';

        // Mock Search logic
        const selectedType = document.getElementById('search-blood-type').value;
        const compatibleTypes = getCompatibleDonors(selectedType);
        
        // Simulating delay
        setTimeout(() => {
            renderMockResults(selectedType, compatibleTypes);
        }, 1200);
    });
}

function renderMockResults(targetType, compatibleTypes) {
    const container = document.getElementById('search-results');
    
    // Mock data
    const mockDonors = [
        { id: '4521', type: 'O-', distance: 1.2, active: true },
        { id: '8829', type: compatibleTypes[0] || 'A+', distance: 3.5, active: true },
        { id: '1092', type: targetType, distance: 5.8, active: true }
    ];

    if (mockDonors.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No compatible donors found in this range.</p></div>';
        return;
    }

    container.innerHTML = mockDonors.map(donor => `
        <div class="donor-card card">
            <div class="donor-header">
                <div class="donor-info">
                    <h4>Donor #${donor.id}</h4>
                    <p style="font-size: 0.9rem;">Blood Type: <strong style="color: var(--primary-red)">${donor.type}</strong></p>
                </div>
                <div class="donor-distance">${donor.distance} km away</div>
            </div>
            <div class="donor-footer">
                <span class="donor-status status-active">● Active Now</span>
                <button class="btn-request" onclick="alert('Request sent to Donor #${donor.id}!')">Send Request</button>
            </div>
        </div>
    `).join('');
}
