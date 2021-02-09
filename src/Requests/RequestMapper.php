<?php


namespace App\Requests;


use Symfony\Component\HttpFoundation\Request;

class RequestMapper {
    private $request;

    public function __construct(Request $request) {
        $this->request = $request;
    }

    public function getValue(string $name) : string {
        return htmlspecialchars(trim($this->request->get($name)));
    }

    public function getRadioValue(string $name) : ?string {
        if (!is_null($this->request->get($name))) {
            return $this->request->get($name);
        } else {
            return null;
        }
    }

    public function getBool(string $name) : bool {
        return !is_null($this->request->get($name));
    }
}