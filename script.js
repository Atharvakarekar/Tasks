let students = [];
const tableBody = document.getElementById("studentTable");
const errorMessage = document.getElementById("errorMessage");
const searchInput = document.getElementById("search");
let scoreChart;

// Handle Form Submission
document.getElementById("studentForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const math = Number(document.getElementById("math").value);
    const science = Number(document.getElementById("science").value);
    const english = Number(document.getElementById("english").value);

    if (!name || isNaN(math) || isNaN(science) || isNaN(english) || math < 0 || math > 100 || science < 0 || science > 100 || english < 0 || english > 100) {
        errorMessage.textContent = "Invalid input!";
        return;
    }

    errorMessage.textContent = "";

    const average = ((math + science + english) / 3).toFixed(2);
    let grade = average >= 90 ? "A" : average >= 75 ? "B" : average >= 50 ? "C" : "F";

    students.push({ name, math, science, english, average: parseFloat(average), grade });
    displayStudents();
    updateChart();
    document.getElementById("studentForm").reset();
});

// Display Students in Table
function displayStudents() {
    tableBody.innerHTML = "";
    students.forEach((student, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.math}</td>
            <td>${student.science}</td>
            <td>${student.english}</td>
            <td>${student.average}</td>
            <td>${student.grade}</td>
            <td>
                <button onclick="editStudent(${index})">✏️ Edit</button>
                <button onclick="deleteStudent(${index})">❌ Delete</button>
            </td>`;
        tableBody.appendChild(row);
    });
}

// Edit Student
function editStudent(index) {
    const student = students[index];
    document.getElementById("name").value = student.name;
    document.getElementById("math").value = student.math;
    document.getElementById("science").value = student.science;
    document.getElementById("english").value = student.english;

    students.splice(index, 1);
    displayStudents();
    updateChart();
}

// Delete Student
function deleteStudent(index) {
    students.splice(index, 1);
    displayStudents();
    updateChart();
}

// Sorting Functions
function sortByName() {
    students.sort((a, b) => a.name.localeCompare(b.name));
    displayStudents();
}

function sortByAverage() {
    students.sort((a, b) => b.average - a.average);
    displayStudents();
}

// Search Students (Fixed)
function searchStudent() {
    const searchValue = searchInput.value.toLowerCase();
    tableBody.innerHTML = "";

    students.forEach((student) => {
        if (student.name.toLowerCase().includes(searchValue)) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${highlightText(student.name, searchValue)}</td>
                <td>${student.math}</td>
                <td>${student.science}</td>
                <td>${student.english}</td>
                <td>${student.average}</td>
                <td>${student.grade}</td>
                <td>
                    <button onclick="editStudent(${students.indexOf(student)})">✏️ Edit</button>
                    <button onclick="deleteStudent(${students.indexOf(student)})">❌ Delete</button>
                </td>`;
            tableBody.appendChild(row);
        }
    });
}

// Highlight Search Results
function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, `<span class="highlight">$1</span>`);
}

// Update Chart
function updateChart() {
    const names = students.map(s => s.name);
    const averages = students.map(s => s.average);

    if (scoreChart) scoreChart.destroy();
    scoreChart = new Chart(document.getElementById("scoreChart"), {
        type: "bar",
        data: {
            labels: names,
            datasets: [{ label: "Average Score", data: averages, backgroundColor: "#007BFF" }]
        }
    });
}

// Dark Mode Toggle
document.getElementById("toggleTheme").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
