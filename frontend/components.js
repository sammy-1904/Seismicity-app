// components.js - UI components for the seismicity analysis app

/**
 * Create the main application UI
 */
function createAppUI() {
  return `
    <div class="bg-gray-900 text-white p-6 rounded-lg shadow-xl">
      <!-- Loading Indicator -->
      <div id="csv-loading" class="text-center p-8">
        <i class="fa fa-spinner fa-spin fa-3x text-blue-500"></i>
        <p class="mt-4 text-lg">Loading earthquake catalogue...</p>
      </div>

      <!-- Main Content -->
      <div id="main-content" style="display: none;">
        <!-- Search Parameters -->
        <div class="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 class="text-2xl font-bold mb-4 text-blue-400">Search Parameters</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Latitude</label>
              <input type="number" id="latitude" step="0.01" 
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value="36.17">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Longitude</label>
              <input type="number" id="longitude" step="0.01"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value="-115.14">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Search Radius (km)</label>
              <input type="number" id="maxradiuskm" step="10" min="10"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value="500">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Minimum Magnitude</label>
              <input type="number" id="minmagnitude" step="0.1" min="0"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value="5.0">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Start Date</label>
              <input type="date" id="starttime"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value="1904-01-01">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">End Date</label>
              <input type="date" id="endtime"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value="2021-12-31">
            </div>
          </div>
          
          <div class="mt-4">
            <button id="search-btn" 
              class="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
              <i class="fa fa-search mr-2"></i> Search Earthquakes
            </button>
          </div>
        </div>

        <!-- Results Summary -->
        <div id="results-summary" class="bg-gray-800 p-4 rounded-lg mb-6" style="display: none;">
          <div class="flex items-center justify-between">
            <span class="text-lg font-semibold">
              <i class="fa fa-check-circle text-green-500 mr-2"></i>
              <span id="results-count">0</span> earthquakes found
            </span>
            <div id="loading-indicator" style="display: none;">
              <i class="fa fa-spinner fa-spin text-blue-500 mr-2"></i>
              Searching...
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="mb-6">
          <ul class="flex flex-wrap border-b border-gray-700">
            <li class="mr-2">
              <button class="tab-btn active inline-block px-6 py-3 rounded-t-lg" data-tab="map">
                <i class="fa fa-map-marker mr-2"></i>Map
              </button>
            </li>
            <li class="mr-2">
              <button class="tab-btn inline-block px-6 py-3 rounded-t-lg" data-tab="gr">
                <i class="fa fa-line-chart mr-2"></i>G-R Plot
              </button>
            </li>
            <li class="mr-2">
              <button class="tab-btn inline-block px-6 py-3 rounded-t-lg" data-tab="depth">
                <i class="fa fa-bar-chart mr-2"></i>Depth Distribution
              </button>
            </li>
            <li class="mr-2">
              <button class="tab-btn inline-block px-6 py-3 rounded-t-lg" data-tab="temporal">
                <i class="fa fa-calendar mr-2"></i>Temporal Analysis
              </button>
            </li>
            <li class="mr-2">
              <button class="tab-btn inline-block px-6 py-3 rounded-t-lg" data-tab="magnitude">
                <i class="fa fa-signal mr-2"></i>Magnitude Distribution
              </button>
            </li>
          </ul>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <div id="map-tab" class="tab-pane active">
            <div class="bg-gray-800 p-4 rounded-lg">
              <div class="mb-4">
                <label class="inline-flex items-center mr-4">
                  <input type="radio" name="mapType" value="terrain" checked class="form-radio text-blue-600">
                  <span class="ml-2">Terrain</span>
                </label>
                <label class="inline-flex items-center mr-4">
                  <input type="radio" name="mapType" value="satellite" class="form-radio text-blue-600">
                  <span class="ml-2">Satellite</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" name="mapType" value="street" class="form-radio text-blue-600">
                  <span class="ml-2">Street</span>
                </label>
              </div>
              <div id="map" style="height: 600px; width: 100%; border-radius: 8px;"></div>
            </div>
          </div>

          <div id="gr-tab" class="tab-pane" style="display: none;">
            <div class="bg-gray-800 p-4 rounded-lg">
              <h3 class="text-xl font-bold mb-4 text-blue-400">Gutenberg-Richter Relationship</h3>
              <div id="gr-stats" class="mb-4 p-4 bg-gray-700 rounded-lg"></div>
              <div style="height: 500px;">
                <canvas id="gr-chart"></canvas>
              </div>
            </div>
          </div>

          <div id="depth-tab" class="tab-pane" style="display: none;">
            <div class="bg-gray-800 p-4 rounded-lg">
              <h3 class="text-xl font-bold mb-4 text-blue-400">Depth Distribution</h3>
              <div style="height: 500px;">
                <canvas id="depth-chart"></canvas>
              </div>
            </div>
          </div>

          <div id="temporal-tab" class="tab-pane" style="display: none;">
            <div class="bg-gray-800 p-4 rounded-lg">
              <h3 class="text-xl font-bold mb-4 text-blue-400">Temporal Analysis</h3>
              <div style="height: 500px;">
                <canvas id="temporal-chart"></canvas>
              </div>
            </div>
          </div>

          <div id="magnitude-tab" class="tab-pane" style="display: none;">
            <div class="bg-gray-800 p-4 rounded-lg">
              <h3 class="text-xl font-bold mb-4 text-blue-400">Magnitude Distribution</h3>
              <div style="height: 500px;">
                <canvas id="magnitude-chart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Create quiz UI
 */
function createQuizUI(quizId) {
  const questions = getQuizQuestions(quizId);
  
  let html = `
    <div class="quiz-container">
      <h3 class="text-2xl font-bold mb-6">Test Your Knowledge</h3>
      <form id="${quizId}-form">
  `;

  questions.forEach((q, index) => {
    html += `
      <div class="question-block mb-6 p-4 bg-gray-100 rounded-lg">
        <p class="font-semibold mb-3">${index + 1}. ${q.question}</p>
        ${q.options.map((option, optIndex) => `
          <div class="mb-2">
            <label class="flex items-center">
              <input type="radio" name="q${index}" value="${optIndex}" class="mr-2">
              <span>${option}</span>
            </label>
          </div>
        `).join('')}
      </div>
    `;
  });

  html += `
        <button type="submit" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
          Submit Answers
        </button>
      </form>
      <div id="${quizId}-results" class="mt-6" style="display: none;"></div>
    </div>
  `;

  return html;
}

/**
 * Get quiz questions
 */
function getQuizQuestions(quizId) {
  // Pre-test: Basic foundational knowledge
  const pretestQuestions = [
    {
      question: "What does the Gutenberg-Richter law describe?",
      options: [
        "The depth distribution of earthquakes",
        "The frequency-magnitude relationship of earthquakes",
        "The geographic distribution of earthquakes",
        "The temporal occurrence of earthquakes"
      ],
      correct: 1
    },
    {
      question: "What is the typical value of the 'b' parameter in the Gutenberg-Richter relationship?",
      options: [
        "Approximately 0.5",
        "Approximately 1.0",
        "Approximately 2.0",
        "Approximately 5.0"
      ],
      correct: 1
    },
    {
      question: "Shallow earthquakes are typically classified as occurring at depths of:",
      options: [
        "0-30 km",
        "0-70 km",
        "0-100 km",
        "0-200 km"
      ],
      correct: 1
    },
    {
      question: "The ISC-GEM catalogue primarily contains earthquakes with magnitudes:",
      options: [
        "≥ 3.0",
        "≥ 4.5",
        "≥ 5.5",
        "≥ 7.0"
      ],
      correct: 2
    },
    {
      question: "Where do most earthquakes occur?",
      options: [
        "Randomly across the globe",
        "Along plate boundaries",
        "In the ocean centers",
        "Near mountain peaks"
      ],
      correct: 1
    }
  ];

  // Post-test: Application-based questions
  const posttestQuestions = [
    {
      question: "If a region has a b-value of 1.2, what does this indicate compared to a region with b-value of 0.8?",
      options: [
        "More large earthquakes relative to small ones",
        "More small earthquakes relative to large ones",
        "No difference in earthquake distribution",
        "Deeper earthquakes only"
      ],
      correct: 1
    },
    {
      question: "When analyzing the G-R plot, what does a lower 'a-value' indicate?",
      options: [
        "Higher overall seismic activity",
        "Lower overall seismic activity",
        "Steeper slope",
        "More shallow earthquakes"
      ],
      correct: 1
    },
    {
      question: "In the simulation, if you search a region and find most earthquakes at 300+ km depth, what tectonic setting is likely?",
      options: [
        "Mid-ocean ridge (divergent boundary)",
        "Transform fault",
        "Subduction zone",
        "Continental rift"
      ],
      correct: 2
    },
    {
      question: "What would you expect to see in the temporal analysis for a region after a major earthquake?",
      options: [
        "Complete cessation of seismic activity",
        "Increased aftershock activity over time",
        "No change in activity patterns",
        "Only larger earthquakes"
      ],
      correct: 1
    },
    {
      question: "If the magnitude distribution chart shows a peak at M5.5-6.0, what can you conclude?",
      options: [
        "This is the minimum detection threshold",
        "This is the most frequent magnitude range",
        "All earthquakes are exactly M5.5",
        "The data is incomplete"
      ],
      correct: 1
    }
  ];

  return quizId === 'pretest' ? pretestQuestions : posttestQuestions;
}

/**
 * Handle quiz submission
 */
function handleQuizSubmit(quizId, formId) {
  const form = document.getElementById(formId);
  const resultsDiv = document.getElementById(`${quizId}-results`);
  const questions = getQuizQuestions(quizId);
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let score = 0;
    let resultsHTML = '<h4 class="text-xl font-bold mb-4">Results:</h4>';
    
    questions.forEach((q, index) => {
      const selected = form.querySelector(`input[name="q${index}"]:checked`);
      const isCorrect = selected && parseInt(selected.value) === q.correct;
      
      if (isCorrect) score++;
      
      resultsHTML += `
        <div class="mb-4 p-3 rounded ${isCorrect ? 'bg-green-100' : 'bg-red-100'}">
          <p class="font-semibold">${index + 1}. ${q.question}</p>
          <p class="${isCorrect ? 'text-green-700' : 'text-red-700'}">
            ${isCorrect ? '✓ Correct' : '✗ Incorrect - Correct answer: ' + q.options[q.correct]}
          </p>
        </div>
      `;
    });
    
    const percentage = (score / questions.length * 100).toFixed(0);
    resultsHTML = `
      <div class="p-4 mb-4 rounded ${percentage >= 70 ? 'bg-green-100' : 'bg-yellow-100'}">
        <p class="text-2xl font-bold">Score: ${score}/${questions.length} (${percentage}%)</p>
      </div>
    ` + resultsHTML;
    
    resultsDiv.innerHTML = resultsHTML;
    resultsDiv.style.display = 'block';
    
    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
  });
}
