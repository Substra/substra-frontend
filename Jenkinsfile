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

    stage('Test & Build') {
      environment {
        VERDACCIO_TOKEN = credentials('verdaccio-deployer')
      }

      parallel {
        stage('Test') {
          agent {
            kubernetes {
              label 'substrafront-test'
              defaultContainer 'node'
              yamlFile '.cicd/agent-test.yaml'
            }
          }

          steps {
            sh 'echo "//substra-npm.owkin.com/:_authToken=\"${VERDACCIO_TOKEN}\"" >> .npmrc'
            sh "yarn config set workspaces-experimental true"
            sh "yarn install"
            sh "yarn eslint"
            sh "yarn test"
          }
        }

        stage('Build') {
          agent {
            kubernetes {
              label 'substrafront-build'
              yamlFile '.cicd/agent-build.yaml'
            }
          }

          steps {
            container(name:'kaniko', shell:'/busybox/sh') {
              sh '''#!/busybox/sh
                echo "//substra-npm.owkin.com/:_authToken=\"${VERDACCIO_TOKEN}\"" >> .npmrc
              '''
              sh '''#!/busybox/sh
                /kaniko/executor -f `pwd`/Dockerfile -c `pwd` -d "eu.gcr.io/substra-208412/substrafront:$GIT_COMMIT"
              '''
            }
          }
        }
      }
    }
  }
}
