import { toast } from 'vue-sonner'
import backgroundService from '@/services/background'

export const useBackgroundStore = defineStore('background', () => {
  const { dayjs } = utils
  const backgrounds = ref([])
  const currentBackgroundId = ref(null)
  const total = ref(0)
  const loading = ref(false)
  const currentPage = ref(0)
  const pageSize = ref(10)

  const defaultData = {
    filename: "bing wallpaper",
    source: "//api.paugram.com/bing",
    sourcePath: "//api.paugram.com/bing",
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
    volume: 0.1, // 音量
    muted: true, // 静音
    order: 0, // 背景排序
  }

  const currentBackground = computed(() => {
    return backgrounds.value.find(item => item.id === currentBackgroundId.value)
  })

  const hasMore = computed(() => {
    return backgrounds.value.length < total.value
  })


  const isDefault = computed(() => {
    return currentBackground.value?.filename === defaultData.filename &&
      currentBackground.value?.sourcePath === defaultData.sourcePath
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
      await loadBackgrounds()
    }
    await loadAllPath()
    currentBackgroundId.value = backgrounds.value[0].id
  }

  async function loadBackgrounds() {
    loading.value = true
    try {
      const data = await backgroundService.getAll({ page: currentPage.value, size: pageSize.value })
      backgrounds.value = currentPage.value === 0 ? data : [...backgrounds.value, ...data]
      // console.log(data, backgrounds.value)
      total.value = await backgroundService.getTotal()
    } catch (error) {
      console.error('加载背景列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  const loadAllPath = async () => {
    for (const item of backgrounds.value) {
      // if (item.sourcePath) continue
      if (item.sourceType === 'url') {
        if (item.source.includes('%')) {
          item.sourcePath = decodeURI(item.source)
        } else {
          item.sourcePath = item.source
        }
      }
      else {
        // 释放旧的blob URL
        if (item.sourcePath.startsWith('blob:')) {
          URL.revokeObjectURL(item.sourcePath)
          // 获取新的blob URL
          item.sourcePath = await getFileURL(item.source)
          // 更新数据库
          await updateSourcePath(item.id, item.sourcePath)
        }
        if (item.sourcePath.startsWith('base64')) {
          // 什么都不做直接用base64编码
        }

      }
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
    try {
      const file = await source.getFile()
      return URL.createObjectURL(file)
    } catch (error) {
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
      } else {
        console.error(error.message)
      }
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

  const addNewBackground = async () => {
    try {
      const updatedId = await addBackground({ ...defaultData, order: total.value + 1 })
      console.log(updatedId)
      const newData = await loadBackgroundById(updatedId)
      if (newData) {
        backgrounds.value.push(newData)
      }
      total.value = await backgroundService.getTotal()
      if (!updatedId) return false
      return updatedId
    } catch (error) {
      console.error('添加新背景失败:', error)
      return false
    }
  }

  async function addBackground(background) {
    try {
      const updatedId = await backgroundService.save({ ...background, createTime: dayjs().toDate() })
      return updatedId
    } catch (error) {
      console.error('添加背景失败:', error)
      return false
    }
  }

  const updateSourcePath = async (id, sourcePath) => {
    try {
      const updatedId = await backgroundService.updateSourcePath(id, sourcePath)
      if (updatedId) {
        const index = backgrounds.value.findIndex(item => item.id == updatedId)
        if (index !== -1) {
          const item = await loadBackgroundById(updatedId)
          backgrounds.value[index] = item
        }
        return true
      }
      return false
    } catch (error) {
      console.error('更新背景源路径失败:', error)
      return false
    }
  }

  async function updateBackground(background) {
    try {
      const updatedId = await backgroundService.save(background)
      // console.log(updatedId)
      if (updatedId) {
        const index = backgrounds.value.findIndex(item => item.id == updatedId)
        if (index !== -1) {
          const item = await loadBackgroundById(updatedId)
          backgrounds.value[index] = item
        }
      }
      return true
    } catch (error) {
      console.error('更新背景失败:', error)
      return false
    }
  }

  const updateAllBackgrounds = async (backgrounds) => {
    try {
      const updated = await backgroundService.saveAll(backgrounds)
      console.log(updated)
      if (updated) {
        refresh()
      }
    } catch (error) {
      console.error('更新所有背景失败:', error)
    }
  }

  async function removeBackground(id) {
    try {
      await backgroundService.remove(id)
      backgrounds.value = backgrounds.value.filter(item => item.id !== id)
      total.value = await backgroundService.getTotal()
      return true
    } catch (error) {
      console.error('删除背景失败:', error)
      return false
    }
  }

  async function refresh() {
    await loadBackgrounds()
    await loadAllPath()
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
        currentBackgroundId.value = updatedId
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
        currentBackgroundId.value = updatedId
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
    currentBackgroundId,
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
    updateAllBackgrounds,
    removeBackground,
    refresh,
    clearAll,
    updateSource,
    updateState,
    searchBackgrounds,
  }
})
