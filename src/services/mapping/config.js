export const acceptFile = {
    image: {
        description: "Images",
        accept: {
            "image/jpeg": [".jpg", ".jpeg", ".jfif"],
            "image/png": [".png"],
            "image/gif": [".gif"],
            "image/bmp": [".bmp"],
            "image/webp": [".webp"],
            "image/avif": [".avif"],
        },
    },
    video: {
        description: "Videos",
        accept: {
            "video/mp4": [".mp4"],
            "video/x-matroska": [".mkv"],
            "video/mp4v-es": [".m4v"],
            "video/webm": [".webm"],
        },
    }
}

export const storgeUnit = {
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
    'TB': 1024 * 1024 * 1024 * 1024,
}

export const fit = {
    contain: {
        value: 'contain',
        'zh-CN': '适应'
    },
    cover: {
        value: 'cover',
        'zh-CN': '覆盖'
    },
    fill: {
        value: 'fill',
        'zh-CN': '填充'
    },
    'scale-down': {
        value: 'scale-down',
        'zh-CN': '缩小'
    },
    none: {
        value: 'none',
        'zh-CN': '无'
    }
}

export const position = {
    center: {
        value: 'center',
        'zh-CN': '居中',
        type: ['vertical', 'horizontal']
    },
    top: {
        value: 'top',
        'zh-CN': '顶部',
        type: ['vertical']
    },
    bottom: {
        value: 'bottom',
        'zh-CN': '底部',
        type: ['vertical']
    },
    left: {
        value: 'left',
        'zh-CN': '左侧',
        type: ['horizontal']
    },
    right: {
        value: 'right',
        'zh-CN': '右侧',
        type: ['horizontal']
    },
}

export const positionStyle = {
    'top-left': {
        value: 'top-left',
        'en-US': 'top-left',
        'zh-CN': '左上',
        style: {
            alignSelf: 'start',
            justifySelf: 'start',
            marginTop: '4rem',
            marginLeft: '2rem'
        }
    },
    'top-center': {
        value: 'top-center',
        'en-US': 'top-center',
        'zh-CN': '顶部居中',
        style: {
            alignSelf: 'start',
            marginTop: '4rem',
        }
    },
    'top-right': {
        value: 'top-right',
        'en-US': 'top-right',
        'zh-CN': '右上',
        style: {
            alignSelf: 'start',
            justifySelf: 'end',
            marginTop: '4rem',
            marginRight: '2rem'
        }
    },
    'center-left': {
        value: 'center-left',
        'en-US': 'center-left',
        'zh-CN': '左侧居中',
        style: {
            justifySelf: 'start',
            marginLeft: '2rem'
        }
    },
    'center-center': {
        value: 'center-center',
        'en-US': 'center',
        'zh-CN': '居中',
        style: {
            
        }
    },
    'center-right': {
        value: 'center-right',
        'en-US': 'center-right',
        'zh-CN': '右侧居中',
        style: {
            justifySelf: 'end',
            marginRight: '2rem',
        }
    },
    
    'bottom-left': {
        value: 'bottom-left',
        'en-US': 'bottom-left',
        'zh-CN': '左下',
        style: {
            alignSelf: 'end',
            justifySelf: 'start',
            marginLeft: '2rem',
            marginBottom: '4rem',
        }
    },
    'bottom-center': {
        value: 'bottom-center',
        'en-US': 'bottom-center',
        'zh-CN': '底部居中',
        style: {
            alignSelf: 'end',
            marginBottom: '4rem',
        }
    },
    'bottom-right':{
        value: 'bottom-right',
        'en-US': 'bottom-right',
        'zh-CN': '右下',
        style: {
            alignSelf: 'end',
            justifySelf: 'end',
            marginRight: '2rem',
            marginBottom: '4rem',
        }
    },
}

