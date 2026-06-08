<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "bibliotheque";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["erreur" => "Connexion échouée : " . $conn->connect_error]);
    exit();
}

$conn->set_charset("utf8");
