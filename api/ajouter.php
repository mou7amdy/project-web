<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "connexion.php";

$donnees = json_decode(file_get_contents("php://input"), true);

$titre = $conn->real_escape_string($donnees["titre"]);
$auteur = $conn->real_escape_string($donnees["auteur"]);
$categorie = $conn->real_escape_string($donnees["categorie"]);
$annee = intval($donnees["annee"]);

if ($titre === "" || $auteur === "") {
    echo json_encode(["erreur" => "Titre et auteur obligatoires"]);
    exit();
}

$sql = "INSERT INTO livres (titre, auteur, categorie, annee) VALUES ('$titre', '$auteur', '$categorie', $annee)";

if ($conn->query($sql)) {
    echo json_encode(["succes" => true, "id" => $conn->insert_id]);
} else {
    echo json_encode(["erreur" => $conn->error]);
}

$conn->close();
