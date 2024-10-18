// User preferences object to store form data

const userPreferences = { 
    priceImportance: 'לא חשוב',
    budget: [1000,2500],
    tasks: ['גלישה באינטרנט'],
    sizeImportance: 'לא חשוב',
    screenSize: [],
    portabilityImportance: 'לא חשוב'
};
//create a max Weight var, to store the max weight 
let globalMaxWeight;

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
    const priceImportanceLevel = userPreferences.priceImportance;  
    const minBudget = userPreferences.budget.min;
    const maxBudget = userPreferences.budget.max;
    
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
        tolerance = maxBudget * 0.1;  // Allow up to 10% above budget
    } else if (priceImportanceLevel === "חשוב") {
        tolerance = maxBudget * 0.05;  // Allow up to 5% above budget
    } else if (priceImportanceLevel === "מאוד חשוב") {
        tolerance = maxBudget * 0.02;  // Allow up to 2% above budget
    }

     // Calculate the price score
     if (priceImportanceLevel === "לא חשוב"){
        minBudget = 0;
        maxBudget = Infinity;
        score += 100;
        maxScore +=100;
     }
     else if (price >= minBudget && price <= maxBudget) {
        // Full score if the laptop price is within the budget range
        score += 100;
        maxScore += 100;
    } else if (price < minBudget && price >= (minBudget - tolerance)) {
        // If the price is below the min budget but within tolerance, calculate a reduced score
        const priceDiff = minBudget - price;
        score += Math.max(0, 100 - (priceDiff / tolerance) * 100);  // Reduce score based on how far it is below the min budget
        maxScore += 100;

    } else if (price > maxBudget && price <= (maxBudget + tolerance)) {
        // If the price is above the max budget but within tolerance, calculate a reduced score
        const priceDiff = price - maxBudget;
        score += Math.max(0, 100 - (priceDiff / tolerance) * 100);  // Reduce score based on how far it exceeds the max budget
        maxScore += 100;

    } else {
        // If the price is beyond both the min/max budget and tolerance, give it zero score
        score += 0;
        maxScore += 100;

    }

      // Price contributes 100 points to the total score



    // Task evaluation
    const maxRamScore = 32;  
    const maxCpuScore = 5.0; 
    const maxScreenHzScore = 144;  
    const maxStorageSpaceScore = 2000; 

    // RAM Size
    score += Math.min((ramSize / maxRamScore) * combinedWeights.ram_size * 100,100);
    maxScore += 100 * combinedWeights.ram_size;
    console.log("ram score: " +  score +  "Max score: " + maxScore);


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



    // Screen Refresh Rate (Hz)
    score += Math.min((screenHz / maxScreenHzScore) * combinedWeights.screenHz * 100,100);
    maxScore += 100 * combinedWeights.screenHz;

    // Storage Type (SSD or HDD)
    const storageTypeScore = storageTypeWeights[laptop.storage_type] || 0;
    score += storageTypeScore * combinedWeights.storage_type * 100;
    maxScore += 100 * combinedWeights.storage_type;

    // RAM Type (DDR3, DDR4, DDR5)
    const ramTypeScore = ramTypeWeights[laptop.ram_type] || 0;
    score += ramTypeScore * combinedWeights.ram_type * 100;
    maxScore += 100 * combinedWeights.ram_type;

    // Storage Space
    if (storageSpace > 2000){
        storageSpace = 2000;
    }
    score += (storageSpace / maxStorageSpaceScore) * combinedWeights.storage_space * 100;
    maxScore += 100 * combinedWeights.storage_space;


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
    
    let bestSizeScore = 0;  // Track the best score from all range

    if (sizeImportanceLevel === "לא חשוב") {
        bestSizeScore = 100;  // Full points if screen size doesn't matter
    }
    else{
        if (selectedRanges.length > 0) {
            selectedRanges.forEach(category => {
                const sizeRange = sizeRanges[category];  // Get the size range for the current category
                console.log(sizeRange);
                let sizeScore = 0;  // Score for this range
            
                if (sizeImportanceLevel === "בכלל לא חשוב") {
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
                console.log(sizeScore);
            });
        }
        else{
            bestSizeScore = 100;
        }
    }
        
    // Add the best size score to the total score
    score += bestSizeScore;
    maxScore += 100;

   // Define weight thresholds based on portability importance
    const portabilityThresholds = {
        "לא חשוב": Infinity,   // Any weight is acceptable
        "קצת חשוב": 2.5,       // Up to 2.5 kg
        "חשוב": 2.0,           // Up to 2.0 kg
        "חשוב מאוד": 1.7       // Up to 1.7 kg
    };

    // Get the user's portability importance level
    const portabilityLevel = userPreferences.portabilityImportance;
    // Get the corresponding weight threshold for the user's portability level
    const maxWeight = portabilityThresholds[portabilityLevel];
    globalMaxWeight = maxWeight;
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
    const minBudget = userPreferences.budget.min;
    const maxBudget = userPreferences.budget.max;
    const rankedLaptops = laptops.map(laptop => {
        const laptopScore = calculateLaptopScore(laptop, combinedWeights, userPreferences);
        let priceNumber = parseFloat(
            laptop.price
                .replace(/,/g, '')          // Remove commas
                .replace(/[^0-9.]/g, '')    // Remove non-numeric and non-period characters
        ) || 0;

        if (isNaN(laptopScore)) {
            console.error('Skipping laptop due to NaN score:', laptop);
            return null;
        }
        return {
            ...laptop,
            score: laptopScore,
            priceNumber: priceNumber
        };
    }).filter(laptop => laptop !== null);

    let laptopsToDisplay;

    if (currentSortBy === 'price') {
        // Filter laptops within the budget range
        laptopsToDisplay = rankedLaptops.filter(laptop => laptop.priceNumber >= minBudget && laptop.priceNumber <= maxBudget);

        // Sort the filtered laptops by price ascending (cheapest first)
        laptopsToDisplay.sort((a, b) => a.priceNumber - b.priceNumber);
    } else {
        // Sort all laptops by score descending (highest score first)
        laptopsToDisplay = rankedLaptops.sort((a, b) => b.score - a.score);
    }

    return laptopsToDisplay;
}






