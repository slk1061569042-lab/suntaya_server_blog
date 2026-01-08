2026-01-07 15:51:11.778 [info] Resolving ssh remote authority 'myserver' (Unparsed 'ssh-remote+7b22686f73744e616d65223a226d79736572766572227d') (attempt #1)
2026-01-07 15:51:11.779 [info] SSH askpass server listening on port 10983
2026-01-07 15:51:11.779 [info] Using configured platform linux for remote host myserver
2026-01-07 15:51:11.779 [info] Using askpass script: c:\Users\Administrator\.cursor\extensions\anysphere.remote-ssh-1.0.36\dist\scripts\launchSSHAskpass.bat with javascript file c:\Users\Administrator\.cursor\extensions\anysphere.remote-ssh-1.0.36\dist\scripts\sshAskClient.js. Askpass handle: 10983
2026-01-07 15:51:11.791 [info] Launching SSH server via shell with command: type "C:\Users\ADMINI~1\AppData\Local\Temp\cursor_remote_install_5efd4447-aa64-4229-9537-55a2a9f0b4b9.sh" | ssh -T -F "C:\Users\Administrator\.ssh\config" -D 10985 myserver bash --login -c bash
2026-01-07 15:51:11.791 [info] Establishing SSH connection: type "C:\Users\ADMINI~1\AppData\Local\Temp\cursor_remote_install_5efd4447-aa64-4229-9537-55a2a9f0b4b9.sh" | ssh -T -F "C:\Users\Administrator\.ssh\config" -D 10985 myserver bash --login -c bash
2026-01-07 15:51:11.791 [info] Started installation script. Waiting for it to finish...
2026-01-07 15:51:11.791 [info] Waiting for server to install. Timeout: 30000ms
2026-01-07 15:51:12.298 [info] (ssh_tunnel) stdout: Configuring Cursor Server on Remote

2026-01-07 15:51:12.302 [info] (ssh_tunnel) stdout: Using TMP_DIR: /run/user/0

2026-01-07 15:51:12.347 [info] (ssh_tunnel) stdout: Locking /run/user/0/cursor-remote-lock.6ca0869f6193ac0d40fa6ae74ed01260

2026-01-07 15:51:12.349 [info] (ssh_tunnel) stdout: Server script already installed in /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/bin/cursor-server
Checking node executable

2026-01-07 15:51:12.353 [info] (ssh_tunnel) stdout: v20.18.2

2026-01-07 15:51:12.358 [info] (ssh_tunnel) stdout: Checking for running multiplex server: /root/.cursor-server/bin/multiplex-server/3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8.js

2026-01-07 15:51:12.378 [info] (ssh_tunnel) stdout: Running multiplex server: 

2026-01-07 15:51:12.382 [info] (ssh_tunnel) stdout: Creating multiplex server token file /run/user/0/cursor-remote-multiplex.token.6ca0869f6193ac0d40fa6ae74ed01260.3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8

2026-01-07 15:51:12.386 [info] (ssh_tunnel) stdout: Creating directory for multiplex server: /root/.cursor-server/bin/multiplex-server

2026-01-07 15:51:12.389 [info] (ssh_tunnel) stdout: Writing multiplex server script to /root/.cursor-server/bin/multiplex-server/3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8.js

2026-01-07 15:51:12.391 [info] (ssh_tunnel) stdout: Starting multiplex server: /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/node /root/.cursor-server/bin/multiplex-server/3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8.js 7f22c3a2-e6e4-4b1e-9bee-960644ccda16 0

2026-01-07 15:51:12.391 [info] (ssh_tunnel) stdout: Multiplex server started with PID 467010 and wrote pid to file /run/user/0/cursor-remote-multiplex.pid.6ca0869f6193ac0d40fa6ae74ed01260.3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8

2026-01-07 15:51:12.392 [info] (ssh_tunnel) stdout: Reading multiplex server token file /run/user/0/cursor-remote-multiplex.token.6ca0869f6193ac0d40fa6ae74ed01260.3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8

2026-01-07 15:51:12.392 [info] (ssh_tunnel) stdout: Multiplex server token file found

2026-01-07 15:51:12.394 [info] (ssh_tunnel) stdout: Reading multiplex server log file /run/user/0/cursor-remote-multiplex.log.6ca0869f6193ac0d40fa6ae74ed01260.3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8

2026-01-07 15:51:12.901 [info] (ssh_tunnel) stdout: Checking for code servers

2026-01-07 15:51:12.919 [info] (ssh_tunnel) stdout: Code server script is not running

2026-01-07 15:51:12.921 [info] (ssh_tunnel) stdout: Creating code server token file /run/user/0/cursor-remote-code.token.6ca0869f6193ac0d40fa6ae74ed01260

2026-01-07 15:51:12.923 [info] (ssh_tunnel) stdout: Starting code server script /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/bin/cursor-server --start-server --host=127.0.0.1 --port 0  --connection-token-file /run/user/0/cursor-remote-code.token.6ca0869f6193ac0d40fa6ae74ed01260 --telemetry-level off --enable-remote-auto-shutdown --accept-server-license-terms &> /run/user/0/cursor-remote-code.log.6ca0869f6193ac0d40fa6ae74ed01260 &

2026-01-07 15:51:12.925 [info] (ssh_tunnel) stdout: Code server started with PID 467066 and wrote pid to file /run/user/0/cursor-remote-code.pid.6ca0869f6193ac0d40fa6ae74ed01260

2026-01-07 15:51:12.926 [info] (ssh_tunnel) stdout: Code server log file is /run/user/0/cursor-remote-code.log.6ca0869f6193ac0d40fa6ae74ed01260

2026-01-07 15:51:13.442 [info] (ssh_tunnel) stdout: f5720fb9b2ec2231dbae0237: start
exitCode==0==
nodeExecutable==/root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/node==
errorMessage====
isFatalError==false==
multiplexListeningOn==38119==

2026-01-07 15:51:13.442 [info] (ssh_tunnel) stdout: multiplexConnectionToken==7f22c3a2-e6e4-4b1e-9bee-960644ccda16==
codeListeningOn==32957==
codeConnectionToken==e2df8d0b-f292-4b04-ad9c-dea59fba9636==
detectedPlatform==linux==
arch==x64==
SSH_AUTH_SOCK====
f5720fb9b2ec2231dbae0237: end

2026-01-07 15:51:13.442 [info] Server install command exit code:  0
2026-01-07 15:51:13.442 [info] Deleting local script C:\Users\ADMINI~1\AppData\Local\Temp\cursor_remote_install_5efd4447-aa64-4229-9537-55a2a9f0b4b9.sh
2026-01-07 15:51:13.443 [info] [forwarding][code] creating new forwarding server
2026-01-07 15:51:13.443 [info] [forwarding][code] server listening on 127.0.0.1:11003
2026-01-07 15:51:13.443 [info] [forwarding][code] Set up server
2026-01-07 15:51:13.443 [info] [remote-ssh] codeListeningOn (remote=127.0.0.1:32957; local=127.0.0.1:11003) codeConnectionToken: e2df8d0b-f292-4b04-ad9c-dea59fba9636
2026-01-07 15:51:13.443 [info] [forwarding][multiplex] creating new forwarding server
2026-01-07 15:51:13.443 [info] [forwarding][multiplex] server listening on 127.0.0.1:11004
2026-01-07 15:51:13.443 [info] [forwarding][multiplex] Set up server
2026-01-07 15:51:13.444 [info] [remote-ssh] multiplexListeningOn (remote=[object Object]; local=[object Object]) multiplexConnectionToken: 7f22c3a2-e6e4-4b1e-9bee-960644ccda16
2026-01-07 15:51:13.444 [info] [remote-ssh] Pinging remote server via 127.0.0.1:11004...
2026-01-07 15:51:13.445 [info] [remote-ssh] Resolved exec server. Socks port: 10985
2026-01-07 15:51:13.445 [info] Setting up 0 default forwarded ports
2026-01-07 15:51:13.445 [info] [remote-ssh] Resolved authority: {"host":"127.0.0.1","port":11003,"connectionToken":"e2df8d0b-f292-4b04-ad9c-dea59fba9636","extensionHostEnv":{}}. Socks port: 10985
2026-01-07 15:51:13.449 [info] (ssh_tunnel) stdout: Unlocking /run/user/0/cursor-remote-lock.6ca0869f6193ac0d40fa6ae74ed01260

2026-01-07 15:51:13.453 [info] (ssh_tunnel) stdout:  
***********************************************************************
* This terminal is used to establish and maintain the SSH connection. *
* Closing this terminal will terminate the connection and disconnect  *

2026-01-07 15:51:13.454 [info] (ssh_tunnel) stdout: * Cursor from the remote server.                                      *
***********************************************************************

2026-01-07 15:51:13.756 [error] [command][5cf450b2-868e-441b-9189-1e6a4f5c209b] Socket error: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:51:13.756 [warning] [remote-ssh] Failed to ping remote server via 127.0.0.1:11004: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:51:34.546 [info] Resolving ssh remote authority 'myserver' (Unparsed 'ssh-remote+7b22686f73744e616d65223a226d79736572766572227d') (attempt #2)
2026-01-07 15:51:34.546 [info] Received re-connection request; checking to see if existing connection is still valid
2026-01-07 15:51:34.855 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 1 of 3 fetch failed
2026-01-07 15:51:36.177 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 2 of 3 fetch failed
2026-01-07 15:51:37.497 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 3 of 3 fetch failed
2026-01-07 15:51:37.497 [error] Could not re-use existing SOCKS connection; attempting to re-establish SOCKS forwarding Failed to connect to Cursor code server. Ensure that your remote host ssh config has 'AllowTcpForwarding yes' in '/etc/ssh/sshd_config'. Please check the logs and try reinstalling the server.
2026-01-07 15:51:37.497 [info] [forwarding][code] returning existing forwarding server listening on local port 11003
2026-01-07 15:51:37.497 [info] [remote-ssh] codeListeningOn (remote=127.0.0.1:32957; local=127.0.0.1:11003) codeConnectionToken: e2df8d0b-f292-4b04-ad9c-dea59fba9636
2026-01-07 15:51:37.497 [info] [forwarding][multiplex] returning existing forwarding server listening on local port 11004
2026-01-07 15:51:37.498 [info] [remote-ssh] multiplexListeningOn (remote=[object Object]; local=[object Object]) multiplexConnectionToken: 7f22c3a2-e6e4-4b1e-9bee-960644ccda16
2026-01-07 15:51:37.498 [info] [remote-ssh] Pinging remote server via 127.0.0.1:11004...
2026-01-07 15:51:37.806 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 1 of 3 fetch failed
2026-01-07 15:51:37.806 [error] [command][e4e25fad-b9aa-4b12-9d8b-e8ac8718f920] Socket error: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:51:37.806 [warning] [remote-ssh] Failed to ping remote server via 127.0.0.1:11004: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:51:39.130 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 2 of 3 fetch failed
2026-01-07 15:51:40.453 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 3 of 3 fetch failed
2026-01-07 15:51:40.454 [error] Could not re-establish SOCKS forwarding; re-establishing entire SSH connection Failed to connect to Cursor code server. Ensure that your remote host ssh config has 'AllowTcpForwarding yes' in '/etc/ssh/sshd_config'. Please check the logs and try reinstalling the server.
2026-01-07 15:51:40.563 [info] Terminating existing SSH process
2026-01-07 15:51:40.563 [info] Using configured platform linux for remote host myserver
2026-01-07 15:51:40.564 [info] Using askpass script: c:\Users\Administrator\.cursor\extensions\anysphere.remote-ssh-1.0.36\dist\scripts\launchSSHAskpass.bat with javascript file c:\Users\Administrator\.cursor\extensions\anysphere.remote-ssh-1.0.36\dist\scripts\sshAskClient.js. Askpass handle: 10983
2026-01-07 15:51:40.569 [info] Launching SSH server via shell with command: type "C:\Users\ADMINI~1\AppData\Local\Temp\cursor_remote_install_2e91c9f0-b877-4bf7-8805-88a7d4dedff8.sh" | ssh -T -F "C:\Users\Administrator\.ssh\config" -D 11235 myserver bash --login -c bash
2026-01-07 15:51:40.569 [info] Establishing SSH connection: type "C:\Users\ADMINI~1\AppData\Local\Temp\cursor_remote_install_2e91c9f0-b877-4bf7-8805-88a7d4dedff8.sh" | ssh -T -F "C:\Users\Administrator\.ssh\config" -D 11235 myserver bash --login -c bash
2026-01-07 15:51:40.569 [info] Started installation script. Waiting for it to finish...
2026-01-07 15:51:40.569 [info] Waiting for server to install. Timeout: 30000ms
2026-01-07 15:51:41.122 [info] (ssh_tunnel) stdout: Configuring Cursor Server on Remote

2026-01-07 15:51:41.125 [info] (ssh_tunnel) stdout: Using TMP_DIR: /run/user/0

2026-01-07 15:51:41.169 [info] (ssh_tunnel) stdout: Locking /run/user/0/cursor-remote-lock.6ca0869f6193ac0d40fa6ae74ed01260

2026-01-07 15:51:41.172 [info] (ssh_tunnel) stdout: Server script already installed in /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/bin/cursor-server
Checking node executable

2026-01-07 15:51:41.178 [info] (ssh_tunnel) stdout: v20.18.2

2026-01-07 15:51:41.184 [info] (ssh_tunnel) stdout: Checking for running multiplex server: /root/.cursor-server/bin/multiplex-server/3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8.js

2026-01-07 15:51:41.204 [info] (ssh_tunnel) stdout: Running multiplex server:  467010 /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/node /root/.cursor-server/bin/multiplex-server/3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8.js 7f22c3a2-e6e4-4b1e-9bee-960644ccda16 0

2026-01-07 15:51:41.206 [info] (ssh_tunnel) stdout: Multiplex server script is already running /root/.cursor-server/bin/multiplex-server/3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8.js. Running processes are  467010 /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/node /root/.cursor-server/bin/multiplex-server/3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8.js 7f22c3a2-e6e4-4b1e-9bee-960644ccda16 0

2026-01-07 15:51:41.206 [info] (ssh_tunnel) stdout: Reading multiplex server token file /run/user/0/cursor-remote-multiplex.token.6ca0869f6193ac0d40fa6ae74ed01260.3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8

2026-01-07 15:51:41.206 [info] (ssh_tunnel) stdout: Multiplex server token file found

2026-01-07 15:51:41.207 [info] (ssh_tunnel) stdout: Reading multiplex server log file /run/user/0/cursor-remote-multiplex.log.6ca0869f6193ac0d40fa6ae74ed01260.3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8

2026-01-07 15:51:41.210 [info] (ssh_tunnel) stdout: Checking for code servers

2026-01-07 15:51:41.226 [info] (ssh_tunnel) stdout: Code server script is already running /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/bin/cursor-server. Running processes are  467066 sh /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/bin/cursor-server --start-server --host=127.0.0.1 --port 0 --connection-token-file /run/user/0/cursor-remote-code.token.6ca0869f6193ac0d40fa6ae74ed01260 --telemetry-level off --enable-remote-auto-shutdown --accept-server-license-terms

2026-01-07 15:51:41.227 [info] (ssh_tunnel) stdout: Code server log file is /run/user/0/cursor-remote-code.log.6ca0869f6193ac0d40fa6ae74ed01260

2026-01-07 15:51:41.233 [info] (ssh_tunnel) stdout: d2aefa8ad93bb7ede28a2d00: start
exitCode==0==
nodeExecutable==/root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/node==
errorMessage====
isFatalError==false==

2026-01-07 15:51:41.233 [info] (ssh_tunnel) stdout: multiplexListeningOn==38119==
multiplexConnectionToken==7f22c3a2-e6e4-4b1e-9bee-960644ccda16==
codeListeningOn==32957==
codeConnectionToken==e2df8d0b-f292-4b04-ad9c-dea59fba9636==
detectedPlatform==linux==
arch==x64==
SSH_AUTH_SOCK====
d2aefa8ad93bb7ede28a2d00: end

2026-01-07 15:51:41.234 [info] Server install command exit code:  0
2026-01-07 15:51:41.234 [info] Deleting local script C:\Users\ADMINI~1\AppData\Local\Temp\cursor_remote_install_2e91c9f0-b877-4bf7-8805-88a7d4dedff8.sh
2026-01-07 15:51:41.234 [info] [forwarding][code] returning existing forwarding server listening on local port 11003
2026-01-07 15:51:41.234 [info] [remote-ssh] codeListeningOn (remote=127.0.0.1:32957; local=127.0.0.1:11003) codeConnectionToken: e2df8d0b-f292-4b04-ad9c-dea59fba9636
2026-01-07 15:51:41.234 [info] [forwarding][multiplex] returning existing forwarding server listening on local port 11004
2026-01-07 15:51:41.234 [info] [remote-ssh] multiplexListeningOn (remote=[object Object]; local=[object Object]) multiplexConnectionToken: 7f22c3a2-e6e4-4b1e-9bee-960644ccda16
2026-01-07 15:51:41.234 [info] [remote-ssh] Pinging remote server via 127.0.0.1:11004...
2026-01-07 15:51:41.235 [info] [remote-ssh] Resolved exec server. Socks port: 11235
2026-01-07 15:51:41.235 [info] Setting up 0 default forwarded ports
2026-01-07 15:51:41.235 [info] [remote-ssh] Resolved authority: {"host":"127.0.0.1","port":11003,"connectionToken":"e2df8d0b-f292-4b04-ad9c-dea59fba9636","extensionHostEnv":{}}. Socks port: 11235
2026-01-07 15:51:41.238 [info] (ssh_tunnel) stdout: Unlocking /run/user/0/cursor-remote-lock.6ca0869f6193ac0d40fa6ae74ed01260

2026-01-07 15:51:41.240 [info] (ssh_tunnel) stdout:  
***********************************************************************
* This terminal is used to establish and maintain the SSH connection. *
* Closing this terminal will terminate the connection and disconnect  *
* Cursor from the remote server.                                      *
***********************************************************************

2026-01-07 15:51:41.545 [error] [command][c54fdb0f-0bf4-49b9-a94a-c0c58a89a6ee] Socket error: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:51:41.545 [warning] [remote-ssh] Failed to ping remote server via 127.0.0.1:11004: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:52:16.633 [info] Resolving ssh remote authority 'myserver' (Unparsed 'ssh-remote+7b22686f73744e616d65223a226d79736572766572227d') (attempt #3)
2026-01-07 15:52:16.634 [info] Received re-connection request; checking to see if existing connection is still valid
2026-01-07 15:52:16.942 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 1 of 3 fetch failed
2026-01-07 15:52:18.255 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 2 of 3 fetch failed
2026-01-07 15:52:19.570 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 3 of 3 fetch failed
2026-01-07 15:52:19.570 [error] Could not re-use existing SOCKS connection; attempting to re-establish SOCKS forwarding Failed to connect to Cursor code server. Ensure that your remote host ssh config has 'AllowTcpForwarding yes' in '/etc/ssh/sshd_config'. Please check the logs and try reinstalling the server.
2026-01-07 15:52:19.570 [info] [forwarding][code] returning existing forwarding server listening on local port 11003
2026-01-07 15:52:19.570 [info] [remote-ssh] codeListeningOn (remote=127.0.0.1:32957; local=127.0.0.1:11003) codeConnectionToken: e2df8d0b-f292-4b04-ad9c-dea59fba9636
2026-01-07 15:52:19.570 [info] [forwarding][multiplex] returning existing forwarding server listening on local port 11004
2026-01-07 15:52:19.570 [info] [remote-ssh] multiplexListeningOn (remote=[object Object]; local=[object Object]) multiplexConnectionToken: 7f22c3a2-e6e4-4b1e-9bee-960644ccda16
2026-01-07 15:52:19.570 [info] [remote-ssh] Pinging remote server via 127.0.0.1:11004...
2026-01-07 15:52:19.878 [error] [command][d37fd812-9c68-47be-aed3-60e80e2bc3b0] Socket error: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:52:19.878 [warning] [remote-ssh] Failed to ping remote server via 127.0.0.1:11004: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:52:19.879 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 1 of 3 fetch failed
2026-01-07 15:52:21.193 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 2 of 3 fetch failed
2026-01-07 15:52:22.507 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 3 of 3 fetch failed
2026-01-07 15:52:22.508 [error] Could not re-establish SOCKS forwarding; re-establishing entire SSH connection Failed to connect to Cursor code server. Ensure that your remote host ssh config has 'AllowTcpForwarding yes' in '/etc/ssh/sshd_config'. Please check the logs and try reinstalling the server.
2026-01-07 15:52:22.596 [info] Terminating existing SSH process
2026-01-07 15:52:22.596 [info] Using configured platform linux for remote host myserver
2026-01-07 15:52:22.596 [info] Using askpass script: c:\Users\Administrator\.cursor\extensions\anysphere.remote-ssh-1.0.36\dist\scripts\launchSSHAskpass.bat with javascript file c:\Users\Administrator\.cursor\extensions\anysphere.remote-ssh-1.0.36\dist\scripts\sshAskClient.js. Askpass handle: 10983
2026-01-07 15:52:22.600 [info] Launching SSH server via shell with command: type "C:\Users\ADMINI~1\AppData\Local\Temp\cursor_remote_install_245f4164-5a38-43d3-9032-0ec334af3883.sh" | ssh -T -F "C:\Users\Administrator\.ssh\config" -D 11576 myserver bash --login -c bash
2026-01-07 15:52:22.600 [info] Establishing SSH connection: type "C:\Users\ADMINI~1\AppData\Local\Temp\cursor_remote_install_245f4164-5a38-43d3-9032-0ec334af3883.sh" | ssh -T -F "C:\Users\Administrator\.ssh\config" -D 11576 myserver bash --login -c bash
2026-01-07 15:52:22.600 [info] Started installation script. Waiting for it to finish...
2026-01-07 15:52:22.600 [info] Waiting for server to install. Timeout: 30000ms
2026-01-07 15:52:23.111 [info] (ssh_tunnel) stdout: Configuring Cursor Server on Remote

2026-01-07 15:52:23.116 [info] (ssh_tunnel) stdout: Using TMP_DIR: /run/user/0

2026-01-07 15:52:23.155 [info] (ssh_tunnel) stdout: Locking /run/user/0/cursor-remote-lock.6ca0869f6193ac0d40fa6ae74ed01260

2026-01-07 15:52:23.157 [info] (ssh_tunnel) stdout: Server script already installed in /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/bin/cursor-server

2026-01-07 15:52:23.157 [info] (ssh_tunnel) stdout: Checking node executable

2026-01-07 15:52:23.159 [info] (ssh_tunnel) stdout: v20.18.2

2026-01-07 15:52:23.164 [info] (ssh_tunnel) stdout: Checking for running multiplex server: /root/.cursor-server/bin/multiplex-server/3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8.js

2026-01-07 15:52:23.183 [info] (ssh_tunnel) stdout: Running multiplex server:  467010 /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/node /root/.cursor-server/bin/multiplex-server/3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8.js 7f22c3a2-e6e4-4b1e-9bee-960644ccda16 0

2026-01-07 15:52:23.187 [info] (ssh_tunnel) stdout: Multiplex server script is already running /root/.cursor-server/bin/multiplex-server/3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8.js. Running processes are  467010 /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/node /root/.cursor-server/bin/multiplex-server/3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8.js 7f22c3a2-e6e4-4b1e-9bee-960644ccda16 0

2026-01-07 15:52:23.187 [info] (ssh_tunnel) stdout: Reading multiplex server token file /run/user/0/cursor-remote-multiplex.token.6ca0869f6193ac0d40fa6ae74ed01260.3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8
Multiplex server token file found

2026-01-07 15:52:23.189 [info] (ssh_tunnel) stdout: Reading multiplex server log file /run/user/0/cursor-remote-multiplex.log.6ca0869f6193ac0d40fa6ae74ed01260.3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8

2026-01-07 15:52:23.192 [info] (ssh_tunnel) stdout: Checking for code servers

2026-01-07 15:52:23.214 [info] (ssh_tunnel) stdout: Code server script is already running /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/bin/cursor-server. Running processes are  467066 sh /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/bin/cursor-server --start-server --host=127.0.0.1 --port 0 --connection-token-file /run/user/0/cursor-remote-code.token.6ca0869f6193ac0d40fa6ae74ed01260 --telemetry-level off --enable-remote-auto-shutdown --accept-server-license-terms

2026-01-07 15:52:23.216 [info] (ssh_tunnel) stdout: Code server log file is /run/user/0/cursor-remote-code.log.6ca0869f6193ac0d40fa6ae74ed01260

2026-01-07 15:52:23.221 [info] (ssh_tunnel) stdout: 9afb20ac28ebc732e546ed17: start
exitCode==0==
nodeExecutable==/root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/node==
errorMessage====

2026-01-07 15:52:23.222 [info] (ssh_tunnel) stdout: isFatalError==false==
multiplexListeningOn==38119==
multiplexConnectionToken==7f22c3a2-e6e4-4b1e-9bee-960644ccda16==
codeListeningOn==32957==
codeConnectionToken==e2df8d0b-f292-4b04-ad9c-dea59fba9636==
detectedPlatform==linux==
arch==x64==
SSH_AUTH_SOCK====
9afb20ac28ebc732e546ed17: end

2026-01-07 15:52:23.222 [info] Server install command exit code:  0
2026-01-07 15:52:23.222 [info] Deleting local script C:\Users\ADMINI~1\AppData\Local\Temp\cursor_remote_install_245f4164-5a38-43d3-9032-0ec334af3883.sh
2026-01-07 15:52:23.222 [info] [forwarding][code] returning existing forwarding server listening on local port 11003
2026-01-07 15:52:23.222 [info] [remote-ssh] codeListeningOn (remote=127.0.0.1:32957; local=127.0.0.1:11003) codeConnectionToken: e2df8d0b-f292-4b04-ad9c-dea59fba9636
2026-01-07 15:52:23.222 [info] [forwarding][multiplex] returning existing forwarding server listening on local port 11004
2026-01-07 15:52:23.222 [info] [remote-ssh] multiplexListeningOn (remote=[object Object]; local=[object Object]) multiplexConnectionToken: 7f22c3a2-e6e4-4b1e-9bee-960644ccda16
2026-01-07 15:52:23.222 [info] [remote-ssh] Pinging remote server via 127.0.0.1:11004...
2026-01-07 15:52:23.223 [info] [remote-ssh] Resolved exec server. Socks port: 11576
2026-01-07 15:52:23.223 [info] Setting up 0 default forwarded ports
2026-01-07 15:52:23.223 [info] [remote-ssh] Resolved authority: {"host":"127.0.0.1","port":11003,"connectionToken":"e2df8d0b-f292-4b04-ad9c-dea59fba9636","extensionHostEnv":{}}. Socks port: 11576
2026-01-07 15:52:23.227 [info] (ssh_tunnel) stdout: Unlocking /run/user/0/cursor-remote-lock.6ca0869f6193ac0d40fa6ae74ed01260

2026-01-07 15:52:23.229 [info] (ssh_tunnel) stdout:  
***********************************************************************
* This terminal is used to establish and maintain the SSH connection. *

2026-01-07 15:52:23.229 [info] (ssh_tunnel) stdout: * Closing this terminal will terminate the connection and disconnect  *
* Cursor from the remote server.                                      *
***********************************************************************

2026-01-07 15:52:23.527 [error] [command][e2f22f5b-6c5d-44d9-a716-266be26e0d91] Socket error: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:52:23.528 [warning] [remote-ssh] Failed to ping remote server via 127.0.0.1:11004: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:52:58.753 [info] Resolving ssh remote authority 'myserver' (Unparsed 'ssh-remote+7b22686f73744e616d65223a226d79736572766572227d') (attempt #4)
2026-01-07 15:52:58.753 [info] Received re-connection request; checking to see if existing connection is still valid
2026-01-07 15:52:59.060 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 1 of 3 fetch failed
2026-01-07 15:53:00.371 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 2 of 3 fetch failed
2026-01-07 15:53:01.685 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 3 of 3 fetch failed
2026-01-07 15:53:01.686 [error] Could not re-use existing SOCKS connection; attempting to re-establish SOCKS forwarding Failed to connect to Cursor code server. Ensure that your remote host ssh config has 'AllowTcpForwarding yes' in '/etc/ssh/sshd_config'. Please check the logs and try reinstalling the server.
2026-01-07 15:53:01.686 [info] [forwarding][code] returning existing forwarding server listening on local port 11003
2026-01-07 15:53:01.686 [info] [remote-ssh] codeListeningOn (remote=127.0.0.1:32957; local=127.0.0.1:11003) codeConnectionToken: e2df8d0b-f292-4b04-ad9c-dea59fba9636
2026-01-07 15:53:01.686 [info] [forwarding][multiplex] returning existing forwarding server listening on local port 11004
2026-01-07 15:53:01.686 [info] [remote-ssh] multiplexListeningOn (remote=[object Object]; local=[object Object]) multiplexConnectionToken: 7f22c3a2-e6e4-4b1e-9bee-960644ccda16
2026-01-07 15:53:01.686 [info] [remote-ssh] Pinging remote server via 127.0.0.1:11004...
2026-01-07 15:53:01.993 [error] [command][008d031e-e739-419b-a469-bc3c80f64de7] Socket error: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:53:01.993 [warning] [remote-ssh] Failed to ping remote server via 127.0.0.1:11004: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:53:01.993 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 1 of 3 fetch failed
2026-01-07 15:53:03.305 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 2 of 3 fetch failed
2026-01-07 15:53:04.617 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 3 of 3 fetch failed
2026-01-07 15:53:04.617 [error] Could not re-establish SOCKS forwarding; re-establishing entire SSH connection Failed to connect to Cursor code server. Ensure that your remote host ssh config has 'AllowTcpForwarding yes' in '/etc/ssh/sshd_config'. Please check the logs and try reinstalling the server.
2026-01-07 15:53:04.711 [info] Terminating existing SSH process
2026-01-07 15:53:04.711 [info] Using configured platform linux for remote host myserver
2026-01-07 15:53:04.711 [info] Using askpass script: c:\Users\Administrator\.cursor\extensions\anysphere.remote-ssh-1.0.36\dist\scripts\launchSSHAskpass.bat with javascript file c:\Users\Administrator\.cursor\extensions\anysphere.remote-ssh-1.0.36\dist\scripts\sshAskClient.js. Askpass handle: 10983
2026-01-07 15:53:04.715 [info] Launching SSH server via shell with command: type "C:\Users\ADMINI~1\AppData\Local\Temp\cursor_remote_install_0d2debf7-d74e-4cc3-9a7b-2872708a42a1.sh" | ssh -T -F "C:\Users\Administrator\.ssh\config" -D 11918 myserver bash --login -c bash
2026-01-07 15:53:04.715 [info] Establishing SSH connection: type "C:\Users\ADMINI~1\AppData\Local\Temp\cursor_remote_install_0d2debf7-d74e-4cc3-9a7b-2872708a42a1.sh" | ssh -T -F "C:\Users\Administrator\.ssh\config" -D 11918 myserver bash --login -c bash
2026-01-07 15:53:04.715 [info] Started installation script. Waiting for it to finish...
2026-01-07 15:53:04.715 [info] Waiting for server to install. Timeout: 30000ms
2026-01-07 15:53:05.230 [info] (ssh_tunnel) stdout: Configuring Cursor Server on Remote

2026-01-07 15:53:05.234 [info] (ssh_tunnel) stdout: Using TMP_DIR: /run/user/0

2026-01-07 15:53:05.278 [info] (ssh_tunnel) stdout: Locking /run/user/0/cursor-remote-lock.6ca0869f6193ac0d40fa6ae74ed01260

2026-01-07 15:53:05.281 [info] (ssh_tunnel) stdout: Server script already installed in /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/bin/cursor-server
Checking node executable

2026-01-07 15:53:05.286 [info] (ssh_tunnel) stdout: v20.18.2

2026-01-07 15:53:05.292 [info] (ssh_tunnel) stdout: Checking for running multiplex server: /root/.cursor-server/bin/multiplex-server/3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8.js

2026-01-07 15:53:05.311 [info] (ssh_tunnel) stdout: Running multiplex server:  467010 /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/node /root/.cursor-server/bin/multiplex-server/3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8.js 7f22c3a2-e6e4-4b1e-9bee-960644ccda16 0

2026-01-07 15:53:05.314 [info] (ssh_tunnel) stdout: Multiplex server script is already running /root/.cursor-server/bin/multiplex-server/3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8.js. Running processes are  467010 /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/node /root/.cursor-server/bin/multiplex-server/3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8.js 7f22c3a2-e6e4-4b1e-9bee-960644ccda16 0

2026-01-07 15:53:05.314 [info] (ssh_tunnel) stdout: Reading multiplex server token file /run/user/0/cursor-remote-multiplex.token.6ca0869f6193ac0d40fa6ae74ed01260.3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8
Multiplex server token file found

2026-01-07 15:53:05.315 [info] (ssh_tunnel) stdout: Reading multiplex server log file /run/user/0/cursor-remote-multiplex.log.6ca0869f6193ac0d40fa6ae74ed01260.3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8

2026-01-07 15:53:05.319 [info] (ssh_tunnel) stdout: Checking for code servers

2026-01-07 15:53:05.338 [info] (ssh_tunnel) stdout: Code server script is already running /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/bin/cursor-server. Running processes are  467066 sh /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/bin/cursor-server --start-server --host=127.0.0.1 --port 0 --connection-token-file /run/user/0/cursor-remote-code.token.6ca0869f6193ac0d40fa6ae74ed01260 --telemetry-level off --enable-remote-auto-shutdown --accept-server-license-terms

2026-01-07 15:53:05.339 [info] (ssh_tunnel) stdout: Code server log file is /run/user/0/cursor-remote-code.log.6ca0869f6193ac0d40fa6ae74ed01260

2026-01-07 15:53:05.346 [info] (ssh_tunnel) stdout: 3787e564c7dd030be15fc859: start
exitCode==0==
nodeExecutable==/root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/node==
errorMessage====
isFatalError==false==
multiplexListeningOn==38119==

2026-01-07 15:53:05.346 [info] (ssh_tunnel) stdout: multiplexConnectionToken==7f22c3a2-e6e4-4b1e-9bee-960644ccda16==
codeListeningOn==32957==
codeConnectionToken==e2df8d0b-f292-4b04-ad9c-dea59fba9636==
detectedPlatform==linux==
arch==x64==
SSH_AUTH_SOCK====
3787e564c7dd030be15fc859: end

2026-01-07 15:53:05.346 [info] Server install command exit code:  0
2026-01-07 15:53:05.346 [info] Deleting local script C:\Users\ADMINI~1\AppData\Local\Temp\cursor_remote_install_0d2debf7-d74e-4cc3-9a7b-2872708a42a1.sh
2026-01-07 15:53:05.346 [info] [forwarding][code] returning existing forwarding server listening on local port 11003
2026-01-07 15:53:05.346 [info] [remote-ssh] codeListeningOn (remote=127.0.0.1:32957; local=127.0.0.1:11003) codeConnectionToken: e2df8d0b-f292-4b04-ad9c-dea59fba9636
2026-01-07 15:53:05.347 [info] [forwarding][multiplex] returning existing forwarding server listening on local port 11004
2026-01-07 15:53:05.347 [info] [remote-ssh] multiplexListeningOn (remote=[object Object]; local=[object Object]) multiplexConnectionToken: 7f22c3a2-e6e4-4b1e-9bee-960644ccda16
2026-01-07 15:53:05.347 [info] [remote-ssh] Pinging remote server via 127.0.0.1:11004...
2026-01-07 15:53:05.347 [info] [remote-ssh] Resolved exec server. Socks port: 11918
2026-01-07 15:53:05.347 [info] Setting up 0 default forwarded ports
2026-01-07 15:53:05.347 [info] [remote-ssh] Resolved authority: {"host":"127.0.0.1","port":11003,"connectionToken":"e2df8d0b-f292-4b04-ad9c-dea59fba9636","extensionHostEnv":{}}. Socks port: 11918
2026-01-07 15:53:05.351 [info] (ssh_tunnel) stdout: Unlocking /run/user/0/cursor-remote-lock.6ca0869f6193ac0d40fa6ae74ed01260

2026-01-07 15:53:05.352 [info] (ssh_tunnel) stdout:  
***********************************************************************
* This terminal is used to establish and maintain the SSH connection. *

2026-01-07 15:53:05.352 [info] (ssh_tunnel) stdout: * Closing this terminal will terminate the connection and disconnect  *
* Cursor from the remote server.                                      *
***********************************************************************

2026-01-07 15:53:05.662 [error] [command][a5000983-5b52-4282-a6f0-df73bc82eab2] Socket error: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:53:05.662 [warning] [remote-ssh] Failed to ping remote server via 127.0.0.1:11004: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:53:40.854 [info] Resolving ssh remote authority 'myserver' (Unparsed 'ssh-remote+7b22686f73744e616d65223a226d79736572766572227d') (attempt #5)
2026-01-07 15:53:40.854 [info] Received re-connection request; checking to see if existing connection is still valid
2026-01-07 15:53:41.161 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 1 of 3 fetch failed
2026-01-07 15:53:42.477 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 2 of 3 fetch failed
2026-01-07 15:53:43.787 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 3 of 3 fetch failed
2026-01-07 15:53:43.787 [error] Could not re-use existing SOCKS connection; attempting to re-establish SOCKS forwarding Failed to connect to Cursor code server. Ensure that your remote host ssh config has 'AllowTcpForwarding yes' in '/etc/ssh/sshd_config'. Please check the logs and try reinstalling the server.
2026-01-07 15:53:43.787 [info] [forwarding][code] returning existing forwarding server listening on local port 11003
2026-01-07 15:53:43.787 [info] [remote-ssh] codeListeningOn (remote=127.0.0.1:32957; local=127.0.0.1:11003) codeConnectionToken: e2df8d0b-f292-4b04-ad9c-dea59fba9636
2026-01-07 15:53:43.787 [info] [forwarding][multiplex] returning existing forwarding server listening on local port 11004
2026-01-07 15:53:43.787 [info] [remote-ssh] multiplexListeningOn (remote=[object Object]; local=[object Object]) multiplexConnectionToken: 7f22c3a2-e6e4-4b1e-9bee-960644ccda16
2026-01-07 15:53:43.787 [info] [remote-ssh] Pinging remote server via 127.0.0.1:11004...
2026-01-07 15:53:44.096 [error] [command][fce31ff0-a6a5-4cdc-93b4-e703812d529f] Socket error: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:53:44.096 [warning] [remote-ssh] Failed to ping remote server via 127.0.0.1:11004: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:53:44.096 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 1 of 3 fetch failed
2026-01-07 15:53:45.412 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 2 of 3 fetch failed
2026-01-07 15:53:46.727 [error] Failed to connect to Cursor server at http://127.0.0.1:11003, attempt 3 of 3 fetch failed
2026-01-07 15:53:46.727 [error] Could not re-establish SOCKS forwarding; re-establishing entire SSH connection Failed to connect to Cursor code server. Ensure that your remote host ssh config has 'AllowTcpForwarding yes' in '/etc/ssh/sshd_config'. Please check the logs and try reinstalling the server.
2026-01-07 15:53:46.819 [info] Terminating existing SSH process
2026-01-07 15:53:46.819 [info] Using configured platform linux for remote host myserver
2026-01-07 15:53:46.819 [info] Using askpass script: c:\Users\Administrator\.cursor\extensions\anysphere.remote-ssh-1.0.36\dist\scripts\launchSSHAskpass.bat with javascript file c:\Users\Administrator\.cursor\extensions\anysphere.remote-ssh-1.0.36\dist\scripts\sshAskClient.js. Askpass handle: 10983
2026-01-07 15:53:46.823 [info] Launching SSH server via shell with command: type "C:\Users\ADMINI~1\AppData\Local\Temp\cursor_remote_install_08d8213d-502e-4fb6-83ee-449a79b08517.sh" | ssh -T -F "C:\Users\Administrator\.ssh\config" -D 12268 myserver bash --login -c bash
2026-01-07 15:53:46.823 [info] Establishing SSH connection: type "C:\Users\ADMINI~1\AppData\Local\Temp\cursor_remote_install_08d8213d-502e-4fb6-83ee-449a79b08517.sh" | ssh -T -F "C:\Users\Administrator\.ssh\config" -D 12268 myserver bash --login -c bash
2026-01-07 15:53:46.823 [info] Started installation script. Waiting for it to finish...
2026-01-07 15:53:46.823 [info] Waiting for server to install. Timeout: 30000ms
2026-01-07 15:53:47.446 [info] (ssh_tunnel) stdout: Configuring Cursor Server on Remote

2026-01-07 15:53:47.451 [info] (ssh_tunnel) stdout: Using TMP_DIR: /run/user/0

2026-01-07 15:53:47.496 [info] (ssh_tunnel) stdout: Locking /run/user/0/cursor-remote-lock.6ca0869f6193ac0d40fa6ae74ed01260

2026-01-07 15:53:47.499 [info] (ssh_tunnel) stdout: Server script already installed in /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/bin/cursor-server

2026-01-07 15:53:47.500 [info] (ssh_tunnel) stdout: Checking node executable

2026-01-07 15:53:47.504 [info] (ssh_tunnel) stdout: v20.18.2

2026-01-07 15:53:47.511 [info] (ssh_tunnel) stdout: Checking for running multiplex server: /root/.cursor-server/bin/multiplex-server/3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8.js

2026-01-07 15:53:47.545 [info] (ssh_tunnel) stdout: Running multiplex server:  467010 /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/node /root/.cursor-server/bin/multiplex-server/3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8.js 7f22c3a2-e6e4-4b1e-9bee-960644ccda16 0

2026-01-07 15:53:47.550 [info] (ssh_tunnel) stdout: Multiplex server script is already running /root/.cursor-server/bin/multiplex-server/3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8.js. Running processes are  467010 /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/node /root/.cursor-server/bin/multiplex-server/3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8.js 7f22c3a2-e6e4-4b1e-9bee-960644ccda16 0

2026-01-07 15:53:47.550 [info] (ssh_tunnel) stdout: Reading multiplex server token file /run/user/0/cursor-remote-multiplex.token.6ca0869f6193ac0d40fa6ae74ed01260.3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8
Multiplex server token file found

2026-01-07 15:53:47.554 [info] (ssh_tunnel) stdout: Reading multiplex server log file /run/user/0/cursor-remote-multiplex.log.6ca0869f6193ac0d40fa6ae74ed01260.3ce73d09cffc8f33c6d911e972bd0f6dabbe3e26e810844be8060e6b10987db8

2026-01-07 15:53:47.558 [info] (ssh_tunnel) stdout: Checking for code servers

2026-01-07 15:53:47.591 [info] (ssh_tunnel) stdout: Code server script is already running /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/bin/cursor-server. Running processes are  467066 sh /root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/bin/cursor-server --start-server --host=127.0.0.1 --port 0 --connection-token-file /run/user/0/cursor-remote-code.token.6ca0869f6193ac0d40fa6ae74ed01260 --telemetry-level off --enable-remote-auto-shutdown --accept-server-license-terms

2026-01-07 15:53:47.594 [info] (ssh_tunnel) stdout: Code server log file is /run/user/0/cursor-remote-code.log.6ca0869f6193ac0d40fa6ae74ed01260

2026-01-07 15:53:47.603 [info] (ssh_tunnel) stdout: cb516bd5850dd53ff48e7bc1: start
exitCode==0==
nodeExecutable==/root/.cursor-server/bin/20adc1003928b0f1b99305dbaf845656ff81f5d0/node==
errorMessage====
isFatalError==false==

2026-01-07 15:53:47.603 [info] (ssh_tunnel) stdout: multiplexListeningOn==38119==
multiplexConnectionToken==7f22c3a2-e6e4-4b1e-9bee-960644ccda16==
codeListeningOn==32957==
codeConnectionToken==e2df8d0b-f292-4b04-ad9c-dea59fba9636==
detectedPlatform==linux==
arch==x64==
SSH_AUTH_SOCK====
cb516bd5850dd53ff48e7bc1: end

2026-01-07 15:53:47.603 [info] Server install command exit code:  0
2026-01-07 15:53:47.603 [info] Deleting local script C:\Users\ADMINI~1\AppData\Local\Temp\cursor_remote_install_08d8213d-502e-4fb6-83ee-449a79b08517.sh
2026-01-07 15:53:47.604 [info] [forwarding][code] returning existing forwarding server listening on local port 11003
2026-01-07 15:53:47.604 [info] [remote-ssh] codeListeningOn (remote=127.0.0.1:32957; local=127.0.0.1:11003) codeConnectionToken: e2df8d0b-f292-4b04-ad9c-dea59fba9636
2026-01-07 15:53:47.604 [info] [forwarding][multiplex] returning existing forwarding server listening on local port 11004
2026-01-07 15:53:47.604 [info] [remote-ssh] multiplexListeningOn (remote=[object Object]; local=[object Object]) multiplexConnectionToken: 7f22c3a2-e6e4-4b1e-9bee-960644ccda16
2026-01-07 15:53:47.604 [info] [remote-ssh] Pinging remote server via 127.0.0.1:11004...
2026-01-07 15:53:47.604 [info] [remote-ssh] Resolved exec server. Socks port: 12268
2026-01-07 15:53:47.604 [info] Setting up 0 default forwarded ports
2026-01-07 15:53:47.604 [info] [remote-ssh] Resolved authority: {"host":"127.0.0.1","port":11003,"connectionToken":"e2df8d0b-f292-4b04-ad9c-dea59fba9636","extensionHostEnv":{}}. Socks port: 12268
2026-01-07 15:53:47.612 [info] (ssh_tunnel) stdout: Unlocking /run/user/0/cursor-remote-lock.6ca0869f6193ac0d40fa6ae74ed01260

2026-01-07 15:53:47.617 [info] (ssh_tunnel) stdout:  
***********************************************************************
* This terminal is used to establish and maintain the SSH connection. *

2026-01-07 15:53:47.617 [info] (ssh_tunnel) stdout: * Closing this terminal will terminate the connection and disconnect  *
* Cursor from the remote server.                                      *
***********************************************************************

2026-01-07 15:53:47.918 [error] [command][119af351-ef2a-4557-8ab0-15396c2c643c] Socket error: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:53:47.918 [warning] [remote-ssh] Failed to ping remote server via 127.0.0.1:11004: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:54:23.510 [info] Saved platform linux for remote host myserver
2026-01-07 15:54:23.519 [info] Saved platform linux for remote host myserver
2026-01-07 15:54:23.519 [info] Saved platform linux for remote host myserver
2026-01-07 15:54:23.519 [info] Saved platform linux for remote host myserver
2026-01-07 15:54:23.519 [info] Saved platform linux for remote host myserver
2026-01-07 15:54:47.922 [info] [remote-ssh] Pinging remote server via 127.0.0.1:11004...
2026-01-07 15:54:48.231 [error] [command][1279a7b0-9f2e-4b8d-8586-a69b3acd133c] Socket error: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:54:48.231 [warning] [remote-ssh] Failed to ping remote server via 127.0.0.1:11004: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:55:48.241 [info] [remote-ssh] Pinging remote server via 127.0.0.1:11004...
2026-01-07 15:55:48.549 [error] [command][387a37b3-46dc-44af-b409-314c275e3cf6] Socket error: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:55:48.549 [warning] [remote-ssh] Failed to ping remote server via 127.0.0.1:11004: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:56:17.646 [info] (ssh_tunnel) stdout: Code server process 467066 died
Multiplex server process 467010 died

2026-01-07 15:56:48.560 [info] [remote-ssh] Pinging remote server via 127.0.0.1:11004...
2026-01-07 15:56:48.868 [error] [command][9506b97f-bf43-4dbd-b1c5-444b8db1201a] Socket error: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:56:48.868 [warning] [remote-ssh] Failed to ping remote server via 127.0.0.1:11004: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:57:48.875 [info] [remote-ssh] Pinging remote server via 127.0.0.1:11004...
2026-01-07 15:57:49.186 [error] [command][62b07bcc-0e78-4518-ba2d-0b9362706df8] Socket error: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:57:49.186 [warning] [remote-ssh] Failed to ping remote server via 127.0.0.1:11004: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:58:49.190 [info] [remote-ssh] Pinging remote server via 127.0.0.1:11004...
2026-01-07 15:58:49.498 [error] [command][83801f82-da85-4268-a582-8eaed35803ef] Socket error: Error: connect ETIMEDOUT 127.0.0.1:11004
2026-01-07 15:58:49.498 [warning] [remote-ssh] Failed to ping remote server via 127.0.0.1:11004: Error: connect ETIMEDOUT 127.0.0.1:11004