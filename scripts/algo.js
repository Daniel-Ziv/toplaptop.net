// User preferences object to store form data
const userPreferences = { 
    priceImportance: 'לא חשוב',
    budget: 2500,  
    tasks: ['גלישה באינטרנט'],
    sizeImportance: 'לא חשוב',
    screenSize: [],
    portabilityImportance: 'לא חשוב'
};


// Task weights for specific tasks
const taskWeights = {
    "גלישה באינטרנט": { 
        ram_size: 0.2,
        cpu_ghz: 0.1,
        screenHz: 0.05,
        storage_type: 0.15,
        ram_type: 0.05,
        storage_space: 0.05,
        for_gaming: 0
    },
    "תוכנות מידול/אנימציה": { 
        ram_size: 0.4,
        cpu_ghz: 0.4,
        screenHz: 0.1,
        storage_type: 0.3,
        ram_type: 0.2,
        storage_space: 0.3,
        for_gaming: 0.2
    },
    "תכנות קל(סטודנטים)": { 
        ram_size: 0.3,
        cpu_ghz: 0.3,
        screenHz: 0.05,
        storage_type: 0.2,
        ram_type: 0.05,
        storage_space: 0.1,
        for_gaming: 0
    },
    "עריכת תמונות": { 
        ram_size: 0.3,
        cpu_ghz: 0.3,
        screenHz: 0.05,
        storage_type: 0.2,
        ram_type: 0.05,
        storage_space: 0.3,
        for_gaming: 0
    },
    "עריכת סרטונים": { 
        ram_size: 0.4,
        cpu_ghz: 0.4,
        screenHz: 0.1,
        storage_type: 0.3,
        ram_type: 0.05,
        storage_space: 0.4,
        for_gaming: 0.1
    },
    "סרטים/זום/צפייה בהרצאות": { 
        ram_size: 0.1,
        cpu_ghz: 0.05,
        screenHz: 0.15,
        storage_type: 0.1,
        ram_type: 0.05,
        storage_space: 0.1,
        for_gaming: 0
    },
    "כתיבת מסמכים": { 
        ram_size: 0.1,
        cpu_ghz: 0.05,
        screenHz: 0.05,
        storage_type: 0.1,
        ram_type: 0.05,
        storage_space: 0.05,
        for_gaming: 0
    },
    "גיימינג כבד": { 
        ram_size: 0.4,
        cpu_ghz: 0.4,
        screenHz: 0.4,
        storage_type: 0.3,
        ram_type: 0.1,
        storage_space: 0.3,
        for_gaming: 1
    },
    "עריכת מוזיקה": { 
        ram_size: 0.3,
        cpu_ghz: 0.2,
        screenHz: 0.05,
        storage_type: 0.2,
        ram_type: 0.05,
        storage_space: 0.3,
        for_gaming: 0
    },
    "תכנות כבד": { 
        ram_size: 0.4,
        cpu_ghz: 0.4,
        screenHz: 0.05,
        storage_type: 0.3,
        ram_type: 0.1,
        storage_space: 0.3,
        for_gaming: 0
    }
};


// Function to combine task weights for selected tasks
function combineTaskWeights(selectedTasks) {
    const combinedWeights = {
        ram_size: 0,
        cpu_ghz: 0,
        screenHz: 0,
        storage_type: 0,
        ram_type: 0,
        storage_space: 0,
        for_gaming: 0
    };

    // Sum the weights for each selected task
    selectedTasks.forEach(task => {
        const weights = taskWeights[task];
        Object.keys(combinedWeights).forEach(param => {
            combinedWeights[param] += weights[param];
        });
    });

    // Average the weights by the number of tasks
    const numTasks = selectedTasks.length;
    Object.keys(combinedWeights).forEach(param => {
        combinedWeights[param] /= numTasks;
    });

    return combinedWeights;
}

const storageTypeWeights = {
    "SSD": 1,
    "HDD": 0.5
};

