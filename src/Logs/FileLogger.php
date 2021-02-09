<?php

namespace App\Logs;

class FileLogger {
    private $filename;
    private $prefix;

    public function __construct(string $filename, string $prefix = '') {
        $this->filename = $filename;
        $this->prefix = $prefix;
    }

    public function getFilename() : string {
        return $this->filename;
    }

    public function getPrefix() : string {
        return $this->prefix;
    }

    public function getPath() : string {
        return $this->getFilename();
    }

    public function write(string $text) : bool {
        return file_put_contents($this->getPath(), date('Y-m-d H:i:s') . "\t" . $this->getPrefix() . "\t" . $text . "\n", FILE_APPEND);
    }
}