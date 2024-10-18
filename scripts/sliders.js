// Function to update the budget value dynamically

  
  // Function to handle form submission
  function submitForm() {
    const form = document.getElementById("questionForm");
    const budget = document.getElementById("budgetSlider").value;
  
    // Get the selected radio button value
    const selectedOption = form.querySelector('input[name="priceImportance"]:checked');
    
   
  
    const userAnswer = {
      priceImportance: selectedOption.value,
      budget: budget
    };
  
    
    
  }

  function showSlider(){
    const sliderdiv = document.getElementsByClassName("budget-selection")[0];
    sliderdiv.style.display = 'block';
  }
  
  function hideSlider(){
    const sliderdiv = document.getElementsByClassName("budget-selection")[0];
    sliderdiv.style.display = 'none';
  }
  
  function showSizeSelection(){
    const sizediv = document.getElementsByClassName("size-selection")[0];
    sizediv.style.display = 'block';
  }

  function hideSizeSelection(){
    const sizediv = document.getElementsByClassName("size-selection")[0];
    sizediv.style.display = 'none';
  }

  function hidePortabilityText(){
    const sliderdiv = document.getElementsByClassName("portability-text")[0];
    sliderdiv.style.display = 'none';
  }

  function showPortabilityText(){
    const sliderdiv = document.getElementsByClassName("portability-text")[0];
    sliderdiv.style.display = 'block';
  }

  
  //double range slider on budget selection: 
  
  var slider = document.getElementById('doubleRangeSlider');

// Initialize the noUiSlider
noUiSlider.create(slider, {
    start: [1000, 3000],  // Initial values of the handles
    connect: true,    // Connects the handles with a colored bar
    range: {
        'min': 500,     // Minimum value
        'max': 6000    // Maximum value

    },
    direction: 'rtl',
    tooltips: [true, true], // Enable tooltips for both handles
    step: 50,
    format: {
        // Function to format the number to an integer
        to: function (value) {
            return Math.round(value); // Convert float to int
        },
        // Preserve the same value without modifications when from the user
        from: function (value) {
            return Number(value); 
        }
    }
});
