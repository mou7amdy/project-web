<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "connexion.php";

$sql = "SELECT DISTINCT categorie FROM livres WHERE categorie != '' ORDER BY categorie ASC";
$resultat = $conn->query($sql);

$categories = [];
while ($ligne = $resultat->fetch_assoc()) {
    $categories[] = $ligne["categorie"];
}

echo json_encode($categories);
$conn->close();
