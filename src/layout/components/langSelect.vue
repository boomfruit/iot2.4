<template>
    <div></div>
    <!-- <el-dropdown @command="chooseLang">
        <div class="lang">
            {{ language }}
            <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, key, i) in langs" :key="i" :command="key">{{ item.language }}</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown> -->
</template>

<script>
import { langs } from '@/lang';
import { addOrUpdate } from '@/api/system/language';
import { getToken } from '@/utils/auth';
import defaultSettings from '@/settings';

export default {
    name: 'langSelect',
    data() {
        return {
            langs: langs,
            language: '',
        };
    },
    methods: {
        setLanguage() {
            console.log(defaultSettings.language);
            const lang = this.$i18n.locale || defaultSettings.language;
            console.log('🚀 ~ setLanguage ~ lang:', lang);
            this.language = this.langs[lang].language || '';
            if (getToken()) addOrUpdate({ language: lang });
            this.$store.dispatch('settings/setLang', lang);
        },
        chooseLang(lang) {
            this.$i18n.locale = lang;
            this.setLanguage();
            window.location.reload();
        },
    },
    created() {
        this.setLanguage();
    },
};
</script>

<style lang="scss" scoped>
.lang {
    font-size: 15px;
    color: #fff;
}
.lang-icon {
    width: 30px !important;
    height: 30px !important;
}
.title {
    color: inherit;
    text-align: center;
    padding: 0 8px;
    color: #fff;
}
</style>
