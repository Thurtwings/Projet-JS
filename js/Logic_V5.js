
/*
* Récupération des elements HTML
* */
const allScreens = document.querySelector("#all_screens");
const addButton = document.querySelector("#add_button");
const backButton = document.querySelectorAll(".back_button");
const validateButton = document.querySelector("#validate_button");
const deleteButton = document.querySelector("#delete_button");
const editButton = document.querySelector("#edit_button");
const contactsList = document.querySelector("#contacts_list");
const label = document.querySelector("#title");
const inputFields = document.querySelectorAll("input");
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=Non demandé/ just for fun-=-=-=-=-=-=-=-=-=-=-=-
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const searchInput = document.querySelector("#search_input");
const sortSelector = document.querySelector("#sort_selector");
const contactsPerPage = 5;
let currentPage = 1;

let contacts = [];
let mode = "add";
let currentContact = null;
let contactId = 0;

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-Event Listeners=-=-=-=-=-=-=-=-=-=-=-=
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
searchInput.addEventListener("input", () => {
    updateContactListSortSurname(true);
});

addButton.addEventListener("click", () =>
{
    label.textContent = "Ajouter un contact";
    showScreen(1);
    document.querySelector("#delete_button").classList.remove("visible");
});

backButton.forEach(button =>
{
    button.addEventListener("click", () =>
    {
        if (mode === "edit")
        {
            mode = "add";
            document.querySelector("#validate_button").textContent = "Ajouter";
            document.querySelector("#delete_button").classList.remove("visible");
        }
        clearInputFields();
        showScreen(2);
    });
});

validateButton.addEventListener("click", () =>
{
    if (isValidInput())
    {
        if (mode === "add")
        {
            const newContact = createContact();
            contacts.push(newContact);
            updateContactListSortSurname();
        }
        else if (mode === "edit")
        {
            updateCurrentContact();
            updateContactListSortSurname();
        }
        saveContacts();
        updateContactListSortSurname();
        showScreen(2);
        clearInputFields();
    }
});

deleteButton.addEventListener("click", deleteContact);

contactsList.addEventListener("click", (event) =>
{
    if (event.target.tagName === "LI")
    {
        currentContact = contacts.find(contact => contact.id === parseInt(event.target.dataset.id));
        displayContact(currentContact);
        showScreen(3);
    }
});

editButton.addEventListener("click", () =>
{
    fillForm(currentContact);
    mode = "edit";
    document.querySelector("#validate_button").textContent = "Enregistrer";
    document.querySelector("#delete_button").classList.add("visible");
    label.textContent = "Modifier un contact";
    showScreen(1);
});

sortSelector.addEventListener("change", () => {
    updateContactListSortSurname();
});

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-Fonctions=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

/**
 * Efface les valeurs des champs de saisie.
 */
function clearInputFields()
{
    inputFields.forEach(input =>
    {
        input.value = "";

    });
}

/**
 * Remplit le formulaire avec les informations du contact.
 * @param {Object} contact - Le contact dont les informations doivent être affichées.
 */
function fillForm(contact)
{
    document.querySelector("#name_field").value = contact.prenom;
    document.querySelector("#surname_field").value = contact.nom;
    document.querySelector("#phone_field").value = contact.telephone;
    document.querySelector("#email_field").value = contact.email;
}

/**
 * Met à jour les informations du contact actuellement sélectionné.
 */
function updateCurrentContact()
{
    currentContact.nom = document.querySelector("#surname_field").value;
    currentContact.prenom = document.querySelector("#name_field").value;
    currentContact.telephone = document.querySelector("#phone_field").value;
    currentContact.email = document.querySelector("#email_field").value;
    saveContacts();
}

/**
 * Affiche les informations d'un contact à l'écran.
 * @param {Object} contact - Le contact dont les informations doivent être affichées.
 */
function displayContact(contact)
{
    document.querySelector("#details_name").textContent = contact.prenom + ' ' + contact.nom;
    document.querySelector("#details_phone").textContent = contact.telephone;
    document.querySelector("#details_email").textContent = contact.email;
}


/**
 * Affiche l'écran spécifié.
 * @param {number} n - L'indice de l'écran à afficher: 1, 2, ou 3.
 */
function showScreen(n)
{
    allScreens.style.left = `${(1 - n) * 100}%`;
}

/**
 * Vérifie si les informations saisies sont valides.
 * @returns {boolean} - Retourne true si les informations sont valides, sous les formats regEx demandés et non null, sinon false.
 */
function isValidInput()
{
    const name = document.querySelector("#name_field").value;
    const surname = document.querySelector("#surname_field").value;
    const phone = document.querySelector("#phone_field").value;
    const email = document.querySelector("#email_field").value;

    const phoneRegex = /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!name || !surname || !phone || !email || !phone.match(phoneRegex) || !email.match(emailRegex))
    {
        alert("Merci de remplir tous champs au format: \nTéléphone : (+0033 / 0)123456789 \nE-mail: adresse@domaine.(fr/com)");
        return false;
    }


    return phone.match(phoneRegex) && email.match(emailRegex);
}

/**
 * Crée un nouvel objet contact à partir des informations saisies.
 * @returns {Object} - Retourne le nouvel objet contact.
 */
function createContact()
{
    const newContact = {
        id: contacts.length,
        nom: document.querySelector("#surname_field").value,
        prenom: document.querySelector("#name_field").value,
        telephone: document.querySelector("#phone_field").value,
        email: document.querySelector("#email_field").value,
    };

    saveContacts();
    return newContact;
}

