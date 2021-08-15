<h1 align="center">smart-community-static-web</h1>


<div align="center">

[![antd](https://img.shields.io/badge/antd-^3.10.0-blue.svg?style=flat-square)](https://github.com/ant-design/ant-design)
[![umi](https://img.shields.io/badge/umi-^2.2.1-orange.svg?style=flat-square)](https://github.com/umijs/umi)
[![GitHub issues](https://img.shields.io/github/issues/zuiidea/antd-admin.svg?style=flat-square)](https://github.com/zuiidea/antd-admin/issues)
[![MIT](https://img.shields.io/dub/l/vibe-d.svg?style=flat-square)](http://opensource.org/licenses/MIT)
![Travis (.org)](https://img.shields.io/travis/zuiidea/antd-admin.svg)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/zuiidea/antd-admin/pulls)
[![Gitter](https://img.shields.io/gitter/room/antd-admin/antd-admin.svg)](https://gitter.im/antd-admin/antd-admin)

</div>

# 一、代码检测
- [eslint](http://192.168.70.235:40080/smart-community/smart-community-static-web/env-rebuild-20200219-V1.1.5/eslint/main.html)

# 二、工程结构

目录/文件|描述|
----|----|
ci/|ci相关的资源文件，如docker相关的构建文件|
ci/build.sh|主要构建脚本|
ci/app|该工程主docker镜像相关资源|
docker-compose.yml|docker-compose.yml文件|
.gitlib-ci.yml|gitlab ci配置文件|

# 三、运行篇

**一般供研发人员使用，需掌握docker及docker-compose等相关命令**

## 环境初始化

```
docker-compose up -d
```

## 端口

端口|描述|
----|----|
3306|mysql|
6379|redis|
25001-25003|地图|
35001|vr|
8080|web服务|
8443|pki服务|
9999|图片服务|

## 账号

用户名|密码|
----|----|
admin|123456|


## 应用启动

1. 进入目录安装依赖，国内用户推荐使用 [cnpm](https://cnpmjs.org) 进行加速。

```bash
yarn install
```

或者

```bash
npm install
```

2. 启动本地服务器。

```bash
npm run start
```

3. 启动完成后打开浏览器访问 [http://localhost:8000](http://localhost:8000)，如果需要更改启动端口，可在 `.env` 文件中配置。

## 环境卸载

```
docker-compose down -v
```

# 四、配置篇

**主要由配置管理员及项目经理使用，建议在研发人员介入前，做好相关配置工作，需要掌握docker、docker-compose及gitlab-ci常用配置参数**

## 1、开启新的分支feature-yyyyMMdd-Vx.y.z

## 2、修改.gitlab-ci.yml

```
variables:
  DOCKER_REGISTRY: DOCKER私服地址
  DOCKER_IMAGE_NAME: 镜像名称，默认为组名/仓库名
  DOCKER_IMAGE_VERSION: 镜像版本，默认为分支名
  TRIGGER_REPO_URL: 相关复合仓库地址
  TRIGGER_REPO_BRANCH: 相关复合仓库分支，默认同该仓库分支
  APP_NAME: 输出产物名称，默认为仓库名
```
**Tips:一般不建议修改**

## 3、修改docker-compose.yml

**主要修改对应镜像版本号**

## 4、修改READM.md中代码检测地址

**URL生成规则**
```
http://{CODE_CHECK_RESULT_SERVER}/{NAME_SPACE}/{PROJECT_NAME}/{BRANCH}/{eslint}/main.html

CODE_CHECK_RESULT_SERVER: 代码检测服务器地址
NAME_SPACE：仓库所在的组名，可能含有子组也可能为空
PROJECT_NAME：仓库名
BRANCH： 分支名
```
**Tips:仅需要修改BRANCH为对应具体的分支，其它保持不变**

# 五、支持环境

现代浏览器。

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- | 
|IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions
