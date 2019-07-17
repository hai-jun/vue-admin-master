# haijun前端
haijun物料管理系统的前端，包装网络请求，使用jwt做权限认证
# 快速部署
1.clone项目到本地 https://github.com/hai-jun/vue-admin-master.git

2.在visual studio code中打开vue-admin-master项目（控制台终端亦可）

3.进入到vue-admin-master目录中，在命令行依次输入如下命令：

# 安装依赖
npm install

# 启动项目
npm run dev

4.将appConfig.js文件中的baseUrl修改成你自己本地或服务端的springcloud网关的地址（能成功访问的前提是你已经在你的服务端或本地跑起来了后端那几个微服务，可以使用docker容器运行或者jar包运行）

5.最后可以用visual studio code等工具继续开发

# 项目上线
开发完成后，依然进入到vue-admin-master目录，然后执行如下命令：

npm run build
该命令执行成功之后，vue-admin-master目录下生成一个dist文件夹，将该文件夹中的两个文件static和index.html拷贝到服务器nginx80端口映射的目录就可以直接访问了
