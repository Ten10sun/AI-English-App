import React from "react";
import { format, subDays, getMonth } from "date-fns";

// 色分けロジック
const COLOR_THRESHOLDS = [1, 3, 6, 10, 20]; // 0,1,3,6,10,20回以上
const COLORS = [
    "bg-gray-500", // 0回（Less: 明るめグレー）
    "bg-github-1", // 1回以上
    "bg-github-2", // 3回以上
    "bg-github-3", // 6回以上
    "bg-github-4", // 10回以上
    "bg-github-flower", // 20回以上（花）
];

// 365日分
const DAYS = 365;

// ラベル配列（2,4,6行目だけ表示）
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ここから下が必須！-------------------------
function getPastDates(days) {
    const today = new Date();
    const todayDay = today.getDay(); // 0:日, ..., 6:土

    // 365日前から今日までの日付配列
    let dates = Array.from({ length: DAYS }, (_, i) => subDays(today, DAYS - 1 - i));

    // 右端の下側に「未来日」分だけnullを追加
    if (todayDay < 6) {
        const futureCount = 6 - todayDay;
        dates = [...dates, ...Array(futureCount).fill(null)];
    }

    // 週ごとに分割
    const weeks = [];
    for (let i = 0; i < dates.length; i += 7) {
        weeks.push(dates.slice(i, i + 7));
    }
    return weeks;
}

function groupByWeeks(dates) {
    const weeks = [];
    let week = [];
    dates.forEach((date, idx) => {
        week.push(date);
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
    });
    // 最後の週が7日未満なら、先頭にnullを詰めて右端がガタガタになるようにする
    if (week.length > 0) {
        while (week.length < 7) week.unshift(null);
        weeks.push(week);
    }
    return weeks;
}
// ここまで必須！-------------------------

const getColor = (count) => {
    if (count >= COLOR_THRESHOLDS[4]) return COLORS[5]; // 20回以上は花
    if (count >= COLOR_THRESHOLDS[3]) return COLORS[4];
    if (count >= COLOR_THRESHOLDS[2]) return COLORS[3];
    if (count >= COLOR_THRESHOLDS[1]) return COLORS[2];
    if (count >= COLOR_THRESHOLDS[0]) return COLORS[1];
    return COLORS[0];
};

// 直近N週間分の日付配列を作成（今日を含む）
function getPastWeeks(weeksCount = 26) {
    const today = new Date();
    const days = weeksCount * 7;
    // 今日を含む直近N週間分の配列
    const dates = Array.from({ length: days }, (_, i) => subDays(today, days - 1 - i));
    const weeks = [];
    for (let i = 0; i < days; i += 7) {
        weeks.push(dates.slice(i, i + 7));
    }
    return weeks;
}

