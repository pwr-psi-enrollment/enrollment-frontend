<?php


namespace App\Requests;


use App\DataStructures\StringExploder;

class HTTPResponse {
    private $statusCode;
    private $headers;
    private $body;

    public function __construct(int $statusCode, array $headers, string $body) {
        $this->statusCode = $statusCode;

        $this->headers = $headers;
        $this->body = $body;
    }

    public function getStatusCode() : int {
        return $this->statusCode;
    }

    public function getHeaders() : array {
        return $this->headers;
    }

    public function getHeader(string $key) : string {
        $key = strtolower($key);

        if (isset($this->headers[$key])) {
            return $this->headers[$key];
        } else {
            return "";
        }
    }

    public function getBody() : string {
        return $this->body;
    }

    public static function extractStatusCode(string $line) : int {
        $parts = explode(" ", $line);

        return intval($parts[1]);
    }

    public static function parseRawResponse(string $raw) : HTTPResponse {
        $raw = trim($raw);

        $parts = StringExploder::explodeByEndLine($raw, 2);

        $rawHeaders = $parts[0];

        $topLines = StringExploder::explodeByEndLine($rawHeaders, 1);

        $statusCode = static::extractStatusCode($topLines[0]);

        $headerLines = array_slice($topLines, 1);

        $headers = static::parseHeaders($headerLines);

        $rawBody = $parts[1];

        return new HTTPResponse($statusCode, $headers, $rawBody);
    }

    public static function parseHeaders(array $headerParts) : array {
        $result = [];

        foreach ($headerParts as $row) {
            $parts = explode(':', $row);

            if (count($parts) > 1) {
                $result[strtolower(trim($parts[0]))] = trim($parts[1]);
            } else {
                $result[] = trim($parts[0]);
            }
        }

        return $result;
    }
}