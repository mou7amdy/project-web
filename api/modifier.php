<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type");

require_once "connexion.php";

$donnees = json_decode(file_get_contents("php://input"), true);

$id = intval($donnees["id"]);
$titre = $conn->real_escape_string($donnees["titre"]);
$auteur = $conn->real_escape_string($donnees["auteur"]);
$categorie = $conn->real_escape_string($donnees["categorie"]);
$annee = intval($donnees["annee"]);

if ($id === 0 || $titre === "" || $auteur === "") {
    echo json_encode(["erreur" => "Données invalides"]);
    exit();
}

$sql = "UPDATE livres SET titre='$titre', auteur='$auteur', categorie='$categorie', annee=$annee WHERE id=$id";

if ($conn->query($sql)) {
    echo json_encode(["succes" => true]);
} else {
    echo json_encode(["erreur" => $conn->error]);
}

$conn->close();
