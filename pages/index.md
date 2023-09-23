---
title: home
content:
  - title: Work
    subtitle: 活到老，学到老
    type: icon
    list:
      - i-vscode-icons-file-type-js-official
      - i-vscode-icons:file-type-html
      - i-vscode-icons:file-type-cssmap
      - i-logos:typescript-icon
      - i-logos-react
      - i-logos-nodejs
      - i-vscode-icons:file-type-vue
      - i-vscode-icons:file-type-nuxt
      - i-tabler:brand-threejs
      - i-vscode-icons:file-type-unocss
      - i-mdi:unity
      - i-vscode-icons:file-type-csharp
  - title: Travel
    subtitle: 读万卷书，行万里路
    type: img-list
    list:
      - /images/travel/hunan/cs/cs_preview.jpg
      - /images/travel/hunan/zjj/d2.jpg
      - /images/travel/jilin/cbs_preview.jpg
      - /images/travel/jiangxi/nc_preview.jpg
      - /images/travel/shandong/ts_preview.jpg
      - /images/travel/fujian/xiamen/preview.jpg
      - /images/travel/fujian/xiamen/h_2.jpg
      - /images/travel/shanghai/1/city3.jpg
      - /images/travel/shanghai/1/me5.jpg
  - title: Read
    subtitle: 腹有诗书气自华
    type: img
    list:
      - /images/home/read_1.png
---

<!-- @layout-full-width -->

<home :content="frontmatter.content" />
