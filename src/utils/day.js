import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import duration from "dayjs/plugin/duration";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
dayjs.locale("zh-cn");
dayjs.extend(duration);
dayjs.extend(LocalizedFormat);

// 返回中文日期格式
const zhDay = (daySting) => dayjs(daySting).format("YYYY年MM月DD日 ddd");

// 返回控件最小日期
const minDay = () => dayjs("2022-01-01").toDate();
// 返回控件最大日期
const maxDay = () => dayjs("2025-01-01").endOf("year").toDate();

export { dayjs, zhDay, minDay, maxDay };
