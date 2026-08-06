let students = ["Bob"];

function addStudent() {
    const input = document.getElementById("studentName");
    let name = input.value.trim();

    if (name === "") {
        alert("Enter student name");
        return;
    }

    // Capitalize first letter
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    students.push(name);

    input.value = "";
    displayStudents();
}

function displayStudents() {
    const list = document.getElementById("studentList");
    list.innerHTML = "";

    students.forEach((student, index) => {
        list.innerHTML += `
        <li>
            <span>${index + 1}. ${student}</span>
            <button class="delete" onclick="deleteStudent(${index})">
                Delete
            </button>
        </li>`;
    });

    document.getElementById("count").textContent = students.length;
}

function deleteStudent(index) {
    students.splice(index, 1);
    displayStudents();
}

displayStudents();