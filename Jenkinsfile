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
      parallel {
        stage('Test Helm') {
          agent {
            kubernetes {
              label 'substra-frontend-helm'
              defaultContainer 'helm'
              yamlFile '.cicd/agent-helm.yaml'
            }
          }

          steps {
            sh "helm lint charts/substra-frontend"
          }
        }

        stage('Test JS') {
          agent {
            kubernetes {
              label 'substra-frontend-test'
              defaultContainer 'node'
              yamlFile '.cicd/agent-test.yaml'
            }
          }

          steps {
            sh "yarn config set workspaces-experimental true"
            sh "yarn install"
            sh "yarn eslint"
            sh "yarn test"
          }
        }

        stage('Build') {
          agent {
            kubernetes {
              label 'substra-frontend-build'
              yamlFile '.cicd/agent-build.yaml'
            }
          }

          steps {
            container(name:'kaniko', shell:'/busybox/sh') {
              sh '''#!/busybox/sh
                /kaniko/executor -f `pwd`/Dockerfile -c `pwd` -d "eu.gcr.io/substra-208412/substra-frontend:$GIT_COMMIT"
              '''
            }
          }
        }
      }
    }

    stage('Publish Helm') {
      agent {
        kubernetes {
          label 'substra-frontend-helm'
          defaultContainer 'helm'
          yamlFile '.cicd/agent-helm.yaml'
        }
      }

      when { buildingTag() }

      steps {
        sh "helm init --client-only"
        sh "helm plugin install https://github.com/chartmuseum/helm-push"
        sh "helm repo add substra https://substra-charts.owkin.com --username owlways --password Cokear4nnRK9ooC"
        sh "helm push charts/substra-frontend substra || true"
      }
    }
  }
}
