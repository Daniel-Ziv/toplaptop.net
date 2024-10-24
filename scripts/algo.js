// User preferences object to store form data
let globalMaxWeight;
let SVGOn = 0;
const userPreferences = { 
    priceImportance: 'לא חשוב',
    budget: [1000,2500],
    tasks: ['גלישה באינטרנט'],
    sizeImportance: 'בכלל לא חשוב',
    screenSize: [],
    portabilityImportance: 'לא חשוב',
   };




// Task weights for specific tasks
const taskWeights = {
    "גלישה באינטרנט": { 
        ideal_ram: 4,
        cpu_ghz: 0.1,
        screenHz: 0,
        storage_type: 0.5,
        ram_type: 0.3,
        storage_space: 0.05,
        for_gaming: 0
    },
    "תוכנות מידול/אנימציה": { 
        ideal_ram: 16,
        cpu_ghz: 0.4,
        screenHz: 0.1,
        storage_type: 0.3,
        ram_type: 1,
        storage_space: 0.3,
        for_gaming: 0
    },
    "תכנות קל(סטודנטים)": { 
        ideal_ram: 8,
        cpu_ghz: 0.3,
        screenHz: 0.05,
        storage_type: 0.2,
        ram_type: 0.7,
        storage_space: 0.1,
        for_gaming: 0
    },
    "עריכת תמונות": { 
        ideal_ram: 16,
        cpu_ghz: 0.3,
        screenHz: 0.05,
        storage_type: 0.2,
        ram_type: 1,
        storage_space: 0.3,
        for_gaming: 0
    },
    "עריכת סרטונים": { 
        ideal_ram: 16,
        cpu_ghz: 0.4,
        screenHz: 0.1,
        storage_type: 0.3,
        ram_type: 1,
        storage_space: 0.4,
        for_gaming: 0
    },
    "סרטים/זום/צפייה בהרצאות": { 
        ideal_ram: 4,
        cpu_ghz: 0.05,
        screenHz: 0.15,
        storage_type: 0.1,
        ram_type: 0.3,
        storage_space: 0.1,
        for_gaming: 0
    },
    "כתיבת מסמכים": { 
        ideal_ram: 4,
        cpu_ghz: 0.05,
        screenHz: 0.05,
        storage_type: 0.1,
        ram_type: 0.3,
        storage_space: 0.05,
        for_gaming: 0
    },
    "גיימינג כבד": { 
        ideal_ram: 16,
        cpu_ghz: 0.4,
        screenHz: 0.4,
        storage_type: 0.3,
        ram_type: 1,
        storage_space: 0.3,
        for_gaming: 1
    },
    "עריכת מוזיקה": { 
        ideal_ram: 16,
        cpu_ghz: 0.2,
        screenHz: 0.05,
        storage_type: 0.2,
        ram_type: 1,
        storage_space: 0.3,
        for_gaming: 0
    },
    "תכנות כבד": { 
        ideal_ram: 16,
        cpu_ghz: 0.4,
        screenHz: 0.05,
        storage_type: 0.3,
        ram_type: 1,
        storage_space: 0.3,
        for_gaming: 0
    }
};


// Function to combine task weights for selected tasks
function combineTaskWeights(selectedTasks) {
    const combinedWeights = {
        ideal_ram: 0,
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
            if(param === "ideal_ram"){
                combinedWeights.ideal_ram = Math.max(combinedWeights.ideal_ram, weights[param]);
            }
            else{
            combinedWeights[param] += weights[param];
            }
        });

    });

    // Average the weights by the number of tasks
    const numTasks = selectedTasks.length;
    Object.keys(combinedWeights).forEach(param => {
        if(param !== "ideal_ram"){
            combinedWeights[param] /= numTasks;

        }

    });

    return combinedWeights;
}




const forGamingWeights = {
    "גיימינג": 1,
    "לא רלוונטי": 0
};

