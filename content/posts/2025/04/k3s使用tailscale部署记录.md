---
title: "k3s使用tailscale部署记录"
description: "k3s使用tailscale部署记录"
publishDate: 2025-04-03T12:30:00+08:00
updatedDate: "2025-04-03T12:30:00+08:00"
tags: ["k8s","tailscale"]
# coverImage:
#   src: "./cover.png"
#   alt: "Astro build wallpaper"
# ogImage: "/social-card.png"
draft: false
---

参考
https://docs.k3s.io/zh/networking/distributed-multicloud?_highlight=tailscale#integration-with-the-tailscale-vpn-provider-experimental
https://forums.rancher.cn/t/k3s/2705
https://zyi.io/zh/corpus/note/build-extensible-cross-cloud-k3s-cluster-using-tailscale
https://ysicing.me/k3s-tailscale
https://www.nodeseek.com/post-25460-1


使用的系统多为debian和ubuntu，alpine没搞定配置
## 修改主机名
这一步挺重要的，不然后面改不了
```bash
hostnamectl set-hostname dev-chunkserve-nl-k3ss-01
hostnamectl set-hostname dev-naranja-nl-k3w1-01
# 搜了下很多都建议修改完reboot下
```

## 安装tailscale
参考
https://tailscale.com/kb/1031/install-linux
```bash
curl -fsSL https://tailscale.com/install.sh | sh
# 安装好之后启动
tailscale up
```
需要去tailscale的Access controls配置相应的内网段
```json
	"autoApprovers": {
		"routes": {
			"10.42.0.0/16":       ["Email"],
			"10.43.0.0/16":       ["Email"],
			"2001:cafe:42::/56":  ["Email],
			"2001:cafe:43::/112": ["Email"],
		},
	},
```
然后在tailscale配置auth key，位于Setting->Keys

## 安装docker
自行寻找方案吧，一大堆教程

## 安装k3s server
```bash
curl -sfL https://get.k3s.io | \
INSTALL_K3S_CHANNEL=stable \
K3S_DATASTORE_ENDPOINT="mysql:" \
sh -s - \
  --disable="traefik" \
  --node-external-ip="公网IPv4,公网Ipv6" \
  --node-ip="0.0.0.0" \
  --cluster-cidr="10.42.0.0/16,2001:cafe:42::/56" \
  --service-cidr="10.43.0.0/16,2001:cafe:43::/112" \
  --docker \
  --write-kubeconfig="/root/.kube/config" \
  --write-kubeconfig-mode="644" \
  --vpn-auth "name=tailscale,joinKey=authkey"
```
INSTALL_K3S_CHANNEL=stable
为了适配大多数情况，选用比较新的版本可能无法安装一些东西
--disable="traefik"
traefik很强大，可是还是习惯用ingress-nginx
--node-external-ip="公网IPv4,公网Ipv6"
这是为了外网访问
-node-ip="0.0.0.0"
这是为了v4优先
--cluster-cidr="10.42.0.0/16,2001:cafe:42::/56"
--service-cidr="10.43.0.0/16,2001:cafe:43::/112"
提前配置双栈，后面想改就得重新安装了
--docker
我更常用docker
--vpn-auth "name=tailscale,joinKey=authkey"
这是为了使用tailscale

## 安装k3s agent
```bash
curl -sfL https://get.k3s.io | \
INSTALL_K3S_CHANNEL=stable \
K3S_URL="https://tailscale的ip:6443" \
K3S_TOKEN=token \
sh -s - \
  --vpn-auth "name=tailscale,joinKey=authkey" \
  --docker \
  --node-external-ip="公网IPv4,公网Ipv6" 
```

获取token
```bash
cat /var/lib/rancher/k3s/server/node-token
```
## 卸载
搞炸了就卸载重来
```bash
#卸载
/usr/local/bin/k3s-uninstall.sh
#agent卸载
/usr/local/bin/k3s-agent-uninstall.sh
```