/**
 * Supprime le contact actuellement sélectionné.
 */
function deleteContact()
{
    if (confirm("Êtes-vous sûr de vouloir supprimer ce contact ?"))
    {
        contacts = contacts.filter(c => c !== currentContact);
        saveContacts();
        updateContactListSortSurname();
        showScreen(2);
    }
}

/**
 * Supprime un contact de la liste.
 * @param {Object} contact - Le contact à supprimer de la liste.
 */
function deleteContactFromList(contact)
{
    if (confirm("Êtes-vous sûr de vouloir supprimer ce contact ?"))
    {
        contacts = contacts.filter(c => c.id !== contact.id);
        saveContacts();
        updateContactListSortSurname();
    }
}

/**
 * Met à jour la liste des contacts en la triant par nom de famille.
 */
/*function updateContactListSortSurname(search = false, filteredContacts = null)
{

    if (search) {
        searchContacts();
        return;
    }

    contactsList.innerHTML = "";

    const displayContacts = filteredContacts ? filteredContacts : contacts;

    // Calculer le début et la fin des contacts pour la page actuelle
    const start = (currentPage - 1) * contactsPerPage;
    const end = start + contactsPerPage;
    // Tri des contacts par prénom
    contacts.sort((a, b) =>
    {
        if (a.prenom < b.prenom)
        {
            return -1;
        }
        else if (a.prenom > b.prenom)
        {
            return 1;
        }
        else
        {
            return 0;
        }
    });
    // Afficher les contacts pour la plage actuelle
    const contactsToDisplay = displayContacts.slice(start, end);
    contactsToDisplay.forEach((contact, index) =>
    {
        displayContacts.forEach((contact, index) => {
            let li = document.createElement("li");
            let deleteButton = document.createElement("button");

            deleteButton.textContent = "X";
            deleteButton.classList.add("delete-button");
            deleteButton.dataset.id = contact.id;
            deleteButton.addEventListener("click", (event) => {
                event.stopPropagation();
                deleteContactFromList(contact);
            });

            li.appendChild(deleteButton);

            let contactName = document.createElement("span");
            contactName.textContent = contact.prenom + " " + contact.nom;
            li.appendChild(contactName);

            li.dataset.id = contact.id;
            li.dataset.name = contact.prenom;
            li.dataset.surname = contact.nom;
            li.dataset.phone = contact.telephone;
            li.dataset.email = contact.email;

            contactsList.appendChild(li);
        });
    });

    // Mettre à jour les boutons de pagination
    updatePagination(displayContacts.length);

}*/
function updateContactListSortSurname(search = false, filteredContacts = null) {

    if (search) {
        searchContacts();
        return;
    }

    contactsList.innerHTML = "";

    const displayContacts = filteredContacts ? filteredContacts : contacts;

    // Calculer le début et la fin des contacts pour la page actuelle
    const start = (currentPage - 1) * contactsPerPage;
    const end = start + contactsPerPage;
    const sortOption = sortSelector.value;
    contacts.sort((a, b) =>
    {
        if (sortOption === "prenom")
        {
            if (a.prenom < b.prenom)
            {
                return -1;
            }
            else if (a.prenom > b.prenom)
            {
                return 1;
            }
            else
            {
                return 0;
            }
        }
        else if (sortOption === "nom")
        {
            if (a.nom < b.nom)
            {
                return -1;
            }
            else if (a.nom > b.nom)
            {
                return 1;
            }
            else
            {
                return 0;
            }
        }
    });
    // Afficher les contacts pour la plage actuelle
    const contactsToDisplay = displayContacts.slice(start, end);
    contactsToDisplay.forEach((contact, index) => {
        let li = document.createElement("li");
        let deleteButton = document.createElement("button");

        deleteButton.textContent = "X";
        deleteButton.classList.add("delete-button");
        deleteButton.dataset.id = contact.id;
        deleteButton.addEventListener("click", (event) => {
            event.stopPropagation();
            deleteContactFromList(contact);
        });

        li.appendChild(deleteButton);

        let contactName = document.createElement("span");
        contactName.textContent = contact.prenom + " " + contact.nom;
        li.appendChild(contactName);

        li.dataset.id = contact.id;
        li.dataset.name = contact.prenom;
        li.dataset.surname = contact.nom;
        li.dataset.phone = contact.telephone;
        li.dataset.email = contact.email;

        contactsList.appendChild(li);
    });

    // Mettre à jour les boutons de pagination
    updatePagination(displayContacts.length);

}


function searchContacts()
{
    const searchValue = searchInput.value.toLowerCase();
    const filteredContacts = contacts.filter(contact =>
        (
            contact.nom.toLowerCase().includes(searchValue) ||
            contact.prenom.toLowerCase().includes(searchValue) ||
            contact.telephone.toLowerCase().includes(searchValue) ||
            contact.email.toLowerCase().includes(searchValue))
    );
    currentPage = 1;
    updateContactListSortSurname(false, filteredContacts);
}

function saveContacts()
{
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

function loadContacts()
{
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
        contacts = JSON.parse(storedContacts);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    updateContactListSortSurname();
});

function updatePagination(totalContacts) {
    const pagination = document.querySelector("#pagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(totalContacts / contactsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.addEventListener("click", () => {
            currentPage = i;
            updateContactListSortSurname();
        });

        // Appliquer un style au bouton de la page actuelle
        if (i === currentPage) {
            pageButton.classList.add("current");
        }

        pagination.appendChild(pageButton);
    }
}