const ramTypeWeights = {
    "DDR3": 0.3,
    "DDR4": 0.5,
    "DDR5": 1
};

const forGamingWeights = {
    "גיימינג": 1,
    "לא רלוונטי": 0
};


function calculateLaptopScore(laptop, combinedWeights, userPreferences) {
    let score = 0;
    let maxScore = 0;

     // Check if combinedWeights is valid
     if (!combinedWeights) {
        console.error('combinedWeights is undefined or null', combinedWeights);
        return NaN;
    }

    // Convert laptop data to numbers, fallback to 0 if data is missing or invalid
    const ramSize = parseFloat(laptop.ram_size.replace(/[^\d.]/g, '')) || 0;  
    const cpuGhz = parseFloat(laptop.cpu_ghz.replace(/[^\d.]/g, '')) || 0;    
    let storageSpace = parseInt(laptop.storage_space.replace(/[^\d.]/g, '')) || 0;  
    const screenSize = parseFloat(laptop.screen_size.replace(/[^\d.]/g, '')) || 0;   
    const weight = parseFloat(laptop.weight.replace(/[^\d.]/g, '')) || 0;    
    const price = parseInt(laptop.price.replace(/[^\d]/g, '')) || 0; 
    const screenHz = parseInt(laptop.screenhz.replace(/[^\d]/g, '')) || 0;
    const priceImportanceLevel = userPreferences.priceImportance;  // Get user's price importance level
    
    if ([ramSize, cpuGhz, storageSpace, screenSize, weight, price, screenHz].some(isNaN)) {
        console.error('Laptop data contains invalid or NaN values:', {
            ramSize, cpuGhz, storageSpace, screenSize, weight, price, screenHz
        });
        return NaN;
    }

    // Set the tolerance based on price importance
    let tolerance;
    if (priceImportanceLevel === "לא חשוב") {
        tolerance = Infinity;  // No price limit, always 100 points
    } else if (priceImportanceLevel === "קצת חשוב") {
        tolerance = 400;  // Allow up to 400₪ above budget
    } else if (priceImportanceLevel === "חשוב") {
        tolerance = 150;  // Allow up to 150₪ above budget
    } else if (priceImportanceLevel === "מאוד חשוב") {
        tolerance = 50;  // Allow up to 50₪ above budget
    }

    // Calculate the price score
    const priceDiff = price - userPreferences.budget;

    if (priceImportanceLevel === "לא חשוב") {
        // If the price isn't important, always give full score
        score += 100;
    } else if (priceDiff <= 0) {
        // If the price is within or below the budget, full score
        score += 100;
    } else {
        // If the price exceeds the budget, subtract points based on how far it is from the tolerance
        const adjustedPriceDiff = (priceDiff - tolerance)/2
        const priceScore = Math.max(0, 100 - adjustedPriceDiff);
        score += priceScore;
    }

    maxScore += 100;
    //console.log("new max score: " + maxScore);


    // Task evaluation
    const maxRamScore = 32;  
    const maxCpuScore = 5.0; 
    const maxScreenHzScore = 144;  
    const maxStorageSpaceScore = 2000; 

    // RAM Size
    //console.log("score before ram added: " + score);
    score += Math.min((ramSize / maxRamScore) * combinedWeights.ram_size * 100,100);
    maxScore += 100 * combinedWeights.ram_size;
    //console.log("score after ram added: " + score);
    //console.log("new max score: " + maxScore);

    // CPU GHz

    const cpuTypeWeights = {
        "i9": 1.0,
        "i7": 0.8,
        "i5": 0.6,
        "i3": 0.4,
        "ryzen 9": 1.0,
        "ryzen 7": 0.8,
        "ryzen 5": 0.6,
        "ryzen 3": 0.4,
        "m1": 0.9,
        "m2": 1.0,
        "unknown": 0.3 // Default for unknown CPUs
    };
    

    function getCpuScore(cpuName) {
        cpuName = cpuName.toLowerCase();  // Convert to lowercase to handle case-insensitivity
    
        // Check for Intel processors
        if (cpuName.includes("i9")) return cpuTypeWeights["i9"];
        if (cpuName.includes("i7")) return cpuTypeWeights["i7"];
        if (cpuName.includes("i5")) return cpuTypeWeights["i5"];
        if (cpuName.includes("i3")) return cpuTypeWeights["i3"];
    
        // Check for AMD Ryzen processors
        if (cpuName.includes("ryzen 9")) return cpuTypeWeights["ryzen 9"];
        if (cpuName.includes("ryzen 7")) return cpuTypeWeights["ryzen 7"];
        if (cpuName.includes("ryzen 5")) return cpuTypeWeights["ryzen 5"];
        if (cpuName.includes("ryzen 3")) return cpuTypeWeights["ryzen 3"];
    
        // Check for Apple M1/M2 processors
        if (cpuName.includes("m1")) return cpuTypeWeights["m1"];
        if (cpuName.includes("m2")) return cpuTypeWeights["m2"];
    
        // Default if CPU type is not recognized
        return cpuTypeWeights["unknown"];
    }
    
            // CPU GHz + CPU Type
        const cpuScoreMultiplier = getCpuScore(laptop.cpu);  // Get CPU core score based on type
        //console.log("cpu score multiplier: " + cpuScoreMultiplier);
        const cpuScore = Math.min((cpuGhz / maxCpuScore) * cpuScoreMultiplier * 100, 100);  // Adjust by CPU type

        score += cpuScore * combinedWeights.cpu_ghz;
        maxScore += 100 * combinedWeights.cpu_ghz;

        //console.log("new max score after CPU added: " + maxScore);
        //console.log("score after CPU added: " + score);


    // Screen Refresh Rate (Hz)
    score += Math.min((screenHz / maxScreenHzScore) * combinedWeights.screenHz * 100,100);
    maxScore += 100 * combinedWeights.screenHz;
    //console.log("score after hz added: " + score);
    //console.log("new max score: " + maxScore);

    // Storage Type (SSD or HDD)
    const storageTypeScore = storageTypeWeights[laptop.storage_type] || 0;
    score += storageTypeScore * combinedWeights.storage_type * 100;
    maxScore += 100 * combinedWeights.storage_type;
    //console.log("score after ssd added: " + score);
    //console.log("new max score: " + maxScore);

    // RAM Type (DDR3, DDR4, DDR5)
    const ramTypeScore = ramTypeWeights[laptop.ram_type] || 0;
    score += ramTypeScore * combinedWeights.ram_type * 100;
    maxScore += 100 * combinedWeights.ram_type;
    //console.log("score after ram type added: " + score);
    //console.log("new max score: " + maxScore);

    // Storage Space
    if (storageSpace > 2000){
        storageSpace = 2000;
    }
    score += (storageSpace / maxStorageSpaceScore) * combinedWeights.storage_space * 100;
    maxScore += 100 * combinedWeights.storage_space;
    //console.log("score after storage space added: " + score);
    //console.log("new max score: " + maxScore);

   // For Gaming
    let forGamingScore = forGamingWeights[laptop.for_gaming] || 0;

    // Check if the laptop name includes "גיימינג" or "gaming" as an additional gaming indicator
    if (laptop.name.toLowerCase().includes("gaming") || laptop.name.includes("גיימינג")) {
        forGamingScore = 1;  // Consider it a gaming laptop if these words are found
    }

    // Only calculate gaming score if the user selected gaming task
    if (userPreferences.tasks.includes("גיימינג כבד")) {
        // Special handling if the user needs a gaming laptop
        if (forGamingScore === 1) {
            // If it's a gaming laptop, give it a score of 100
            score += 100 * combinedWeights.for_gaming;
        } else {
            // If the user needs a gaming laptop but it's not a gaming one, penalize more heavily
            score += 50 * combinedWeights.for_gaming;  // Reduced score for non-gaming laptops
        }

        maxScore += 100 * combinedWeights.for_gaming;

    } else {
        // If the user didn't choose gaming, skip adding gaming-related scores
        // Nothing is added to the score or maxScore
        forGamingScore = 0;  // Reset the score to 0 just to make sure
    }
    //console.log("score after gaming added: " + score);
    //console.log("new max score: " + maxScore);



    const sizeRanges = {
        "קטנטן": { min: 0, max: 13 },        // Less than 13 inches
        "קטן": { min: 13, max: 14 },         // Between 13 and 14 inches
        "בינוני": { min: 14, max: 16 },      // Between 14 and 16 inches
        "גדול": { min: 16, max: Infinity }   // More than 16 inches
    };
    
    
    // Size importance level
    const sizeImportanceLevel = userPreferences.sizeImportance;  // Get size importance level
    
    // List of user-selected screen size categories (can be multiple)
    const selectedRanges = userPreferences.screenSize;  // This will be an array of size categories
    
    let bestSizeScore = 0;  // Track the best score from all ranges
    if (selectedRanges.length > 0) {
        selectedRanges.forEach(category => {
            const sizeRange = sizeRanges[category];  // Get the size range for the current category
            let sizeScore = 0;  // Score for this range
        
            if (sizeImportanceLevel === "לא חשוב") {
                // If size is not important, full score
                sizeScore = 100;
            } else if (sizeImportanceLevel === "קצת חשוב") {
                // Allow 2 inches above or below the range
                if (screenSize >= sizeRange.min - 2 && screenSize <= sizeRange.max + 2) {
                    sizeScore = 100;  // Full score if within expanded range
                } else {
                    // Penalize for being outside the 2-inch buffer
                    const sizeDiff = Math.min(Math.abs(screenSize - sizeRange.min), Math.abs(screenSize - sizeRange.max));
                    sizeScore = Math.max(0, 100 - sizeDiff * 50);  // Penalize based on how far out of range the size is
                }
            } else if (sizeImportanceLevel === "חשוב") {
                // Allow 1 inch above or below the range
                if (screenSize >= sizeRange.min - 1 && screenSize <= sizeRange.max + 1) {
                    sizeScore = 100;  // Full score if within expanded range
                } else {
                    // Penalize for being outside the 1-inch buffer
                    const sizeDiff = Math.min(Math.abs(screenSize - sizeRange.min), Math.abs(screenSize - sizeRange.max));
                    sizeScore = Math.max(0, 100 - sizeDiff * 100);  // Penalize more heavily for being out of range
                }
            } else if (sizeImportanceLevel === "חשוב מאוד") {
                // Only allow within the exact range
                if (screenSize >= sizeRange.min && screenSize <= sizeRange.max) {
                    sizeScore = 100;  // Full score if within the exact range
                } else {
                    sizeScore = 0;  // No score if outside the exact range
                }
            }
        
            // Track the highest score from all the ranges
            bestSizeScore = Math.max(bestSizeScore, sizeScore);
        });
    }
    else{
        bestSizeScore = 100;
    }
    
    // Add the best size score to the total score
    score += bestSizeScore;
    maxScore += 100;
    //console.log("score after size added: " + score);
    //console.log("new max score: " + maxScore);


   // Define weight thresholds based on portability importance
    const portabilityThresholds = {
        "לא חשוב": Infinity,   // Any weight is acceptable
        "קצת חשוב": 2.5,       // Up to 2.5 kg
        "חשוב": 2.0,           // Up to 2.0 kg
        "חשוב מאוד": 1.7       // Up to 1.7 kg
    };

    // Get the user's portability importance level
    const portabilityLevel = userPreferences.portabilityImportance;
    console.log(portabilityLevel)
    // Get the corresponding weight threshold for the user's portability level
    const maxWeight = portabilityThresholds[portabilityLevel];

    // Evaluate the laptop's weight
    if (weight <= maxWeight) {
        // Full score if the weight is within the acceptable limit
        score += 100;
    } else {
        // Reduce the score based on how much the laptop exceeds the maximum weight for the given importance
        const weightDiff = weight - maxWeight;
        score += Math.max(0, 100 - weightDiff * 50);  // Penalty based on how far the weight is from the threshold
    }

    maxScore += 100;
    //console.log("new max score: " + maxScore);

    if (isNaN(score)) {
        return NaN;
    }

     // Return NaN if maxScore is 0 (which should never happen with proper data)
     if (maxScore === 0) {
         console.error(`Max Score is 0, which is invalid for laptop: ${laptop.name}`);
         return NaN;
     } 
    //console.log("score after weight is " + score);
    // Return the percentage score
    //console.error("Score is NaN after calculation:", score);
    return (score / maxScore) * 100;

}

