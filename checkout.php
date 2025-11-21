<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// read incoming JSON
$data = json_decode(file_get_contents("php://input"), true);

// just test returning back
$response = [
    "status" => "OK",
    "received" => $data
];

echo json_encode($response);
?>
