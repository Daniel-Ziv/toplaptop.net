// Function to update the budget value dynamically
function updateSliderValue() {
    const slider = document.getElementById("budgetSlider");
    const output = document.getElementById("budgetValue");
    output.innerHTML = slider.value;
  }
  
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
  