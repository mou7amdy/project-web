<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once "connexion.php";

$donnees = json_decode(file_get_contents("php://input"), true);

$id = intval($donnees["id"]);

if ($id === 0) {
    echo json_encode(["erreur" => "ID invalide"]);
    exit();
}

$sql = "DELETE FROM livres WHERE id=$id";

if ($conn->query($sql)) {
    echo json_encode(["succes" => true]);
} else {
    echo json_encode(["erreur" => $conn->error]);
}

$conn->close();
