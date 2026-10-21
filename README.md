# 《系统建模与仿真》课程网站框架（GitHub Pages 版）

零依赖纯静态课程主页：主页 / 教学日历 / 作业与实验 / 资料 四个页面，
**日常更新只需要修改 `js/data.js` 一个文件**，不需要懂前端。

## 功能一览

- 主页：课程海报 + **实时运行的 Lorenz 吸引子数值积分动画**（纯代码绘制，无图片资源）、
  公告、本周安排、课程规格、教学团队
- 教学日历：16 周表格，根据 `startDate` 自动高亮当前周
- 作业与实验：发布/截止时间、**实时倒计时**（截止前 48 小时自动标红）、
  状态自动判定（未发布 / 进行中 / 即将截止 / 已截止）、点击展开题面与附件、提交入口按钮
- 资料页：分组资源列表，链接留空自动显示「待上传」

## 目录结构

```
├── index.html          主页
├── schedule.html       教学日历
├── assignments.html    作业与实验（倒计时 + 提交入口）
├── resources.html      资料
├── css/style.css       全部样式（主题色在文件顶部的 CSS 变量里）
├── js/data.js          ★ 课程内容都在这个文件里，改它就行
├── js/site.js          渲染逻辑与首屏仿真动画（一般不用动）
├── .nojekyll           告诉 GitHub Pages 不要走 Jekyll 构建
└── examples/
    └── autograde-workflow.yml   附赠：Python 作业的 GitHub Actions 自动评分示例（pytest 版）
```

## 本地预览

浏览器直接打开 `index.html` 即可；或在本目录运行：

```bash
python3 -m http.server 8000
# 访问 http://localhost:8000
```

## 部署到 GitHub Pages

1. 新建公开仓库（如 `sys3301-2026fall`）
2. 把本目录**全部文件**上传到仓库根目录（网页拖拽或 git push）
3. 仓库 **Settings → Pages** → Source 选 `Deploy from a branch`，Branch 选 `main` / `/ (root)`
4. 约 1 分钟后访问 `https://<你的用户名>.github.io/sys3301-2026fall/`

之后每次修改 `js/data.js` 并提交，页面自动更新。

## 日常维护（只改 js/data.js）

| 要做什么 | 改哪里 |
|---|---|
| 发公告 | `announcements` 数组，新公告加在最前面 |
| 调整某周内容 | `schedule` 数组对应行 |
| 发布新实验 | `assignments` 数组加一项，填好 `release` / `due` / `url` |
| 上传课件 | `resources` 对应分组加一条，填链接 |
| 换主题色 | `css/style.css` 顶部的 `--navy` / `--red` / `--grid` 等变量 |

日期格式：`"2026-10-31T23:59"`（年-月-日T时:分，24 小时制）。
作业状态由程序根据当前时间自动计算，无需手动改。

## 配套：仿真实验自动评测

主页只负责展示，判题二选一（也可并用）：

1. **PTA 拼题A**：代码题（数值积分、排队仿真等）直接在 PTA 布置，
   把 `assignments` 里的 `url` 指向 PTA 作业链接即可。
2. **GitHub 模板仓库 + Actions**（推荐用于 Python 实验与课程设计）：
   为每次实验建模板仓库，放入 `examples/autograde-workflow.yml`
   （改名为 `.github/workflows/autograde.yml`）和 pytest 测试文件，
   学生 push 代码即自动跑测试，得分明细输出到 Actions Summary 页面。
   详见该文件内的注释。
