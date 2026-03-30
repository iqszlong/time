import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import backgroundService from '@/services/background'
import { dayjs } from '@/utils/day'
import { toast } from 'vue-sonner'

export const useBackgroundStore = defineStore('background', () => {

  const backgrounds = ref([])
  const currentBackground = ref(null)
  const total = ref(0)
  const loading = ref(false)
  const currentPage = ref(0)
  const pageSize = ref(10)

  const defaultData = {
    filename: "bing wallpaper",
    source: "//api.paugram.com/bing",
    sourceType: "url",
    fit: "cover", // 背景填充方式
    hposition: "center", // 背景填充水平位置
    vposition: "center", // 背景填充垂直位置
    visible: true,
    maskEnabled: true,
    maskFrom: 0,
    maskTo: 100,
    state: "idle", // pause || play
    autoPause: true, // 播放页离开自动暂停
  }

  const hasMore = computed(() => {
    return backgrounds.value.length < total.value
  })

  const isDefault = computed(() => {
    return currentBackground.value?.filename === defaultData.filename &&
      currentBackground.value?.source === defaultData.source
  })



  const isFilePicker = computed(() => {
    return "showDirectoryPicker" in window &&
      "showOpenFilePicker" in window &&
      "showSaveFilePicker" in window
  })

  async function initBackground() {
    await loadBackgrounds()
    if (total.value === 0) {
      await addBackground(defaultData)
    }
    await loadAllPath()
    await setCurrentBackground(backgrounds.value[0])
  }

  const addNewBackground = async () => {
    try {
      const id = await addBackground(defaultData)
      // console.log(id)
      if (!id) return false
      await loadBackgrounds()

      // await setCurrentBackground(await loadBackgroundById(id))
      return id
    } catch (error) {
      console.error('添加新背景失败:', error)
      return false
    }
  }

  const setCurrentBackground = async (background) => {
    currentBackground.value = background
    // currentBackground.value.sourcePath = await getFileURL(currentBackground.value.source)
  }



  async function loadBackgrounds(page = 0, size = 10) {
    loading.value = true
    try {
      currentPage.value = page
      pageSize.value = size
      const data = await backgroundService.getAll({ page, size })
      backgrounds.value = page === 0 ? data : [...backgrounds.value, ...data]
      total.value = await backgroundService.getTotal()
      
    } catch (error) {
      console.error('加载背景列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  const loadAllPath = async () => {
    for (const item of backgrounds.value) {
      if (item.sourcePath) continue
      if (item.sourceType === 'url') item.sourcePath = item.source
      else item.sourcePath = await getFileURL(item.source)
    }
  }

  async function loadMore() {
    if (hasMore.value && !loading.value) {
      await loadBackgrounds(currentPage.value + 1, pageSize.value)
    }
  }

  async function loadBackgroundById(id) {
    loading.value = true
    try {
      return await backgroundService.getById(id)
    } catch (error) {
      console.error('加载背景详情失败:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  const getFileURL = async (source) => {
    if (source instanceof Object) {
      try {
        const file = await source.getFile()
        return URL.createObjectURL(file)
      } catch (error) {
        // console.error(error.message)
        if (error.message.includes('FileSystemFileHandle')) {
          toast.warning('获取背景文件URL失败', {
            description: '请检查背景文件是否存在或是否被授权访问',
            position: 'top-center',
            duration: 999999,
            action: {
              label: '授权',
              onClick: async () => {
                const userPermission = await verifyPermission(currentBackground.value.source, false)
                if (userPermission) {
                  toast.success('已授权成功，稍后将自动刷新页面', {
                    position: 'top-center', onAutoClose: () => {
                      location.reload()
                    }
                  })
                }
              }
            }
          })
        }
      }


    } else if (typeof source === 'string') {
      if (source.includes('%')) {
        return decodeURI(source)
      }
      return source
    }
    return ''
  }

  async function verifyPermission(fileHandle, withWrite = false) {
    const opts = {}
    if (withWrite) {
      opts.mode = "readwrite"
    } else {
      opts.mode = "read"
    }

    // 检查是否已经拥有相应权限，如果是，返回 true。
    if ((await fileHandle.queryPermission(opts)) === "granted") {
      return true
    }

    // 为文件请求权限，如果用户授予了权限，返回 true。
    if ((await fileHandle.requestPermission(opts)) === "granted") {
      return true
    }

    // 用户没有授权，返回 false。
    return false
  }

  const queryPermission = async (fileHandle, withWrite) => {
    const opts = {}
    if (withWrite) {
      opts.mode = "readwrite"
    } else {
      opts.mode = "read"
    }
    return await fileHandle.queryPermission(opts)
  }


  async function addBackground(background) {
    try {
      const id = await backgroundService.save({ ...background, createTime: dayjs().toDate() })
      await loadBackgrounds()
      return id
    } catch (error) {
      console.error('添加背景失败:', error)
      return false
    }
  }

  async function updateBackground(background) {
    try {
      const data = { ...background }
      delete data.sourcePath
      const updatedId = await backgroundService.save({ ...data, updateTime: dayjs().toDate() })
      const index = backgrounds.value.findIndex(bg => bg.id === updatedId)
      if (index !== -1) {
        backgrounds.value[index] = background
      }
      return true
    } catch (error) {
      console.error('更新背景失败:', error)
      return false
    }
  }

  async function removeBackground(id) {
    try {
      await backgroundService.remove(id)
      await loadBackgrounds()
      // if (currentBackground.value?.id === id) {
      await setCurrentBackground(backgrounds.value[0])
      // }
      total.value = await backgroundService.getTotal()
      return true
    } catch (error) {
      console.error('删除背景失败:', error)
      return false
    }
  }

  async function refresh() {
    await loadBackgrounds()
  }

  const resetBackground = async () => {
    try {
      await updateBackground({ ...currentBackground.value, ...defaultData })
      await loadBackgrounds()
    } catch (error) {
      console.error('重置背景失败:', error)
    }
  }

  async function clearAll() {
    try {
      await backgroundService.clear()
      backgrounds.value = []
      currentBackground.value = null
      total.value = 0
    } catch (error) {
      console.error('清空背景失败:', error)
    }
  }

  async function updateSource(id, sourceData) {
    try {
      const updatedId = await backgroundService.updateSource(id, sourceData)
      if (updatedId) {
        if (currentBackground.value?.id === updatedId) {
          const item = await backgroundService.getById(updatedId)
          await setCurrentBackground(item)
        }
        await loadBackgrounds()
        return true
      }
      return false
    } catch (error) {
      console.error('更新背景源失败:', error)
      return false
    }
  }

  const updateState = async (id, state) => {
    try {
      const updatedId = await backgroundService.updateState(id, state)
      // console.log('更新状态:',updatedId)
      if (updatedId) {
        if (currentBackground.value?.id === updatedId) {
          const item = await backgroundService.getById(updatedId)
          await setCurrentBackground(item)
        }
        await loadBackgrounds()
        return true
      }
      return false
    } catch (error) {
      console.error('更新状态失败:', error)
      return false
    }
  }



  async function searchBackgrounds(query) {
    loading.value = true
    try {
      const results = await backgroundService.search(query)
      backgrounds.value = results
      total.value = results.length
      return results
    } catch (error) {
      console.error('搜索背景失败:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    defaultData,
    backgrounds,
    currentBackground,
    total,
    loading,
    hasMore,
    isDefault,
    isFilePicker,
    verifyPermission,
    initBackground,
    resetBackground,
    loadBackgrounds,
    loadMore,
    getFileURL,
    loadBackgroundById,
    addNewBackground,
    addBackground,
    updateBackground,
    removeBackground,
    refresh,
    clearAll,
    updateSource,
    updateState,
    searchBackgrounds,
  }
})
