import configService from '@/services/config';

export const useConfigStore = defineStore("config", () => {
  const { dayjs } = utils
  const configs = ref([])
  const config = ref(null)
  const total = ref(0)
  const loading = ref(false)
  const currentPage = ref(0)
  const pageSize = ref(10)

  const defaultData = {
    timeDisplay: '12',
    naiveTheme: "dark", // 主题
    country: "CN",
    language: "ZH_CN",
    location: null, // 地理位置
  }

  const hasMore = computed(() => {
    return configs.value.length < total.value
  });



  const initConfig = async () => {
    await loadConfigs()
    if(total.value === 0) {
       await addConfig(defaultData)
    }
    await setConfig(configs.value[0])
  }

  const loadConfigs = async (page = 0, size = 10) => {
    loading.value = true
    try {
      currentPage.value = page;
      pageSize.value = size;
      const data = await configService.getAll("config", "createTime", page, size)
      configs.value = data
      total.value = await configService.getTotal()
    } catch (error) {
      console.error("加载配置失败:", error)
    } finally {
      loading.value = false
    }
  }

  const addConfig = async (data) => {
    try {
      await configService.save({...data, createTime: dayjs().toDate()})
      await loadConfigs()
    } catch (error) {
      console.error("添加配置失败:", error)
    }
  }

  const updateConfig = async (data) => {
    try {
      await configService.save({...data, updateTime: dayjs().toDate()})
      const index = configs.value.findIndex(item => item.id === data.id)
      if(index !== -1) {
        configs.value[index] = data
      }
      if(config.value.id === data.id) {
        await setConfig(data)
      }
      return true
    } catch (error) {
      console.error("更新配置失败:", error)
      return false
    }
  }


  const updateTimeDisplay = async (id,display) => {
    try {
      const updateId = await configService.updateTimeDisplay(id, display)
      if(updateId){
        if(config.value.id === updateId) {
          const item = await configService.getById(updateId)
          await setConfig(item)
        }
        await loadConfigs()
        return true
      }
    } catch (error) {
      console.error("更新时间显示失败:", error)
      return false
    }
  }

  const removeConfig = async (id) => {
    try {
      await configService.remove(id)
      configs.value = configs.value.filter(item => item.id !== id)
      if(config.value.id === id) {
        config.value = null
      }
      total.value = await configService.getTotal()
      return true
    } catch (error) {
      console.error("删除配置失败:", error)
      return false
    }
  }

  const loadingConfigById = async (id) => {
    loading.value = true
    try {
      const data = await configService.getById(id)
      if(data) {
        await setConfig(data)
      }
    } catch (error) {
      console.error("加载配置失败:", error)
    } finally {
      loading.value = false
    }
  }

  const loadMore = async () => {
    if(hasMore.value && !loading.value) {
      await loadConfigs(currentPage.value + 1, pageSize.value)
    }
  }


  const setConfig = async (data) => {
    try {
      config.value = {...data}
    } catch (error) {
      console.error("Error setting config:", error)
    }
  }



  const resetConfig = async () => {
    try {
      for (const key in config.value) {
        config.value[key] = defaultData[key]
      }
      await setConfig(config.value)
      await loadConfigs()
    } catch (error) {
      console.error("重置配置失败:", error)
    }
  }


  const refresh = async () => {
    await loadConfigs()
  }

  return {
    configs,
    config,
    hasMore,
    total,
    currentPage,
    pageSize,
    loading,
    loadConfigs,
    setConfig,
    resetConfig,
    initConfig,
    addConfig,
    updateConfig,
    removeConfig,
    loadingConfigById,
    loadMore,
    refresh,
    resetConfig,
    loadingConfigById,
    loadMore,
    refresh,
    resetConfig,
    updateTimeDisplay,
  }
});
