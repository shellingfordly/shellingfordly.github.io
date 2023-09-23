---
title: projects
projects:
  - title: "Vele Admin"
    path: "https://github.com/shellingfordly/vele-admin"
    desc: "一个基于 vue3 vite2 element-plus vuex vue-router typescript 的后台管理系统."
    img: "/images/projects/vele-admin.png"
  - title: "Pixijs Games"
    path: "https://github.com/shellingfordly/pixi-games"
    desc: "一个使用pixijs开发的网页小游戏集合，不定期持续更新中..."
    img: "/images/projects/pixijs_game_1.png"
  - title: "工具集合"
    path: "https://github.com/shellingfordly/my-tools"
    desc: "一些文件格式转换的工具，不定期持续添加一些乱七八糟的功能..."
    img: "/images/projects/my_tools.png"
  - title: "Terminal"
    path: "https://github.com/shellingfordly/terminal"
    desc: "一个命令行形式的文章展示项目..."
    img: "/images/projects/terminal.png"
---

<!-- @layout-full-width -->

<list-projects :list="frontmatter.projects" />
