

const darkThemeFlowSystem = () => {
    if (
        window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
            if (e.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        });
}

// 手动切换示例
export const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
}

export const shadcnui = () => {
    darkThemeFlowSystem()
}