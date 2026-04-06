<?php
header('Content-Type: application/json');

function get_country_by_ip() {
    $api_url = "https://api.country.is/";
    
    $response = @file_get_contents($api_url);
    
    if ($response === false) {
        return ['country' => null];
    }

    return json_decode($response, true);
}

echo json_encode(get_country_by_ip());