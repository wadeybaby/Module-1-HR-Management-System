document.getElementById("performanceReviewForm").addEventListener("submit", function (event) {
  // Prevent the default form submission
  event.preventDefault(); 

  // Get form values
  let employeeName = document.getElementById("employeeName").value;
  let department = document.getElementById("department").value;
  let communication = document.getElementById("communication").value;
  let productivity = document.getElementById("productivity").value;
  let comments = document.getElementById("comments").value;

  // Validate inputs
  if (!employeeName || !communication || !productivity) {
      alert("Please fill all required fields.");
      return;
  }

  // Create a new table row
  const newRow = document.createElement("tr");

  // Add data cells to the row
  newRow.innerHTML = `
      <td>${employeeName}</td>
      <td>${department}</td>
      <td>${communication}</td>
      <td>${productivity}</td>
      <td>${comments}</td>
  `;

  // Append the new row to the table
  document.querySelector("#reviewsTable tbody").appendChild(newRow);

  // Reset the form after submission
  document.getElementById("performanceReviewForm").reset();

  // Provide user feedback
  alert("Review submitted successfully!");
});