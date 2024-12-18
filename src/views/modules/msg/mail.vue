<script setup>
import useView from '@/hooks/useView'

const commonView = reactive({
  ...useView({
    isPage: true,
    deleteIsBatch: false,
    dataListUrl: '/msg/mail/page',
    dataForm: {
      tempId: undefined,
      status: undefined,
      creatorName: undefined
    }
  })
})

const statusMap = commonView.dictMap.get('common_status')
</script>

<template>
  <div class="mod-mail mod-wrap">
    <el-form :inline="true" :model="commonView.dataForm">
      <el-form-item>
        <el-input
          v-model="commonView.dataForm.tempId"
          placeholder="模版ID"
          clearable
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="commonView.dataForm.status"
          clearable
          placeholder="状态"
          style="width: 186px"
          @change="commonView.getDataList()"
        >
          <el-option
            v-for="(key, index) in statusMap.keys()"
            :key="index"
            :label="statusMap.get(key)"
            :value="key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" @click="commonView.getDataList()"
          >查询</el-button
        >
        <el-button
          icon="Download"
          type="success"
          @click="commonView.exportHandle()"
          >导出</el-button
        >
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <el-table
        class-name="custom-table"
        border
        :data="commonView.dataList"
        v-loading="commonView.dataLoading"
      >
        <el-table-column
          prop="tempId"
          align="center"
          label="模版ID"
        ></el-table-column>
        <el-table-column
          prop="creatorName"
          align="center"
          label="发送者"
        ></el-table-column>
        <el-table-column
          prop="recipient"
          align="center"
          label="收件人"
        ></el-table-column>
        <el-table-column
          prop="subject"
          align="center"
          label="主题"
        ></el-table-column>
        <el-table-column
          prop="content"
          align="center"
          label="邮件内容"
        ></el-table-column>
        <el-table-column prop="status" align="center" label="状态">
          <template #default="scope">
            <el-tag
              size="small"
              :type="commonView.tagTypeMap.get(scope.row.status)"
            >
              {{ statusMap.get(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          align="center"
          width="180"
          label="发送时间"
        >
        </el-table-column>
      </el-table>
    </div>
    <common-pagination v-model="commonView"></common-pagination>
  </div>
</template>

<style scoped lang="scss"></style>
