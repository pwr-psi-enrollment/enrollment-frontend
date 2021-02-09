<?php


namespace App\Requests;

use App\Logs\FileLogger;

class JSONRequestsManager {
    public function post(string $url, array $json = [], array $headers = []) : ?array {
        $ch = curl_init();

        $jsonString = json_encode($json);

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonString);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $result = curl_exec($ch);

        var_dump($result);

        return json_decode($result, true);
    }

    public function simplePost(string $url, string $data) : ?array {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        //curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        return json_decode(curl_exec($ch), true);
    }

    public function put(string $url, array $json = [], array $headers = []) : ?array {
        $ch = curl_init();

        $jsonString = json_encode($json);

        $fileLogger = new FileLogger('logs.txt');

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonString);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $result = curl_exec($ch);

        $fileLogger->write("[PUT]" . $url);
        $fileLogger->write($result);

        return json_decode($result, true);
    }

    public function get(string $url, array $headers = []) : ?array {
        $ch = curl_init();

        //echo "URL : " . $url;

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $result = curl_exec($ch);

        return json_decode($result, true);
    }
}