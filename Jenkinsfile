node('v2-slave'){
    step([$class: 'WsCleanup'])
    try
       {
          dir('node_modules'){
              deleteDir()
          }
          dir('dist'){
              deleteDir()
          }

          git branch: env.BRANCH_NAME, credentialsId: 'stoicbot-github-ssh', url: "git@github.com:sutoiku/lambda-artifacts-cleaner"

          stage name: 'Unit testing', concurrency: 1
            try{
                sh("npm run stoic-unit-tests")
            }
            catch(err){
                throw err
            }
            finally{
               step([$class: "JUnitResultArchiver", testResults: "reports/report.xml"])
               step([$class: 'CoberturaPublisher',
                       autoUpdateHealth: false,
                       autoUpdateStability: false,
                       coberturaReportFile: 'coverage/cobertura-coverage.xml',
                       failUnhealthy: false,
                       failUnstable: false,
                       maxNumberOfBuilds: 0,
                       onlyStable: false,
                       sourceEncoding: 'ASCII',
                       zoomCoverageChart: false
                     ])
            }

          stage name: 'Resolving dependencies', concurrency: 1
              sh("npm i")

          stage name: 'Deploying', concurrency: 1
              sh("node node_modules/grunt-cli/bin/grunt deploy")
              slackSend channel: '#builds', color: 'success', message: "Build Done : ${env.JOB_NAME}\nBranch : ${env.BRANCH_NAME} (<${env.BUILD_URL}|Open>)"
        }
        catch (error){
          slackSend channel: '#builds', color: 'danger', message: "Build failed : ${env.JOB_NAME}\nBranch : ${env.BRANCH_NAME} (<${env.BUILD_URL}|Open>)"
          throw error
        }
}
