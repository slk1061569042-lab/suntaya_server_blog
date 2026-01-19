#!/usr/bin/env python3
# 添加 MCP 路由到 Kong 配置文件

import sys
import re

if len(sys.argv) < 2:
    print("Usage: python3 add_mcp_route.py <kong.yml path>")
    sys.exit(1)

kong_yml_path = sys.argv[1]

# MCP route configuration
mcp_route = """  ## MCP routes (must be before dashboard route)
  - name: mcp
    _comment: 'MCP: /mcp -> http://studio:3000/api/mcp'
    url: http://studio:3000/api/mcp
    routes:
      - name: mcp-route
        strip_path: true
        paths:
          - /mcp
    plugins:
      - name: cors
      - name: key-auth
        config:
          hide_credentials: false
      - name: acl
        config:
          hide_groups_header: true
          allow:
            - admin
            - anon

"""

# Read the file
with open(kong_yml_path, 'r') as f:
    content = f.read()

# Check if MCP route already exists
if 'name: mcp' in content:
    print("MCP route already exists")
    sys.exit(0)

# Find dashboard section and insert MCP route before it
pattern = r'(  ## Protected Dashboard - catch all remaining routes)'
if re.search(pattern, content):
    new_content = re.sub(pattern, mcp_route + r'\1', content)
    
    # Backup original file
    backup_path = kong_yml_path + '.backup.mcp'
    with open(backup_path, 'w') as f:
        f.write(content)
    print(f"Backup created: {backup_path}")
    
    # Write new content
    with open(kong_yml_path, 'w') as f:
        f.write(new_content)
    print("MCP route added successfully")
else:
    print("Error: Could not find '## Protected Dashboard' section")
    sys.exit(1)
