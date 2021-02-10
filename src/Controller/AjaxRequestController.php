<?php


namespace App\Controller;


use App\Requests\JSONRequestsManager;
use App\Requests\RequestStatus;
use http\Client;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Mime\Part\Multipart\FormDataPart;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class AjaxRequestController extends AbstractController {
    private $client;

    public function __construct() {
        $this->client = HttpClient::create([ 'verify_peer' => false, 'verify_host' => false ]);
    }

    /**
     * @Route("/api/auth/login")
     */
    public function login(Request $request) {
        $username = $request->get('username');
        $password = $request->get('password');

        $requestManager = new JSONRequestsManager();

        $formFields = [
            'username' => $username,
            'password' => $password
        ];
        $formData = new FormDataPart($formFields);

        $headers[] = 'Content-Type: application/json';

        $response = $this->client->request('POST', 'https://3.10.51.120/api/auth/login', [
            'headers' => $headers,
            'body' => json_encode($formFields)
        ]);

        $statusCode = $response->getStatusCode();

        if ($statusCode == 200) {
            $rawResult = $response->getContent();

            $result = json_decode($rawResult, true);
        } else {
            $result = [];
        }

        $jsonResponse = new JsonResponse($result);
        $jsonResponse->setStatusCode($statusCode);

        return $jsonResponse;

        if ($statusCode == 200) {
            $rawResult = $response->getContent();

            $result = json_decode($rawResult, true);

            if (isset($result['value'])) {
                $status = RequestStatus::SUCCESS;
                $token = $result['value'];
                $message = "Sukces";


            } else {
                $status = RequestStatus::ERROR;
                $token = "";
                $message = "Błędny login lub hasło.";
            }
        } else {
            $status = RequestStatus::ERROR;
            $token = "";
            $message = "Błędny login lub hasło.";
        }

        return new JsonResponse([
            'status' => $status,
            'message' => $message,
            'bundle' => [
                'token' => $token
            ]
        ]);
    }

    /**
     * @Route("/api/enrollment-service/student-details")
     */
    public function getStudent(Request $request) {

//        $headers[] = 'Content-Type: application/json';
//        $headers[] = 'Authorization: Bearer ' . $request->get('token');

        $headers[] = 'Content-Type: ' . $request->headers->get('content-type');
        $headers[] = 'Authorization: ' . $request->headers->get('authorization');

        //var_dump($request->headers);

        $result = $request->getContent();

        $response = $this->client->request('GET', 'https://3.10.51.120/api/enrollment-service/student-details', [
            'headers' => $headers
        ]);

        $statusCode = $response->getStatusCode();

        $rawResult = $response->getContent();

        $result = json_decode($rawResult, true);

        $jsonResponse = new JsonResponse($result);
        $jsonResponse->setStatusCode($statusCode);

        return $jsonResponse;

//        if ($statusCode == 200) {
//            $rawResult = $response->getContent();
//
//            $result = json_decode($rawResult, true);
//
//            $status = RequestStatus::SUCCESS;
//            $message = "Sukces";
//        } else {
//            $status = RequestStatus::ERROR;
//            $message = "Błędny token.";
//        }
//
//        return new JsonResponse([
//            'status' => $status,
//            'message' => $message,
//            'bundle' => $result,
//            'statusCode' => $statusCode,
//            'headers' => $headers
//        ]);
//
//
//        return new JsonResponse([
//            'status' => RequestStatus::SUCCESS,
//            'message' => "",
//            'bundle' => [
//                'student' => [
//                    'name' => "Zuzanna Zuzannowska",
//                    'indexNumber' => 234123,
//                    'fieldsOfStudy' => [
//                        [
//                            'id' => 29,
//                            'faculty' => [
//                                'id' => 8,
//                                'name' => "Wydział Informatyki i Zarządzania"
//                            ],
//                            'name' => "Informatyka stosowana",
//                            'studyDegree' => 2,
//                            'degree' => "Magisterskie",
//                            'specialization' => "Inżynieria Oprogramowania",
//                            'registeredId' => 10,
//                            'status' => "Aktywne",
//                            'startYear' => 2020,
//                            'semesters' => [
//                                [
//                                    "id" => 10,
//                                    "academicYear" => "2019/2020",
//                                    "semesterType" => "WINTER",
//                                    "year" => 1,
//                                    "semesterNumber" => 1
//                                ],
//                                [
//                                    "id" => 11,
//                                    "academicYear" => "2020/2021",
//                                    "semesterType" => "SUMMER",
//                                    "year" => 1,
//                                    "semesterNumber" => 2
//                                ],
//                                [
//                                    "id" => 12,
//                                    "academicYear" => "2020/2021",
//                                    "semesterType" => "WINTER",
//                                    "year" => 2,
//                                    "semesterNumber" => 3
//                                ]
//                            ]
//                        ]
//                    ]
//                ]
//            ]
//        ]);
    }

    /**
     * @Route("/api/enrollment-service/student-registrations")
     */
    public function getRegistrations(Request $request) {

//        $headers[] = 'Content-Type: application/json';
//        $headers[] = 'Authorization: Bearer ' . $request->get('token');

        $headers[] = 'Content-Type: ' . $request->headers->get('content-type');
        $headers[] = 'Authorization: ' . $request->headers->get('authorization');

        $result = $request->getContent();

        $registeredId = $request->query->get('registeredId');
        $semesterId = $request->query->get('semesterId');

        $debug = [
            'registeredId' => $registeredId,
            'semesterId' => $semesterId
        ];

        $response = $this->client->request('GET', 'https://3.10.51.120/api/enrollment-service/student-registrations?registeredId=' . $registeredId . '&semesterId=' . $semesterId, [
            'headers' => $headers
        ]);

        $statusCode = $response->getStatusCode();

        $rawResult = $response->getContent();

        $result = json_decode($rawResult, true);

        $jsonResponse = new JsonResponse($result);
        $jsonResponse->setStatusCode($statusCode);

        return $jsonResponse;

        if ($statusCode == 200) {
            $rawResult = $response->getContent();

            $result = json_decode($rawResult, true);

            $status = RequestStatus::SUCCESS;
            $message = "Sukces";
        } else {
            $status = RequestStatus::ERROR;
            $message = "Błędny token.";
        }

        return new JsonResponse([
            'status' => $status,
            'message' => $message,
            'bundle' => $result,
            'statusCode' => $statusCode,
            'headers' => $headers,
            'debug' => $debug
        ]);

//
//        return new JsonResponse([
//            'status' => RequestStatus::SUCCESS,
//            'message' => "",
//            'bundle' => [
//                  [
//                      "id" => 1,
//                    "name" => "W08 Zapisy zima 2020/2021",
//                    "destination" => "FACULTY",
//                    "kind" => "CORRECTION",
//                    "status" => "ACTIVE",
//                    "startTime" => "2021-02-01T13:00:00",
//                    "endTime" => "2021-03-01T13:00:00",
//                    "studentStartTime" => "2021-02-07T11:25:36"
//                  ],
//                  [
//                      "id" => 2,
//                    "name" => "W08 Zapisy zima 2020/2021",
//                    "destination" => "FACULTY",
//                    "kind" => "MAIN",
//                    "status" => "ENDED",
//                    "startTime" => "2021-02-01T13:00:00",
//                    "endTime" => "2021-03-01T13:00:00",
//                    "studentStartTime" => "2021-02-06T13:13:10"
//                  ],
//                  [
//                      "id" => 3,
//                    "name" => "W08 Zapisy zima 2020/2021",
//                    "destination" => "UNIVERSITY",
//                    "kind" => "MAIN",
//                    "status" => "ENDED",
//                    "startTime" => "2021-02-01T13:00:00",
//                    "endTime" => "2021-03-01T13:00:00",
//                    "studentStartTime" => "2021-02-05T09:54:24"
//                  ]
//                ]
//        ]);
    }

    /**
     * @Route("/api/enrollment-service/student-registrations/{registrationId}/courses")
     */
    public function getCourses($registrationId, Request $request)
    {

//        $headers[] = 'Content-Type: application/json';
//        $headers[] = 'Authorization: Bearer ' . $request->get('token');

        $headers[] = 'Content-Type: ' . $request->headers->get('content-type');
        $headers[] = 'Authorization: ' . $request->headers->get('authorization');

        $result = "";
        //$registrationID = $request->get('registrationID');

        $response = $this->client->request('GET', 'https://3.10.51.120/api/enrollment-service/student-registrations/' . $registrationId . '/courses', [
            'headers' => $headers
        ]);

        $statusCode = $response->getStatusCode();

        $rawResult = $response->getContent();

        $result = json_decode($rawResult, true);

        $jsonResponse = new JsonResponse($result);
        $jsonResponse->setStatusCode($statusCode);

        return $jsonResponse;




        if ($statusCode == 200) {
            $rawResult = $response->getContent();

            $result = json_decode($rawResult, true);

            $status = RequestStatus::SUCCESS;
            $message = "Sukces";
        } else {
            $status = RequestStatus::ERROR;
            $message = "Błędny token.";
        }

        return new JsonResponse([
            'status' => $status,
            'message' => $message,
            'bundle' => $result,
            'statusCode' => $statusCode,
            'headers' => $headers
        ]);
    }

    /**
     * @Route("/api/student-registrations/{studentRegistrationId}/enroll")
     */
    public function enroll($studentRegistrationId, Request $request)
    {

//        $headers[] = 'Content-Type: application/json';
//        $headers[] = 'Authorization: Bearer ' . $request->get('token');


        $content = explode('=', $request->getContent());

        $groupID = $content[1];

        $headers[] = 'Content-Type: ' . $request->headers->get('content-type');
        $headers[] = 'Authorization: ' . $request->headers->get('authorization');

        //var_dump($headers);

        //$studentRegistrationId = $request->query->get('studentRegistrationId');
        //$groupID = $request->get('groupID');

        $debug = [];

        $debug[] = json_encode([
            'groupId' => intval($groupID)
        ]);

//        var_dump(json_encode([
//            'groupId' => intval($groupID)
//        ]));

        //var_dump ($debug);

        $response = $this->client->request('POST', 'https://3.10.51.120/api/enrollment-service/student-registrations/' . $studentRegistrationId . '/enroll', [
            'headers' => $headers,
            'body' => json_encode([
                'groupId' => intval($groupID)
            ])
        ]);

        $statusCode = $response->getStatusCode();

        $rawResult = $response->getContent();

        $result = json_decode($rawResult, true);

        $jsonResponse = new JsonResponse($result);
        $jsonResponse->setStatusCode($statusCode);

        return $jsonResponse;

        $result = [];

        if ($statusCode == 200) {
            $rawResult = $response->getContent();

            $result = json_decode($rawResult, true);

            $status = RequestStatus::SUCCESS;
            $message = "Sukces";
        } else {
            $status = RequestStatus::ERROR;
            $message = "Błędny token.";

            $result = $response->getContent();
        }

        return new JsonResponse([
            'status' => $status,
            'message' => $message,
            'bundle' => $result,
            'statusCode' => $statusCode,
            'headers' => $headers,
            'debug' => $debug
        ]);
    }

    /**
     * @Route("/api/enrollment-service/student-registrations/{studentRegistrationId}/enrollment/{groupId}")
     */
    public function roll($studentRegistrationId, $groupId, Request $request)
    {

//        $headers[] = 'Content-Type: application/json';
//        $headers[] = 'Authorization: Bearer ' . $request->get('token');


        $headers[] = 'Content-Type: ' . $request->headers->get('content-type');
        $headers[] = 'Authorization: ' . $request->headers->get('authorization');

        //$studentRegistrationId = $request->query->get('studentRegistrationId');
        //$groupID = $request->get('groupID');

        $debug = [];

        $debug[] = json_encode([
            'groupId' => intval($groupId)
        ]);

        //var_dump ($debug);

        $response = $this->client->request('DELETE', 'https://3.10.51.120/api/enrollment-service/student-registrations/' . $studentRegistrationId . '/enrollment/' . $groupId, [
            'headers' => $headers
        ]);

        $statusCode = $response->getStatusCode();

        $rawResult = $response->getContent();

        $result = json_decode($rawResult, true);

        $jsonResponse = new JsonResponse($result);
        $jsonResponse->setStatusCode($statusCode);

        return $jsonResponse;

        $result = [];

        if ($statusCode == 200) {
            $rawResult = $response->getContent();

            $result = json_decode($rawResult, true);

            $status = RequestStatus::SUCCESS;
            $message = "Sukces";
        } else {
            $status = RequestStatus::ERROR;
            $message = "Błąd.";

            $result = $response->getContent();
        }

        return new JsonResponse([
            'status' => $status,
            'message' => $message,
            'bundle' => $result,
            'statusCode' => $statusCode,
            'headers' => $headers,
            'debug' => $debug
        ]);
    }
}