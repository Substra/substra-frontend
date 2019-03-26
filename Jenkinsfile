pipeline {
  options {
    timestamps ()
    timeout(time: 1, unit: 'HOURS')
    buildDiscarder(logRotator(numToKeepStr: '5'))
  }

  agent none

  stages {
    stage('Abort previous builds'){
      steps {
        milestone(Integer.parseInt(env.BUILD_ID)-1)
        milestone(Integer.parseInt(env.BUILD_ID))
      }
    }

    stage('Test') {
      agent {
        kubernetes {
          label 'node'
          defaultContainer 'node'
          yaml """
            apiVersion: v1
            kind: Pod
            spec:
              containers:
              - name: node
                image: node:lts-slim
                command: [cat]
                tty: true
            """
        }
      }

      steps {
        sh "yarn config set workspaces-experimental true"
        sh "yarn install"
        sh "yarn eslint"
        sh "yarn test"
      }
    }
  }
}