// Display results on the page
function displayResults(results, limit) {
    
    const resultsDiv = document.getElementById('results-container');  // Correct ID
    resultsDiv.innerHTML = '';  // Clear previous results

    const resultsToShow = results.slice(0, limit); 
    // Choose SVGs based on budget check
    let checkMarkSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2b8a3e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-check" style="vertical-align: middle;"><path d="M5 12l5 5l10 -10"></path></svg>'
    let xSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c92a2a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-x" style="vertical-align: middle;"><path d="M18 6l-12 12" ></path><path d="M6 6l12 12"></path></svg>'
   


    resultsToShow.forEach(laptop => {
        if (isNaN(laptop.score)) {
            console.error("Laptop score is NaN, skipping:", laptop);
            return;  // Skip this result if the score is NaN
        }
        const minBudget = userPreferences.budget.min;
        const maxBudget = userPreferences.budget.max;
        const laptopPrice = parseInt(laptop.price.replace(/[^\d]/g, '')) || 0;
        const laptopWeight = parseInt(laptop.weight.replace(/[^\d]/g, '')) || 0;
        const laptopScreenSize_ = parseFloat(laptop.screen_size.replace(/[^\d.]/g, '')) || 0;
        const preferredScreenSizes = userPreferences.screenSize; // Array of user-selected sizes
        let weightIndicatorSVG;
        let budgetIndicatorSVG;
        let screenIndicatorSVG;

        if (laptopPrice >= minBudget && laptopPrice <= maxBudget) {
            budgetIndicatorSVG = checkMarkSVG;
        } else {
            budgetIndicatorSVG = xSVG;
        }
        
        if (laptopWeight < globalMaxWeight) {
            weightIndicatorSVG = checkMarkSVG;
        } else {
            weightIndicatorSVG = xSVG;
        }
        
        // Default icon if screen size doesn't match user preferences
            screenIndicatorSVG = xSVG;
        // Loop through user's preferred screen size ranges to check for a match
        preferredScreenSizes.forEach(size => {
            if (
                (size === 'קטנטן' && laptopScreenSize_ < 13) ||
                (size === 'קטן' && laptopScreenSize_ >= 13 && laptopScreenSize_ <= 14) ||
                (size === 'בינוני' && laptopScreenSize_ > 14 && laptopScreenSize_ <= 16) ||
                (size === 'גדול' && laptopScreenSize_ > 16)
            ) {
                screenIndicatorSVG = checkMarkSVG;
            }
        });

        


        const laptopNameModified = laptop.name.replace("מחשב נייד", "").trim();
        const laptopInfo = document.createElement('div');
        laptopInfo.classList.add('laptop-card');
        laptopInfo.innerHTML = `
        <div class="inner-card">
        <div class="inner-precentage">
            <circle-progress text-format="percent" value="${laptop.score}" max="100"></circle-progress>
            <h2>אחוז התאמה</h2>

        </div>
            <div class="inner-info">
                <h2 class="laptop-details" id="h2-specs" dir="rtl">${laptopNameModified}</h2>
                <p class="laptop-specs" dir="rtl">${laptop.price}<br>
                ${budgetIndicatorSVG}
                <span>מחיר </span></p>
                <p class="laptop-specs" dir="rtl">${laptop.weight}<br>
                ${weightIndicatorSVG}
                <span>משקל </span></p>
                <p class="laptop-specs" dir="rtl">${laptop.screen_size}<br>
                ${screenIndicatorSVG}
                <span>מסך </span></p>
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
        console.log(laptop.score)
        createProgressCircle(progressCircle, score);  // Initialize CircleProgress with the laptop's score
    });

}

//suggesting the user a budget based on the tasks he chose
const taskBudgetRanges = {
    "גלישה באינטרנט": { min: 1200, max: 2700 },
    "תוכנות מידול/אנימציה": { min: 4500, max: 8000 },
    "תכנות קל(סטודנטים)": { min: 2500, max: 4500 },
    "עריכת תמונות": { min: 3500, max: 6500 },
    "עריכת סרטונים": { min: 5500, max: 8000 },
    "סרטים/זום/צפייה בהרצאות": { min: 1700, max: 3200 },
    "כתיבת מסמכים": { min: 1200, max: 2700 },
    "גיימינג כבד": { min: 6500, max: 8000 },
    "עריכת מוזיקה": { min: 3500, max: 5500 },
    "תכנות כבד": { min: 4500, max: 8000 }
};

function combineBudgetRanges(selectedTasks) {
    let minBudget = 0;
    let maxBudget = 0;

    selectedTasks.forEach(task => {
        const taskRange = taskBudgetRanges[task];
        if (taskRange) {
            minBudget = Math.max(minBudget, taskRange.min);
            maxBudget = Math.max(maxBudget, taskRange.max);
        }
    });

    return { min: minBudget, max: maxBudget };
}

