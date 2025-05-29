//TODO:n'oublie pas de verifier le windows.href pour la redirection

// Sélection des éléments
const container = document.getElementById("container");
const overlaycon = document.getElementById("overlaycon");
const overlayBtn = document.getElementById("overlayBtn");

//defiler de la page
overlayBtn.addEventListener("click", () => {
  container.classList.toggle("right-panel-active");
  overlayBtn.classList.remove("btnScaled");
  window.requestAnimationFrame(() => {
    overlayBtn.classList.add("btnScaled");
  });
});

// Sélection des éléments du formulaire
const form = document.getElementById("form");
const username = document.querySelector("#username");
const mail = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");
const submitBtn = document.getElementById("submitBtn");
const mailField = document.getElementById("connectMail");
const passwordField = document.getElementById("connectPassword");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  let isValide = true;

  // Récupération des valeurs
  const usernameValue = username.value.trim();
  const mailValue = mail.value.trim();
  const passwordValue = password.value.trim();
  const password2Value = password2.value.trim();

  // Vérification du nom d'utilisateur
  if (usernameValue === "") {
    setError(username, "Le nom d'utilisateur ne peut être vide");
    isValide = false;
  } else if (!usernameValue.match(/^[a-zA-Z]/)) {
    setError(username, "Le nom d'utilisateur doit commencer par une lettre");
    isValide = false;
  } else if (usernameValue.length < 3) {
    setError(
      username,
      "Le nom d'utilisateur doit comporter au moins 3 caractères"
    );
    isValide = false;
  } else {
    setSuccess(username, "Correct !");
  }

  // Vérification du mail
  if (mailValue === "") {
    setError(mail, "Le mail ne peut être vide");
    isValide = false;
  } else if (!email_verify(mailValue)) {
    setError(mail, "Email invalide");
    isValide = false;
  } else {
    setSuccess(mail, "Correct !");
  }

  // Vérification du mot de passe
  if (passwordValue === "") {
    setError(password, "Le mot de passe ne peut être vide");
    isValide = false;
  } else if (!password_verify(passwordValue)) {
    setError(
      password,
      "Le mot de passe est trop faible (8 à 12 caractères avec des chiffres)"
    );
    isValide = false;
  } else {
    setSuccess(password, "Correct !");
  }

  // Vérification du mot de passe de confirmation
  if (password2Value === "") {
    setError(password2, "Le mot de passe de confirmation ne peut être vide");
    isValide = false;
  } else if (password2Value !== passwordValue) {
    setError(password2, "Les mots de passe ne correspondent pas");
    isValide = false;
  } else {
    setSuccess(password2, "Correct !");
  }

  if (!isValide) {
    e.preventDefault(); // Empêche l'envoi du formulaire si validation échoue
  } else {
    // Enregistrement des données dans le localStorage
    const users = getUsers();
    const userExists = users.some((user) => user.email === mailValue);
    if (userExists) {
      setError(mail, "Un utilisateur avec cet email existe déjà");
      isValide = false;
    } else {
      saveUsers(mailValue, passwordValue);
      alert("Inscription réussie !");
      window.location.href = "../site/home_pages/index.html"; // Redirection vers la page d'accueil
      form.reset(); // Réinitialisation du formulaire
    }
  }
});

// Gestion de la connexion
submitBtn.addEventListener("submit", function (e) {
  e.preventDefault();

  let isValide = true;
  const mailValue = mailField.value.trim();
  const passwordValue = passwordField.value.trim();

  if (mailValue === "") {
    setError(mailField, "Le mail ne peut être vide");
    isValide = false;
  }
  if (passwordValue === "") {
    setError(passwordField, "Le mot de passe ne peut être vide");

    isValide = false;
  }

  if (!isValide) {
    e.preventDefault(); // Empêche l'envoi du formulaire si validation échoue
  } else {
    const users = getUsers();
    const found = users.find(
      (user) => user.email === mailValue && user.password === passwordValue
    );
    if (found) {
      alert("Connexion réussie !");
      window.location.href = "../site/home_pages/index.html"; // Redirection vers la page d'accueil
      form.reset(); // Réinitialisation du formulaire
    } else {
      setError(
        mailField,
        "Email ou mot de passe incorrect! Veuillez vous s'inscrire si c'est votre première connexion"
      );
      setError(
        passwordField,
        "Email ou mot de passe incorrect! Veuillez vous s'inscrire si c'est votre première connexion"
      );
      isValide = false;
    }
  }
});

// Fonction pour afficher les erreurs
function setError(elem, message) {
  const infield = elem.parentElement;
  const small = infield.querySelector("small");
  const input = infield.querySelector("input");

  small.innerText = message;
  infield.className = "infield error";
  input.className = "error";
}

// Fonction pour afficher les succès
function setSuccess(elem, message) {
  const infield = elem.parentElement;
  const small = infield.querySelector("small");

  small.innerText = message || "Correct !";
  infield.className = "infield success";
}

// Fonction de validation de l'email
function email_verify(email) {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
}

// Fonction de validation du mot de passe
function password_verify(password) {
  return /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/.test(
    password
  );
}
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}
function saveUsers(email, password) {
  const users = getUsers();
  users.push({ email, password });
  localStorage.setItem("users", JSON.stringify(users));
  console.log("Utilisateur enregistré :", { email, password });
}
