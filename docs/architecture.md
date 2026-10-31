# 架构与协议

星搭子是「总管」，不是又一个编码 Agent：它理解需求、生成派单、调用本机 Agent、跟踪任务、写回经验；真正改代码的是 Claude Code 与 Codex。

## 组成

| 部分 | 职责 | 状态 |
| --- | --- | --- |
| 星芽桌面外壳 `src/` | 透明浮窗、表情动作、气泡、审批按钮 | 已从星笺迁入 |
| 守护进程 | 常驻、开机自启；本地网关、调度大脑、任务表 | 未实现 |
| 本地网关 | `127.0.0.1` WebSocket，帧见 `src/gateway-protocol.ts` | 协议草案 |
| Agent 适配器 | Codex App Server（stdio JSONL）、Claude Agent SDK（stream JSON）、ACP；退回命令行 JSON | 未实现 |
| 状态文件 `~/.starbuddy/` | `config.toml`、`workspace/{AGENTS,USER,MEMORY}.md`、`skills/`、`projects.toml`、`tasks.sqlite` | 未实现 |

## 网关协议

一行一个 JSON 帧，`type` 为 `req` / `res` / `event`。客户端先发 `connect` 声明角色（`shell`、`cli`、`starclip`、`hook`）与范围（`tasks`、`pet`、`approvals`、`memory`），凭证来自仅当前用户可读的运行时文件，每次启动重新生成。未知方法、角色、范围或版本一律拒绝。

## 权限

默认「改文件」档：已登记项目内改文件、跑测试、本地 commit 自动进行；删除、push、发消息、装依赖、项目外写入、改 Skill 与记忆先经星芽气泡确认。API Key 存系统钥匙串。Agent 输出、网页与文件内容一律视为不可信数据。

## 参考与许可

| 项目 | 许可证 | 借鉴 |
| --- | --- | --- |
| [OpenClaw](https://github.com/openclaw/openclaw) | MIT | 本地网关、SKILL.md 加载顺序、工作区记忆文件 |
| [openbot.run](https://github.com/nightly-labs/openbot) | PolyForm Noncommercial 1.0.0 | 仅产品思路，不复制代码 |
| [CopilotKit/OpenBot](https://github.com/CopilotKit/openbot) | MIT | 所有动作经同一网关判定并审计 |
| [clawd-on-desk](https://github.com/rullerzhou-afk/clawd-on-desk) | AGPL-3.0 | 仅 hooks 接入思路，不复制代码与素材 |

## 分期

0. 拆仓库：迁入星芽，守护进程与网关骨架；验收：星芽显示你手动打开的 Agent 状态。
1. 派单：填 Key、Claude Code 适配器、任务表与审批气泡；验收：一句话需求在项目里完成并回报。
2. 多 Agent：Codex 与 ACP、自动选模型与强度、续用会话；验收：一周日常任务无需手动选工具。
3. 回写：完工回写 Skill、记忆压缩、跨项目合并；验收：回写建议过半被采纳。
