**项目说明**

- Venus-Fast是一个轻量级的，前后端分离的Java快速开发平台，能快速开发项目并交付
- 支持MySQL、Oracle、SQL Server、PostgreSQL等主流数据库

<br>


**具有如下特点**

- 友好的代码结构及注释，便于阅读及二次开发
- 实现前后端分离，通过token进行数据交互，前端再也不用关注后端技术
- 灵活的权限控制，可控制到页面或按钮，满足绝大部分的权限需求
- 页面交互使用Vue2.x，极大的提高了开发效率
- 完善的代码生成机制，可在线生成entity、xml、dao、service、vue、sql代码，减少70%以上的开发任务
- 引入quartz定时任务，可动态完成任务的添加、修改、删除、暂停、恢复及日志查看等功能
- 引入API模板，根据token作为登录令牌，极大的方便了APP接口开发
- 引入Hibernate Validator校验框架，轻松实现后端校验
- 引入云存储服务，已支持：七牛云、阿里云、腾讯云、Minio等
- 引入swagger文档支持，方便编写API接口文档 <br>

**项目结构**

```
renren-fast
├─db  项目SQL语句
│
├─common 公共模块
│  ├─aspect 系统日志
│  ├─exception 异常处理
│  ├─validator 后台校验
│  └─xss XSS过滤
│
├─config 配置信息
│
├─modules 功能模块
│  ├─job 定时任务模块
│  ├─log 系统日志
│  ├─login 登录
│  ├─oss 文件服务模块
│  └─sys 权限模块
│
├─RenrenApplication 项目启动类
│
├──resources
│  ├─mapper SQL对应的XML文件
│  └─static 静态资源

```

<br>

开发工具IDEA： https://www.jetbrains.com
