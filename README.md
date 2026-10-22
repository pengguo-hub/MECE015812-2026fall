# 《系统建模优化与仿真》课程网站（GitHub Pages 版）

西南交通大学机械工程学院 · MECE015812 · 主讲：郭鹏

零依赖纯静态课程主页：主页 / 教学日历 / 作业与报告 / 资料 四个页面，
**日常更新只需要修改 `js/data.js` 一个文件**，不需要懂前端。

## 功能一览

- 主页：课程海报（右侧为实时运行的 Lorenz 系统数值积分动画）、公告、
  本周安排、课程规格（先修/考核/软件环境等）、教学团队
- 教学日历：16 周表格（数学建模 → 优化求解 → Plant Simulation → 实战），
  根据 `startDate` 自动高亮当前周
- 作业与报告：发布/截止时间、**实时倒计时**（截止前 48 小时自动标红）、
  状态自动判定（未发布 / 进行中 / 即将截止 / 已截止）、点击展开说明与附件
- 资料页：软件环境（Python / SCIP / Plant Simulation）、课件、教材与参考书、延伸阅读
- 第 1 周课件已放入 `slides/` 目录并在资料页提供下载

## 目录结构

```
├── index.html          主页
├── schedule.html       教学日历
├── assignments.html    作业与报告（倒计时 + 提交入口）
├── resources.html      资料
├── slides/             课件（学生可直接从资料页下载）
├── css/style.css       全部样式（主题色在文件顶部的 CSS 变量里）
├── js/data.js          ★ 课程内容都在这个文件里，改它就行
├── js/site.js          渲染逻辑与首屏仿真动画（一般不用动）
├── .nojekyll           告诉 GitHub Pages 不要走 Jekyll 构建
└── examples/
    └── autograde-workflow.yml   附赠：编程作业的 GitHub Actions 自动评分示例
```

## 本地预览

浏览器直接打开 `index.html` 即可；或在本目录运行：

```bash
python3 -m http.server 8000
# 访问 http://localhost:8000
```

## 部署到 GitHub Pages

1. 新建公开仓库（如 `mece015812`）
2. 把本目录**全部文件**上传到仓库根目录（网页拖拽或 git push；
   注意网页拖拽会跳过 `.nojekyll` 这类点开头的隐藏文件，需单独
   Add file → Create new file → 文件名填 `.nojekyll` → 空白提交）
3. 仓库 **Settings → Pages** → Source 选 `Deploy from a branch`，
   Branch 选 `main` / `/ (root)`
4. 约 1 分钟后访问 `https://<用户名>.github.io/mece015812/`

之后每次修改 `js/data.js` 并提交，页面自动更新。

## 日常维护（只改 js/data.js）

| 要做什么 | 改哪里 |
|---|---|
| 发公告 | `announcements` 数组，新公告加在最前面 |
| 调整某周内容 | `schedule` 数组对应行 |
| 布置作业/报告 | `assignments` 数组加一项，填好 `release` / `due` / `url` |
| 上传新课件 | 文件放进 `slides/`，在 `resources` 的「课件」组加一条链接 |
| 换主题色 | `css/style.css` 顶部的 `--navy` / `--red` / `--grid` 等变量 |

日期格式：`"2026-10-27T23:59"`（年-月-日T时:分，24 小时制）。
作业状态由程序根据当前时间自动计算，无需手动改。

## 附赠：编程作业自动评分

`examples/autograde-workflow.yml` 是一个 GitHub Actions 工作流示例
（Python + pytest 按测试点给分，结果输出到 Actions Summary 页面）。
如需用 GitHub 模板仓库分发课堂编程作业，将该文件改名为
`.github/workflows/autograde.yml` 放入模板仓库即可，文件内有详细注释。
