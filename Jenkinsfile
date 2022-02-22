pipeline {
    agent any
    environment {
        USER_CREDENTIALS = credentials('srv-jenkins')
        CLIENT_NAME = "timber-client"
	API_NAME = "timber-api"
        VERSION = "${env.BUILD_ID}-${env.GIT_COMMIT}"
        IMAGE = "${NAME}:${VERSION}"
        HARBOR_URL = "10.230.5.2"
        HARBOR_PROJECT = "eserv-tst-ns"
    }

    triggers {
        githubPush()
    }


    stages {
        stage('Dependencies') {
            steps {
                dir('server') {
                    sh 'npm i'
                    sh 'npm install pg'
                    sh 'npm install --save-dev @types/pg'
                    sh 'npm run build'
                }
                dir('client') {
                    sh 'npm i'
                  //sh 'npm i bootstrap'
                    sh 'npm run build-css'
                    sh 'npm run build'
                }
            }
        }
        stage('Build and Push') {
            steps {
                script {
                    def client = docker.build("${HARBOR_URL}/${HARBOR_PROJECT}/${CLIENT_NAME}:${VERSION}", "-f ${env.WORKSPACE}/client/Dockerfile ./client")
                    def api = docker.build("${HARBOR_URL}/${HARBOR_PROJECT}/${API_NAME}:${VERSION}", "-f ${env.WORKSPACE}/server/Dockerfile-noenv ./server")
                    docker.withRegistry("https://${HARBOR_URL}", "srv-jenkins-domain") {
                        client.push()
                        client.push("latest")
                    }
                    docker.withRegistry("https://${HARBOR_URL}", "srv-jenkins-domain") {
                        api.push()
                        api.push("latest")
                    }

                }
            }
        }

        stage('Remove local image') {
            steps {
                sh "docker rmi ${HARBOR_URL}/${HARBOR_PROJECT}/${CLIENT_NAME}:${VERSION}"
                sh "docker rmi ${HARBOR_URL}/${HARBOR_PROJECT}/${API_NAME}:${VERSION}"
            }
        }

        stage('Deploy') {

            steps {
                sh 'tkc=$(curl -XPOST -u $USER_CREDENTIALS_USR@ynet.gov.yk.ca:$USER_CREDENTIALS_PSW https://10.230.5.1/wcp/login -k -d \'{"guest_cluster_name":"eserv-tst-cluster"}\' -H "Content-Type: application/json"); tkc_server=$(echo $tkc | jq -r .guest_cluster_server); tkc_session=$(echo $tkc | jq -r .session_id); kubectl config set-cluster $tkc_server --server=https://$tkc_server:6443 --insecure-skip-tls-verify=true; kubectl config set-context tkc-context-prod --cluster=$tkc_server; kubectl --context tkc-context-prod apply -f yaml/ -n timber-reporting --token=$tkc_session'
            }
        }

        stage('Refresh deployments') {

            steps {
                sh 'tkc=$(curl -XPOST -u $USER_CREDENTIALS_USR@ynet.gov.yk.ca:$USER_CREDENTIALS_PSW https://10.230.5.1/wcp/login -k -d \'{"guest_cluster_name":"eserv-tst-cluster"}\' -H "Content-Type: application/json"); tkc_server=$(echo $tkc | jq -r .guest_cluster_server); tkc_session=$(echo $tkc | jq -r .session_id); kubectl config set-cluster $tkc_server --server=https://$tkc_server:6443 --insecure-skip-tls-verify=true; kubectl config set-context tkc-context-prod --cluster=$tkc_server; kubectl --context tkc-context-prod -n timber-reporting rollout restart deployment timber-client --token=$tkc_session'
                sh 'tkc=$(curl -XPOST -u $USER_CREDENTIALS_USR@ynet.gov.yk.ca:$USER_CREDENTIALS_PSW https://10.230.5.1/wcp/login -k -d \'{"guest_cluster_name":"eserv-tst-cluster"}\' -H "Content-Type: application/json"); tkc_server=$(echo $tkc | jq -r .guest_cluster_server); tkc_session=$(echo $tkc | jq -r .session_id); kubectl config set-cluster $tkc_server --server=https://$tkc_server:6443 --insecure-skip-tls-verify=true; kubectl config set-context tkc-context-prod --cluster=$tkc_server; kubectl --context tkc-context-prod -n timber-reporting rollout restart deployment timber-api --token=$tkc_session'
            }
        }

    }
    post {
        always {
            emailext (
                to: 'shu-jun.lin@yukon.ca',
                subject: '$DEFAULT_SUBJECT',
                body: '$DEFAULT_CONTENT',
                mimeType: 'text/html'
            );
        }

        success {
            emailext (
                to: 'ryan.sylvestre@makeit.com,grant.redfern@makeit.com',
                subject: '$DEFAULT_SUBJECT',
                body: 'build number ${BUILD_NUMBER} with Git commit hash ${GIT_REVISION} has succeeded',
                mimeType: 'text/html'
            );
            echo 'Build complete'
        }
        failure {
            emailext (
                to: 'ryan.sylvestre@makeit.com,grant.redfern@makeit.com',
                subject: '$DEFAULT_SUBJECT',
                body: 'build number ${BUILD_NUMBER} with Git commit hash ${GIT_REVISION} has failed',
                mimeType: 'text/html'
            );
            echo 'Build failed'
        }
    }

}

