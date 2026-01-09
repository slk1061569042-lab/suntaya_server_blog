pipeline {
    agent any
    
    environment {
        NODE_VERSION = '20'
        PROJECT_NAME = 'git-docs-blog'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '正在检出代码...'
                checkout scm
            }
        }
        
        stage('Setup Node.js') {
            steps {
                echo '正在设置 Node.js 环境...'
                sh '''
                    # 如果使用 nvm
                    # export NVM_DIR="$HOME/.nvm"
                    # [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
                    # nvm use ${NODE_VERSION}
                    
                    # 或者直接使用系统安装的 node
                    node --version
                    npm --version
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '正在安装依赖...'
                sh 'npm ci'
            }
        }
        
        stage('Lint') {
            steps {
                echo '正在运行代码检查...'
                sh 'npm run lint || true'  # 如果 lint 失败不中断构建
            }
        }
        
        stage('Build') {
            steps {
                echo '正在构建项目...'
                sh 'npm run build'
            }
        }
        
        stage('Deploy') {
            steps {
                echo '正在部署...'
                script {
                    // 方式一：部署到服务器目录
                    // sh '''
                    //     # 复制构建文件到服务器目录
                    //     rsync -avz --delete .next/ user@your-server:/var/www/${PROJECT_NAME}/.next/
                    //     rsync -avz --delete public/ user@your-server:/var/www/${PROJECT_NAME}/public/
                    //     rsync -avz package.json package-lock.json user@your-server:/var/www/${PROJECT_NAME}/
                    //     
                    //     # 在服务器上重启应用
                    //     ssh user@your-server "cd /var/www/${PROJECT_NAME} && npm install --production && pm2 restart ${PROJECT_NAME} || pm2 start npm --name ${PROJECT_NAME} -- start"
                    // '''
                    
                    // 方式二：使用 Docker
                    // sh '''
                    //     docker build -t ${PROJECT_NAME}:latest .
                    //     docker stop ${PROJECT_NAME} || true
                    //     docker rm ${PROJECT_NAME} || true
                    //     docker run -d --name ${PROJECT_NAME} -p 3000:3000 ${PROJECT_NAME}:latest
                    // '''
                    
                    // 方式三：使用 PM2（如果 Jenkins 和服务器在同一台机器）
                    sh '''
                        # 停止旧进程
                        pm2 stop ${PROJECT_NAME} || true
                        pm2 delete ${PROJECT_NAME} || true
                        
                        # 启动新进程
                        pm2 start npm --name ${PROJECT_NAME} -- start
                        pm2 save
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ 构建和部署成功！'
            // 可以发送通知，例如：
            // slackSend(color: 'good', message: "构建成功: ${env.BUILD_URL}")
        }
        failure {
            echo '❌ 构建或部署失败！'
            // 可以发送通知，例如：
            // slackSend(color: 'danger', message: "构建失败: ${env.BUILD_URL}")
        }
        always {
            echo '清理工作空间...'
            cleanWs()
        }
    }
}