// Example function to rank laptops based on user preferences
function findBestLaptops(laptops, userPreferences) {
    const selectedTasks = userPreferences.tasks;
    const combinedWeights = combineTaskWeights(selectedTasks);

    const rankedLaptops = laptops.map(laptop => {
        const laptopScore = calculateLaptopScore(laptop, combinedWeights, userPreferences);
        if (isNaN(laptopScore)) {
            console.error('Skipping laptop due to NaN score:', laptop);
            return null;
        }
        return {
            ...laptop,
            score: laptopScore
        };
    }).filter(laptop => laptop !== null);

    rankedLaptops.sort((a, b) => b.score - a.score);
    return rankedLaptops;
}






// Display results on the page
function displayResults(results, limit) {
    
    const resultsDiv = document.getElementById('results-container');  // Correct ID
    resultsDiv.innerHTML = '';  // Clear previous results

    const resultsToShow = results.slice(0, limit); 

    resultsToShow.forEach(laptop => {
        if (isNaN(laptop.score)) {
            console.error("Laptop score is NaN, skipping:", laptop);
            return;  // Skip this result if the score is NaN
        }
        const laptopNameModified = laptop.name.replace("מחשב נייד", "").trim();
        const laptopInfo = document.createElement('div');
        laptopInfo.classList.add('laptop-card');
        laptopInfo.innerHTML = `
         <!-- https://github.com/tigrr/circle-progress https://tigrr.github.io/circle-progress/examples.html -->
        <div class="inner-card">
        <div class="inner-precentage">
            <circle-progress text-format="percent" value="${laptop.score}" max="100"></circle-progress>
            <h2>אחוז התאמה</h2>

        </div>
            <div class="inner-info">
                <h2 class="laptop-details" id="h2-specs" dir="rtl">${laptopNameModified}</h2>
                <p class="laptop-specs" dir="rtl">${laptop.price}<br><span>מחיר </span></p>
                <p class="laptop-specs" dir="rtl">${laptop.weight}<br><span>משקל </span></p>
                <p class="laptop-specs" dir="rtl">${laptop.screen_size}<br><span>מסך </span></p>
            </div>
            
            <div class="inner-img">
                <img src="${laptop.product_img}" alt="${laptop.name}" class="laptop-img">
            </div>
           
        </div>
        <div class ="link-zap">
            <a href="${laptop.url}" class="laptop-action" target="_blank">קישור למוצר</a>
        </div>
        `;
        
        resultsDiv.appendChild(laptopInfo);  // Append to correct container
            });
        
        if (results.length > limit) {
        const showMoreButton = document.createElement('button');
        showMoreButton.textContent = "הצג עוד";
        showMoreButton.classList.add('show-more-btn');
        showMoreButton.onclick = function() {
            displayResults(results, limit + 5);  // Show 5 more results when clicked
        };
        resultsDiv.appendChild(showMoreButton);
    }

        
        document.querySelectorAll('.progress-circle').forEach(function(progressCircle) {
        const score = progressCircle.getAttribute('data-score');
        //console.log(laptop.score)
        createProgressCircle(progressCircle, score);  // Initialize CircleProgress with the laptop's score
    });

}

