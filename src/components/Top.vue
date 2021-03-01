<template>
  <div class="top-container">
    <div class="left-box">
      <div class="icon-wrapper">
        <span>
          <i class="el-icon-s-home"></i>
        </span>
        <span>
          <i class="el-icon-minus"></i>
        </span>
        <span>
          <i class="el-icon-close"></i>
        </span>
      </div>
      <div class="icon-left-right">
        <span @click="handleBack">
          <i class="el-icon-arrow-left"></i>
        </span>
        <span @click="handleForward">
          <i class="el-icon-arrow-right"></i>
        </span>
      </div>
    </div>
    <div class="right-box">
      <el-input prefix-icon="el-icon-search" v-model="keywords" :maxlength="10" placeholder="搜索" size="mini" @keyup.enter="handleSearch"></el-input>
      <!-- <div class="login" @click="handleLogin">登录</div> -->
    </div>
  </div>
  <!-- 登录窗口-挂载body下 -->
  <teleport to="body">
    <el-dialog title="登录" v-model="isLogin" width="30%" center :close-on-click-modal="false" :close-on-press-escape="false">
      <div>
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
          <el-form-item label="手机号" prop="name">
            <el-input v-model="form.name" :maxlength="11">
              <template #append>发送验证码</template>
            </el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="password">
            <el-input v-model="form.password" type="password"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </teleport>
</template>

<script>
import { sendCodePhone, loginPhoneCode } from '@/api/login'
import { ref, watchEffect, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  setup () {
    const rules = {
      name: [
        { required: true, message: '请输入手机号', trigger: 'change' },
        { pattern: /^[1][3456789]\d{9}$/, message: '手机格式不正确', trigger: 'change' }
      ],
      password: [{ required: true, message: '请输入验证码', trigger: 'change' }]
    }

    const route = useRoute()
    const router = useRouter()

    const formRef = ref(null)
    const form = reactive({
      name: '',
      password: ''
    })

    const state = reactive({
      isLogin: ref(false),
      keywords: ref('')
    })

    const handleLogin = () => {
      state.isLogin = true
    }

    // 后退
    const handleBack = () => {
      router.go(-1)
    }

    // 前进
    const handleForward = () => {
      router.go(1)
    }

    const handleSearch = () => {
      if (state.keywords) {
        router.push({ name: 'Result', query: { keywords: state.keywords } })
      }
    }

    const submitForm = async () => {
      // const res = await loginPhoneCode({
      //   phone: 15851000553,
      //   captcha: 9763
      // })
      // console.log(res)
      // const res = await sendCodePhone({
      //   phone: 15851000553
      // })
      // console.log(res)
      // // formRef.value.validate((valid) => {
      // //   if (valid) {
      // //     console.log(form)
      // //   }
      // // })
    }

    const handleCancel = () => {
      state.isLogin = false
      formRef.value.resetFields()
    }

    watchEffect(() => {
      if (route.query.keywords) {
        state.keywords = route.query.keywords
      }
    })

    return {
      form,
      formRef,
      rules,
      submitForm,
      handleCancel,
      ...toRefs(state),
      handleLogin,
      handleBack,
      handleForward,
      handleSearch
    }
  }
}
</script>

<style lang="less" scoped>
.top-container {
  position: fixed;
  height: 60px;
  display: flex;
  justify-content: space-between;
  background-color: #f9f9f9;
  width: 100%;
  z-index: 100;
  .left-box {
    display: flex;
  }
  .icon-wrapper {
    display: flex;
    width: 200px;
    padding-top: 8px;
    padding-left: 10px;
    span {
      display: flex;
      margin: 4px;
      width: 18px;
      height: 18px;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      cursor: pointer;
      &:hover i {
        display: inline;
      }
      &:nth-of-type(1) {
        background-color: #dd6d60;
      }
      &:nth-of-type(2) {
        background-color: #dcc060;
      }
      &:nth-of-type(3) {
        background-color: #84bb58;
      }
      i {
        font-size: 12px;
      }
    }
  }
  .icon-left-right {
    display: flex;
    align-items: center;
    margin-left: -10px;
    span {
      display: flex;
      margin: 4px;
      width: 35px;
      height: 35px;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      cursor: pointer;
      i {
        font-weight: 900;
      }
    }
    span:hover {
      background-color: #ebebeb;
    }
  }
  .right-box {
    margin-right: 20px;
    display: flex;
    align-items: center;
    .login {
      margin-left: 30px;
      width: 50px;
      font-size: 14px;
      padding: 10px;
      cursor: pointer;
      color: gray;
    }
  }
}
</style>