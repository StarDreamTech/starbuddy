# 星搭子开发约定

- 文档与界面文案用简体中文；代码标识符用英文。
- 改动后运行 `npm test` 与 `npx vue-tsc --noEmit`。
- 星芽素材均为原创；不要引入第三方角色素材，也不要复制 AGPL 或非商用许可项目的代码（见 `docs/architecture.md` 参考表）。
- 网关协议改动同步更新 `src/gateway-protocol.ts`、其测试与 `docs/architecture.md`。
- 星芽相关文件仍保留星笺时期的历史说明，引用的星笺路径（如 `src/App.vue`）在本仓库不存在，迁移完成前以本仓库实际文件为准。
