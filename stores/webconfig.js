import { useStorage } from '@/utils/index';
import { ref } from 'vue';
export default () => {
    const storage = useStorage()
    const WebConfigStorageKey = 'WEBCONFIG'
    const WEBCONFIG = ref();
    const setWebConfig = (WebConfig) => {
        WEBCONFIG.value = WebConfig;
        return storage.set(WebConfigStorageKey, WebConfig);
    }
    const initWebConfig = () => {
        const webconfig = storage.get(WebConfigStorageKey)
        if (webconfig !== null) {
            setWebConfig(webconfig);
        }
    }
    const clearWebConfig = () => {
        WEBCONFIG.value = undefined;
        return storage.remove(WebConfigStorageKey)
    }
    return {
        WEBCONFIG,
        setWebConfig,
        initWebConfig,
        clearWebConfig,
    };
}