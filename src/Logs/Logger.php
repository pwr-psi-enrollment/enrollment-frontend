<?php

namespace App\Logs;

class Logger {
    private $logs;

    public function __construct() {
        $this->logs = [];
    }

    public function log(string $log) : Logger {
        $this->logs[] = $log;

        return $this;
    }

    public function size() : int {
        return count($this->logs);
    }

    public function get() : string {
        $result = "";

        $i = 0;

        foreach ($this->logs as $log) {
            if ($i > 0) {
                $result .= "<br />";
            }

            $result .= $log;

            $i++;
        }

        return $result;
    }
}