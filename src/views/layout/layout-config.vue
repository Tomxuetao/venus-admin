<script setup>
import { useThemeState } from '@/store'

const visible = defineModel()

const themeState = useThemeState()
</script>

<template>
  <el-drawer
    class="custom-drawer"
    v-model="visible"
    title="主题设置"
    size="20%"
    append-to-body
  >
    <template #header>
      <div class="drawer-header">
        <div class="drawer-title">主题设置</div>
      </div>
    </template>
    <template #default>
      <div class="drawer-ctx">
        <div class="ctx-item">12</div>
        <el-divider></el-divider>
        <div class="ctx-item">
          <div class="item-title">布局模式</div>
          <div class="item-layout">
            <el-tooltip placement="top" effect="dark" content="左侧菜单布局">
              <div
                :class="[
                  'layout-item',
                  'layout-item-1',
                  themeState.navLayout === 'aside' ? 'layout-item-active' : '',
                ]"
                @click="themeState.updateNavLayout('aside')"
              ></div>
            </el-tooltip>
            <el-tooltip placement="top" effect="dark" content="顶部菜单布局">
              <div
                :class="[
                  'layout-item',
                  'layout-item-2',
                  themeState.navLayout === 'header' ? 'layout-item-active' : '',
                ]"
                @click="themeState.updateNavLayout('header')"
              ></div>
            </el-tooltip>
            <el-tooltip placement="top" effect="dark" content="混合菜单布局">
              <div
                :class="[
                  'layout-item',
                  'layout-item-3',
                  themeState.navLayout === 'mix' ? 'layout-item-active' : '',
                ]"
                @click="themeState.updateNavLayout('mix')"
              ></div>
            </el-tooltip>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="ctx-item">
          <div class="item-title">其他配置</div>
          <div class="other-config">
            <div class="other-item">
              <div class="item-label">侧栏默认收起</div>
              <el-switch v-model="themeState.collapse"></el-switch>
            </div>
            <div class="other-item">
              <div class="item-label">侧栏排他展开</div>
              <el-switch v-model="themeState.uniqueOpened"></el-switch>
            </div>
            <div class="other-item">
              <div class="item-label">面包屑默认开启</div>
              <el-switch v-model="themeState.showCrumb"></el-switch>
            </div>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="ctx-item">12345</div>
      </div>
    </template>
    <template #footer>
      <div class="drawer-footer">
        <el-button type="primary" @click="visible = false">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style lang="scss">
.custom-drawer {
  .drawer-header {
    .drawer-title {
      font-size: 16px;
      color: #333333;
    }
  }

  .drawer-ctx {
    display: grid;
    grid-auto-flow: row;

    .ctx-item {
      .item-title {
        height: 18px;
        font-size: 14px;
        color: #8c8c8c;
        line-height: 18px;
      }

      .item-layout {
        display: grid;
        padding: 16px 0;
        grid-gap: 0 24px;
        grid-auto-flow: column;

        .layout-item {
          position: relative;
          display: inline-block;
          width: 64px;
          height: 36px;
          cursor: pointer;
          border-radius: 2px;
          background-color: #f5f7fa;
          box-shadow: 0 0 2px #00000026;

          &-1 {
            &:before {
              position: absolute;
              content: '';
              width: 12px;
              height: 36px;
              border-radius: 2px 0 0 2px;
              background-color: #2e3549;
            }
          }

          &-2 {
            &:before {
              position: absolute;
              content: '';
              width: 64px;
              height: 8px;
              border-radius: 2px 2px 0 0;
              background-color: #2e3549;
            }
          }

          &-3 {
            background-color: #2e3549;

            &:before {
              position: absolute;
              content: '';
              top: 8px;
              left: 12px;
              width: 52px;
              height: 28px;
              background-color: #f0f2f5;
            }
          }

          &-active {
            &:after {
              position: absolute;
              top: 100%;
              left: 50%;
              content: '';
              width: 6px;
              height: 6px;
              margin-top: 8px;
              border-radius: 50%;
              background-color: #19be6b;
              transform: translateX(-50%);
            }
          }
        }
      }

      .other-config {
        display: grid;
        grid-gap: 16px;
        margin-top: 24px;
        grid-auto-flow: row;

        .other-item {
          height: 32px;
          display: grid;
          line-height: 32px;
          align-items: center;
          grid-auto-flow: column;
          justify-content: space-between;
          grid-template-columns: repeat(2, max-content);

          .item-label {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
