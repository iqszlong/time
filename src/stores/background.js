import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import backgroundService from '@/services/background';
import { dayjs } from '@/utils/day';

export const useBackgroundStore = defineStore('background', () => {
  const backgrounds = ref([]);
  const currentBackground = ref(null);
  const total = ref(0);
  const loading = ref(false);
  const currentPage = ref(0);
  const pageSize = ref(10);

  const hasMore = computed(() => {
    return backgrounds.value.length < total.value;
  });


  async function init() {
    await loadBackgrounds()
    if (total.value === 0) {
      await addBackground({
        filename: "bing wallpaper",
        source: "//api.paugram.com/bing",
        fit: "cover", // 背景填充方式
        hposition: "center", // 背景填充水平位置
        vposition: "center", // 背景填充垂直位置
        visible: true,
        maskEnabled: true,
        maskFrom: 0,
        maskTo: 100,
        state: "idle", // pause || play
        autoPause: true, // 播放页离开自动暂停
        random: false, //播放页随机播放
      })
    }
    currentBackground.value = backgrounds.value[0];
  }

  async function loadBackgrounds(page = 0, size = 10) {
    loading.value = true;
    try {
      currentPage.value = page;
      pageSize.value = size;
      const data = await backgroundService.getAll({ page, size });
      backgrounds.value = page === 0 ? data : [...backgrounds.value, ...data];
      total.value = await backgroundService.getTotal();
    } catch (error) {
      console.error('加载背景列表失败:', error);
    } finally {
      loading.value = false;
    }
  }

  async function loadMore() {
    if (hasMore.value && !loading.value) {
      await loadBackgrounds(currentPage.value + 1, pageSize.value);
    }
  }

  async function loadBackgroundById(id) {
    loading.value = true;
    try {
      currentBackground.value = await backgroundService.getById(id);
    } catch (error) {
      console.error('加载背景详情失败:', error);
    } finally {
      loading.value = false;
    }
  }

  async function addBackground(background) {
    try {
      await backgroundService.save({ ...background, createTime: dayjs().toDate() });
      await loadBackgrounds(0);
      return true;
    } catch (error) {
      console.error('添加背景失败:', error);
      return false;
    }
  }

  async function updateBackground(background) {
    try {
      await backgroundService.save({ ...background, updateTime: dayjs().toDate() });
      const index = backgrounds.value.findIndex(bg => bg.id === background.id);
      if (index !== -1) {
        backgrounds.value[index] = background;
      }
      if (currentBackground.value?.id === background.id) {
        currentBackground.value = background;
      }
      return true;
    } catch (error) {
      console.error('更新背景失败:', error);
      return false;
    }
  }

  async function removeBackground(id) {
    try {
      await backgroundService.remove(id);
      backgrounds.value = backgrounds.value.filter(bg => bg.id !== id);
      if (currentBackground.value?.id === id) {
        currentBackground.value = null;
      }
      total.value = await backgroundService.getTotal();
      return true;
    } catch (error) {
      console.error('删除背景失败:', error);
      return false;
    }
  }

  async function refresh() {
    await loadBackgrounds(0);
  }

  async function clearAll() {
    try {
      await backgroundService.clear();
      backgrounds.value = [];
      currentBackground.value = null;
      total.value = 0;
    } catch (error) {
      console.error('清空背景失败:', error);
    }
  }

  async function updateMask(id, maskConfig) {
    try {
      const updated = await backgroundService.updateMask(id, maskConfig);
      if (updated) {
        const index = backgrounds.value.findIndex(bg => bg.id === id);
        if (index !== -1) {
          backgrounds.value[index] = updated;
        }
        if (currentBackground.value?.id === id) {
          currentBackground.value = updated;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('更新遮罩失败:', error);
      return false;
    }
  }

  async function updateFit(id, fit) {
    try {
      const updated = await backgroundService.updateFit(id, fit);
      if (updated) {
        const index = backgrounds.value.findIndex(bg => bg.id === id);
        if (index !== -1) {
          backgrounds.value[index] = updated;
        }
        if (currentBackground.value?.id === id) {
          currentBackground.value = updated;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('更新填充模式失败:', error);
      return false;
    }
  }

  async function toggleVisible(id) {
    try {
      const updated = await backgroundService.toggleVisible(id);
      if (updated) {
        const index = backgrounds.value.findIndex(bg => bg.id === id);
        if (index !== -1) {
          backgrounds.value[index] = updated;
        }
        if (currentBackground.value?.id === id) {
          currentBackground.value = updated;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('切换可见性失败:', error);
      return false;
    }
  }

  async function toggleAutoPause(id) {
    try {
      const updated = await backgroundService.toggleAutoPause(id);
      if (updated) {
        const index = backgrounds.value.findIndex(bg => bg.id === id);
        if (index !== -1) {
          backgrounds.value[index] = updated;
        }
        if (currentBackground.value?.id === id) {
          currentBackground.value = updated;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('切换自动暂停失败:', error);
      return false;
    }
  }

  async function toggleState(id) {
    try {
      const updated = await backgroundService.toggleState(id);
      if (updated) {
        const index = backgrounds.value.findIndex(bg => bg.id === id);
        if (index !== -1) {
          backgrounds.value[index] = updated;
        }
        if (currentBackground.value?.id === id) {
          currentBackground.value = updated;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('切换状态失败:', error);
      return false;
    }
  }

  async function searchBackgrounds(query) {
    loading.value = true;
    try {
      const results = await backgroundService.search(query);
      backgrounds.value = results;
      total.value = results.length;
      return results;
    } catch (error) {
      console.error('搜索背景失败:', error);
      return [];
    } finally {
      loading.value = false;
    }
  }

  return {
    backgrounds,
    currentBackground,
    total,
    loading,
    hasMore,
    init,
    loadBackgrounds,
    loadMore,
    loadBackgroundById,
    addBackground,
    updateBackground,
    removeBackground,
    refresh,
    clearAll,
    updateMask,
    updateFit,
    toggleVisible,
    toggleAutoPause,
    toggleState,
    searchBackgrounds,
  };
});
