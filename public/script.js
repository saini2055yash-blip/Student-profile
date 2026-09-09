const form = document.getElementById("userForm");

let editingUserId = null;


// ===============================
// SAVE / UPDATE USER
// ===============================

if (form) {

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name = document.getElementById("name").value;
        const age = document.getElementById("age").value;
        const mobile = document.getElementById("mobile").value;
        const email = document.getElementById("email").value;


        // Name validation
        if (name.trim() === "") {
            alert("Please enter your name.");
            return;
        }


        // Age validation
        if (age === "" || age < 1 || age > 120) {
            alert("Please enter a valid age.");
            return;
        }


        // Mobile validation
        if (!/^\d{10}$/.test(mobile)) {
            alert("Mobile number must be exactly 10 digits.");
            return;
        }


        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert("Please enter a valid email.");
            return;
        }


        let response;


        // UPDATE existing user
        if (editingUserId !== null) {

            response = await fetch(`/users/${editingUserId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    age: age,
                    mobile: mobile,
                    email: email
                })
            });

            editingUserId = null;

        }


        // SAVE new user
        else {

            response = await fetch("/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    age: age,
                    mobile: mobile,
                    email: email
                })
            });

        }


        const result = await response.text();

        const successMessage =
            document.getElementById("successMessage");


        if (response.ok && successMessage) {

            successMessage.textContent =
                "🎉✨ " + result + " ✨🎉";

            setTimeout(() => {
                successMessage.textContent = "";
            }, 3000);

        }


        if (!response.ok) {
            alert(result);
        }


        form.reset();

    });

}


// ===============================
// LOAD USERS
// ===============================

async function loadUsers() {

    const response = await fetch("/users");

    const users = await response.json();

    const tableBody =
        document.getElementById("userTableBody");


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    users.forEach(user => {

        const row = document.createElement("tr");


        row.innerHTML = `
            <td>${user.ID}</td>
            <td>${user.Name}</td>
            <td>${user.Age}</td>
            <td>${user.Mobile}</td>
            <td>${user.Email}</td>

            <td>

                <button onclick="editUser(
                    ${user.ID},
                    '${user.Name}',
                    ${user.Age},
                    '${user.Mobile}',
                    '${user.Email}'
                )">
                    Edit
                </button>

                <button onclick="deleteUser(${user.ID})">
                    Delete
                </button>

            </td>
        `;


        tableBody.appendChild(row);

    });

}


// ===============================
// DELETE USER
// ===============================

async function deleteUser(id) {

    const response = await fetch(`/users/${id}`, {
        method: "DELETE"
    });


    const result = await response.text();


    alert(result);


    loadUsers();

}


// ===============================
// EDIT USER
// ===============================

function editUser(id, name, age, mobile, email) {

    window.location.href =
        `/?editId=${id}&name=${encodeURIComponent(name)}&age=${age}&mobile=${encodeURIComponent(mobile)}&email=${encodeURIComponent(email)}`;

}


// ===============================
// CHECK EDIT DATA
// ===============================

const params =
    new URLSearchParams(window.location.search);


if (params.has("editId") && form) {

    editingUserId = params.get("editId");


    document.getElementById("name").value =
        params.get("name");


    document.getElementById("age").value =
        params.get("age");


    document.getElementById("mobile").value =
        params.get("mobile");


    document.getElementById("email").value =
        params.get("email");

}


// ===============================
// LOAD USERS ONLY ON SAVED USERS PAGE
// ===============================

if (document.getElementById("userTableBody")) {

    loadUsers();

}