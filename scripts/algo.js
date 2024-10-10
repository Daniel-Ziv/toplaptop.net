// User preferences object to store form data
const userPreferences = { 
    priceImportance: 'לא חשוב',
    budget: 2500,  
    tasks: ['גלישה באינטרנט'],
    sizeImportance: 'לא חשוב',
    screenSize:[],
    portabilityImportance: 'לא חשוב'
};


const priceImportance = {
    "בכלל לא חשוב": 0.5,
    "קצת חשוב": 1,
    "חשוב": 2,
    "חשוב מאוד": 4
};

// Multiplier for size importance
const sizeImportance = {
    "בכלל לא חשוב": 0.5,
    "קצת חשוב": 1,
    "חשוב": 2,
    "חשוב מאוד": 3
};

const laptopSize = {
    "קטנטן": 13,
    "קטן": 14,
    "בינוני": 16,
    "גדול" : 16
}

// Multiplier for portability importance
const portabilityImportance = {
    "בכלל לא חשוב": 0.5,
    "קצת חשוב": 1,
    "חשוב": 2,
    "חשוב מאוד": 3
};

 /*"name": "מחשב נייד Asus Vivobook 16X K3605ZC-N1453 אסוס",
"price": "3,872 ₪",
"url": "https://www.zap.co.il/compmodels.aspx?modelid=1232235",
"product_img": "https://img.zap.co.il/pics/3/6/0/3/89443063c.gif",
"ram_type": "DDR4",
"storage_space": "1000 GB",
"storage_type": "SSD",
"screen_size": "16 אינטש",
"for_gaming": "לא רלוונטי",
"os": "ללא",
"weight": "1.8 ק\"ג",
"cpu": "Intel Core i7",
"ram_size": "16 GB",
"cpu_ghz": "2.3Ghz",
"screenhz": "120 Hz"
*/

// Task weights for specific tasks
const taskWeights = {
    "גלישה באינטרנט": { 
        ram_size: 0.1, 
        cpu_ghz: 0.1, 
        screenHz: 0.1, 
        screen_size: 0.3, 
        storage_type: 0.1, 
        ram_type: 0.05,
        storage_space: 0,
        for_gaming: 0       
    },
    "תוכנות מידול/אנימציה": { 
        ram_size: 0.5, 
        cpu_ghz: 0.5, 
        screenHz: 0.2, 
        storage_type: 0.5, 
        ram_type: 0.5,
        storage_space: 0.5        
    },
    "תכנות קל(סטודנטים)": { 
        ram_size: 0.4, //higher = more ram is good 
        cpu_ghz: 0.2, //higher = more GHZ is better
        screenHz: 0.1, //the higher, the more hz is better
        storage_type: 0.3, //the higher, ssd is better
        ram_type: 0.05, //gddr4/5, the higher, 5 is better
        storage_space: 0    //the higher is more gb in ssd/hd    
    },
    "עריכת תמונות": { 
        ram_size: 0.3, 
        cpu_ghz: 0.4, 
        screenHz: 0.1, 
        storage_type: 0.5, 
        ram_type: 0.05,
        storage_space: 0.2  
    },
    "עריכת סרטונים": { 
        ram_size: 0.2, 
        cpu_ghz: 0.1, 
        screenHz: 0.1, 
        storage_type: 0.1, 
        ram_type: 0.05,
        storage_space: 0  
    },
    "סרטים/זום/צפייה בהרצאות": { 
        ram_size: 0.1, 
        cpu_ghz: 0.1, 
        screenHz: 0.1, 
        storage_type: 0.1, 
        ram_type: 0.05,
        storage_space: 0      
    },
    "כתיבת מסמכים": { 
        ram_size: 0.1, 
        cpu_ghz: 0.1, 
        screenHz: 0.1, 
        storage_type: 0.1, 
        ram_type: 0.05,
        storage_space: 0   
    },
    "גיימינג כבד": { 
        ram_size: 0.1, 
        cpu_ghz: 0.1, 
        screenHz: 0.1, 
        storage_type: 0.1, 
        ram_type: 0.05,
        storage_space: 0  
    },
    "עריכת מוזיקה": { 
        ram_size: 0.1, 
        cpu_ghz: 0.1, 
        screenHz: 0.1, 
        storage_type: 0.1, 
        ram_type: 0.05,
        storage_space: 0  
    },
    "תכנות כבד": { 
        ram_size: 0.1, 
        cpu_ghz: 0.1, 
        screenHz: 0.1, 
        storage_type: 0.1, 
        ram_type: 0.05,
        storage_space: 0  
    }
};




