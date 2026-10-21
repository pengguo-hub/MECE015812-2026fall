/* ============================================================
   站点渲染脚本 —— 一般不需要修改
   读取 js/data.js 中的 COURSE 对象，渲染导航 / 页脚 / 各页面内容
   首屏右侧为实时运行的 Lorenz 系统数值积分（RK 步进示意）
   ============================================================ */

(function () {
  "use strict";

  var page = document.body.getAttribute("data-page");

  /* ---------- 工具 ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function fmtDate(iso) {
    var d = new Date(iso);
    return d.getMonth() + 1 + " 月 " + d.getDate() + " 日";
  }
  function fmtDateTime(iso) {
    var d = new Date(iso);
    return fmtDate(iso) + " " + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }
  function weekIndex() {
    var start = new Date(COURSE.startDate + "T00:00:00");
    var diff = Date.now() - start.getTime();
    if (diff < 0) return -1;
    return Math.floor(diff / (7 * 864e5));
  }
  function hwStatus(a) {
    var now = Date.now();
    if (now < new Date(a.release).getTime()) return "pending";
    if (now > new Date(a.due).getTime()) return "closed";
    return (new Date(a.due).getTime() - now) < 48 * 36e5 ? "soon" : "open";
  }
  function countdownText(a) {
    var s = hwStatus(a);
    if (s === "pending") return { text: fmtDateTime(a.release) + " 发布", urgent: false };
    if (s === "closed") return { text: "已截止", urgent: false };
    var ms = new Date(a.due).getTime() - Date.now();
    var d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4);
    var text = d > 0 ? "T-" + d + "D " + h + "H" : (h > 0 ? "T-0D " + h + "H " + m + "M" : "T-0D 0H " + m + "M");
    return { text: text, urgent: ms < 48 * 36e5 };
  }
  var STATUS_LABEL = { pending: "未发布", open: "进行中", soon: "即将截止", closed: "已截止" };

  function secHead(i, zh, enText) {
    return '<div class="sec-head">' +
      '<span class="num">' + String(i).padStart(2, "0") + "</span>" +
      "<h2>" + zh + "</h2>" +
      '<span class="en">/ ' + enText + "</span>" +
      '<span class="dots">:: :: ::</span>' +
    "</div>";
  }

  /* ---------- 共享框架：导航 + 页脚 ---------- */
  function renderChrome() {
    var nav = [
      { id: "home",        zh: "主页",      href: "index.html" },
      { id: "schedule",    zh: "教学日历",  href: "schedule.html" },
      { id: "assignments", zh: "作业与实验", href: "assignments.html" },
      { id: "resources",   zh: "资料",      href: "resources.html" },
    ];
    var navHtml = nav.map(function (n) {
      return '<a href="' + n.href + '"' + (n.id === page ? ' class="active"' : "") + ">" +
        String(n.id === page ? "● " : "") + n.zh + "</a>";
    }).join("");

    document.getElementById("site-header").innerHTML =
      '<div class="bar">' +
        '<a class="brand" href="index.html">' +
          '<span class="sq"></span>' +
          '<span class="code">' + esc(COURSE.code) + "</span>" +
          '<span class="name">' + esc(COURSE.name) + "</span>" +
        "</a>" +
        '<nav class="site-nav">' + navHtml + "</nav>" +
      "</div>";

    var f = COURSE.footer;
    document.getElementById("site-footer").innerHTML =
      '<div class="inner">' +
        "<div>" +
          '<div class="course">' + esc(COURSE.name) + "</div>" +
          '<div class="fine">' + esc(COURSE.code) + " · " + esc(COURSE.semester) + "</div>" +
        "</div>" +
        '<div class="fine" style="text-align:right">' +
          esc(f.line1) + "<br>" + esc(f.line2) +
          (f.repo ? '<br><a class="u-link" href="' + esc(f.repo) + '">SOURCE ON GITHUB ↗</a>' : "") +
        "</div>" +
      "</div>";
  }

  /* ---------- 首屏：Lorenz 系统实时积分 ---------- */
  function startSim(canvas, readout) {
    var ctx = canvas.getContext("2d");
    var sigma = 10, rho = 28, beta = 8 / 3, dt = 0.006;
    var s = { x: 0.1, y: 0, z: 20 };
    var trail = [];
    var MAX_TRAIL = 2600;
    var t = 0;

    function resize() {
      var r = canvas.parentElement.getBoundingClientRect();
      canvas.width = Math.max(300, r.width) * devicePixelRatio;
      canvas.height = Math.max(220, r.height - 30) * devicePixelRatio;
    }
    resize();
    window.addEventListener("resize", resize);

    function step() {
      for (var i = 0; i < 3; i++) {
        var dx = sigma * (s.y - s.x),
            dy = s.x * (rho - s.z) - s.y,
            dz = s.x * s.y - beta * s.z;
        s.x += dx * dt; s.y += dy * dt; s.z += dz * dt; t += dt;
        trail.push({ x: s.x, y: s.y, z: s.z });
      }
      if (trail.length > MAX_TRAIL) trail.splice(0, trail.length - MAX_TRAIL);
    }

    function draw() {
      var W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      // 投影到 x-z 平面
      var cx = W / 2, cy = H * 0.52, sc = Math.min(W, H) / 55;
      for (var i = 1; i < trail.length; i++) {
        var a = i / trail.length;             // 轨迹尾部渐隐
        ctx.strokeStyle = "rgba(0,0,102," + (a * 0.85).toFixed(3) + ")";
        ctx.lineWidth = devicePixelRatio * (a > 0.97 ? 1.8 : 1);
        ctx.beginPath();
        ctx.moveTo(cx + trail[i - 1].x * sc, cy - (trail[i - 1].z - 27) * sc);
        ctx.lineTo(cx + trail[i].x * sc, cy - (trail[i].z - 27) * sc);
        ctx.stroke();
      }
      // 当前点
      ctx.fillStyle = "#e2231a";
      var px = cx + s.x * sc, py = cy - (s.z - 27) * sc;
      ctx.fillRect(px - 2.5 * devicePixelRatio, py - 2.5 * devicePixelRatio, 5 * devicePixelRatio, 5 * devicePixelRatio);
      readout.textContent =
        "t=" + t.toFixed(2).padStart(7, "0") + "  x=" + s.x.toFixed(2).padStart(7, " ") +
        "  y=" + s.y.toFixed(2).padStart(7, " ") + "  z=" + s.z.toFixed(2).padStart(7, " ");
    }

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // 预绘：先积分一段，让吸引子轮廓首屏即现
    for (var k = 0; k < 1400; k++) step();
    draw();
    if (reduced) return;    // 减弱动效：停在静态轮廓
    (function loop() { step(); draw(); requestAnimationFrame(loop); })();
  }

  /* ---------- 主页 ---------- */
  function renderHome() {
    var wk = weekIndex();
    var wkLabel = wk < 0 ? "NOT STARTED" :
      (wk + 1 <= COURSE.schedule.length ? "WEEK " + String(wk + 1).padStart(2, "0") + " / 16" : "FINISHED");

    document.getElementById("hero").innerHTML =
      '<div class="frame"><span class="reg"></span>' +
        '<div class="left">' +
          '<div class="meta-top">' +
            "<span>" + esc(COURSE.code) + "</span><span>" + esc(COURSE.semester) +
            "</span><span>" + esc(COURSE.credits) + '</span><span style="color:var(--red)">' + wkLabel + "</span>" +
          "</div>" +
          "<h1>" + esc(COURSE.name) + (COURSE.nameDim ? '<span class="dim">' + esc(COURSE.nameDim) + "</span>" : "") + "</h1>" +
          '<div class="subtitle">' + esc(COURSE.nameEn) + "</div>" +
        "</div>" +
        '<div class="right">' +
          '<canvas id="sim-canvas"></canvas>' +
          '<div class="fig-cap"><span><b>FIG.00</b> LORENZ ATTRACTOR · RK STEPPING · LIVE</span><span id="sim-readout"></span></div>' +
        "</div>" +
      "</div>";

    // 参数带
    document.getElementById("spec-strip").innerHTML =
      '<div class="row">' +
        cell("CLASS TIME · 上课时间", COURSE.time, false) +
        cell("CLASSROOM · 地点", COURSE.location, false) +
        cell("INSTRUCTOR · 主讲", COURSE.staff[0] ? COURSE.staff[0].name : "", false) +
        cell("OFFICE HOUR · 答疑", "周四 16:00–17:30", false) +
      "</div>";
    function cell(k, v) {
      return '<div class="cell"><span class="k">' + k + '</span><span class="v">' + esc(v) + "</span></div>";
    }

    startSim(document.getElementById("sim-canvas"), document.getElementById("sim-readout"));

    // 公告
    document.getElementById("announcements").innerHTML =
      secHead(1, "公告", "Announcements") +
      '<div class="sheet-wrap"><table class="sheet"><thead><tr>' +
      "<th style='width:120px'>日期 DATE</th><th>内容 CONTENT</th>" +
      "</tr></thead><tbody>" +
      COURSE.announcements.map(function (a) {
        return "<tr><td class='num'>" + esc(a.date) + "</td><td>" + esc(a.text) + "</td></tr>";
      }).join("") +
      "</tbody></table></div>";

    // 本周安排
    var tw = wk >= 0 && wk < COURSE.schedule.length ? COURSE.schedule[wk] : null;
    document.getElementById("this-week").innerHTML =
      secHead(2, "本周教学安排", "This Week") +
      (tw
        ? '<div class="sheet-wrap"><table class="sheet"><thead><tr>' +
          "<th style='width:110px'>周次 WEEK</th><th>主题 TOPIC</th><th style='width:160px'>阅读 READING</th><th style='width:120px'>作业 DUE</th>" +
          "</tr></thead><tbody><tr class='is-now'>" +
          "<td class='num'>W" + String(tw.week).padStart(2, "0") + "<span class='now-tag'>本周</span></td>" +
          "<td class='topic'>" + esc(tw.topic) + "<span class='sub'>" + esc(tw.sub) + "</span></td>" +
          "<td>" + esc(tw.reading) + "</td>" +
          "<td>" + (tw.assignment ? '<a class="u-link" href="assignments.html">' + esc(tw.assignment) + " ↗</a>" : "—") + "</td>" +
          "</tr></tbody></table></div>"
        : '<div class="frame" style="padding:24px"><span class="reg"></span>当前不在教学周内，完整安排见 <a class="u-link" href="schedule.html">教学日历</a>。</div>');

    // 课程规格
    document.getElementById("course-info").innerHTML =
      secHead(3, "课程规格", "Specifications") +
      '<div class="info-grid">' +
      COURSE.info.map(function (c) {
        return '<div class="cell"><span class="k">' + esc(c.k) + " · " + esc(c.label) + '</span>' +
               '<div class="v">' + esc(c.v) + "</div></div>";
      }).join("") +
      "</div>";

    // 教学团队
    document.getElementById("staff").innerHTML =
      secHead(4, "教学团队", "Staff & Office Hours") +
      COURSE.staff.map(function (s) {
        return '<div class="staff-row">' +
          '<div class="who"><span class="name">' + esc(s.name) + '</span><span class="title">' + esc(s.title) + "</span></div>" +
          '<div class="what">' + esc(s.what) + "</div>" +
          '<div class="contact"><a class="u-link" href="mailto:' + esc(s.email) + '">' + esc(s.email) + "</a><br>" + esc(s.office) + "</div>" +
        "</div>";
      }).join("");
  }

  /* ---------- 教学日历 ---------- */
  function renderSchedule() {
    var wk = weekIndex();
    var rows = COURSE.schedule.map(function (s, i) {
      var monday = new Date(new Date(COURSE.startDate + "T00:00:00").getTime() + i * 7 * 864e5);
      var dateStr = (monday.getMonth() + 1) + "/" + monday.getDate() + " 起";
      var isNow = i === wk;
      return "<tr" + (isNow ? " class='is-now'" : "") + ">" +
        "<td class='num'>W" + String(s.week).padStart(2, "0") + (isNow ? "<span class='now-tag'>本周</span>" : "") + "</td>" +
        "<td class='num'>" + dateStr + "</td>" +
        "<td class='topic'>" + esc(s.topic) + (s.sub ? "<span class='sub'>" + esc(s.sub) + "</span>" : "") + "</td>" +
        "<td>" + esc(s.reading) + "</td>" +
        "<td>" + (s.assignment ? '<a class="u-link" href="assignments.html">' + esc(s.assignment) + " ↗</a>" : "—") + "</td>" +
      "</tr>";
    }).join("");
    document.getElementById("schedule-table").innerHTML =
      '<div class="sheet-wrap"><table class="sheet"><thead><tr>' +
      "<th style='width:110px'>周次 WEEK</th><th style='width:100px'>日期 DATE</th><th>主题 TOPIC</th>" +
      "<th style='width:150px'>阅读 READING</th><th style='width:110px'>作业 DUE</th>" +
      "</tr></thead><tbody>" + rows + "</tbody></table></div>";
  }

  /* ---------- 作业与实验 ---------- */
  function renderAssignments() {
    var wrap = document.getElementById("assign-list");
    var rows = COURSE.assignments.map(function (a, i) {
      var st = hwStatus(a);
      var cd = countdownText(a);
      var btn;
      if (st === "pending")     btn = '<span class="btn disabled">暂未开放</span>';
      else if (st === "closed") btn = a.url ? '<a class="btn" href="' + esc(a.url) + '" target="_blank" rel="noopener">查看题目 ↗</a>' : '<span class="btn disabled">已结束</span>';
      else                      btn = '<a class="btn primary" href="' + esc(a.url) + '" target="_blank" rel="noopener">领取 / 提交 ↗</a>';

      var files = (a.files || []).map(function (f) {
        return f.url ? '<a class="u-link" href="' + esc(f.url) + '">' + esc(f.name) + " ↓</a>"
                     : "<span style='opacity:.55'>" + esc(f.name) + "（待上传）</span>";
      }).join(" · ");

      return '<tr class="hw-row" data-i="' + i + '">' +
          "<td class='num'><span class='toggle'>▸</span>" + esc(a.id) + "</td>" +
          "<td class='topic'>" + esc(a.title) + "<span class='sub'>" + esc(a.platform) + "</span></td>" +
          "<td class='num'>" + fmtDate(a.release) + "</td>" +
          "<td class='num'>" + fmtDateTime(a.due) + "</td>" +
          "<td><span class='countdown" + (cd.urgent ? " urgent" : "") + "'>" + cd.text + "</span></td>" +
          "<td><span class='pill " + st + "'>" + STATUS_LABEL[st] + "</span></td>" +
          "<td>" + btn + "</td>" +
        "</tr>" +
        '<tr class="hw-detail-row" data-i="' + i + '" hidden><td colspan="7">' +
          '<div class="hw-body"><p>' + esc(a.desc) + "</p>" +
          (files ? '<p class="files">附件 · ' + files + "</p>" : "") +
          "</div></td></tr>";
    }).join("");

    wrap.innerHTML =
      '<div class="sheet-wrap"><table class="sheet"><thead><tr>' +
      "<th style='width:90px'>编号 NO.</th><th>题目 TITLE</th>" +
      "<th style='width:92px'>发布 FROM</th><th style='width:148px'>截止 DUE</th>" +
      "<th style='width:130px'>倒计时 T-MINUS</th><th style='width:100px'>状态 STATUS</th><th style='width:132px'>提交 SUBMIT</th>" +
      "</tr></thead><tbody>" + rows + "</tbody></table></div>";

    wrap.querySelectorAll("tr.hw-row").forEach(function (tr) {
      tr.addEventListener("click", function (e) {
        if (e.target.closest("a, .btn")) return;
        var i = tr.getAttribute("data-i");
        var detail = wrap.querySelector("tr.hw-detail-row[data-i='" + i + "']");
        var open = detail.hasAttribute("hidden");
        detail.toggleAttribute("hidden", !open);
        tr.querySelector(".toggle").style.transform = open ? "rotate(90deg)" : "";
      });
    });

    setInterval(function () {
      COURSE.assignments.forEach(function (a) {
        var cd = countdownText(a);
        var cellEl = wrap.querySelector("tr.hw-row td .countdown");
      });
      // 重新渲染倒计时列
      var tds = wrap.querySelectorAll(".countdown");
      COURSE.assignments.forEach(function (a, i) {
        if (tds[i]) {
          var cd2 = countdownText(a);
          tds[i].textContent = cd2.text;
          tds[i].classList.toggle("urgent", cd2.urgent);
        }
      });
    }, 60 * 1000);
  }

  /* ---------- 资料 ---------- */
  function renderResources() {
    document.getElementById("res-list").innerHTML = COURSE.resources.map(function (g, gi) {
      return '<div class="res-group">' +
        '<div class="sec-head"><span class="num">R' + (gi + 1) + "</span>" +
        "<h2 style='font-size:19px'>" + esc(g.group) + "</h2>" +
        '<span class="dots">:: ::</span></div>' +
        g.items.map(function (it, i) {
          var inner = '<span class="idx">' + String(i + 1).padStart(2, "0") + "</span>" +
            '<span class="t">' + esc(it.title) + (it.note ? '<span class="note">// ' + esc(it.note) + "</span>" : "") + "</span>" +
            '<span class="go">' + (it.url ? "OPEN ↗" : "待上传") + "</span>";
          return it.url
            ? '<a class="res-row" href="' + esc(it.url) + '" target="_blank" rel="noopener">' + inner + "</a>"
            : '<div class="res-row" style="opacity:.6">' + inner + "</div>";
        }).join("") +
      "</div>";
    }).join("");
  }

  /* ---------- 入场动效 ---------- */
  function observeReveals() {
    var els = document.querySelectorAll("section, .hero, .spec-strip, .res-group");
    els.forEach(function (e2) { e2.classList.add("reveal"); });
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (e2) { e2.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.06 });
    els.forEach(function (e2) { io.observe(e2); });
    // 兜底：1 秒后无论是否进入视口都显示，避免极端情况下内容停留在透明态
    setTimeout(function () {
      els.forEach(function (e2) { e2.classList.add("in"); });
    }, 1000);
  }

  /* ---------- 启动 ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderChrome();
    if (page === "home") renderHome();
    if (page === "schedule") renderSchedule();
    if (page === "assignments") renderAssignments();
    if (page === "resources") renderResources();
    observeReveals();
  });
})();
