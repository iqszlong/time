import XEUtils from "xe-utils";
const baseTitle = import.meta.env.VITE_TITLE

export const setDocTitle = (title) => {
    document.title = title ? `${title} | ${baseTitle}` : baseTitle
}

// 创建webworker
// worker是javaScript代码
export const createWorker = (worker) => {
    const blob = new Blob([worker.toString()], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const workerInstance = new Worker(url)
    URL.revokeObjectURL(url)
    return workerInstance
}

// 媒体查询
export const mediaQuery = (query) => {
    if (!import.meta.env.SSR) {
        return window.matchMedia(query)
    }
    return null
}

export const isClient = () => typeof window !== 'undefined'

export const formatterNumber = new Intl.NumberFormat('zh-CN', {
    signDisplay: 'exceptZero'
});

export function diffByKey(newList, oldList, key = 'id', ignoreKeys = []) {
    const oldMap = XEUtils.groupBy(oldList, key)
    const newIds = new Set()
    const added = []
    const updated = []
    const unchanged = []

    for (const item of newList) {
        newIds.add(item[key])
        const oldItem = oldMap[item[key]]?.[0]
        if (!oldItem) {
            added.push(item)
            continue
        }

        const isSame = XEUtils.isEqual(
            XEUtils.omit(item, ignoreKeys),
            XEUtils.omit(oldItem, ignoreKeys)
        )

        if (isSame) {
            unchanged.push(item)
        } else {
            updated.push(item)
        }
    }

    const removed = oldList.filter(i => !newIds.has(i[key])).map(i => XEUtils.clone(i, true))

    return { added, updated, unchanged, removed }
}