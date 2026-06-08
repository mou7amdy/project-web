var idASupprimer = null;

function chargerLivres() {
  var recherche = document.getElementById("recherche").value;
  var categorie = document.getElementById("filtre-categorie").value;
  var tri = document.getElementById("tri").value;

  var url = "api/lire.php?recherche=" + encodeURIComponent(recherche) + "&categorie=" + encodeURIComponent(categorie) + "&tri=" + encodeURIComponent(tri);

  fetch(url)
    .then(function(reponse) {
      return reponse.json();
    })
    .then(function(livres) {
      afficherLivres(livres);
    });
}

function filtrerLivres() {
  chargerLivres();
}

function chargerCategories() {
  fetch("api/categories.php")
    .then(function(reponse) {
      return reponse.json();
    })
    .then(function(categories) {
      var select = document.getElementById("filtre-categorie");
      var valeurActuelle = select.value;
      select.innerHTML = '<option value="">Toutes les catégories</option>';
      for (var i = 0; i < categories.length; i++) {
        var option = document.createElement("option");
        option.value = categories[i];
        option.textContent = categories[i];
        if (categories[i] === valeurActuelle) {
          option.selected = true;
        }
        select.appendChild(option);
      }
    });
}

function sauvegarderLivre() {
  var id = document.getElementById("livre-id").value;
  var titre = document.getElementById("titre").value.trim();
  var auteur = document.getElementById("auteur").value.trim();
  var categorie = document.getElementById("categorie").value.trim();
  var annee = document.getElementById("annee").value.trim();

  if (titre === "" || auteur === "") {
    alert("Le titre et l'auteur sont obligatoires.");
    return;
  }

  var donnees = {
    titre: titre,
    auteur: auteur,
    categorie: categorie,
    annee: annee
  };

  if (id === "") {
    fetch("api/ajouter.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donnees)
    })
      .then(function(reponse) {
        return reponse.json();
      })
      .then(function(resultat) {
        if (resultat.succes) {
          reinitialiserFormulaire();
          chargerCategories();
          chargerLivres();
        } else {
          alert("Erreur : " + resultat.erreur);
        }
      });
  } else {
    donnees.id = id;
    fetch("api/modifier.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donnees)
    })
      .then(function(reponse) {
        return reponse.json();
      })
      .then(function(resultat) {
        if (resultat.succes) {
          reinitialiserFormulaire();
          chargerCategories();
          chargerLivres();
        } else {
          alert("Erreur : " + resultat.erreur);
        }
      });
  }
}

function reinitialiserFormulaire() {
  document.getElementById("livre-id").value = "";
  document.getElementById("titre").value = "";
  document.getElementById("auteur").value = "";
  document.getElementById("categorie").value = "";
  document.getElementById("annee").value = "";
  document.getElementById("titre-formulaire").textContent = "Ajouter un livre";
  document.getElementById("btn-ajouter").textContent = "Ajouter";
  document.getElementById("btn-annuler").classList.add("cache");
}

function modifierLivre(id, titre, auteur, categorie, annee) {
  document.getElementById("livre-id").value = id;
  document.getElementById("titre").value = titre;
  document.getElementById("auteur").value = auteur;
  document.getElementById("categorie").value = categorie;
  document.getElementById("annee").value = annee;
  document.getElementById("titre-formulaire").textContent = "Modifier le livre";
  document.getElementById("btn-ajouter").textContent = "Enregistrer";
  document.getElementById("btn-annuler").classList.remove("cache");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function annulerModification() {
  reinitialiserFormulaire();
}

function demanderSuppression(id) {
  idASupprimer = id;
  document.getElementById("overlay").classList.remove("cache");
  document.getElementById("modal-confirmation").classList.remove("cache");
}

function confirmerSuppression() {
  if (idASupprimer !== null) {
    fetch("api/supprimer.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: idASupprimer })
    })
      .then(function(reponse) {
        return reponse.json();
      })
      .then(function(resultat) {
        if (resultat.succes) {
          chargerCategories();
          chargerLivres();
        } else {
          alert("Erreur : " + resultat.erreur);
        }
        idASupprimer = null;
        fermerModal();
      });
  }
}

function fermerModal() {
  idASupprimer = null;
  document.getElementById("overlay").classList.add("cache");
  document.getElementById("modal-confirmation").classList.add("cache");
}

function afficherLivres(livres) {
  var conteneur = document.getElementById("liste-livres");
  var messageVide = document.getElementById("message-vide");
  var compteur = document.getElementById("compteur");

  conteneur.innerHTML = "";

  if (livres.length === 0) {
    messageVide.classList.remove("cache");
    compteur.textContent = "0 livre(s)";
    return;
  }

  messageVide.classList.add("cache");
  compteur.textContent = livres.length + " livre(s)";

  for (var i = 0; i < livres.length; i++) {
    var livre = livres[i];
    var carte = document.createElement("div");
    carte.classList.add("carte-livre");

    var badge = "";
    if (livre.categorie !== "" && livre.categorie !== null) {
      badge = '<span class="badge-categorie">' + livre.categorie + '</span>';
    }

    var anneeTexte = "";
    if (livre.annee && livre.annee !== "0") {
      anneeTexte = " · " + livre.annee;
    }

    var titreEchap = livre.titre.replace(/'/g, "\\'");
    var auteurEchap = livre.auteur.replace(/'/g, "\\'");
    var catEchap = (livre.categorie || "").replace(/'/g, "\\'");
    var anneeVal = livre.annee || "";

    carte.innerHTML = '<div class="info-livre"><h3>' + livre.titre + '</h3><p>' + livre.auteur + anneeTexte + '</p>' + badge + '</div><div class="boutons-carte"><button class="btn-modifier" onclick="modifierLivre(' + livre.id + ', \'' + titreEchap + '\', \'' + auteurEchap + '\', \'' + catEchap + '\', \'' + anneeVal + '\')">Modifier</button><button class="btn-supprimer" onclick="demanderSuppression(' + livre.id + ')">Supprimer</button></div>';

    conteneur.appendChild(carte);
  }
}

chargerCategories();
chargerLivres();
