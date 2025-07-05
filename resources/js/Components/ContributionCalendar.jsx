import React from "react";
import { format, subDays, getMonth } from "date-fns";

// 色分けロジック
const COLOR_THRESHOLDS = [1, 3, 6, 10]; // 0,1,3,6,10回以上
const COLORS = [
    "bg-gray-500", // 0回（Less: 明るめグレー）
    "bg-github-1", // 1回以上
    "bg-github-2", // 3回以上
    "bg-github-3", // 6回以上
    "bg-github-4", // 10回以上
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
    if (count >= COLOR_THRESHOLDS[3]) return COLORS[4];
    if (count >= COLOR_THRESHOLDS[2]) return COLORS[3];
    if (count >= COLOR_THRESHOLDS[1]) return COLORS[2];
    if (count >= COLOR_THRESHOLDS[0]) return COLORS[1];
    return COLORS[0];
};

// 直近N週間分の日付配列を作成（今日を含む）
function getPastWeeks(weeksCount = 12) {
    const today = new Date();
    const days = weeksCount * 7;
    const dates = Array.from({ length: days }, (_, i) => subDays(today, days - 1 - i));
    const weeks = [];
    for (let i = 0; i < days; i += 7) {
        weeks.push(dates.slice(i, i + 7));
    }
    return weeks;
}

export default function ContributionCalendar({ daysData = [] }) {
    const weeksCount = 12; // 3か月分
    const days = weeksCount * 7;
    // 直近3か月分の週ごと配列
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

    // 年月ラベル（左上の日付から取得、英語表記）
    const firstDate = weeks[0][0];
    const yearMonthLabel = firstDate
        ? `${firstDate.toLocaleString('en-US', { month: 'long' })} ${firstDate.getFullYear()}`
        : "";

    // 月ラベルの計算（各週の最初の日付が月初なら月名を表示）
    const monthLabels = weeks.map((week, idx) => {
        const firstDate = week[0];
        if (!firstDate) return "";
        // 最初の週は必ず表示
        if (idx === 0) {
            return firstDate.toLocaleString('en-US', { month: 'short' });
        }
        // 直前の週と月が異なる場合も表示
        const prevDate = weeks[idx - 1][0];
        if (prevDate && prevDate.getMonth() !== firstDate.getMonth()) {
            return firstDate.toLocaleString('en-US', { month: 'short' });
        }
        // 今週の中に「今日」と同じ年月日が含まれていれば表示
        const today = new Date();
        if (
            week.some(date =>
                date &&
                date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate()
            )
        ) {
            return today.toLocaleString('en-US', { month: 'short' });
        }
        // 今週の中に今月の1日が含まれていれば表示
        if (
            week.some(date =>
                date &&
                date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === 1
            )
        ) {
            return today.toLocaleString('en-US', { month: 'short' });
        }
        return "";
    });

    // 年ラベルの計算（年が切り替わる月の上だけ表示）
    const yearLabels = weeks.map((week, idx) => {
        const firstDate = week[0];
        if (!firstDate) return "";
        // 最初の週は必ず表示
        if (idx === 0) return firstDate.getFullYear();
        // 直前の週と年が異なる場合のみ表示
        const prevDate = weeks[idx - 1][0];
        if (prevDate && prevDate.getFullYear() !== firstDate.getFullYear()) {
            return firstDate.getFullYear();
        }
        return "";
    });

    return (
        <div>
            {/* 年ラベル（カレンダー本体の上） */}
            <div style={{ display: 'flex', marginLeft: `${32 + 2}px`, marginBottom: '2px' }}>
                {yearLabels.map((label, idx) => (
                    <div key={idx} style={{ width: `${cellSize + cellGap}px`, textAlign: 'center', fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>{label}</div>
                ))}
            </div>
            {/* 月ラベル（カレンダー本体の上） */}
            <div style={{ display: 'flex', marginLeft: `${32 + 2}px`, marginBottom: '4px' }}>
                {monthLabels.map((label, idx) => (
                    <div key={idx} style={{ width: `${cellSize + cellGap}px`, textAlign: 'center', fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>{label}</div>
                ))}
            </div>
            {/* カレンダー本体（曜日・マス） */}
            <div className="flex" style={{ alignItems: "flex-start" }}>
                {/* 曜日ラベル（縦） */}
                <div
                    className="flex flex-col mr-2"
                    style={{
                        height: `${cellSize * 7 + cellGap * 6}px`,
                        justifyContent: "center",
                        minWidth: "32px",
                    }}
                >
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
                {/* カレンダー本体（12週間分） */}
                <div className="flex">
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
