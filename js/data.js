/* ============================================================
   课程内容数据 —— 日常维护只需要修改这一个文件
   ------------------------------------------------------------
   · 日期一律写 "YYYY-MM-DD" 或 "YYYY-MM-DDTHH:mm"（24 小时制）
   · startDate 决定「本周是第几教学周」与日历页的本周高亮
   · 作业状态（未发布/进行中/即将截止/已截止）由日期自动计算
   · 链接留空字符串 "" 即显示为「暂未开放 / 待上传」
   ============================================================ */

const COURSE = {

  /* ---------- 基本信息 ---------- */
  name:      "系统建模与仿真",
  nameDim:   "",                    // 标题中需要弱化显示的部分（留空则整句同色）
  nameEn:    "System Modeling & Simulation",
  code:      "SYS3301",
  semester:  "2026 秋季学期",
  credits:   "2.5 学分 · 48 学时（32 讲授 + 16 上机）",
  time:      "周二 5–6 节 · 周四 5–6 节（单周上机）",
  location:  "综合实验楼 B204 · 仿真机房",
  startDate: "2026-09-07",          // 第 1 教学周的周一

  /* ---------- 课程信息格（主页「规格参数」一节） ---------- */
  info: [
    { k: "PREREQUISITE", label: "先修要求", v: "高等数学 · 概率论 · 程序设计基础" },
    { k: "GRADING",      label: "考核方式", v: "作业 30% · 上机 20% · 课设 30% · 期末 20%" },
    { k: "SOFTWARE",     label: "仿真环境", v: "MATLAB R2025a · Python 3.12 · NetLogo" },
    { k: "PLATFORM",     label: "作业平台", v: "GitHub 模板仓库 + Actions 自动评测" },
    { k: "TEXTBOOK",     label: "参考教材", v: "Law《Simulation Modeling and Analysis》" },
    { k: "SYLLABUS",     label: "教学周历", v: "共 16 周 · 见「教学日历」页" },
  ],

  /* ---------- 教学团队 ---------- */
  staff: [
    {
      name: "陈序恒", title: "INSTRUCTOR · 主讲教师 · 教授",
      what: "负责理论授课与课程设计命题。答疑：周四 16:00–17:30，系统科学研究所。",
      email: "chenxh@example.edu.cn", office: "科研楼 A608",
    },
    {
      name: "赵启帆", title: "TA · 助教 · 在读硕士",
      what: "负责上机实验与自动评测答疑。答疑：周日 19:00–21:00（线上会议）。",
      email: "zhaoqf@example.edu.cn", office: "线上腾讯会议",
    },
  ],

  /* ---------- 公告（新的放最上面） ---------- */
  announcements: [
    { date: "2026-10-19", text: "实验三已发布：Monte Carlo 方法估算定积分，10 月 31 日 23:59 截止，从 GitHub 模板仓库领取，push 即自动评测。" },
    { date: "2026-10-14", text: "本周四为上机周：请提前安装 MATLAB（校园正版）并激活 Simulink，机房座位按学号就座。" },
    { date: "2026-10-08", text: "课程设计选题通道已开放，三人一组，选题登记表于 11 月 2 日前提交至助教邮箱。" },
    { date: "2026-09-01", text: "欢迎选修《系统建模与仿真》！请在第一周完成 GitHub 账号注册，并将用户名填入在线名册（见课程群）。" },
  ],

  /* ---------- 教学日历 ---------- */
  schedule: [
    { week: 1,  topic: "系统仿真导论", sub: "系统 · 模型 · 仿真的概念谱系与分类", reading: "Law 第 1 章", assignment: "" },
    { week: 2,  topic: "建模方法论", sub: "抽象与假设 · 数学模型的形式化", reading: "讲义 02", assignment: "" },
    { week: 3,  topic: "连续系统建模", sub: "微分方程模型 · 状态空间表示", reading: "Law 第 3 章", assignment: "实验一" },
    { week: 4,  topic: "数值积分方法", sub: "欧拉法 · 龙格-库塔 · 步长与数值稳定性", reading: "讲义 04", assignment: "" },
    { week: 5,  topic: "Simulink 仿真环境", sub: "模块建模 · 求解器配置 · 上机", reading: "Simulink 官方教程", assignment: "实验二" },
    { week: 6,  topic: "连续系统仿真实践", sub: "弹簧-质量-阻尼 · RLC 电路", reading: "实验指导书 A", assignment: "" },
    { week: 7,  topic: "随机数与 Monte Carlo", sub: "伪随机数生成 · 分布检验 · 方差缩减", reading: "Law 第 8 章", assignment: "实验三" },
    { week: 8,  topic: "离散事件系统基础", sub: "实体 · 事件 · 活动 · 进程", reading: "Banks 第 3 章", assignment: "" },
    { week: 9,  topic: "事件调度法", sub: "未来事件表 · 仿真钟推进", reading: "Banks 第 4 章", assignment: "实验四" },
    { week: 10, topic: "排队系统仿真", sub: "M/M/1 · 银行与食堂案例建模", reading: "Law 第 2 章", assignment: "" },
    { week: 11, topic: "系统动力学", sub: "存量流量图 · Vensim 建模入门", reading: "讲义 11", assignment: "实验五" },
    { week: 12, topic: "多智能体建模", sub: "NetLogo · 涌现与微观-宏观关联", reading: "NetLogo 手册", assignment: "" },
    { week: 13, topic: "仿真输出分析", sub: "终止型与稳态仿真 · 置信区间 · 重复运行次数", reading: "Law 第 9 章", assignment: "" },
    { week: 14, topic: "校核、验证与确认", sub: "VV&A · 灵敏度分析", reading: "Law 第 10 章", assignment: "" },
    { week: 15, topic: "课程设计中期检查", sub: "各组汇报模型与初步结果", reading: "—", assignment: "课程设计" },
    { week: 16, topic: "课程设计答辩与总结", sub: "现场演示 · 代码与报告提交", reading: "—", assignment: "" },
  ],

  /* ---------- 作业与实验：状态由 release / due 自动判定 ---------- */
  assignments: [
    {
      id: "EXP1", title: "常微分方程数值求解",
      release: "2026-09-21T00:00", due: "2026-10-02T23:59",
      platform: "PTA 拼题A", url: "https://pintia.cn/",
      desc: "用欧拉法与四阶龙格-库塔法求解给定的 Lorenz 系统初值问题，对比两种方法在不同步长下的精度与稳定性。代码提交后自动评测，按测试点得分。",
      files: [{ name: "exp1-题面.pdf", url: "" }],
    },
    {
      id: "EXP2", title: "Simulink 弹簧-质量-阻尼系统",
      release: "2026-10-05T00:00", due: "2026-10-16T23:59",
      platform: "GitHub 模板仓库", url: "",
      desc: "搭建弹簧-质量-阻尼系统的 Simulink 模型，调节参数观察欠阻尼/临界阻尼/过阻尼响应，提交 .slx 模型文件与仿真曲线截图。仓库 push 后由 Actions 自动检查模型结构与参数范围。",
      files: [{ name: "exp2-实验指导.pdf", url: "" }, { name: "模板仓库", url: "" }],
    },
    {
      id: "EXP3", title: "Monte Carlo 方法估算定积分",
      release: "2026-10-19T00:00", due: "2026-10-31T23:59",
      platform: "GitHub 模板仓库", url: "",
      desc: "用随机投点法与均值法估算给定函数的二重积分，分析样本量与误差的关系，并给出 95% 置信区间。pytest 自动评测：数值精度 5 个测试点 + 收敛性 3 个测试点。",
      files: [{ name: "exp3-题面.pdf", url: "" }, { name: "模板仓库", url: "" }],
    },
    {
      id: "EXP4", title: "单服务台排队系统仿真",
      release: "2026-11-02T00:00", due: "2026-11-13T23:59",
      platform: "PTA 拼题A", url: "https://pintia.cn/",
      desc: "用事件调度法实现 M/M/1 排队系统仿真，统计平均队长与平均等待时间，并与理论解析解对比。提交 Python 代码，自动评测。",
      files: [{ name: "exp4-题面.pdf", url: "" }],
    },
    {
      id: "EXP5", title: "系统动力学：库存-销售模型",
      release: "2026-11-16T00:00", due: "2026-11-27T23:59",
      platform: "GitHub 模板仓库", url: "",
      desc: "用 Vensim PLE 建立零售商库存-销售系统动力学模型，分析补货策略对库存振荡的影响，提交模型文件与一页分析报告。",
      files: [{ name: "exp5-实验指导.pdf", url: "" }],
    },
    {
      id: "PROJ", title: "课程设计：自选系统仿真",
      release: "2026-11-30T00:00", due: "2026-12-28T23:59",
      platform: "GitHub 模板仓库", url: "",
      desc: "三人一组自选现实系统（交通流 / 疫情传播 / 食堂排队 / 生态竞争……），完成建模、仿真实验、输出分析与 VV&A 讨论。仓库需包含可运行的仿真代码、实验数据与报告；Actions 自动运行冒烟测试，现场答辩占课设成绩 40%。",
      files: [{ name: "课设要求与评分细则.pdf", url: "" }, { name: "选题登记表.docx", url: "" }],
    },
  ],

  /* ---------- 资料页分组 ---------- */
  resources: [
    {
      group: "仿真软件与环境",
      items: [
        { title: "MATLAB & Simulink 校园正版下载", note: "信息办门户 · 统一认证", url: "" },
        { title: "Python 仿真环境配置指南", note: "NumPy / SciPy / Matplotlib", url: "" },
        { title: "NetLogo 7 下载", note: "多智能体建模", url: "https://ccl.northwestern.edu/netlogo/" },
        { title: "Vensim PLE 教育版", note: "系统动力学", url: "https://vensim.com/free-download/" },
      ],
    },
    {
      group: "课件与讲义",
      items: [
        { title: "L01 · 系统仿真导论（PDF）", note: "09-08", url: "" },
        { title: "L04 · 数值积分方法（PDF）", note: "09-28", url: "" },
        { title: "L07 · Monte Carlo 方法（PDF）", note: "10-19", url: "" },
        { title: "实验指导书合订本", note: "持续更新", url: "" },
      ],
    },
    {
      group: "作业与评测",
      items: [
        { title: "PTA 拼题A · 本课程班级入口", note: "代码题自动评测", url: "https://pintia.cn/" },
        { title: "GitHub 作业模板仓库列表", note: "Use this template 领取", url: "" },
        { title: "自动评测结果查看指南", note: "Actions 页面读分教程", url: "" },
      ],
    },
    {
      group: "延伸阅读",
      items: [
        { title: "Averill M. Law《Simulation Modeling and Analysis》(5e)", note: "主教材", url: "" },
        { title: "Banks 等《离散事件系统仿真（第 5 版）》", note: "机械工业出版社", url: "" },
        { title: "3Blue1Brown · 微分方程系列视频", note: "直觉理解", url: "https://www.3blue1brown.com/" },
      ],
    },
  ],

  /* ---------- 页脚 ---------- */
  footer: {
    line1: "© 2026 系统工程系 · 系统建模与仿真课程组",
    line2: "HOSTED ON GITHUB PAGES · 内容与作业以课堂通知为准",
    repo: "",   // 源码仓库地址，如 "https://github.com/yourname/sys3301"，留空则不显示
  },
};
