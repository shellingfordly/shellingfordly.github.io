---
title: 获取ip地址
date: 2024-1-29 16:22:24
tags:
  - jquery
  - jsonp
  - ip
---

### 获取 ip 地址

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

<script>
  $(document).ready(() => {
    $.getJSON("https://api.ipify.org?format=json", function (data) {
      alert(data.ip);
    });
  });
</script>
```
