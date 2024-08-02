---
title: python 虚拟环境运行
date: 2024-6-27 16:55:08
tags:
  - python
---

# 在 python 虚拟环境下运行 stable diffusion web-ui

- 创建虚拟环境

```bash
python3 -m venv venv
```

- 激活虚拟环境

```bash
source venv/bin/activate
```

- 添加虚拟环境配置

如果无法成功安装 pip23.0 则在 venv 虚拟环境看中创建 `venv/pip.conf` 文件

```bash
vim venv/pip.conf
```

添加一下内容，表示允许 pip 在受管理的 Python 环境中安装或修改包，即使这可能会影响系统范围内的包管理

```
[global]
break-system-packages = true
```

- 降级 pip 版本

```bash
pip install pip==23.0
```

- 运行 web-ui

```bash
./webui.sh
```
