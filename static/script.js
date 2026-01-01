document.getElementById('predictionForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = this;
    const btn = document.getElementById('predictBtn');
    const btnText = btn.querySelector('span');
    const resultDiv = document.getElementById('result');
    const stressDisplay = document.getElementById('stressLevelDisplay');
    const predictionText = document.getElementById('predictionText');

    // UI Loading State
    const originalText = btnText.textContent;
    btnText.textContent = 'Processing Data...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    // Collect data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            resultDiv.classList.remove('hidden');

            // Remove previous classes
            stressDisplay.className = 'stress-badge';

            // Add tiny timeout for animation reset
            setTimeout(() => {
                stressDisplay.classList.add(`level-${result.stress_level}`);
                stressDisplay.textContent = result.prediction;
                predictionText.innerHTML = `Probability confidence: <strong>High</strong>. <br>Based on your metrics, your current stress level is ${result.stress_level}/4.`;

                // Recommendations for High Stress
                if (result.stress_level >= 3) {
                    const recDiv = document.createElement('div');
                    recDiv.className = 'recommendation-box';
                    recDiv.innerHTML = `
                        <h3><i class="fa-solid fa-user-doctor"></i> Personalized Recommendations for You</h3>
                        <p>Your stress levels appear elevated. Here are some immediate actions you can take:</p>
                        <ul>
                            <li><i class="fa-solid fa-moon"></i> <strong>Prioritize Sleep:</strong> Aim for at least 7-8 hours tonight.</li>
                            <li><i class="fa-solid fa-lungs"></i> <strong>Deep Breathing:</strong> Box breathing (4-4-4-4) for 5 minutes.</li>
                            <li><i class="fa-solid fa-person-walking"></i> <strong>Light Exercise:</strong> A 15-minute walk can lower cortisol.</li>
                            <li><i class="fa-solid fa-ban"></i> <strong>Limit Screen Time:</strong> Reduces cognitive load before bed.</li>
                        </ul>
                        
                        <div class="location-search-container">
                            <button id="findPlacesBtn" class="btn-secondary">
                                <i class="fa-solid fa-map-location-dot"></i> Find Nearest Stress Relief Places
                            </button>
                        </div>
                    `;
                    predictionText.appendChild(recDiv);

                    // Add event listener to the new button
                    document.getElementById('findPlacesBtn').addEventListener('click', function () {
                        const btn = this;
                        const container = document.querySelector('.location-search-container');

                        // Avoid duplicate searches
                        if (document.getElementById('placesGrid')) return;

                        const originalText = btn.innerHTML;
                        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Finding Best Spots...';

                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(async (position) => {
                                const lat = position.coords.latitude;
                                const lng = position.coords.longitude;

                                try {
                                    // Overpass API Query for Stress Relief Spots (Parks, Gardens, Yoga, Nature)
                                    // Searching within 3km (3000m) for better proximity relevance
                                    const radius = 5000;
                                    const query = `
                                        [out:json][timeout:25];
                                        (
                                          node["leisure"="park"](around:${radius},${lat},${lng});
                                          way["leisure"="park"](around:${radius},${lat},${lng});
                                          node["leisure"="garden"](around:${radius},${lat},${lng});
                                          way["leisure"="garden"](around:${radius},${lat},${lng});
                                          node["leisure"="nature_reserve"](around:${radius},${lat},${lng});
                                          way["leisure"="nature_reserve"](around:${radius},${lat},${lng});
                                          node["sport"="yoga"](around:${radius},${lat},${lng});
                                          node["amenity"="meditation_centre"](around:${radius},${lat},${lng});
                                        );
                                        out center 10;
                                    `;

                                    const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
                                    const data = await response.json();

                                    // Clear container loading state
                                    // wrapper
                                    const grid = document.createElement('div');
                                    grid.id = 'placesGrid';
                                    grid.className = 'places-grid';

                                    // Add Disclaimer
                                    const disclaimer = document.createElement('p');
                                    disclaimer.style.fontSize = '0.8rem';
                                    disclaimer.style.color = '#94a3b8';
                                    disclaimer.style.width = '100%';
                                    disclaimer.style.marginBottom = '1rem';
                                    disclaimer.innerHTML = `<i class="fa-solid fa-circle-info"></i> Showing results within ~5km of your detected location provided by your browser.`;
                                    container.appendChild(disclaimer);

                                    if (data.elements.length === 0) {
                                        grid.innerHTML = '<p class="no-places">No specific parks found nearby. Try searching broadly.</p>';
                                        const fallbackBtn = document.createElement('button');
                                        fallbackBtn.className = 'btn-secondary';
                                        fallbackBtn.innerText = 'Search on Maps Instead';
                                        fallbackBtn.onclick = () => window.open(`https://www.google.com/maps/search/parks+near+me/@${lat},${lng},13z`, '_blank');
                                        grid.appendChild(fallbackBtn);
                                    } else {
                                        data.elements.forEach((place, index) => {
                                            const name = place.tags?.name || "Unnamed Relaxation Spot";
                                            // Get lat/lon (node has lat/lon, way has center.lat/center.lon)
                                            const placeLat = place.lat || place.center.lat;
                                            const placeLon = place.lon || place.center.lon;

                                            // Create Card
                                            const card = document.createElement('div');
                                            card.className = 'place-card';

                                            // Random Nature Image (using picsum as placeholder)
                                            const imgId = 10 + index;
                                            const imgUrl = `https://picsum.photos/id/${imgId}/300/200`;

                                            card.innerHTML = `
                                                <img src="${imgUrl}" alt="${name}" onerror="this.src='https://via.placeholder.com/300x200?text=Nature+Spot'">
                                                <div class="place-info">
                                                    <h4>${name}</h4>
                                                    <p><i class="fa-solid fa-location-dot"></i> ~${(distance(lat, lng, placeLat, placeLon)).toFixed(1)} km away</p>
                                                    <a href="https://www.google.com/maps/dir/?api=1&destination=${placeLat},${placeLon}" target="_blank" class="direction-btn">
                                                        Get Directions <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                                    </a>
                                                </div>
                                            `;
                                            grid.appendChild(card);
                                        });
                                    }

                                    container.appendChild(grid);
                                    btn.innerHTML = '<i class="fa-solid fa-check"></i> Places Found';
                                    // btn.style.display = 'none'; // Optional: hide search button

                                } catch (err) {
                                    console.error(err);
                                    alert("Could not fetch detailed list. Redirecting to maps.");
                                    window.open(`https://www.google.com/maps/search/gardens+near+me/@${lat},${lng},13z`, '_blank');
                                    btn.innerHTML = originalText;
                                }

                            }, (error) => {
                                alert("Location access denied. Cannot find nearby places.");
                                btn.innerHTML = originalText;
                            });
                        } else {
                            alert("Geolocation not supported.");
                            btn.innerHTML = originalText;
                        }
                    });
                }

                // Helper: Haversine Distance
                function distance(lat1, lon1, lat2, lon2) {
                    const R = 6371; // km
                    const dLat = (lat2 - lat1) * Math.PI / 180;
                    const dLon = (lon2 - lon1) * Math.PI / 180;
                    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    return R * c;
                }

                // Smooth scroll
                resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 10);

        } else {
            throw new Error(result.error);
        }

    } catch (error) {
        alert('Analysis Failed: ' + error.message);
    } finally {
        // Reset Button
        setTimeout(() => {
            btnText.textContent = originalText;
            btn.disabled = false;
            btn.style.opacity = '1';
        }, 500);
    }
});
