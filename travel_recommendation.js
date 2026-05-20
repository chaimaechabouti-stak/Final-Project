// Travel Recommendation Search Functionality

async function searchDestinations() {
  const input = document.getElementById('searchInput').value.trim().toLowerCase();

  if (!input) {
    alert('Please enter a search term (e.g. beach, temple, or a country name).');
    return;
  }

  try {
    const response = await fetch('travel_recommendation_api.json');
    const data = await response.json();

    const resultsSection = document.getElementById('results-section');
    const resultsGrid = document.getElementById('results-grid');
    const resultsSubtitle = document.getElementById('results-subtitle');

    resultsGrid.innerHTML = '';
    let results = [];

    // Search for beaches
    if (input.includes('beach') || input.includes('beaches')) {
      data.beaches.forEach(beach => {
        results.push({
          name: beach.name,
          description: beach.description,
          imageUrl: beach.imageUrl,
          tag: 'Beach'
        });
      });
    }

    // Search for temples
    if (input.includes('temple') || input.includes('temples')) {
      data.temples.forEach(temple => {
        results.push({
          name: temple.name,
          description: temple.description,
          imageUrl: temple.imageUrl,
          tag: 'Temple'
        });
      });
    }

    // Search for countries
    data.countries.forEach(country => {
      if (input.includes(country.name.toLowerCase())) {
        country.cities.forEach(city => {
          results.push({
            name: city.name + ', ' + country.name,
            description: city.description,
            imageUrl: city.imageUrl,
            tag: 'City'
          });
        });
      }
    });

    // Display results
    if (results.length > 0) {
      resultsSubtitle.textContent = `Found ${results.length} result(s) for "${input}"`;
      results.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/600x220?text=${encodeURIComponent(item.name)}'"/>
          <div class="card-body">
            <span class="card-tag">${item.tag}</span>
            <h3>${item.name}</h3>
            <p>${item.description}</p>
          </div>
        `;
        resultsGrid.appendChild(card);
      });

      resultsSection.classList.add('visible');
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      resultsSubtitle.textContent = `No results found for "${input}". Try "beach", "temple", "Brazil", or "Australia".`;
      resultsSection.classList.add('visible');
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Could not load travel data. Please try again.');
  }
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  const resultsSection = document.getElementById('results-section');
  resultsSection.classList.remove('visible');
  document.getElementById('results-grid').innerHTML = '';
}

// Allow pressing Enter to search
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') searchDestinations();
    });
  }
});
