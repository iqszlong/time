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
    if (!import.meta.env.SSR){
        return window.matchMedia(query)
    }
    return null
}

export const isClient = () => typeof window !== 'undefined'