import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getCompatibleBloodTypes, calculateDistance } from '../../hooks/useGeo';
import BloodRequestForm from './BloodRequestForm';
import { useNavigate } from 'react-router-dom';

const DonorSearch = () => {
    const [bloodType, setBloodType] = useState('');
    const [maxDistance, setMaxDistance] = useState(10);
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userPos, setUserPos] = useState(null);
    const [requestingDonor, setRequestingDonor] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => console.error("Geo error", err)
        );
    }, []);

    const handleSearch = async () => {
        if (!bloodType) return;
        setLoading(true);

        try {
            const compatibleTypes = getCompatibleBloodTypes(bloodType);

            // Basic query for active/approved donors with compatible blood types
            const q = query(
                collection(db, "users"),
                where("role", "==", "donor"),
                where("status", "==", "approved"),
                where("availabilityStatus", "==", "active"),
                where("bloodType", "in", compatibleTypes)
            );

            const querySnapshot = await getDocs(q);
            const results = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (userPos && data.location) {
                    const dist = calculateDistance(
                        userPos.lat, userPos.lng,
                        data.location.lat, data.location.lng
                    );
                    if (dist <= maxDistance) {
                        results.push({ id: doc.id, ...data, distance: dist.toFixed(1) });
                    }
                } else {
                    // If no user location, just show all (might need refinement)
                    results.push({ id: doc.id, ...data, distance: 'Unknown' });
                }
            });

            setDonors(results.sort((a, b) => a.distance - b.distance));
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-page fade-in">
            <header className="section-header">
                <h2>Find Donors</h2>
                <p>Discover matches within your area</p>
            </header>

            <div className="search-filter card">
                <div className="filter-group">
                    <label>Required Blood Type</label>
                    <select value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
                        <option value="">Select Type</option>
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
                <div className="filter-group">
                    <label>Max Distance: {maxDistance}km</label>
                    <input
                        type="range"
                        min="1" max="50"
                        value={maxDistance}
                        onChange={(e) => setMaxDistance(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" onClick={handleSearch} disabled={loading || !bloodType}>
                    {loading ? 'Searching...' : 'Search Donors'}
                </button>
            </div>

            <div className="results-list">
                <h4>{donors.length} Potential Matches Found</h4>
                {donors.map(donor => (
                    <div key={donor.id} className="donor-card card fade-in">
                        <div className="donor-info">
                            <span className="blood-badge">{donor.bloodType}</span>
                            <div className="donor-details">
                                <strong>{donor.fullName}</strong>
                                <span>{donor.distance} km away</span>
                            </div>
                        </div>
                        <button className="btn-chat" onClick={() => setRequestingDonor(donor)}>🩸</button>
                    </div>
                ))}
                {donors.length === 0 && !loading && (
                    <div className="empty-state">
                        <p>No active donors found in this range. Try increasing the distance.</p>
                    </div>
                )}
            </div>

            {requestingDonor && (
                <BloodRequestForm
                    donor={requestingDonor}
                    onClose={() => setRequestingDonor(null)}
                    onSuccess={(chatId) => navigate(`/chat/${chatId}`)}
                />
            )}

            <style>{`
        .search-filter { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
        .filter-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .filter-group select { padding: 0.75rem; border-radius: var(--radius-sm); border: 1.5px solid var(--border-color); }
        .filter-group input[type="range"] { accent-color: var(--primary-red); }
        
        .donor-card { display: flex; justify-content: space-between; align-items: center; padding: 1rem; }
        .donor-info { display: flex; align-items: center; gap: 1rem; }
        .blood-badge { 
          width: 45px; height: 45px; background: var(--primary-red); color: white;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%; font-weight: 800; font-size: 1.1rem;
        }
        .donor-details { display: flex; flex-direction: column; gap: 0.1rem; }
        .donor-details strong { font-size: 1rem; }
        .donor-details span { font-size: 0.8rem; color: var(--text-light); }
        .btn-chat { background: var(--bg-light); border: none; font-size: 1.25rem; cursor: pointer; padding: 0.5rem; border-radius: 50%; width: 45px; height: 45px; }
        .empty-state { text-align: center; color: var(--text-light); padding: 2rem; }
      `}</style>
        </div>
    );
};

export default DonorSearch;
