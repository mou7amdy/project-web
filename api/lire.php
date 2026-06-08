<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "connexion.php";

$recherche = isset($_GET["recherche"]) ? $_GET["recherche"] : "";
$categorie = isset($_GET["categorie"]) ? $_GET["categorie"] : "";
$tri = isset($_GET["tri"]) ? $_GET["tri"] : "titre";

$colonnesAutorisees = ["titre", "auteur", "annee"];
if (!in_array($tri, $colonnesAutorisees)) {
    $tri = "titre";
}

$sql = "SELECT * FROM livres WHERE 1=1";

if ($recherche !== "") {
    $recherche = $conn->real_escape_string($recherche);
    $sql .= " AND (titre LIKE '%$recherche%' OR auteur LIKE '%$recherche%')";
}

if ($categorie !== "") {
    $categorie = $conn->real_escape_string($categorie);
    $sql .= " AND categorie = '$categorie'";
}

$sql .= " ORDER BY $tri ASC";

$resultat = $conn->query($sql);

$livres = [];
while ($ligne = $resultat->fetch_assoc()) {
    $livres[] = $ligne;
}

echo json_encode($livres);
$conn->close();
