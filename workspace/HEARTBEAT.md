# HEARTBEAT.md

## 定期检查事项

### 后台任务监控
检查是否有后台进程（exec sessions）在运行：
- 如果有，主动报告进度
- 如果已完成但未通知，立即汇报结果

### AG2开发任务
如果`young-river`进程存在或日志有更新：
- 读取最新日志
- 总结进度
- 如有错误，分析并建议解决方案

### 项目状态
检查关键目录：
- `~/workspace/agent/workspace/agent-dev-team/outputs/` - 是否有新文件
- 妙搭项目状态

---

**执行频率**：每次HEARTBEAT（约30分钟）
**主动通知条件**：发现任务完成或出错时
