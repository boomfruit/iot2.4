<template>
    <div class="con">
        <div class="Nav flex1">
            <el-tree ref="tree" style="height: calc(100% - 16px); overflow-y: auto" :data="treeData" :props="defaultProps" highlight-current default-expand-all node-key="configname" @node-click="handleNodeClick">
                <span slot-scope="{ data }" class="custom-tree-node">
                    <span :class="['treeicon', !data.father ? 'el-icon-document' : 'el-icon-folder-opened']"></span>
                    <span style="margin-left: 5px">{{ data.configname }}</span>
                </span>
            </el-tree>
        </div>
        <div class="pdf flex5" ref="scrollDiv" @scroll="scrollEvent()">
            <div :id="'IDDIV_0'" class="min-h">1</div>
            <div :id="'IDDIV_1'" class="min-h">2</div>
            <div :id="'IDDIV_2'" class="min-h">3-1</div>
            <div :id="'IDDIV_3'" class="min-h">3-2</div>
            <div :id="'IDDIV_4'" class="min-h">4</div>

            <!-- <div v-for="(item, index) in allPdfList" :key="index" :id="'IDDIV_' + index" class="min-h">
                <h1>{{ item.configname }}</h1>
            </div> -->
        </div>
    </div>
</template>
<script>
export default {
    name: 'TreePdf',
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'configname',
            },
            treeData: [],
            allPdfList: [],
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList() {
            this.treeData = [
                { configname: '导航1', id: 'dh_01' },
                { configname: '导航2', id: 'dh_02' },
                {
                    configname: '导航3',
                    id: 'dh_03',
                    father: true,
                    children: [
                        { configname: '导航3-1', id: 'dh_03-001' },
                        { configname: '导航3-2', id: 'dh_03-002' },
                    ],
                },
                { configname: '导航4', id: 'dh_04' },
            ];
            this.allPdfList = []; // 无视父级，同级所需索引用到的导航数组
            this.treeData.forEach((e) => {
                if (!e?.father) {
                    this.allPdfList.push(e);
                } else if (e.children.length > 0) {
                    const childArr = e.children.map((e) => {
                        return { ...e, configname: e?.configname };
                    });
                    this.allPdfList = [...this.allPdfList, ...childArr];
                    console.log('allPdfList', this.allPdfList);
                }
            });
            this.$nextTick(() => {
                this.$refs.tree.setCurrentKey(this.allPdfList[0]?.configname);
            });
        },
        handleNodeClick(row) {
            // 点击锚点触发
            this.$nextTick(() => {
                const rowName = row?.configname;
                const names = this.allPdfList.map((e) => {
                    return e?.configname;
                });
                console.log(rowName, 'rowName');
                const id = 'IDDIV_' + names.indexOf(rowName);
                const dom = document.getElementById(id);
                //  console.log(indexObj, key, this.allPdfList.length)
                if (dom && this.$refs.scrollDiv) {
                    // console.log(this.showHeader ? 60 : 0)
                    // 嵌入式 缺少头部引用  少算60
                    this.$refs.scrollDiv.scrollTo({
                        top: dom.offsetTop - 5,
                        behavior: 'smooth',
                    });
                }
            });
        },
        // 滚动pdf监听
        scrollEvent() {
            const nowScroll = this.$refs.scrollDiv.scrollTop + 42; // h1的高度是42
            const allIds = this.allPdfList.map((e, index) => {
                return 'IDDIV_' + index;
            });
            // console.log(allIds)
            allIds.forEach((id, index) => {
                // 每一个id容器的高度获取
                const dom = document.getElementById(id);
                if (index < allIds.length - 1) {
                    // console.log(index, allIds.length)
                    const domNext = document.getElementById(allIds[index + 1]);
                    // 监听至滚动在指定的模块区域中
                    if (nowScroll > dom.offsetTop && nowScroll < domNext.offsetTop) {
                        // 在当前dom选中内
                        this.$nextTick(() => {
                            this.$refs.tree.setCurrentKey(this.allPdfList[index]?.configname);
                        });
                    }
                } else {
                    // 滚动至最后一个tree选中的条件
                    if (nowScroll > dom.offsetTop) {
                        this.$nextTick(() => {
                            this.$refs.tree.setCurrentKey(this.allPdfList[index]?.configname);
                        });
                    }
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.con {
    background: #ddd;
    padding: 8px;
    display: flex;
    .flex1 {
        flex: 1;
    }
    .flex5 {
        flex: 5;
    }
    .Nav {
        height: calc(100vh - 32px);
        background: #fff;
        padding: 8px;
        overflow-y: auto;
    }
    .pdf {
        background: #fff;
        margin-left: 8px;
        padding: 8px;
        overflow: auto;
        .min-h {
            min-height: 100%;
        }
    }
}
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: #eaf7f0 !important;
    border-radius: 4px;
    color: #28a670 !important;
}
::v-deep .el-tree--highlight-current .el-tree-node > .el-tree-node__content {
    line-height: 38px;
    height: 38px;
}
</style>
