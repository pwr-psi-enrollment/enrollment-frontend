<?php


namespace App\Requests;


use App\Logs\FileLogger;

class RESTRequestsManager {
    public function post(string $url, string $body = "", array $headers = []) : HTTPResponse {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_HEADER, 1);

        $result = curl_exec($ch);

        curl_close($ch);

        $response = HTTPResponse::parseRawResponse($result);

        return $response;
    }
}