// Evaluate RAM Size based on the task's ideal RAM requirement
function calculateRamScore(laptopRamSize, combinedWeights) {
    const idealRam = combinedWeights.ideal_ram;
    let ramScore = 0;
    if (laptopRamSize >= idealRam) {
        ramScore = 100;
    } else if (laptopRamSize < idealRam) {
        const deficit = idealRam - laptopRamSize;
        ramScore = Math.max(0, 100 - (deficit * 10)); // Penalize heavily for lack of RAM
    } else {
        ramScore = 0;
    }
    return (ramScore > 100 ? 100 : ramScore);
}

const cpuTypeWeights = {
    "i9": 1.0,          
    "i7": 0.85,         
    "i5": 0.65,       
    "i3": 0.45,        
    "ryzen 9": 1.0,    
    "ryzen 7": 0.85,   
    "ryzen 5": 0.65,   
    "ryzen 3": 0.45,   
    "m1": 0.9,         
    "m2": 1.0,          
    "m3" : 1.0,
    "unknown": 0.3      
};


const taskCpuRequirements = {
    "גלישה באינטרנט": { 
        ideal_cpu: "i3",         // Basic web browsing requires a low-power CPU
        ideal_ghz: 1.8            // 1.8 GHz should be enough for basic tasks
    },
    "תוכנות מידול/אנימציה": { 
        ideal_cpu: "i7",         // 3D modeling or animation requires a high-performance CPU
        ideal_ghz: 3.0            // Ideally 3.0 GHz or higher for such demanding tasks
    },
    "תכנות קל(סטודנטים)": { 
        ideal_cpu: "i5",         // Light programming is best with a mid-range CPU
        ideal_ghz: 2.5            // 2.5 GHz or higher is sufficient for light programming
    },
    "עריכת תמונות": { 
        ideal_cpu: "i5",         // Photo editing needs a mid-range CPU
        ideal_ghz: 2.5            // 2.5 GHz is ideal for photo editing
    },
    "עריכת סרטונים": { 
        ideal_cpu: "i7",         // Video editing is resource-intensive and requires a high-end CPU
        ideal_ghz: 3.0            // 3.0 GHz or more for smooth video editing performance
    },
    "סרטים/זום/צפייה בהרצאות": { 
        ideal_cpu: "i3",         // Watching videos or Zoom meetings doesn't require much CPU power
        ideal_ghz: 1.8            // 1.8 GHz is sufficient for media consumption
    },
    "כתיבת מסמכים": { 
        ideal_cpu: "i3",         // Document writing is a light task that only needs an entry-level CPU
        ideal_ghz: 1.8            // 1.8 GHz is adequate for writing documents
    },
    "גיימינג כבד": { 
        ideal_cpu: "i7",         // Heavy gaming requires a high-performance CPU
        ideal_ghz: 3.5            // Ideally 3.5 GHz or higher for gaming
    },
    "עריכת מוזיקה": { 
        ideal_cpu: "i5",         // Music production needs a mid-range CPU for processing multiple tracks
        ideal_ghz: 2.5            // 2.5 GHz or more is ideal for smooth performance
    },
    "תכנות כבד": { 
        ideal_cpu: "i7",         // Heavy programming requires a high-end CPU, especially when using VMs or large projects
        ideal_ghz: 3.0            // 3.0 GHz or more is recommended for heavy programming
    }
};

const minGhzForCpuType = {
    "i9": 3.0,         
    "i7": 2.5,         
    "i5": 2.0,        
    "i3": 1.8,         
    "ryzen 9": 3.0,   
    "ryzen 7": 2.5,    
    "ryzen 5": 2.0,   
    "ryzen 3": 1.8,    
    "m1": 3.0,        
    "m2": 3.2,         
    "unknown": 2.0    
};


function getMinGhz(cpuName) {
    const lowerCpuName = cpuName.toLowerCase();  // Convert to lowercase for matching
    
    for (const key in minGhzForCpuType) {
        if (lowerCpuName.includes(key)) {
            return minGhzForCpuType[key];
        }
    }

    return minGhzForCpuType["unknown"];
}


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
    if (cpuName.includes("m3")) return cpuTypeWeights["m3"];

    // Default if CPU type is not recognized
    return cpuTypeWeights["unknown"];
}

