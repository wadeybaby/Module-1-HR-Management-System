// Function to search for an employee by ID
async function searchEmployee() {
  let searchInput = document.getElementById("searchInput").value.trim(); 
  let resultsContainer = document.getElementById("employeeList");

  // Clears previous results
  resultsContainer.innerHTML = "";

  // Condition to check if the search input is empty
  if (!searchInput) {
    resultsContainer.innerHTML = `<p class='text-warning'>Please enter a valid employee ID to search.</p>`;
    return;
  }

  // Search in the fetched employee data
  let result = (window.employeeData || []).find(
    (employee) => employee.employeeId.toString() === searchInput
  );

  // Condition to check if the employee is found
  if (result) {
    resultsContainer.innerHTML = `
          <div class="card m-2">
              <div class="card-body">
                  <h2 class="card-title">Name: ${result.name}</h2>
                  <hr>
                  <p class="card-text"><strong>Position:</strong> ${result.position}</p>
                  <p class="card-text"><strong>Department:</strong> ${result.department}</p>
                  <p class="card-text"><strong>Salary:</strong> ${result.salary}</p>
                  <p class="card-text"><strong>Employment History:</strong> ${result.employmentHistory}</p>
                  <p class="card-text"><strong>Contact:</strong> ${result.contact}</p>
              </div>
          </div>
      `;
  } else {
    resultsContainer.innerHTML = `<p class='text-danger'>No employee found with ID ${searchInput}.</p>`;
  }
}

// Function to open the performance review page (new tab)
function openPerformanceReview(employeeId) {
  let reviewUrl = `../performance/performance.html?employeeId=${employeeId}`;
  window.open(reviewUrl, "_blank");
}


let employeeData = []; // Store employee data globally

// Function to display data fetched from JSON File
async function displayData() {
  let container = document.getElementById("data-container");

  try {
    let response = await fetch("EmployeeData.json");
    let data = await response.json();
    employeeData = data.employeeInformation; 
    window.employeeData = data.employeeInformation; 

    renderEmployees(); 
  } catch (error) {
    console.error("Error:", error);
    container.innerHTML = "<p class='text-danger'>Error: Data not found.</p>";
  }
}

// Function that sends and displays data into the div 'data-container'
function renderEmployees() {
  let container = document.getElementById("data-container");
  container.innerHTML = ""; 

  employeeData.forEach((item, index) => {
    let card = document.createElement("div");
    card.className = "card m-2";

    card.innerHTML = `
      <div class="card-body">
        <h4 class="card-01"><strong>Name:</strong> ${item.name}</h4>
        <hr>
        <p class="card-text"><strong>Position:</strong> ${item.position}</p>
        <p class="card-text"><strong>Department:</strong> ${item.department}</p>
        <p class="card-text"><strong>Salary:</strong> R ${item.salary}</p>
        <p class="card-text"><strong>Employment History:</strong> ${item.employmentHistory}</p>
        <p class="card-text"><strong>Contact:</strong> ${item.contact}</p>
        <!-- Button Container -->
        <div class="d-flex justify-content-between mt-3">
          <!--<button id="performance-review-btn" class="btn btn-light" onclick="openPerformanceReview('${item.employeeId}')">Performance Review</button>--!>
          <button class="btn btn-light" onclick="deleteEmployee(${index})">Delete</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Function for the button to 'Add employees'
document
  .getElementById("addEmployeeForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form values
    let newEmployee = {
      employeeId: employeeData.length + 1,
      name: document.getElementById("name").value,
      position: document.getElementById("position").value,
      department: document.getElementById("department").value,
      salary: parseInt(document.getElementById("salary").value),
      employmentHistory: document.getElementById("employmentHistory").value,
      contact: document.getElementById("contact").value,
    };

    // Add new employee to the array
    employeeData.push(newEmployee);

    // ClearS the form
    this.reset();
    alert("Employee added");
    renderEmployees();
  });

function deleteEmployee(index) {
  // Remove the employee from the array
  employeeData.splice(index, 1);

  renderEmployees();
}

window.onload = displayData;
