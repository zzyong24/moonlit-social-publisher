![社交图文发布：一次准备，逐平台核对与提交](assets/readme/hero.png)

# 月明·社交图文发布

把已确认的内容包准备为小红书图文、抖音图文或长文、X 线程，并核对实际平台结果。

## 你会得到什么

- 发布包字段与图片路径的检查结果
- 已填入内容、素材与声明的可核对草稿
- 按平台记录的草稿、待审或发布结果

## 试着这样说

```text
用 moonlit-social-publisher。把这个已确认的图文包准备到小红书和 X，检查图片顺序、线程顺序和声明，先停在可发布状态。
```

## 安装与首次使用

将本仓库的完整目录交给支持本地 Skill 的 Agent 安装，保留 `SKILL.md` 与随附资源。已有同名版本时先检查差异；使用版本锁的工作区沿用自身升级机制。

让 Agent 安装：

```text
请安装这个 Skill：https://github.com/zzyong24/moonlit-social-publisher
```

也可通过 Skills CLI 安装：

```bash
npx skills add zzyong24/moonlit-social-publisher
```

## 配置与依赖

发布包校验需要 Node.js。实际平台操作依赖 ego-browser／Ego Lite 和对应账号登录。小红书与 X 文案分别可由 moonlit-xiaohongshu、moonlit-x-short 提供；已确认的兼容包也可作为输入。

## 数据与使用边界

准备平台草稿会上传相应文本和媒体至选定平台。最终发布需要当前任务的明确授权；审核中只记为 submitted。账号会话不随仓库分发，本 Skill 不负责制作视频或改写已确认正文。

## 配套 Skill

[x-short](https://github.com/zzyong24/moonlit-x-short) · [xiaohongshu](https://github.com/zzyong24/moonlit-xiaohongshu)

## 详细说明

执行流程与资源导航见 [SKILL.md](SKILL.md)。安装检查不代表真实业务验收；需要外部服务、账号登录或付费生成的步骤，应在使用者自己的环境中验证。

---

月明水清深 · `moonlit-social-publisher`

首图为 AI 生成的品牌概念插画，不是工具截图或执行结果。
