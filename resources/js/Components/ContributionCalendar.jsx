import React from "react";
import { format, subDays, getMonth } from "date-fns";

// 色分けロジック
const COLORS = [
    "bg-gray-500",    // 0
    "bg-green-200",   // 1
    "bg-green-400",   // 2
    "bg-green-600",   // 3
    "bg-green-700",   // 4
];

// 365日分
const DAYS = 365;

// ラベル配列（2,4,6行目だけ表示）
const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

// ここから下が必須！-------------------------
function getPastDates(days) {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < days; i++) {
        dates.push(subDays(today, days - 1 - i));
    }
    return dates;
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

export default function ContributionCalendar({ daysData = [] }) {
    // 日付配列
    const dates = getPastDates(DAYS);
    // 週ごとに分割（左が最古、右が最新）
    const weeks = groupByWeeks(dates);

    // 月ラベルの計算
    let lastMonth = null;
    const monthLabels = weeks.map((week, idx) => {
        // 週の最初の有効な日付
        const firstDate = week.find(d => d !== null);
        if (!firstDate) return "";
        const month = getMonth(firstDate);
        if (month !== lastMonth) {
            lastMonth = month;
            return format(firstDate, "MMM");
        }
        return "";
    });

    // 草の色データ（daysDataがなければランダム）
    const flatData = daysData.length === DAYS
        ? daysData
        : Array.from({ length: DAYS }, () => Math.floor(Math.random() * 5));

    // 日付→活動量
    const dateToCount = {};
    dates.forEach((date, idx) => {
        dateToCount[format(date, "yyyy-MM-dd")] = flatData[idx];
    });

    // 1マスの高さ(px)
    const cellSize = 12; // 例: 12px
    const cellGap = 2;   // マス間の隙間

    return (
        <div
            className="relative"
            style={{
                paddingLeft: "32px",
                width: "fit-content",
                paddingBottom: "32px" // 下に余白を追加
            }}
        >
            {/* 月ラベル */}
            <div className="flex ml-2 mb-1" style={{ marginLeft: "32px" }}>
                {monthLabels.map((label, idx) => (
                    <div key={idx} style={{
                        width: `${cellSize}px`,
                        fontSize: "10px",
                        color: "#d1d5db",
                        textAlign: "center"
                    }}>{label}</div>
                ))}
            </div>
            {/* 草グリッド */}
            <div className="flex" style={{ position: "relative" }}>
                {weeks.map((week, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col">
                        {week.map((date, dayIdx) => (
                            <div
                                key={dayIdx}
                                style={{
                                    width: `${cellSize}px`,
                                    height: `${cellSize}px`,
                                    margin: `${cellGap / 2}px`
                                }}
                                className={`rounded ${date
                                    ? COLORS[dateToCount[format(date, "yyyy-MM-dd")] || 0]
                                    : "bg-transparent"
                                }`}
                            />
                        ))}
                    </div>
                ))}
                {/* 曜日ラベル（絶対配置） */}
                <div style={{
                    position: "absolute",
                    left: `-${cellSize * 2.2}px`,
                    top: 0,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    pointerEvents: "none"
                }}>
                    {WEEKDAY_LABELS.map((label, idx) => (
                        <div
                            key={idx}
                            style={{
                                height: `${cellSize + cellGap}px`,
                                lineHeight: `${cellSize + cellGap}px`,
                                fontSize: "10px",
                                color: "#d1d5db",
                                textAlign: "right"
                            }}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            </div>
            {/* 凡例（右下に絶対配置、グリッドの下に表示） */}
            <div
                style={{
                    position: "absolute",
                    right: 0,
                    bottom: "-20px", // グリッドの下にずらす
                    display: "flex",
                    alignItems: "center",
                    fontSize: "10px",
                    color: "#d1d5db"
                }}
            >
                <span className="mr-1">Less</span>
                {COLORS.map((color, idx) => (
                    <div key={idx} className={`w-3 h-2 mx-0.5 rounded ${color}`} />
                ))}
                <span className="ml-1">More</span>
            </div>
        </div>
    );
}