function getIdealCpuForTask(selectedTasks) {
    let idealCpu = "i3";  // Default to the lowest acceptable CPU
    let idealGhz = 0;
    selectedTasks.forEach(task => {
        const taskIdealCpu = taskCpuRequirements[task].ideal_cpu || "i3";  
        idealGhz = Math.max(idealGhz, taskCpuRequirements[task].ideal_ghz);
        if (taskIdealCpu === "i7" || (taskIdealCpu === "i5" && idealCpu !== "i7")) {
            idealCpu = taskIdealCpu;  // Upgrade ideal CPU if needed
        }
    });
    console.log("CPU : " + idealCpu + "GHZ: " + idealGhz);
    return {idealCpu: idealCpu, idealGhz : idealGhz};
}

function calculateCpuScore(laptopCpuName, laptopCpuGhz, combinedWeights, selectedTasks) {

    const cpuScoreMultiplier = getCpuScore(laptopCpuName); // for exaple i3, 0.3 
    const {idealCpu, idealGhz } = getIdealCpuForTask(selectedTasks); // for editing i7 3.5ghz
    const idealCpuScoreMultiplier = cpuTypeWeights[idealCpu];  // its 0.9
    let laptopGhz = laptopCpuGhz || getMinGhz(laptopCpuName);
    let cpuTypeAdjustment = 1;

    if (isNaN(laptopGhz)){
        laptopGhz = getMinGhz(laptopCpuName);
    }

    if (cpuScoreMultiplier < idealCpuScoreMultiplier) {
        cpuTypeAdjustment = cpuScoreMultiplier / idealCpuScoreMultiplier;  // Dynamic adjustment
    } 
    const cpuPreScore = Math.min((cpuScoreMultiplier/idealCpuScoreMultiplier),1);
    const cpuScore = Math.min(cpuTypeAdjustment * (cpuPreScore * 100),100);
    console.log(laptopCpuName);
    console.log(cpuScoreMultiplier);
    console.log(idealCpuScoreMultiplier);
    console.log(cpuScore);

    const ghzScore = Math.min((laptopGhz / idealGhz) * 100, 100);  

    // Final CPU score: based on GHz score, adjusted by CPU type comparison
    const finalCpuScore = (ghzScore * 0.5) + (cpuScore * 0.5);

    // Apply weight for the CPU score
    return finalCpuScore;
}

