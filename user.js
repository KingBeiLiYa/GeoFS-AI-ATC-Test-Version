// ==UserScript==
// @name         GeoFS AI ATC
// @namespace    https://github.com/KingBeiLiYa/GeoFS-AI-ATC-Test-Version
// @version      0.1
// @description  shortcut key is T/快捷键为T
// @author       贝利亚大王
// @match        https://www.geo-fs.com/geofs.php?v=3.9
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ---------------------------- Language Pack ----------------------------
    const LANGS = {
        zh: {
            name: "简体中文",
            callsign_label: "呼号",
            dep_label: "起飞机场",
            arr_label: "到达机场",
            alt_label: "备降机场",
            route_label: "航路点(选填)",
            plan_label: "飞行计划(选填)",
            lang_label: "语言",
            send: "发送",
            close: "关闭",
            input_placeholder: "输入ATC指令或选择下拉菜单",
            status: "实时状态",
            alt: "高度",
            spd: "速度",
            hdg: "航向",
            vs: "垂直速度",
            welcome: "请输入指令。",
            you: "你",
            atc: "ATC",
            not_recognized: "未识别指令。请用下拉菜单或标准ATC格式。",
            takeoff: (callsign, airport) => `${callsign}，可以在${airport}起飞。`,
            airborne: callsign => `${callsign}，你已在空中，无法再次起飞。`,
            landing: (callsign, airport) => `${callsign}，可以在${airport}降落。`,
            on_ground: callsign => `${callsign}，你已在地面，无法降落。`,
            alt_clear: (callsign, alt) => `${callsign}，许可改变高度至${alt}英尺。`,
            hdg_clear: (callsign, hdg) => `${callsign}，许可转向${hdg}度。`,
            speed_clear: (callsign, spd) => `${callsign}，许可速度${spd}节。`,
            hold: (callsign, fix) => `${callsign}，请在${fix}等待。`,
            contact: (callsign, freq) => `${callsign}，请切换到${freq}。`,
            squawk: (callsign, code) => `${callsign}，应答机设置为${code}。`,
            climb: (callsign, alt) => `${callsign}，爬升至${alt}英尺。`,
            descend: (callsign, alt) => `${callsign}，下降至${alt}英尺。`,
            direct: (callsign, fix) => `${callsign}，直接前往${fix}。`,
            approach: (callsign, type) => `${callsign}，采用${type}进近。`,
            report: (altitude, speed, heading, vs, ground) => `当前高度：${altitude}英尺，速度：${speed}节，航向：${heading}度，垂直速度：${vs}fpm，状态：${ground ? "地面" : "空中"}。`,
            bye: "ATC服务结束，祝您飞行愉快！",
            invalid_icao: "请在上方填写相关信息。",
            ground_btn: "地面",
            airborne_btn: "空中",
            auto_btn: "自动",
            state_label: "手动判定飞机状态",
            ground_set: "飞机被判定为地面状态",
            airborne_set: "飞机被判定为空中状态",
            auto_set: "飞机状态已自动识别",
            select_instruction: "常用指令选择",
            add_cmd: "添加",
            export_history: "导出历史",
            tutorial: "教程",
            mode_label: "模式",
            beginner: "新手",
            advanced: "进阶",
            instructions: [
                { value: "request_pushback", label: "请求推出" },
                { value: "request_taxi", label: "请求滑行" },
                { value: "request_lineup", label: "请求进入跑道" },
                { value: "takeoff", label: "请求起飞" },
                { value: "request_departure", label: "请求离场" },
                { value: "climb", label: "请求爬升" },
                { value: "cruise", label: "巡航高度许可" },
                { value: "direct", label: "直飞航路点" },
                { value: "descend", label: "请求下降" },
                { value: "request_arrival", label: "请求进场" },
                { value: "landing", label: "请求降落" },
                { value: "hold", label: "等待（等待XXX点）" },
                { value: "contact", label: "切换频率（切换XXX.XXX）" },
                { value: "squawk", label: "应答机设置（应答机xxxx）" },
                { value: "approach", label: "进近（ILS进近/目视进近等）" },
                { value: "report", label: "报告通过XXX点" },
                { value: "alternate", label: "备降机场指令" }
            ],
            tutorial_text: "【GeoFS AI ATC插件教程】\n\n1. 填写呼号、起降机场、航路点、飞行计划等（航路点/飞行计划可选填）。\n2. 可用下拉菜单选择常用指令。\n3. 支持输入“请求滑行”、“请求起飞”、“报告位置”等标准ATC。\n4. 支持多机场（备降）、航路点、飞行计划解析。\n5. 支持语音播报和导出历史复盘。\n6. 新手/进阶模式可切换。\n\n建议顺序：滑行→进入跑道→起飞→离场→巡航→进场→降落→脱离跑道。\n\n如需自定义指令，可输入内容后点击“添加”。"
        },
        zht: {
            name: "繁體中文",
            callsign_label: "呼號",
            dep_label: "起飛機場",
            arr_label: "到達機場",
            alt_label: "備降機場",
            route_label: "航路點(選填)",
            plan_label: "飛行計劃(選填)",
            lang_label: "語言",
            send: "發送",
            close: "關閉",
            input_placeholder: "輸入ATC指令或選擇下拉選單",
            status: "即時狀態",
            alt: "高度",
            spd: "速度",
            hdg: "航向",
            vs: "垂直速度",
            welcome: "請輸入指令。",
            you: "你",
            atc: "ATC",
            not_recognized: "未識別指令。請用下拉選單或標準ATC格式。",
            takeoff: (callsign, airport) => `${callsign}，可以在${airport}起飛。`,
            airborne: callsign => `${callsign}，你已在空中，無法再次起飛。`,
            landing: (callsign, airport) => `${callsign}，可以在${airport}降落。`,
            on_ground: callsign => `${callsign}，你已在地面，無法降落。`,
            alt_clear: (callsign, alt) => `${callsign}，許可改變高度至${alt}英尺。`,
            hdg_clear: (callsign, hdg) => `${callsign}，許可轉向${hdg}度。`,
            speed_clear: (callsign, spd) => `${callsign}，許可速度${spd}節。`,
            hold: (callsign, fix) => `${callsign}，請在${fix}等待。`,
            contact: (callsign, freq) => `${callsign}，請切換到${freq}。`,
            squawk: (callsign, code) => `${callsign}，應答機設置為${code}。`,
            climb: (callsign, alt) => `${callsign}，爬升至${alt}英尺。`,
            descend: (callsign, alt) => `${callsign}，下降至${alt}英尺。`,
            direct: (callsign, fix) => `${callsign}，直接前往${fix}。`,
            approach: (callsign, type) => `${callsign}，採用${type}進近。`,
            report: (altitude, speed, heading, vs, ground) => `當前高度：${altitude}英尺，速度：${speed}節，航向：${heading}度，垂直速度：${vs}fpm，狀態：${ground ? "地面" : "空中"}。`,
            bye: "ATC服務結束，祝您飛行愉快！",
            invalid_icao: "請在上方填寫相關資訊。",
            ground_btn: "地面",
            airborne_btn: "空中",
            auto_btn: "自動",
            state_label: "手動判定飛機狀態",
            ground_set: "飛機被判定為地面狀態",
            airborne_set: "飛機被判定為空中狀態",
            auto_set: "飛機狀態已自動識別",
            select_instruction: "常用指令選擇",
            add_cmd: "新增",
            export_history: "匯出歷史",
            tutorial: "教學",
            mode_label: "模式",
            beginner: "新手",
            advanced: "進階",
            instructions: [
                { value: "request_pushback", label: "請求推出" },
                { value: "request_taxi", label: "請求滑行" },
                { value: "request_lineup", label: "請求進入跑道" },
                { value: "takeoff", label: "請求起飛" },
                { value: "request_departure", label: "請求離場" },
                { value: "climb", label: "請求爬升" },
                { value: "cruise", label: "巡航高度許可" },
                { value: "direct", label: "直飛航路點" },
                { value: "descend", label: "請求下降" },
                { value: "request_arrival", label: "請求進場" },
                { value: "landing", label: "請求降落" },
                { value: "hold", label: "等待（等待XXX點）" },
                { value: "contact", label: "切換頻率（切換XXX.XXX）" },
                { value: "squawk", label: "應答機設置（應答機xxxx）" },
                { value: "approach", label: "進近（ILS進近/目視進近等）" },
                { value: "report", label: "報告通過XXX點" },
                { value: "alternate", label: "備降機場指令" }
            ],
            tutorial_text: "【GeoFS AI ATC插件教學】\n\n1. 填寫呼號、起降機場、航路點、飛行計劃等（航路點/飛行計劃可選填）。\n2. 可用下拉選單選擇常用指令。\n3. 支持輸入“請求滑行”、“請求起飛”、“報告位置”等標準ATC。\n4. 支持多機場（備降）、航路點、飛行計劃解析。\n5. 支持語音播報和匯出歷史復盤。\n6. 新手/進階模式可切換。\n\n建議順序：滑行→進入跑道→起飛→離場→巡航→進場→降落→脫離跑道。\n\n如需自定義指令，可輸入內容後點擊“新增”。"
        },
        en: {
            name: "English",
            callsign_label: "Callsign",
            dep_label: "Departure",
            arr_label: "Arrival",
            alt_label: "Alternate",
            route_label: "Route points (optional)",
            plan_label: "Flight plan (optional)",
            lang_label: "Language",
            send: "Send",
            close: "Close",
            input_placeholder: "Enter ATC command or select from dropdown",
            status: "Live Status",
            alt: "ALT",
            spd: "SPD",
            hdg: "HDG",
            vs: "VS",
            welcome: "Please enter a command.",
            you: "You",
            atc: "ATC",
            not_recognized: "Unrecognized command. Use dropdown or standard ATC format.",
            takeoff: (callsign, airport) => `${callsign}, cleared for takeoff at ${airport}.`,
            airborne: callsign => `${callsign}, you are already airborne. Takeoff not allowed.`,
            landing: (callsign, airport) => `${callsign}, cleared to land at ${airport}.`,
            on_ground: callsign => `${callsign}, you are already on the ground. Landing not allowed.`,
            alt_clear: (callsign, alt) => `${callsign}, cleared to change altitude to ${alt}ft.`,
            hdg_clear: (callsign, hdg) => `${callsign}, cleared to heading ${hdg}°.`,
            speed_clear: (callsign, spd) => `${callsign}, cleared to speed ${spd}kt.`,
            hold: (callsign, fix) => `${callsign}, hold at ${fix}.`,
            contact: (callsign, freq) => `${callsign}, contact ${freq}.`,
            squawk: (callsign, code) => `${callsign}, squawk ${code}.`,
            climb: (callsign, alt) => `${callsign}, climb to ${alt}ft.`,
            descend: (callsign, alt) => `${callsign}, descend to ${alt}ft.`,
            direct: (callsign, fix) => `${callsign}, proceed direct to ${fix}.`,
            approach: (callsign, type) => `${callsign}, cleared for ${type} approach.`,
            report: (altitude, speed, heading, vs, ground) => `Altitude: ${altitude}ft, Speed: ${speed}kt, Heading: ${heading}°, VS: ${vs}fpm, State: ${ground ? "Ground" : "Airborne"}.`,
            bye: "ATC session ended. Have a nice flight!",
            invalid_icao: "Please fill in the relevant information above.",
            ground_btn: "Ground",
            airborne_btn: "Airborne",
            auto_btn: "Auto",
            state_label: "Manually set aircraft state",
            ground_set: "Aircraft set to Ground state.",
            airborne_set: "Aircraft set to Airborne state.",
            auto_set: "Aircraft state is now auto detected.",
            select_instruction: "Common instruction select",
            add_cmd: "Add",
            export_history: "Export history",
            tutorial: "Tutorial",
            mode_label: "Mode",
            beginner: "Beginner",
            advanced: "Advanced",
            instructions: [
                { value: "request_pushback", label: "Request pushback" },
                { value: "request_taxi", label: "Request taxi" },
                { value: "request_lineup", label: "Request line up" },
                { value: "takeoff", label: "Request takeoff" },
                { value: "request_departure", label: "Request departure" },
                { value: "climb", label: "Request climb" },
                { value: "cruise", label: "Cruise level clearance" },
                { value: "direct", label: "Direct to waypoint" },
                { value: "descend", label: "Request descend" },
                { value: "request_arrival", label: "Request arrival" },
                { value: "landing", label: "Request landing" },
                { value: "hold", label: "Hold (hold at XXX)" },
                { value: "contact", label: "Contact frequency (contact XXX.XXX)" },
                { value: "squawk", label: "Set squawk (squawk xxxx)" },
                { value: "approach", label: "Approach (ILS/Visual/etc)" },
                { value: "report", label: "Report passing XXX" },
                { value: "alternate", label: "Alternate airport" }
            ],
            tutorial_text: "【GeoFS AI ATC Plugin Tutorial】\n\n1. Fill in callsign, departure/arrival airport, route points, flight plan (route/plan optional).\n2. You can use dropdown to select common instructions.\n3. Supports commands like 'request taxi', 'request takeoff', 'report position'.\n4. Supports multiple airports (alternate), route points, flight plan parsing.\n5. Supports voice broadcast and export history for review.\n6. Beginner/Advanced mode switchable.\n\nRecommended process: Taxi → Line up → Takeoff → Departure → Cruise → Arrival → Landing → Runway exit.\n\nFor custom commands, enter text then click 'Add'."
        }
    };
    // ---------------------------- Language Pack END ------------------------

    let currentLang = "zh";
    let callsign = "";
    let depICAO = "";
    let arrICAO = "";
    let alternates = [];
    let routePoints = [];
    let flightPlan = "";
    let manualState = null;
    let focusInput = false;
    let currentPhase = 0;
    let mode = localStorage.getItem("atcMode") || "beginner";
    let customCmds = JSON.parse(localStorage.getItem("myATCcmds") || "[]");
    let history = JSON.parse(localStorage.getItem("atcHistory") || "[]");

    // --- ATC面板管理 ---
    let atcPanelOpen = false;
    let atcPanel = null;
    function isOnGround() {
        if (manualState !== null) return manualState;
        let vals = geofs.animation?.values || {};
        let alt = vals.altitude || geofs.aircraft?.instance?.altitude || 0;
        let ground = vals.groundElevation || 0;
        return Math.abs(alt - ground) < 15;
    }

    function getFlightStatus() {
        let vals = geofs.animation?.values || {};
        let alt = Math.round(vals.altitude || geofs.aircraft?.instance?.altitude || 0);
        let ground = Math.round(vals.groundElevation || 0);
        let speed = Math.round(vals.groundSpeedKnt || geofs.aircraft?.instance?.groundSpeedKnt || 0);
        let heading = Math.round(vals.heading || geofs.aircraft?.instance?.heading || 0);
        let vs = Math.round(vals.verticalSpeed || 0);
        let relAlt = alt - ground;
        let onGround = manualState !== null ? manualState : relAlt < 15;
        return { altitude: alt, relAlt, speed, heading, vs, onGround };
    }

    function makeDraggable(panel, handle) {
        let dragging = false, offsetX = 0, offsetY = 0;
        handle.style.cursor = "move";
        handle.onmousedown = function(e) {
            dragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            document.onmousemove = function(ev) {
                if (dragging) {
                    panel.style.left = (ev.clientX - offsetX) + "px";
                    panel.style.top = (ev.clientY - offsetY) + "px";
                    panel.style.right = "auto";
                }
            };
            document.onmouseup = function() {
                dragging = false;
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
    }

    function logATC(msg) {
        let log = document.getElementById("atc-log");
        if (log) {
            log.innerHTML += `<div>${msg}</div>`;
            log.scrollTop = log.scrollHeight;
        }
        history.push(msg);
        localStorage.setItem("atcHistory", JSON.stringify(history));
    }
    function exportHistory() {
        let text = history.map(x => x.replace(/<[^>]+>/g, '')).join("\n");
        let blob = new Blob([text], { type: "text/plain" });
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url; a.download = "atc_history.txt"; a.click();
    }

    function speakATC(text) {
        if (!window.speechSynthesis) return;
        let msg = new window.SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
    }

    async function aiATC(cmd, lang) {
        cmd = cmd.toLowerCase();
        if (!/^[a-z]{4}$/i.test(depICAO) || !/^[a-z]{4}$/i.test(arrICAO)) {
            return lang.invalid_icao;
        }
        let useCallsign = callsign || "";
        let reply = "";
        if (cmd.includes("滑行") || cmd.includes("taxi")) {
            currentPhase = 1; reply = (lang === LANGS.zht ? "許可滑行至跑道。" : (lang === LANGS.en ? "Cleared to taxi to runway." : "允许滑行至跑道。"));
        }
        if (cmd.includes("推出") || cmd.includes("pushback")) {
            currentPhase = 0; reply = (lang === LANGS.zht ? "許可推出。" : (lang === LANGS.en ? "Pushback approved." : "允许推出。"));
        }
        if (cmd.includes("起飞") || cmd.includes("takeoff")) {
            currentPhase = 2;
            if (isOnGround()) reply = lang.takeoff(useCallsign, depICAO);
            else reply = lang.airborne(useCallsign);
        }
        if (cmd.includes("进入跑道") || cmd.includes("進入跑道") || cmd.includes("line up")) {
            currentPhase = 1; reply = (lang === LANGS.zht ? "許可進入跑道。" : (lang === LANGS.en ? "Cleared to line up on runway." : "允许进入跑道。"));
        }
        if (cmd.includes("离场") || cmd.includes("離場") || cmd.includes("departure")) {
            currentPhase = 3; reply = (lang === LANGS.zht ? "許可離場，呼叫雷達。" : (lang === LANGS.en ? "Cleared for departure, contact radar." : "允许离场，呼叫雷达。"));
        }
        if (cmd.includes("降落") || cmd.includes("降落") || cmd.includes("landing")) {
            currentPhase = 6;
            if (!isOnGround()) reply = lang.landing(useCallsign, arrICAO);
            else reply = lang.on_ground(useCallsign);
        }
        let altMatch = cmd.match(/(高度|altitude)[^\d]*(\d{3,5})/);
        let climbMatch = cmd.match(/(爬升|climb)[^\d]*(\d{3,5})/);
        let descendMatch = cmd.match(/(下降|descend)[^\d]*(\d{3,5})/);
        if (altMatch) reply = lang.alt_clear(useCallsign, parseInt(altMatch[2]));
        if (climbMatch) reply = lang.climb(useCallsign, parseInt(climbMatch[2]));
        if (descendMatch) reply = lang.descend(useCallsign, parseInt(descendMatch[2]));
        let hdgMatch = cmd.match(/(航向|heading)[^\d]*(\d{2,3})/);
        if (hdgMatch) reply = lang.hdg_clear(useCallsign, parseInt(hdgMatch[2]));
        let spdMatch = cmd.match(/(速度|speed)[^\d]*(\d{2,4})/);
        if (spdMatch) reply = lang.speed_clear(useCallsign, parseInt(spdMatch[2]));
        let holdMatch = cmd.match(/(等待|hold)[^\w]*(\w+)/);
        if (holdMatch) reply = lang.hold(useCallsign, holdMatch[2]);
        let freqMatch = cmd.match(/(切换|contact)[^\d]*(\d{3}\.\d{3})/);
        if (freqMatch) reply = lang.contact(useCallsign, freqMatch[2]);
        let squawkMatch = cmd.match(/(应答机|squawk)[^\d]*(\d{4})/);
        if (squawkMatch) reply = lang.squawk(useCallsign, squawkMatch[2]);
        let directMatch = cmd.match(/(前往|direct)[^\w]*(\w+)/);
        if (directMatch) reply = lang.direct(useCallsign, directMatch[2]);
        let approachMatch = cmd.match(/(进近|approach)[^\w]*(\w+)/);
        if (approachMatch) reply = lang.approach(useCallsign, approachMatch[2]);
        if (cmd.includes("报告") || cmd.includes("報告") || cmd.includes("report") || cmd.includes("状态") || cmd.includes("狀態")) {
            let s = getFlightStatus();
            reply = lang.report(s.altitude, s.speed, s.heading, s.vs, s.onGround);
        }
        if (cmd.includes("备降") || cmd.includes("備降") || cmd.includes("alternate")) {
            reply += ` ${lang.alt_label}：${alternates.join(", ")}`;
        }
        if (cmd.includes("航路") || cmd.includes("route")) {
            reply += ` ${lang.route_label.replace('(选填)','').replace('(optional)','').replace('(選填)','')}：${routePoints.join(", ")}`;
        }
        if (cmd.includes("计划") || cmd.includes("計劃") || cmd.includes("plan")) {
            reply += ` ${lang.plan_label.replace('(选填)','').replace('(optional)','').replace('(選填)','')}：${flightPlan}`;
        }
        if (cmd.includes("再见") || cmd.includes("bye") || cmd.includes("退出") || cmd.includes("exit")) {
            closeATCPanel();
            reply = lang.bye;
        }
        if (!reply) reply = lang.not_recognized;
        return reply;
    }

    async function sendATCCommand() {
        let input = document.getElementById("atc-input");
        if (!input || !input.value.trim()) return;
        let cmd = input.value.trim();
        let lang = LANGS[currentLang];
        logATC(`<span style="color:#0af">${lang.you}：${cmd}</span>`);
        input.value = "";
        let reply = await aiATC(cmd, lang);
        logATC(`<span style="color:#fe0">${lang.atc}：${reply}</span>`);
        speakATC(reply);
    }

    function openATCPanel() {
        if (atcPanelOpen) return;
        atcPanelOpen = true;
        focusInput = false;
        const lang = LANGS[currentLang];
        let panel = document.createElement("div");
        atcPanel = panel;
        panel.id = "ai-atc-panel";
        panel.style = `
            position:fixed;top:30px;right:30px;z-index:99999;background:#222;color:#fff;
            padding:0 0 8px 0;border:2px solid #0af;border-radius:12px;width:480px;font-family:monospace;
            box-shadow:0 6px 24px #0008;
        `;
        panel.innerHTML = `
            <div id="atc-drag-handle" style="font-size:20px;margin-bottom:8px;background:#111;border-radius:12px 12px 0 0;padding:14px 14px 8px 14px;cursor:move;">
                🛫 GeoFS AI ATC
            </div>
            <div style="margin-bottom:8px;padding:0 14px;">
                <label style="margin-right:3px;">${lang.callsign_label}</label>
                <input id="callsign-input" type="text" style="width:90px;padding:2px;font-size:16px;border-radius:4px;border:none;background:#333;color:#fff;" value="${callsign}">
                <label style="margin-left:12px;">${lang.dep_label}</label>
                <input id="dep-input" type="text" maxlength="4" style="width:62px;padding:2px;font-size:16px;border-radius:4px;border:none;background:#333;color:#fff;" value="${depICAO}">
                <label style="margin-left:12px;">${lang.arr_label}</label>
                <input id="arr-input" type="text" maxlength="4" style="width:62px;padding:2px;font-size:16px;border-radius:4px;border:none;background:#333;color:#fff;" value="${arrICAO}">
                <label style="margin-left:12px;">${lang.alt_label}</label>
                <input id="alternate-input" type="text" style="width:88px;padding:2px;font-size:16px;border-radius:4px;border:none;background:#333;color:#fff;" value="${alternates.join(',')}">
            </div>
            <div style="margin-bottom:8px;padding:0 14px;">
                <label>${lang.route_label}</label>
                <input id="route-input" type="text" style="width:180px;padding:2px;font-size:16px;border-radius:4px;border:none;background:#333;color:#fff;" value="${routePoints.join(',')}">
                <label style="margin-left:8px;">${lang.plan_label}</label>
                <input id="plan-input" type="text" style="width:125px;padding:2px;font-size:16px;border-radius:4px;border:none;background:#333;color:#fff;" value="${flightPlan}">
            </div>
            <div style="margin-bottom:8px;padding:0 14px;">
                <label style="margin-right:6px;">${lang.lang_label}</label>
                <select id="lang-select" style="padding:2px 5px;font-size:16px;border-radius:6px;background:#333;color:#fff;">
                    <option value="zh">${LANGS.zh.name}</option>
                    <option value="zht">${LANGS.zht.name}</option>
                    <option value="en">${LANGS.en.name}</option>
                </select>
                <label style="margin-left:18px;">${lang.mode_label}</label>
                <button id="mode-switch" style="padding:2px 10px;background:#333;color:#ffd700;border-radius:5px;border:none;margin-left:5px;">${mode=== "beginner"?lang.beginner:lang.advanced}</button>
            </div>
            <div style="margin-bottom:8px;padding:0 14px;">
                <span style="color:#9cf;">${lang.state_label}:</span>
                <button id="btn-ground" style="padding:2px 10px;background:#333;color:#6bff6b;border-radius:5px;border:none;margin-left:5px;">${lang.ground_btn}</button>
                <button id="btn-airborne" style="padding:2px 10px;background:#333;color:#ff6b6b;border-radius:5px;border:none;margin-left:5px;">${lang.airborne_btn}</button>
                <button id="btn-auto" style="padding:2px 10px;background:#333;color:#fff;border-radius:5px;border:none;margin-left:5px;">${lang.auto_btn}</button>
                <span id="manual-state-info" style="margin-left:12px;color:#ffd700;font-size:13px;"></span>
            </div>
            <div id="atc-status" style="margin-bottom:8px;padding:6px 14px;background:#111;border-radius:7px;font-size:15px;">
                <b>${lang.status}：</b>
                <span id="fs-alt">${lang.alt}:</span>
                <span id="fs-alt-val" style="color:#fe6;">000ft</span> |
                <span id="fs-spd">${lang.spd}:</span>
                <span id="fs-spd-val" style="color:#6ef;">000kt</span> |
                <span id="fs-hdg">${lang.hdg}:</span>
                <span id="fs-hdg-val" style="color:#f6e;">000°</span> |
                <span id="fs-vs">${lang.vs}:</span>
                <span id="fs-vs-val" style="color:white;">0fpm</span>
            </div>
            <div style="margin-bottom:8px;padding:0 14px;">
                <span style="color:#9cf;">${lang.select_instruction}:</span>
                <select id="instruction-select" style="padding:2px 10px;font-size:16px;border-radius:5px;background:#333;color:#ffd700;">
                    <option value="">--</option>
                    ${((mode==="beginner"?lang.instructions.slice(0,6):lang.instructions).concat(customCmds)).map(i=> `<option value="${i.value||i.label||i}">${i.label||i}</option>`).join("")}
                </select>
                <input id="add-cmd" style="width:110px;margin-left:10px;" placeholder="${lang.input_placeholder}">
                <button id="add-cmd-btn">${lang.add_cmd}</button>
            </div>
            <div id="atc-log" style="height:120px;overflow:auto;background:#111;padding:6px 14px;border-radius:6px;margin-bottom:8px;font-size:15px;"></div>
            <div style="padding:0 14px;">
                <input id="atc-input" type="text" style="width:59%;padding:4px;font-size:16px;background:#333;color:#fff;border-radius:4px;border:none;" placeholder="${lang.input_placeholder}">
                <button id="atc-send" style="padding:4px 12px;font-size:16px;margin-left:8px;background:#09f;color:#fff;border:none;border-radius:6px;">${lang.send}</button>
                <button id="atc-close" style="float:right;background:#e23;color:#fff;border:none;padding:2px 14px;border-radius:8px;font-size:16px;margin-left:8px;">${lang.close}</button>
                <button id="export-history" style="float:right;background:#09f;color:#fff;border:none;padding:2px 14px;border-radius:8px;font-size:16px;margin-left:8px;">${lang.export_history}</button>
                <button id="tutorial-btn" style="float:left;background:#ffd700;color:#333;border:none;padding:2px 12px;border-radius:8px;font-size:15px;">${lang.tutorial}</button>
            </div>
        `;
        document.body.appendChild(panel);

        // 可拖动
        makeDraggable(panel, document.getElementById("atc-drag-handle"));

        // 语言和模式切换
        document.getElementById("lang-select").value = currentLang;
        document.getElementById("lang-select").onchange = function () {
            currentLang = this.value;
            closeATCPanel();
            openATCPanel();
        };
        document.getElementById("mode-switch").onclick = function () {
            mode = (mode === "beginner" ? "advanced" : "beginner");
            localStorage.setItem("atcMode", mode);
            closeATCPanel();
            openATCPanel();
        };

        // 信息输入
        document.getElementById("callsign-input").onchange = function () { callsign = this.value.trim(); };
        document.getElementById("dep-input").onchange = function () { depICAO = this.value.trim().toUpperCase(); };
        document.getElementById("arr-input").onchange = function () { arrICAO = this.value.trim().toUpperCase(); };
        document.getElementById("alternate-input").onchange = function () { alternates = this.value.split(",").map(x => x.trim().toUpperCase()).filter(Boolean); };
        document.getElementById("route-input").onchange = function () { routePoints = this.value.split(",").map(x => x.trim().toUpperCase()).filter(Boolean); };
        document.getElementById("plan-input").onchange = function () { flightPlan = this.value.trim(); };
        document.getElementById("atc-close").onclick = function () { closeATCPanel(); };
        document.getElementById("export-history").onclick = exportHistory;
        document.getElementById("tutorial-btn").onclick = function () { alert(lang.tutorial_text); };

        // 状态按钮
        const stateInfo = document.getElementById("manual-state-info");
        document.getElementById("btn-ground").onclick = function () { manualState = true; stateInfo.textContent = lang.ground_set; stateInfo.style.color = "#6bff6b"; };
        document.getElementById("btn-airborne").onclick = function () { manualState = false; stateInfo.textContent = lang.airborne_set; stateInfo.style.color = "#ff6b6b"; };
        document.getElementById("btn-auto").onclick = function () { manualState = null; stateInfo.textContent = lang.auto_set; stateInfo.style.color = "#ffd700"; };

        // 常用/自定义指令按钮和下拉
        document.getElementById("add-cmd-btn").onclick = function () {
            let val = document.getElementById("add-cmd").value.trim();
            if (val) {
                customCmds.push({ label: val, value: val });
                localStorage.setItem("myATCcmds", JSON.stringify(customCmds));
                closeATCPanel();
                openATCPanel();
            }
        };

        document.getElementById("instruction-select").onchange = function () {
            let val = this.value;
            if (!val) return;
            document.getElementById("atc-input").value = val;
        };

        // 指令输入和发送
        logATC(lang.welcome);
        let atcInput = document.getElementById("atc-input");
        atcInput.focus();
        focusInput = true;
        atcInput.addEventListener("keydown", function (e) {
            if (["t", "T"].includes(e.key) || e.ctrlKey || e.altKey || e.metaKey) {
                e.stopPropagation();
                e.preventDefault();
            }
            if (e.key === "Enter") sendATCCommand();
        });
        document.getElementById("atc-send").onclick = sendATCCommand;
        panel.addEventListener("keydown", function (e) {
            e.stopPropagation();
            if (["t", "T"].includes(e.key) || e.ctrlKey || e.altKey || e.metaKey) {
                e.preventDefault();
            }
        }, true);

        // 状态栏刷新
        function updateStatus() {
            let s = getFlightStatus();
            document.getElementById("fs-alt-val").textContent = `${s.altitude}ft`;
            document.getElementById("fs-spd-val").textContent = `${s.speed}kt`;
            document.getElementById("fs-hdg-val").textContent = `${s.heading}°`;
            document.getElementById("fs-vs-val").textContent = `${s.vs}fpm`;
            document.getElementById("fs-vs-val").style.color = s.vs > 100 ? "#ff6b6b" : s.vs < -100 ? "#6bff6b" : "white";
        }
        let timer = setInterval(updateStatus, 1000);
        updateStatus();
        panel._closeTimer = timer;
    }

    function closeATCPanel() {
        if (!atcPanelOpen) return;
        atcPanelOpen = false;
        focusInput = false;
        if (atcPanel) {
            if (atcPanel._closeTimer) clearInterval(atcPanel._closeTimer);
            atcPanel.remove();
            atcPanel = null;
        }
        manualState = null;
    }

    // -------------------- 工具栏按钮 ---------------------
    // 工具栏按钮插入
    function addToolbarButton() {
        // 防止重复添加
        if (document.getElementById("atc-toolbar-button")) return;

        // 工具栏
        let buttonDiv = document.createElement("div");
        buttonDiv.innerHTML = `<button class="mdl-button mdl-js-button geofs-f-standard-ui geofs-mediumScreenOnly" 
            data-toggle-panel=".geofs-livery-list" 
            data-tooltip-classname="mdl-tooltip--top" 
            tabindex="0" 
            id="atc-toolbar-button" 
            size="50%">ATC</button>`;

        // 工具栏
        let inserted = false;
        let bottomUI;
        let retryCount = 0;
        function tryInsert() {
            bottomUI = document.getElementsByClassName("geofs-ui-bottom")[0];
            if (bottomUI) {
                let element = buttonDiv.firstElementChild;
                // 优先插入
                if (typeof geofs !== "undefined" && geofs.version >= 3.6) {
                    bottomUI.insertBefore(element, bottomUI.children[4]);
                } else {
                    bottomUI.insertBefore(element, bottomUI.children[3]);
                }
                // 按钮事件
                element.onclick = function() {
                    if (atcPanelOpen) closeATCPanel();
                    else openATCPanel();
                };
                inserted = true;
            } else if (retryCount < 30) {
                // DOM还没加载完，重试
                retryCount++;
                setTimeout(tryInsert, 300);
            }
        }
        tryInsert();
    }
    // -------------------- 工具栏按钮 END --------------------------

    // -------------------- 按T键开关 ------------------------------
    document.addEventListener("keydown", function (e) {
        // 不在输入框
        if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
        if (e.key.toLowerCase() === "t") {
            e.preventDefault();
            if (atcPanelOpen) closeATCPanel();
            else openATCPanel();
        }
        // 关闭
        if (atcPanelOpen && e.ctrlKey && e.key.toLowerCase() === "w") {
            e.preventDefault();
            closeATCPanel();
        }
    }, true);

    // -------------------- 页面加载后初始化 ------------------------
    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }
    ready(() => {
        addToolbarButton();
    });
    // 保证动态加载情况下工具栏按钮也会生成
    setTimeout(addToolbarButton, 3000);

    // 禁止盗用!!!诅咒盗用者没有🐔🐔
})();
