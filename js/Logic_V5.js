

/* 
* Récupération des éléments HTML 
*/
const elements = {
    allScreens: document.querySelector("#all_screens"),
    addButton: document.querySelector("#add_button"),
    backButton: document.querySelectorAll(".back_button"),
    validateButton: document.querySelector("#validate_button"),
    deleteButton: document.querySelector("#delete_button"),
    editButton: document.querySelector("#edit_button"),
    contactsList: document.querySelector("#contacts_list"),
    label: document.querySelector("#title"),
    inputFields: document.querySelectorAll("input"),
    searchInput: document.querySelector("#search_input"),
    sortSelector: document.querySelector("#sort_selector"),
    filterSelector: document.querySelector("#filter_selector"),
};

const contactsPerPage = 5;
let currentPage = 1;

const sampleContacts = [
    { id: 0, nom: "Dupont", prenom: "Jean", telephone: "0612345678", email: "jean.dupont@example.com" },
    { id: 1, nom: "Martin", prenom: "Lucie", telephone: "0712345678", email: "lucie.martin@example.com" },
    { id: 2, nom: "Leclerc", prenom: "Marie", telephone: "0812345678", email: "marie.leclerc@example.com" },
    { id: 3, nom: "Gauthier", prenom: "Pierre", telephone: "0912345678", email: "pierre.gauthier@example.com" },
    { id: 4, nom: "Leroy", prenom: "Camille", telephone: "0612345679", email: "camille.leroy@example.com" },
    { id: 5, nom: "Roux", prenom: "Julien", telephone: "0712345679", email: "julien.roux@example.com" },
    { id: 6, nom: "Moreau", prenom: "Sophie", telephone: "0812345679", email: "sophie.moreau@example.com" },
    { id: 7, nom: "Girard", prenom: "Nicolas", telephone: "0912345679", email: "nicolas.girard@example.com" },
    { id: 8, nom: "Blanchard", prenom: "Emma", telephone: "0612345680", email: "emma.blanchard@example.com" },
    { id: 9, nom: "Lefebvre", prenom: "Alexandre", telephone: "0712345680", email: "alexandre.lefebvre@example.com" },
    { id: 10, nom: "Meyer", prenom: "Alice", telephone: "0812345680", email: "alice.meyer@example.com" },
    { id: 11, nom: "Simon", prenom: "Guillaume", telephone: "0912345680", email: "guillaume.simon@example.com" },
    { id: 12, nom: "Richard", prenom: "Nina", telephone: "0612345681", email: "nina.richard@example.com" },
    { id: 13, nom: "Lambert", prenom: "Lucas", telephone: "0712345681", email: "lucas.lambert@example.com" },
    { id: 14, nom: "Rousseau", prenom: "Charlotte", telephone: "0812345681", email: "charlotte.rousseau@example.com" }
];

let contacts = [];
let mode = "add";
let currentContact = null;
let contactId = 0;

/* 
* Event Listeners 
*/
elements.searchInput.addEventListener("input", () => updateContactList(true));
elements.addButton.addEventListener("click", onAddButtonClick);
elements.backButton.forEach(button => button.addEventListener("click", onBackButtonClick));
elements.validateButton.addEventListener("click", onValidateButtonClick);
elements.deleteButton.addEventListener("click", deleteContact);
elements.contactsList.addEventListener("click", onContactsListClick);
elements.editButton.addEventListener("click", onEditButtonClick);
elements.sortSelector.addEventListener("change", () => updateContactList());
elements.filterSelector.addEventListener("change", () => searchContacts());

/**
 * Gestionnaire d'événements pour le clic sur le bouton "Ajouter".
 */
function onAddButtonClick() {
    elements.label.textContent = "Ajouter un contact";
    showScreen(1);
    elements.deleteButton.classList.remove("visible");
}

/**
 * Gestionnaire d'événements pour le clic sur le bouton "Retour".
 */
function onBackButtonClick() {
    if (mode === "edit") {
        mode = "add";
        elements.validateButton.textContent = "Ajouter";
        elements.deleteButton.classList.remove("visible");
    }
    clearInputFields();
    showScreen(2);
}

