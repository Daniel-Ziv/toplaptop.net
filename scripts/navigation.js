let currentStep = -1;
const sections = document.querySelectorAll('.section');
const welcomePage = document.getElementById('welcome');
const progress = document.getElementById('progress');
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const resultsSection = document.getElementById('results-container');  // Results section




// Function to capture form data based on the current step/question
function captureFormData(stepIndex) {
    // Based on the step index, capture the corresponding form data
    if (stepIndex === 0) {
        // Price Importance (question 1)
        const priceForm = document.forms['price-form'];
        const priceValue = priceForm.elements['priceImportance'].value;
        userPreferences.priceImportance = priceValue || userPreferences.priceImportance;
        
        //budget value:
        const budgetSlider = document.getElementById('budgetSlider');
        userPreferences.budget = budgetSlider.value || userPreferences.budget;
        //console.log(userPreferences.priceImportance)
        //console.log(userPreferences.budget)


    } else if (stepIndex === 1) {
        // Tasks (question 2)
        const tasksForm = document.forms['tasks-form'];
        const tasksForm2 = document.forms['tasks-form2'];

        const selectedTasks1 = Array.from(tasksForm.elements['activity'])
            .filter(task => task.checked)
            .map(task => task.value);
        
        const selectedTasks2 = Array.from(tasksForm2.elements['activity'])
            .filter(task => task.checked)
            .map(task => task.value);

        userPreferences.tasks = [...selectedTasks1, ...selectedTasks2].length > 0 ? [...selectedTasks1, ...selectedTasks2] : userPreferences.tasks;
        //console.log(userPreferences.tasks)


    } else if (stepIndex === 2) {
        // Size Importance (question 3)
        const sizeForm = document.forms['size-form'];
        const sizeValue = sizeForm.elements['sizeImportance'].value;
        const Whatsize = document.forms['sizeType-form']
        const selectedSizes = Array.from(Whatsize.elements['size'])

        .filter(size => size.checked)  
        .map(size => size.value);

        userPreferences.screenSize = selectedSizes.length > 0 ? selectedSizes : ['קטנטן','גדול','בינוני','קטן']
        userPreferences.sizeImportance = sizeValue || userPreferences.sizeImportance; 
        //console.log(userPreferences.sizeImportance)
        //console.log(userPreferences.screenSize)


    } else if (stepIndex === 3) {
        // Portability Importance (question 4)
        const portabilityForm = document.forms['portability-form'];
        const portabilityValue = portabilityForm.elements['portabilityImportance'].value;
        userPreferences.portabilityImportance = portabilityValue || userPreferences.portabilityImportance;  
        //console.log(userPreferences.portabilityImportance)

    }

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
            console.error('Error fetching laptops:', error);

            // Hide the loading spinner in case of error
            hideLoadingSpinner();
        });
}


//show what section we are in at the top of the page 
function showStep(stepIndex) {
    if (stepIndex === -1) {
        // Show welcome page, hide sections
        welcomePage.classList.add('active-section');
        sections.forEach(step => step.classList.remove('section-active'));
        welcomePage.style.display = 'block';
        progress.style.display = 'none'; // Hide progress bar for welcome page

    }
     
    else {
        // Hide welcome page, show the current section
        welcomePage.style.display = 'none';
        sections.forEach((section, index) => {
            section.classList.remove('section-active');
            if (index === stepIndex) {
                section.classList.add('section-active');
            }
        });
        if(stepIndex == 4){
            progress.style.display = 'none'
        } 
        else{
        progress.style.display = 'block'; // Show progress bar for sections
        }
        // Update progress
        progress.innerText = `שאלה ${stepIndex + 1} מתוך ${sections.length - 1} `;

 
    }
}

function nextStep() {
    if (currentStep >= 0 && currentStep < sections.length - 1) {
        captureFormData(currentStep);  // Capture data from the current step
    }

    if (currentStep < sections.length - 1) {
        currentStep++;
        showStep(currentStep);

        // If we are at the last step, display the results
        if (currentStep === sections.length - 1) {
            showResults();
        }
    }
}

function prevStep() {
    if (currentStep > -1) {
        currentStep--;
        showStep(currentStep);
    }
}

// Initialize the first step
showStep(currentStep);

function updateBudgetValue(value) {
    document.getElementById('budgetValue').innerText = value;
}


// Function to show the loading spinner
function showLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    spinner.style.display = 'flex';
}

// Function to hide the loading spinner
function hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    spinner.style.display = 'none';
}