function calculateLaptopScore(laptop, combinedWeights, userPreferences) {
     //new stuff to remove ------------------------------------------------------------------------------------------------------------------------------------------------
    let userScores = {
        price_score: 0,
        size_score: 0,
        portability_score: 0,
        max_score: 0,
        weight_score: 0,
        ram_score: 0,
        cpu_score: 0,
        hz_score:0, 
        storageType_score:0,
        storageSpace_score:0,
        forGaming_score:0,
        user_precentage:0
   
        //------------------------------------------------------------------------------------------------------------------------------------------------
    
   }



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
        //to remove -----------------------------------------------------------------
        userScores.price_score += 100;
        //to remove -----------------------------------------------------------------
     }
     else if (price >= minBudget && price <= maxBudget) {
        // Full score if the laptop price is within the budget range
        score += 100;
        maxScore += 100;
         //to remove -----------------------------------------------------------------
         userScores.price_score  += 100;
         //to remove ------------------------------------------------------------------
    } else if (price < minBudget && price >= (minBudget - tolerance)) {
        // If the price is below the min budget but within tolerance, calculate a reduced score
        const priceDiff = minBudget - price;
        score += Math.max(0, 100 - (priceDiff / tolerance) * 100);  // Reduce score based on how far it is below the min budget
        maxScore += 100;
        //to remove -----------------------------------------------------------------
        userScores.price_score  += Math.max(0, 100 - (priceDiff / tolerance) * 100);
        //to remove -----------------------------------------------------------------
    } else if (price > maxBudget && price <= (maxBudget + tolerance)) {
        // If the price is above the max budget but within tolerance, calculate a reduced score
        const priceDiff = price - maxBudget;
        score += Math.max(0, 100 - (priceDiff / tolerance) * 100);  // Reduce score based on how far it exceeds the max budget
        maxScore += 100;
        //to remove -----------------------------------------------------------------
        userScores.price_score  += Math.max(0, 100 - (priceDiff / tolerance) * 100);
        //to remove -----------------------------------------------------------------

    } else {
        // If the price is beyond both the min/max budget and tolerance, give it zero score
        score += 0;
        maxScore += 100;
        //to remove -----------------------------------------------------------------
        userScores.price_score  += 0;
        //to remove -----------------------------------------------------------------

    }
    
    const maxScreenHzScore = 144;  
    const maxStorageSpaceScore = 2000; 

    const ramTypeWeights = {
        "DDR3": 0.3,
        "DDR4": 0.7,
        "DDR5": 1
    };


    // RAM Size score
    const ramScore = calculateRamScore(ramSize, combinedWeights);    
    const ramTypeWeight = ramTypeWeights[laptop.ram_type] || 0;
    let ramTypeScore = Math.min((ramSize / combinedWeights.ideal_ram)*1.5, 1); 
    const ramSizeScore = ramTypeScore * ramTypeWeight * 100;
    
    if (isNaN(ramSizeScore)){
        score += ramScore;
    }
    else{
        score += ramSizeScore*0.3 + ramScore*0.7;

    }
    
    maxScore += 100
    //to remove -----------------------------------------------------------------
    userScores.ram_score = ramSizeScore*0.3 + ramScore*0.7;
    //to remove -----------------------------------------------------------------


    // CPU GHz



    const cpuScore = calculateCpuScore(laptop.cpu, laptop.cpu_ghz, combinedWeights, userPreferences.tasks);

    score += cpuScore;
    //to remove ---------------------------------------------------------------------------------------------------------------------------
    userScores.cpu_score += cpuScore;
    //to remove ---------------------------------------------------------------------------------------------------------------------
    maxScore += 100;


    
  

   // For Gaming
    let forGamingScore = forGamingWeights[laptop.for_gaming] || 0;

    // Check if the laptop name includes "גיימינג" or "gaming" as an additional gaming indicator
    if (laptop.name.toLowerCase().includes("gaming") || laptop.name.includes("גיימינג")) {
        forGamingScore = 1;  // Consider it a gaming laptop if these words are found
    }

    if (userPreferences.tasks.includes("גיימינג כבד")) {
        // Special handling if the user needs a gaming laptop
        if (forGamingScore === 1) {
            score += 100;
            //to remove ---------------------------------------------------------------------------------------------------------------------
            userScores.forGaming_score += 100; 
            //to remove ---------------------------------------------------------------------------------------------------------------------

        } else {
            score += 50;
            //to remove ---------------------------------------------------------------------------------------------------------------------
            userScores.forGaming_score += 50; 
            //to remove ---------------------------------------------------------------------------------------------------------------------
            }

        maxScore += 100

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
    
    
    const sizeImportanceLevel = userPreferences.sizeImportance;  // Get size importance level
    
    const selectedRanges = userPreferences.screenSize;  
    
    let bestSizeScore = 0;  // Track the best score from all range
    
    if (sizeImportanceLevel === "בכלל לא חשוב") {
        bestSizeScore = 100;
        SVGOn = 1;  // Full points if screen size doesn't matter
    }
    else{
        if (selectedRanges.length > 0) {
            selectedRanges.forEach(category => {
                const sizeRange = sizeRanges[category];  
                let sizeScore = 0;  
                
                if (sizeImportanceLevel === "קצת חשוב") {
                    // Allow 2 inches above or below the range
                    if (screenSize >= sizeRange.min - 2 && screenSize <= sizeRange.max + 2) {
                        sizeScore = 100;  
                        SVGOn = 1;
                    } else {
                        // Penalize for being outside the 2-inch buffer
                        const sizeDiff = Math.min(Math.abs(screenSize - sizeRange.min), Math.abs(screenSize - sizeRange.max));
                        sizeScore = Math.max(0, 100 - sizeDiff * 50);  // Penalize based on how far out of range the size is
                    }
                } else if (sizeImportanceLevel === "חשוב") {
                    // Allow 1 inch above or below the range
                    if (screenSize >= sizeRange.min - 1 && screenSize <= sizeRange.max + 1) {
                        sizeScore = 100;  // Full score if within expanded range
                        SVGOn = 1;
                    } else {
                        // Penalize for being outside the 1-inch buffer
                        const sizeDiff = Math.min(Math.abs(screenSize - sizeRange.min), Math.abs(screenSize - sizeRange.max));
                        sizeScore = Math.max(0, 100 - sizeDiff * 100);  // Penalize more heavily for being out of range
                       
                    }
                } else if (sizeImportanceLevel === "חשוב מאוד") {
                    if (screenSize >= sizeRange.min && screenSize <= sizeRange.max) {
                        sizeScore = 100;  
                        SVGOn = 1;
                    } else {
                        sizeScore = 0;  
                    }
                }
            
                bestSizeScore = Math.max(bestSizeScore, sizeScore);
            });
        }
        else{
            bestSizeScore = 100;
            SVGOn = 1;
        }
    }
        
    score += bestSizeScore;
    maxScore += 100;
    //to remove ---------------------------------------------------------------------------------------------------------------------
    userScores.size_score += bestSizeScore; 
    //to remove ---------------------------------------------------------------------------------------------------------------------


   // Define weight thresholds based on portability importance
    const portabilityThresholds = {
        "לא חשוב": Infinity,   // Any weight is acceptable
        "קצת חשוב": 2.5,       // Up to 2.5 kg
        "חשוב": 2.0,           // Up to 2.0 kg
        "חשוב מאוד": 1.7       // Up to 1.7 kg
    };

    // Get the user's portability importance level
    const portabilityLevel = userPreferences.portabilityImportance;
    const maxWeight = portabilityThresholds[portabilityLevel];
    globalMaxWeight = maxWeight;
    // Evaluate the laptop's weight
    if (weight <= maxWeight) {
        // Full score if the weight is within the acceptable limit
        score += 100;
         //to remove ---------------------------------------------------------------------------------------------------------------------
        userScores.weight_score += 100; 
        //to remove ---------------------------------------------------------------------------------------------------------------------

    } else {
        // Reduce the score based on how much the laptop exceeds the maximum weight for the given importance
        const weightDiff = weight - maxWeight;
        score += Math.max(0, 100 - weightDiff * 50);  // Penalty based on how far the weight is from the threshold
        //to remove ---------------------------------------------------------------------------------------------------------------------
        userScores.weight_score += Math.max(0, 100 - weightDiff * 50);
        //to remove ---------------------------------------------------------------------------------------------------------------------

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
    
            //to remove ---------------------------------------------------------------------------------------------------------------------
    userScores.max_score = maxScore;
    userScores.user_precentage = score;
            //to remove ---------------------------------------------------------------------------------------------------------------------
    return { precentage: (score / maxScore) * 100, details: userScores };

}

//function to rank laptops based on user preferences
function findBestLaptops(laptops, userPreferences) {
    const selectedTasks = userPreferences.tasks;
    const combinedWeights = combineTaskWeights(selectedTasks);
    const minBudget = userPreferences.budget.min;
    const maxBudget = userPreferences.budget.max;
    const rankedLaptops = laptops.map(laptop => {
        //const laptopScore = calculateLaptopScore(laptop, combinedWeights, userPreferences); ---------------------------------------------------------------------
        const { precentage, details} = calculateLaptopScore(laptop, combinedWeights, userPreferences);
        //------------------------------------------------------------------------------------------------------------------------------------------
        let priceNumber = parseFloat(
            laptop.price
                .replace(/,/g, '')          // Remove commas
                .replace(/[^0-9.]/g, '')    // Remove non-numeric and non-period characters
        ) || 0;

        if (isNaN(precentage)) {
            console.error('Skipping laptop due to NaN score:', laptop);
            return null;
        }
        return {
            ...laptop,
            //score: laptopScore,------------------------------------------------------------------------------------------------------------------------------------------
            score: precentage,
            details: details,
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




// Function to calculate and display the results
function showResults() {

    showLoadingSpinner();

    fetch('laptops.json')
        .then(response => response.json())
        .then(laptops => {
            const results = findBestLaptops(laptops, userPreferences);  
            hideLoadingSpinner();
            displayResults(results, 5);
        })
        .catch(error => {
            console.error('Error Fetching laptops:', error);

            // Hide the loading spinner in case of error
            hideLoadingSpinner();
        });
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
            return;  
        }

        const minBudget = userPreferences.budget.min;
        const maxBudget = userPreferences.budget.max;
        const laptopPrice = parseInt(laptop.price.replace(/[^\d]/g, '')) || 0;
        const laptopWeight = parseFloat(laptop.weight.replace(/[^\d.]/g, '')) || 0;    
        const laptopScreenSize_ = parseFloat(laptop.screen_size.replace(/[^\d.]/g, '')) || 0;
        const preferredScreenSizes = userPreferences.screenSize; // Array of user-selected sizes
        let weightIndicatorSVG;
        let budgetIndicatorSVG;
        let screenIndicatorSVG;

        if (laptopPrice <= maxBudget) {
            budgetIndicatorSVG = checkMarkSVG;
        } else {
            budgetIndicatorSVG = xSVG;
        }

        if (laptopWeight <= globalMaxWeight) {
            weightIndicatorSVG = checkMarkSVG;
        } else {
            weightIndicatorSVG = xSVG;
        }
        
        // Default icon if screen size doesn't match user preferences
            screenIndicatorSVG = xSVG;
        // Loop through user's preferred screen size ranges to check for a match
       
        if(SVGOn){
            screenIndicatorSVG = checkMarkSVG;
        }
    

        


        const laptopNameModified = laptop.name.replace("מחשב נייד", "").trim();
        const laptopInfo = document.createElement('div');
        laptopInfo.classList.add('laptop-card');
        laptopInfo.innerHTML = `
        <div class="inner-card">
        <div class="inner-precentage">
            <circle-progress text-format="percent" value="${laptop.score.toFixed(2)}" max="100"></circle-progress>
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

                <!--------- 
                FOR TESTING
                <ol>
                    <li>Price Score: ${laptop.details.price_score.toFixed(2)}</li>
                    <li>Size Score: ${laptop.details.size_score.toFixed(2)}</li>
                    <li>Portability Score: ${laptop.details.weight_score.toFixed(2)}</li>
                    <li>RAM Score: ${laptop.details.ram_score.toFixed(2)}</li>
                    <li>CPU Score: ${laptop.details.cpu_score.toFixed(2)}</li>
                    <li>Refresh Rate Score: ${laptop.details.hz_score.toFixed(2)}</li>
                    <li>Storage Type Score: ${laptop.details.storageType_score.toFixed(2)}</li>
                    <li>Storage Space Score: ${laptop.details.storageSpace_score.toFixed(2)}</li>
                    <li>Gaming Score: ${laptop.details.forGaming_score.toFixed(2)}</li>
                    
                    <li> Max Score: ${laptop.details.max_score.toFixed(2)}</li>
                    <li> sum Score: ${(laptop.details.price_score + laptop.details.size_score + laptop.details.weight_score + laptop.details.ram_score + laptop.details.cpu_score + laptop.details.hz_score + laptop.details.storageType_score + laptop.details.storageSpace_score + laptop.details.forGaming_score ).toFixed(2)}</li>
                    <li>Laptop Score: ${laptop.score.toFixed(2)}</li>
                    <li>Laptop calculated score: ${(((laptop.details.price_score +  laptop.details.size_score + laptop.details.weight_score + laptop.details.ram_score + laptop.details.cpu_score + laptop.details.hz_score + laptop.details.storageType_score + laptop.details.storageSpace_score + laptop.details.forGaming_score)/laptop.details.max_score) * 100).toFixed(2)}</li>
                    <li> user precentage: ${laptop.details.user_precentage}</i>    
                </ol>
                        ----------------------!>

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

