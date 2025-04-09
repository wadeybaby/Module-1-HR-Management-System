// Define constants and initial data
const hourly_rate = 379;
let payrollData = [];
let employeeInfo = [];
let dataLoaded = false;
// Fallback function to safely return a value when the value is undefined
function getSafeValue(value, fallback = "N/A") {
  return value !== null && value !== undefined ? value : fallback;
}
// Load payroll and employee data from JSON files
(async function loadData() {
  try {
    // Use Promise.all to load both JSON files concurrently
    const [payrollRes, employeeRes] = await Promise.all([
      fetch("payroll_data.json").then((response) => response.json()),
      fetch("employeeData.json").then((response) => response.json()),
    ]);
    // Assign the loaded data to the proper arrays
    payrollData = payrollRes.payrollData || [];
    employeeInfo = employeeRes.employeeInformation || [];
    console.log("Data loaded:", { payrollData, employeeInfo });
    dataLoaded = true;
    displayPayrollTable();
  } catch (error) {
    // Handle error, if data fails to load
    console.error("Failed to load data:", error);
  }
})();
// Function to show the payroll data table
function displayPayrollTable() {
  const tableBody = document.querySelector("#payrollTable tbody");
  if (!tableBody) return;
  // Build and insert the table rows based on the payroll and employee data given
  tableBody.innerHTML = payrollData
    .map((payroll) => {
      // Find employee information for this payroll entry
      const employee =
        employeeInfo.find((e) => e.employeeId === payroll.employeeId) || {};
      const monthlySalary = calculateSalary(
        payroll.hoursWorked,
        payroll.leaveDeductions
      );
      const annualSalary = monthlySalary * 12;
      return `
                <tr>
                    <td>${getSafeValue(payroll.employeeId)}</td>
                    <td>${getSafeValue(employee.name)}</td>
                    <td><input type="number" value="${
                      payroll.hoursWorked
                    }" data-id="${payroll.employeeId}" class="hours"></td>
                    <td><input type="number" value="${
                      payroll.leaveDeductions
                    }" data-id="${payroll.employeeId}" class="deductions"></td>
                    <td id="salary-${
                      payroll.employeeId
                    }">R ${monthlySalary.toFixed(2)}</td>
                    <td id="annual-salary-${
                      payroll.employeeId
                    }">R ${annualSalary.toFixed(2)}</td>
                    <td><button onclick="generatePayslip(${
                      payroll.employeeId
                    })">Generate Payslip</button></td>
                </tr>
            `;
    })
    .join("");
  // Attach listeners to input fields
  addInputListeners();
}
// function to attach listeners for real-time updates
function addInputListeners() {
  const inputs = document.querySelectorAll(".hours, .deductions");
  inputs.forEach((input) => {
    // Listen for changes in the input values
    input.addEventListener("change", (event) => {
      const { target } = event;
      const employeeId = parseInt(target.dataset.id, 10);
      const payroll = payrollData.find((e) => e.employeeId === employeeId);
      if (!payroll) {
        console.error("Invalid employee ID");
        return;
      }
      // Ensures the new value isn't negative
      const newValue = Math.max(0, parseInt(target.value, 10) || 0);
      // Ensures that leave deductions do not exceed the hours worked
      if (
        target.classList.contains("deductions") &&
        newValue > payroll.hoursWorked
      ) {
        alert("Leave deductions cannot exceed hours worked.");
        target.value = payroll.leaveDeductions;
        return;
      }
      // Update the payroll data based on the input
      if (target.classList.contains("hours")) {
        // Update hours worked
        payroll.hoursWorked = newValue;
      } else {
        // Update leave deductions
        payroll.leaveDeductions = newValue;
      }
      const updatedSalary = calculateSalary(
        payroll.hoursWorked,
        payroll.leaveDeductions
      );
      // Update the final salary in payroll data
      payroll.finalSalary = updatedSalary;
      document.getElementById(
        `salary-${employeeId}`
      ).innerText = `R ${updatedSalary.toFixed(2)}`;
    });
  });
}
// Function to calculate the salary based on hours worked and deductions
function calculateSalary(hoursWorked, leaveDeductions) {
  // Makes sure there are no negative hours
  const adjustedHours = Math.max(
    0,
    hoursWorked - Math.min(leaveDeductions, hoursWorked)
  );
  return adjustedHours * hourly_rate;
}
// Function to generate a payslip for a specific employee
function generatePayslip(employeeId) {
  // Finds payroll data for the employee
  const payroll = payrollData.find((e) => e.employeeId === employeeId);
  // Finds employee information for the employee
  const employee = employeeInfo.find((e) => e.employeeId === employeeId);
  if (!payroll || !employee) {
    alert("Employee data missing!");
    return;
  }
  // Opens a new window and then generates the payslip
  const payslipWindow = window.open("", "_blank");
  payslipWindow.document.write(`
        <html>
        <head>
            <title>Payslip for ${getSafeValue(employee.name)}</title>
            <style>
               body {
                background-image: url('../assets/195384443_80e5a83e-0a99-494d-9489-4e89a8630084.jpg');
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                font-family: 'Roboto', sans-serif;
                text-align: center;
                margin: 0; /* Remove default browser margin */
                color: #FFFFFF;
                height: 100%; /* Ensure the body covers the full height of the viewport */
                display: flex;
                flex-direction: column;
                justify-content: space-between; /* Push the footer to the bottom */
                width: 100%; /* Make sure the body width is 100% */
            }

            h1 {
                margin-top: 20px; /* Add space above the heading */
                padding-top: 10px; /* Optional, adds inner spacing */
                color: #FFFFFF;
            }

            table {
                width: 80%; /* Adjust width to leave space on the sides */
                margin: 2rem auto; /* Add vertical spacing and center the table horizontally */
                border-collapse: collapse;
                background: rgba(0, 0, 0, 0.5);
                color: #FFFFFF;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
                border-radius: 0.5rem;
                font-size: 1rem;
                padding: 1rem; /* Add inner padding to avoid text touching the table border */
                text-align: left; /* Align text to the left */
            }

            th, td {
                padding: 12px;
                text-align: center;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            th {
                background-color: #3333FF;
                text-transform: uppercase;
            }

            tr:nth-child(even) {
                background-color: rgba(4, 0, 70, 0.8);
            }

            tr:nth-child(odd) {
                background-color: rgba(4, 0, 70, 0.6);
            }

            button {
                background-color: #040046;
                color: #FFFFFF;
                padding: 8px 10px;
                border: none;
                border-radius: 5px;
                font-size: 0.9rem;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }

            button:hover {
                background-color: #3333FF;
            }

            /* Footer */
            footer {
                position: fixed;
                bottom: 0;
                width: 100%;
                text-align: center;
                padding: 1rem;
                background-color: #000000;
                color: #ffffff;
                box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.5);
                animation: fadeIn 1s ease-in-out;
            }
            </style>
        </head>
        <body>
            <h1>Payslip</h1>
            <table>
                <tr><th>Employee Name</th><td>${getSafeValue(
                  employee.name
                )}</td></tr>
                <tr><th>Position</th><td>${getSafeValue(
                  employee.position
                )}</td></tr>
                <tr><th>Employee ID</th><td>${getSafeValue(
                  payroll.employeeId
                )}</td></tr>
                <tr><th>Hours Worked</th><td>${getSafeValue(
                  payroll.hoursWorked
                )}</td></tr>
                <tr><th>Leave Deductions</th><td>${getSafeValue(
                  payroll.leaveDeductions
                )}</td></tr>
                <tr><th>Final Salary</th><td>R ${payroll.finalSalary.toFixed(
                  2
                )}</td></tr>
            </table>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <!-- Footer -->
<footer>
  <p>&copy; 2024 MODERNTECH SOLUTIONS. All rights reserved.</p>
</footer>
        </body>
        </html>
    `);
  payslipWindow.document.close();
}