export default function ContributionCalendar({ daysData = [] }) {
    const weeksCount = 26; // 半年分
    const days = weeksCount * 7;
    // 直近半年分の週ごと配列（右端が今週）
    const weeks = getPastWeeks(weeksCount); // [ [日~土], ... ]
    // データがなければ0埋め
    const flatData = daysData.length === days
        ? daysData
        : Array.from({ length: days }, () => 0);
    // 日付→活動量
    const dateToCount = {};
    weeks.flat().forEach((date, i) => {
        dateToCount[format(date, "yyyy-MM-dd")] = flatData[i];
    });
    const cellSize = 20;
    const cellGap = 4;

    // 年ラベル（各週の最初の日付で判定）
    const yearLabels = weeks.map((week, idx) => {
        const firstDate = week[0];
        if (!firstDate) return "";
        if (idx === 0) return firstDate.getFullYear();
        const prevDate = weeks[idx - 1][0];
        if (prevDate && prevDate.getFullYear() !== firstDate.getFullYear()) {
            return firstDate.getFullYear();
        }
        return "";
    });
    // 月ラベル（週の中に1日があればその月をラベルに、なければ週の一番上の月）
    const monthLabels = weeks.map((week, idx) => {
        // その週の中に「1日」があるか探す
        const firstOfMonth = week.find(date => date && date.getDate() === 1);
        if (firstOfMonth) {
            // 1日があれば、その月をラベルに
            return firstOfMonth.toLocaleString('en-US', { month: 'short' });
        }
        // 1日がなければ、前の週と月が異なる場合のみ表示
        const firstDate = week[0];
        if (!firstDate) return "";
        if (idx === 0) {
            return firstDate.toLocaleString('en-US', { month: 'short' });
        }
        const prevWeek = weeks[idx - 1];
        // 前の週の中に1日がある場合、その月は既にラベル表示済みなので重複させない
        const prevHasFirst = prevWeek.find(date => date && date.getDate() === 1);
        if (prevHasFirst) {
            return "";
        }
        const prevDate = prevWeek[0];
        if (prevDate && prevDate.getMonth() !== firstDate.getMonth()) {
            return firstDate.toLocaleString('en-US', { month: 'short' });
        }
        return "";
    });

    return (
        <div>
            {/* 年・月ラベル＋カレンダー本体（横スクロール） */}
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                {/* 曜日ラベル（固定） */}
                <div className="flex flex-col mr-2" style={{ minWidth: '32px' }}>
                    {/* 上部の空白（年・月ラベル分） */}
                    <div style={{ height: `${cellSize * 2 + cellGap * 2}px` }} />
                    {WEEKDAY_LABELS.map((label, idx) => (
                        <div
                            key={idx}
                            style={{
                                height: `${cellSize}px`,
                                lineHeight: `${cellSize}px`,
                                fontSize: "14px",
                                color: "#d1d5db",
                                textAlign: "right",
                                marginBottom: idx !== 6 ? `${cellGap}px` : 0,
                                fontWeight: "bold",
                                letterSpacing: "0.5px",
                            }}
                        >
                            {label}
                        </div>
                    ))}
                </div>
                {/* 年・月ラベル＋カレンダー本体（横スクロール） */}
                <div style={{ overflowX: 'auto', width: '100%', paddingBottom: '16px' }}>
                    {/* 年ラベル */}
                    <div style={{ display: 'flex', marginBottom: '2px', minWidth: `${weeks.length * (cellSize + cellGap)}px` }}>
                        {yearLabels.map((label, idx) => (
                            <div key={idx} style={{ width: `${cellSize + cellGap}px`, textAlign: 'center', fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>{label}</div>
                        ))}
                    </div>
                    {/* 月ラベル */}
                    <div style={{ display: 'flex', marginBottom: '4px', minWidth: `${weeks.length * (cellSize + cellGap)}px` }}>
                        {monthLabels.map((label, idx) => (
                            <div key={idx} style={{ width: `${cellSize + cellGap}px`, textAlign: 'center', fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>{label}</div>
                        ))}
                    </div>
                    {/* カレンダー本体（N週間分） */}
                    <div className="flex" style={{ alignItems: "flex-start", minWidth: `${weeks.length * (cellSize + cellGap)}px` }}>
                        {weeks.map((week, colIdx) => (
                            <div key={colIdx} className="flex flex-col">
                                {week.map((date, rowIdx) => (
                                    <div
                                        key={rowIdx}
                                        className={`w-5 h-5 rounded ${date ? getColor(dateToCount[format(date, "yyyy-MM-dd")] || 0) : "bg-transparent"}`}
                                        style={{
                                            marginBottom: rowIdx !== 6 ? `${cellGap}px` : 0,
                                            marginLeft: "2px",
                                            marginRight: "2px",
                                        }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* 凡例（カレンダー下、中央揃え） */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '16px',
                fontSize: '14px',
                color: '#d1d5db'
            }}>
                <span className="mr-1">Less</span>
                {COLORS.map((color, idx) => (
                    <div key={idx} className={`w-4 h-3 mx-0.5 rounded ${color}`} />
                ))}
                <span className="ml-1">More</span>
            </div>
        </div>
    );
}