/**
 * Gestionnaire d'événements pour le clic sur le bouton "Valider".
 */
function onValidateButtonClick() {
    if (isValidInput()) {
        if (mode === "add") {
            const newContact = createContact();
            contacts.push(newContact);
            updateContactList();
        } else if (mode === "edit") {
            updateCurrentContact();
            updateContactList();
        }
        saveContacts();
        updateContactList();
        showScreen(2);
        clearInputFields();
    }
}

/**
 * Gestionnaire d'événements pour le clic sur un contact dans la liste.
 * @param {Event} event - L'objet Event représentant l'événement.
 */
function onContactsListClick(event) {
    if (event.target.tagName === "LI") {
        currentContact = contacts.find(contact => contact.id === parseInt(event.target.dataset.id));
        displayContact(currentContact);
        showScreen(3);
    }
}

/**
 * Gestionnaire d'événements pour le clic sur le bouton "Modifier".
 */
function onEditButtonClick() {
    fillForm(currentContact);
    mode = "edit";
    elements.validateButton.textContent = "Enregistrer";
    elements.deleteButton.classList.add("visible");
    elements.label.textContent = "Modifier un contact";
    showScreen(1);
}
/**
 * Affiche l'écran spécifié.
 * @param {number} n - L'indice de l'écran à afficher: 1, 2, ou 3.
 */
function showScreen(n) {
    elements.allScreens.style.left = `${(1 - n) * 100}%`;
}

/**
 * Vérifie si les informations saisies sont valides.
 * @returns {boolean} - Retourne true si les informations sont valides, sous les formats regEx demandés et non null, sinon false.
 */
function isValidInput() {
    const name = document.querySelector("#name_field").value;
    const surname = document.querySelector("#surname_field").value;
    const phone = document.querySelector("#phone_field").value;
    const email = document.querySelector("#email_field").value;

    const phoneRegex = /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!name || !surname || !phone || !email || !phone.match(phoneRegex) || !email.match(emailRegex)) {
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
 * Efface les valeurs des champs de saisie.
 */
function clearInputFields()
{
    elements.inputFields.forEach(input =>
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
 * Supprime le contact actuellement sélectionné.
 */
function deleteContact()
{
    if (confirm("Êtes-vous sûr de vouloir supprimer ce contact ?"))
    {
        contacts = contacts.filter(c => c !== currentContact);
        saveContacts();
        updateContactList();
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
        updateContactList();
    }
}

/**
 * Met à jour la liste des contacts en la triant par nom de famille.
 */
function updateContactList(search = false, filteredContacts = null) {

    if (search) {
        searchContacts();
        return;
    }

    elements.contactsList.innerHTML = "";

    const displayContacts = filteredContacts ? filteredContacts : contacts;

    // Calculer le début et la fin des contacts pour la page actuelle
    const start = (currentPage - 1) * contactsPerPage;
    const end = start + contactsPerPage;
    const sortOption = elements.sortSelector.value;
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

        elements.contactsList.appendChild(li);
    });

    // Mettre à jour les boutons de pagination
    updatePagination(displayContacts.length);

}


function searchContacts()
{
    const searchValue = elements.searchInput.value.toLowerCase();
    const filterOption = elements.filterSelector.value;

    const filteredContacts = contacts.filter(contact =>
    {
        const searchInName = contact.nom.toLowerCase().includes(searchValue) || contact.prenom.toLowerCase().includes(searchValue);
        const searchInPhone = contact.telephone.toLowerCase().includes(searchValue);
        const searchInEmail = contact.email.toLowerCase().includes(searchValue);

        if (filterOption === "all")
        {
            return searchInName || searchInPhone || searchInEmail;
        }
        else if (filterOption === "email")
        {
            return searchInEmail;
        }
        else if (filterOption === "phone")
        {
            return searchInPhone;
        }
    });

    currentPage = 1;
    updateContactList(false, filteredContacts);

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
    // contacts = sampleContacts;
    loadContacts();
    updateContactList();
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
            updateContactList();
        });

        // Appliquer un style au bouton de la page actuelle
        if (i === currentPage) {
            pageButton.classList.add("current");
        }

        pagination.appendChild(pageButton);
    }
}
