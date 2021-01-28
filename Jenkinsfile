pipeline {

  agent {
    kubernetes {
      label 'enrollment-frontend'
      idleMinutes 5
      yamlFile '.jenkins-config/node12-pod.yaml'
      defaultContainer 'node12'
    }
  }

  stages {

    stage('Build') {
      steps {
        sh 'npm install http-server -g'
      }
    }

  }
}