// Evaluate a laptop based on user preferences
function evaluateLaptop(laptop, userPreferences) {
    let score = 0;
    let maxScore = 0;

    // Convert laptop data to numbers, fallback to 0 if data is missing or invalid
    const ramSize = parseFloat(laptop.ram_size.replace(/[^\d.]/g, '')) || 0;  
    const cpuGhz = parseFloat(laptop.cpu_ghz.replace(/[^\d.]/g, '')) || 0;    
    const storageSpace = parseInt(laptop.storage_space.replace(/[^\d.]/g, '')) || 0;  
    const screenSize = parseFloat(laptop.screen_size.replace(/[^\d.]/g, '')) || 0;   
    const weight = parseFloat(laptop.weight.replace(/[^\d.]/g, '')) || 0;    
    const price = parseInt(laptop.price.replace(/[^\d]/g, '')) || 0; 


    // Price evaluation
    const priceDiff = price - userPreferences.budget;
    if (priceDiff <= 0) {
        score += 100 * priceImportance[userPreferences.priceImportance];
    } else {
        const priceScore = Math.max(0, 100 - priceDiff * priceImportance[userPreferences.priceImportance]);
        score += priceScore;

    }
    maxScore += 100;


    // Task evaluation
    userPreferences.tasks.forEach(task => {
        const taskWeight = taskWeights[task];
        if (taskWeight) {
            if (ramSize >= 16) score += 100 * taskWeight.ram;
            else if (ramSize >= 8) score += 50 * taskWeight.ram;
            maxScore += 100 * taskWeight.ram;

            if (cpuGhz >= 3.0) score += 100 * taskWeight.cpu;
            else if (cpuGhz >= 2.5) score += 50 * taskWeight.cpu;
            maxScore += 100 * taskWeight.cpu;

            if (storageSpace >= 512) score += 100 * taskWeight.disk;
            else if (storageSpace >= 256) score += 50 * taskWeight.disk;
            maxScore += 100 * taskWeight.disk;


        }
    });

    // Size evaluation
    const sizeDiff = Math.abs(screenSize - 15);
    score += Math.max(0, 100 - sizeDiff * sizeImportance[userPreferences.sizeImportance]);
    maxScore += 100;

    // Portability evaluation (weight)
    const weightDiff = weight - 2.0;
    score += (weightDiff <= 0 ? 100 : Math.max(0, 100 - weightDiff * portabilityImportance[userPreferences.portabilityImportance]));
    maxScore += 100;
    // Return percentage score
    return (score / maxScore) * 100;
}


// Rank all laptops based on user preferences
function findBestLaptops(laptops, userPreferences) {
    const rankedLaptops = laptops.map(laptop => ({
        ...laptop,
        score: evaluateLaptop(laptop, userPreferences)
    }));

    rankedLaptops.sort((a, b) => b.score - a.score);
    return rankedLaptops;
}



// Display results on the page
function displayResults(results) {
    
    const resultsDiv = document.getElementById('results-container');  // Correct ID
    resultsDiv.innerHTML = '';  // Clear previous results
    results.forEach(laptop => {
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
            <a href="${laptop.url}" class="laptop-action">קישור למוצר</a>
        </div>
        `;
        
        resultsDiv.appendChild(laptopInfo);  // Append to correct container
            });
        
        document.querySelectorAll('.progress-circle').forEach(function(progressCircle) {
        const score = progressCircle.getAttribute('data-score');
        console.log(laptop.score)
        createProgressCircle(progressCircle, score);  // Initialize CircleProgress with the laptop's score
    });

}