export const fontFamilys = {
    default: {
        label: 'default',
        'zh-CN': '默认',
        value: 'system-ui',
    },
    'JetBrains Mono': {
        label: 'JetBrains Mono',
        'zh-CN': 'JetBrains Mono',
        value: "'JetBrains Mono', monospace",
    },
    'Inter': {
        label: 'Inter',
        'zh-CN': 'Inter',
        value: "'Inter', system-ui, sans-serif",
    },
    'Roboto Mono': {
        label: 'Roboto Mono',
        'zh-CN': 'Roboto Mono',
        value: "'Roboto Mono', monospace",
    },
    'Comfortaa': {
        label: 'Comfortaa',
        'zh-CN': 'Comfortaa',
        value: "'Comfortaa', display",
    },
    'Nunito': {
        label: 'Nunito',
        'zh-CN': 'Nunito',
        value: "'Nunito', sans-serif",
    },
    'Audiowide': {
        label: 'Audiowide',
        'zh-CN': 'Audiowide',
        value: "'Audiowide', display",
    },
    'Gilda Display': {
        label: 'Gilda Display',
        'zh-CN': 'Gilda Display',
        value: "'Gilda Display', serif",
    },
    'AgibotDisplay': {
        label: 'AgibotDisplay',
        'zh-CN': 'AgibotDisplay',
        value: "'AgibotDisplay', display",
    },
    'Eunomia': {
        label: 'Eunomia',
        'zh-CN': 'Eunomia',
        value: "'Eunomia', sans-serif",
    },
    'Ferrum': {
        label: 'Ferrum',
        'zh-CN': 'Ferrum',
        value: "'Ferrum', serif",
    },
    'Melete': {
        label: 'Melete',
        'zh-CN': 'Melete',
        value: "'Melete', sans-serif",
    },
    'Monoton': {
        label: 'Monoton',
        'zh-CN': 'Monoton',
        value: "'Monoton', display",
    },
    'VT323': {
        label: 'VT323',
        'zh-CN': 'VT323',
        value: "'VT323', monospace",
    },
    'Doto': {
        label: 'Doto',
        'zh-CN': 'Doto',
        value: "'Doto', sans-serif",
    },
    'Sixtyfour': {
        label: 'Sixtyfour',
        'zh-CN': 'Sixtyfour',
        value: "'Sixtyfour', monospace",
    },
    'Bytesized': {
        label: 'Bytesized',
        'zh-CN': 'Bytesized',
        value: "'Bytesized', sans-serif",
    },
    'Fjalla One':{
        label: 'Fjalla One',
        'zh-CN': 'Fjalla One',
        value: "'Fjalla One', sans-serif",
    },
    'Anton':{
        label: 'Anton',
        'zh-CN': 'Anton',
        value: "'Anton', sans-serif",
    },
    'Akshar':{
        label: 'Akshar',
        'zh-CN': 'Akshar',
        value: "'Akshar', sans-serif",
    },
    'Jockey One':{
        label: 'Jockey One',
        'zh-CN': 'Jockey One',
        value: "'Jockey One', sans-serif",
    },
    'League Gothic':{
        label: 'League Gothic',
        'zh-CN': 'League Gothic',
        value: "'League Gothic', sans-serif",
    },
    'Oswald':{
        label: 'Oswald',
        'zh-CN': 'Oswald',
        value: "'Oswald', sans-serif",
    },
    'Reem Kufi':{
        label: 'Reem Kufi',
        'zh-CN': 'Reem Kufi',
        value: "'Reem Kufi', sans-serif",
    },
    'Six Caps':{
        label: 'Six Caps',
        'zh-CN': 'Six Caps',
        value: "'Six Caps', sans-serif",
    },
    'Wire One':{
        label: 'Wire One',
        'zh-CN': 'Wire One',
        value: "'Wire One', sans-serif",
    },
    'Lobster Two': {
        label: 'Lobster Two',
        'zh-CN': 'Lobster Two',
        value: "'Lobster Two', display",
    },
    'Train One': {
        label: 'Train One',
        'zh-CN': 'Train One',
        value: "'Train One', display",
    },
    'Bebas Neue':{
        label: 'Bebas Neue',
        'zh-CN': 'Bebas Neue',
        value: "'Bebas Neue', display",
    },
    'Noto Sans SC': {
        label: 'Noto Sans SC',
        'zh-CN': '思源黑体',
        value: "'Noto Sans SC', sans-serif",
    },
    'Noto Serif SC': {
        label: 'Noto Serif SC',
        'zh-CN': '思源宋体',
        value: "'Noto Serif SC', serif",
    },
    'ZCOOL QingKe': {
        label: 'ZCOOL QingKe',
        'zh-CN': '站酷庆科黄油体',
        value: "'ZCOOL QingKe HuangYou', sans-serif",
    },
    'Dela Gothic One': {
        label: 'Dela Gothic One',
        'zh-CN': 'Dela Gothic One',
        value: "'Dela Gothic One', display",
    },
    'LXGW WenKai Mono TC': {
        label: 'LXGW WenKai Mono TC',
        'zh-CN': '霞鹜文楷 等宽繁体',
        value: "'LXGW WenKai Mono TC', monospace",
    },
    'M PLUS U': {
        label: 'M PLUS U',
        'zh-CN': 'M PLUS U',
        value: "'M PLUS U', sans-serif",
    },
    'SmileySans': {
        label: 'SmileySans',
        'zh-CN': '得意黑',
        value: "'SmileySans', sans-serif",
    },
    'AlibabaPuHuiTi': {
        label: 'AlibabaPuHuiTi',
        'zh-CN': '阿里巴巴普惠体',
        value: "'AlibabaPuHuiTi', sans-serif",
    },
    'MiSans': {
        label: 'MiSans',
        'zh-CN': '小米黑体',
        value: "'MiSans', sans-serif",
    }
}


export const fontEffects = {
    default: {
        label: 'default',
        'zh-CN': '默认',
        value: '',
    },
    blurGlass: {
        label: 'Frosted glass',
        'zh-CN': '磨砂玻璃',
        value: 'blur-glass',
    },
}