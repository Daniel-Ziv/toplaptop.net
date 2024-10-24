let currentStep = -1;
const sections = document.querySelectorAll('.section');
const welcomePage = document.getElementById('welcome');
const progress = document.getElementById('progress');
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const resultsSection = document.getElementById('results-container');  // Results section
let currentSortBy = 'score';




// Function to capture form data based on the current step/question
function captureFormData(stepIndex) {
    // Based on the step index, capture the corresponding form data
    if (stepIndex === 0) {
         // Tasks (question 1)
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

         console.log(userPreferences.tasks);

    } else if (stepIndex === 1) {
      
        // Price Importance (question 2)
        const priceForm = document.forms['price-form'];
        const priceValue = priceForm.elements['priceImportance'].value;
        userPreferences.priceImportance = priceValue || userPreferences.priceImportance;
        
        // Get the selected price range from the noUiSlider
        const budgetSlider = document.getElementById('doubleRangeSlider');
        const selectedRange = budgetSlider.noUiSlider.get();  // This returns an array of [min, max]
        userPreferences.budget = {
            min: parseInt(selectedRange[0]),
            max: parseInt(selectedRange[1])
        };
        console.log(userPreferences.budget.min);
        console.log(userPreferences.budget.max);
        console.log(userPreferences.priceImportance);


// You can now use userPreferences.budgetRange.min and userPreferences.budgetRange.max later on


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
        console.log(userPreferences.sizeImportance)
        console.log(userPreferences.screenSize)
    


    } else if (stepIndex === 3) {
        // Portability Importance (question 4)
        const portabilityForm = document.forms['portability-form'];
        const portabilityValue = portabilityForm.elements['portabilityImportance'].value;
        userPreferences.portabilityImportance = portabilityValue || userPreferences.portabilityImportance;  
        console.log(userPreferences.portabilityImportance)

    }

}

// Function to validate that at least one task is selected
function validateTaskSelection() {
    const tasksForm = document.forms['tasks-form'];
    const tasksForm2 = document.forms['tasks-form2'];

    const selectedTasks1 = Array.from(tasksForm.elements['activity']).filter(task => task.checked);
    const selectedTasks2 = Array.from(tasksForm2.elements['activity']).filter(task => task.checked);

    const selectedTasks = [...selectedTasks1, ...selectedTasks2];

    const errorMessageDiv = document.getElementById('task-error-message');

    if (selectedTasks.length === 0) {
        errorMessageDiv.textContent = "חובה לבחור לפחות משימה אחת"; // Set the error message
        errorMessageDiv.style.display = "block"; // Show the error message
        return false; // Prevent proceeding to the next step
    }

    errorMessageDiv.style.display = "none"; // Hide the error message if selection is valid
    return true; // Allow proceeding to the next step
}

function validateSizeSection() {
    // Get the size importance radio buttons
    const size_form = document.forms["size-form"];
    const selectedSizeImportance = size_form.elements["sizeImportance"].value;
    const sizeErrorMessageDiv = document.getElementById('size-error-message');

    // If "בכלל לא חשוב" is selected, no need to check dropdown
    if (selectedSizeImportance === "בכלל לא חשוב") {
        return true; // Allow submission
    }
    
    // If any other option is selected, check the size selection dropdown
    const sizeTypeForm = document.forms["sizeType-form"];
    const sizeSelection = sizeTypeForm.querySelectorAll('input[name="size"]:checked');

    // If no size checkbox is selected, display an error message
    if (sizeSelection.length === 0) {
        sizeErrorMessageDiv.textContent = "חובה לבחור"; // Set the error message
        sizeErrorMessageDiv.style.display = "block"; // Show the error message
        return false; // Prevent submission
    }

    return true; // Allow submission if a size was selected
}


function validatePortSection() {

    const portabilityForm = document.forms["portability-form"];
    const portabilityErrorMessageDiv = document.getElementById('portability-error-message');

    const selectedPortability = portabilityForm.querySelector('input[name="portabilityImportance"]:checked');

    if (!selectedPortability) {
        portabilityErrorMessageDiv.textContent = "חובה לבחור אפשרות";
        portabilityErrorMessageDiv.style.display = "block"; 
        return false; 
    }

    portabilityErrorMessageDiv.style.display = "none"; 
    return true; 
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
    if (currentStep === 0) {
        // Validate task selection on step 0 (task form)
        if (!validateTaskSelection()) {
            return; // Prevent moving to the next step if no tasks are selected
        }
    }

    if (currentStep === 2) {
        // Validate task selection on step 0 (task form)
        if (!validateSizeSection()) {
            return; // Prevent moving to the next step if no tasks are selected
        }
    }
    
    if (currentStep === 3) {
        // Validate task selection on step 0 (task form)
        if (!validatePortSection()) {
            return; // Prevent moving to the next step if no tasks are selected
        }
    }


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
    if (currentStep === 1) {
        const suggestedBudget = combineBudgetRanges(userPreferences.tasks);
        userPreferences.suggestedBudget = suggestedBudget;

        // Update slider
        const budgetSlider = document.getElementById('doubleRangeSlider');
        budgetSlider.noUiSlider.updateOptions({
            start: [suggestedBudget.min, suggestedBudget.max],
            range: {
                'min': 500,
                'max': 12000
            }
        });
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
function togglePriceFilter() {
    currentSortBy = 'price';
    fetch('laptops.json')
        .then(response => response.json())
        .then(laptops => {
            const results = findBestLaptops(laptops, userPreferences);  
            displayResults(results, 5);
        })
        .catch(error => {
            console.error('Error Fetching laptops:', error);

            // Hide the loading spinner in case of error
        });
}

function sortByScore() {
    currentSortBy = 'score';
    fetch('laptops.json')
        .then(response => response.json())
        .then(laptops => {
            const results = findBestLaptops(laptops, userPreferences);  
            displayResults(results, 5);
        })
        .catch(error => {
            console.error('Error Fetching laptops:', error);

            // Hide the loading spinner in case of error
        });
}


