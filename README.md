# 工时表单填写 Chrome 插件

https://github.xsky.com/storage/user/377/files/0d4d6c78-847a-42a2-8d15-9b676dad15a9

1. 插件会在表单页启动，根据 csv 直接批量发送表单提交请求，避免多次手动提交，大大节省工时填报时间

## 🦋 版本更新

### 1.0.3

- 增加工作天数和工时总数统计
- 优化样式

### 1.0.1

- 修复 csrf token 获取错误的问题

### 1.0.0

- 增加对于节假日过滤的支持

### beta.8

- 增大弹窗宽度
- 增加提交中状态的显示和限制
- 增加了上月日期的生成按钮

### beta.7

- 修复网站地址带参数的情况无法启动插件的问题

### beta.6

- 自动生成本月或本周的工作日期（未处理节假日）

## 使用

### 下载

在 https://github.xsky.com/liu-zhen/xsky-work-report/tags 中找到最新版本，点击 zip 文件下载并解压
![Alt text](image-1.png)

### 安装

1. 在新标签页中输入 chrome://extensions，前往“扩展程序”页面

- 或者，您也可以点击“扩展程序”菜单谜题按钮，然后选择菜单底部的管理扩展程序。
- 或者，点击 Chrome 菜单，将光标悬停在更多工具上，然后选择扩展程序。

2. 点击开发者模式旁边的切换开关以启用开发者模式。
3. 点击 Load unpacked（加载解压缩）按钮，然后选择扩展程序目录。

![Alt text](image.png)

4. 进入工时表单页面，如果是已经存在的则可以刷新

### 操作

1. 先把除了日期,工时，工作描述，以外的必填表单选择上
2. 点击下方的「快速填写工时」按钮
3. 粘贴 csv 格式的文本，填写日期,工时，工作描述内容
4. 点击提交，等待提交完成

### 从 Notion 导出 csv

参考 https://github.xsky.com/liu-zhen/notion-asst-sync 库，从 Notion database 生成 csv 的简单实现

## 技术栈

1. vite
2. react
3. typescript
4. shadcn/ui

## 基本原理

通过 window.formMetaContent 通过获取当前表单的配置，获取当前填写的表单的重复值，自己构造请求并发送，csrf_token 可以从 cookie 中获取。

## 节假日 API

免费节假日 API: https://timor.tech/api/holiday
