<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class MainController extends AbstractController
{
    /**
     * @Route("/")
     */
    public function index()
    {
        return $this->render('index.html', [

        ]);
    }

    /**
     * @Route("/template/site-header")
     */
    public function siteHeader()
    {
        $result = $this->render('site-header.html', []);

        return new JsonResponse([
            'html' => $result->getContent()
        ]);
    }

    /**
     * @Route("/template/site-main")
     */
    public function siteMain()
    {
        $result = $this->render('site-main.html', []);

        return new JsonResponse([
            'html' => $result->getContent()
        ]);
    }

    /**
     * @Route("/template/login")
     */
    public function login()
    {
        $result = $this->render('site-login.html', []);

        return new JsonResponse([
            'html' => $result->getContent()
        ]);
    }


}