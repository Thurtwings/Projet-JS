const allScreens = document.querySelector("#all_screens");
const addButton = document.querySelector("#add_button");
const backButton = document.querySelectorAll(".back_button");
const validateButton = document.querySelector("#validate_button");
const contactsList = document.querySelector("#contacts_list");
const inputFields = document.querySelectorAll("input");

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-Fonctions=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Affiche l'écran d'ajout de contact
addButton.addEventListener("click", () =>
{
    showScreen(1);
});

// Affiche l'écran de la liste des contacts et vide les champs de saisie
backButton.forEach(button =>
{
    button.addEventListener("click", () =>
    {
        showScreen(2);
        clearInputFields();
    });
});

// Valide les données saisies et ajoute un nouveau contact à la liste
validateButton.addEventListener("click", () =>
{
    if (isValidInput()) {
        const newContact = createContact();
        contactsList.appendChild(newContact);
        updateDetails(newContact);
        showScreen(3);
        clearInputFields();
    }
});

contactsList.addEventListener("click", (event) =>
{
    if (event.target.tagName === "LI")
    {
        updateDetails(event.target);
        showScreen(3);
    }
});

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-Fonctions=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function showScreen(n) {
    allScreens.style.left = `${(1 - n) * 100}%`;
}

function isValidInput() {
    const name = document.querySelector("#name_field").value;
    const surname = document.querySelector("#surname_field").value;
    const phone = document.querySelector("#phone_field").value;
    const email = document.querySelector("#email_field").value;

    if (!name || !surname || !phone || !email) {
        return false;
    }

    const phoneRegex = /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    return phone.match(phoneRegex) && email.match(emailRegex);
}

    function createContact()
    {
        const li = document.createElement("li");
        li.textContent = document.querySelector("#name_field").value + ' ' + document.querySelector("#surname_field").value;
        li.dataset.name = document.querySelector("#name_field").value;
        li.dataset.surname = document.querySelector("#surname_field").value;
        li.dataset.phone = document.querySelector("#phone_field").value;
        li.dataset.email = document.querySelector("#email_field").value;
        return li;
    }

    function updateDetails(contact)
    {
        document.querySelector("#details_name").textContent = contact.dataset.name + ' ' + contact.dataset.surname;
        document.querySelector("#details_phone").textContent = contact.dataset.phone;
        document.querySelector("#details_email").textContent = contact.dataset.email;
    }

    function clearInputFields()
    {
        inputFields.forEach(input =>
        {
            input.value = "";
        });
    }
