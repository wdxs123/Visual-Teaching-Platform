#!/usr/bin/env python3
"""
软著源代码排版生成器
"""
import os
import sys

# 配置
SOFTWARE_NAME = "Vue-电气工程系统"
VERSION = "V1.0"
LINES_PER_PAGE = 50
FONT = "Courier New"
FONT_SIZE = 10

# 要包含的文件（根据你的项目调整）
CODE_FILES = [
    "server.js",
    "backend/models/User.js",
    "backend/routes/auth.js",
    "backend/routes/user.js",
    "src/router/index.js",
    "src/stores/modules/user.js",
    "src/api/auth.js",
    "package.json"
]

def generate_document():
    """生成源代码文档"""
    output_lines = []
    current_line = 0
    page_number = 1
    
    # 添加页眉
    header = f"软件名称: {SOFTWARE_NAME} 版本号: {VERSION}"
    
    for file_path in CODE_FILES:
        if not os.path.exists(file_path):
            print(f"警告: 文件不存在: {file_path}")
            continue
            
        # 添加文件分隔符
        output_lines.append(f"\n{'='*60}")
        output_lines.append(f"文件: {file_path}")
        output_lines.append(f"{'='*60}\n")
        
        # 读取文件内容
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                
            # 添加行号
            for i, line in enumerate(lines, 1):
                line_with_number = f"{i:4} | {line.rstrip()}"
                output_lines.append(line_with_number)
                
        except Exception as e:
            print(f"读取文件失败 {file_path}: {e}")
    
    # 统计页数
    total_lines = len(output_lines)
    total_pages = (total_lines + LINES_PER_PAGE - 1) // LINES_PER_PAGE
    
    print(f"总行数: {total_lines}")
    print(f"总页数: {total_pages}")
    print(f"每页行数: {LINES_PER_PAGE}")
    
    # 保存到文件
    with open("软著源代码.txt", 'w', encoding='utf-8') as f:
        f.write(header + "\n")
        f.write(f"总页数: {total_pages}\n\n")
        for line in output_lines:
            f.write(line + "\n")
    
    print("已生成: 软著源代码.txt")
    print(f"请填写申请表: 源代码页数 = {total_pages}")

if __name__ == "__main__":
    generate_document()