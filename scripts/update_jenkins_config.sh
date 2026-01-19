#!/bin/bash
# Update Jenkins Job Configuration

CONFIG_FILE="/var/jenkins_home/jobs/suntaya-server-blog/config.xml"
BACKUP_FILE="${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"

# Backup
cp "$CONFIG_FILE" "$BACKUP_FILE"
echo "Backup created: $BACKUP_FILE"

# Update URL
sed -i 's|https://github.com/linkslks/suntaya_server_blog.git|git@github.com-new:slk1061569042-lab/suntaya_server_blog.git|g' "$CONFIG_FILE"

# Update branch
sed -i 's|*/master|*/main|g' "$CONFIG_FILE"

# Update lightweight
sed -i 's|<lightweight>true</lightweight>|<lightweight>false</lightweight>|g' "$CONFIG_FILE"

# Update description
sed -i 's|<description></description>|<description>自动从 GitHub 部署到服务器 115.190.54.220</description>|g' "$CONFIG_FILE"

# Set permissions
chown jenkins:jenkins "$CONFIG_FILE"
chmod 644 "$CONFIG_FILE"

echo "Config updated successfully"
