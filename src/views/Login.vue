<template>
  <el-form v-if="isLogin" :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" @click="remeber" class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!-- <el-button @click.native.prevent="handleReset2">重置</el-button> -->
      <a @click="isLogin = false;isRegister = true">注册>>></a>
    </el-form-item>
  </el-form>
  <el-form v-else-if="isRegister" :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统注册</h3>
    <el-form-item prop="account">
      <el-input type="text"  auto-complete="off" v-model="ruleForm1.account" placeholder="用户名"></el-input>
    </el-form-item>
    <el-form-item prop="pwd">
      <el-input placeholder="密码" v-model="ruleForm1.pwd" type="password"></el-input>
    </el-form-item>
    <el-form-item prop="checkPwd">
      <el-input placeholder="确认密码" v-model="ruleForm1.checkPwd" type="password"></el-input>
    </el-form-item>
    <el-form-item prop="phone">
      <el-input type="text"  auto-complete="off" v-model="ruleForm1.phone" placeholder="手机号"></el-input>
    </el-form-item>
    <el-form-item prop="discription">
      <el-input type="text"  auto-complete="off" v-model="ruleForm1.discription" placeholder="描述"></el-input>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click="toRegister">注册</el-button>
      <a @click="isLogin = true;isRegister = false">登录>>></a>
    </el-form-item>
  </el-form>
</template>

<script>
  import axios from 'axios';
  import qs from 'qs'
  import { stock, 
           login,
           register
  } from '../api/axiosapi';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        //注册表单
        isLogin: true,
        isRegister: false,
        ruleForm1: {
          account: '',
          pwd: '',
          checkPwd: '',
          phone: '',
          discription: ''
        },
        rules1: {
          account: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          pwd: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
          checkPwd: [
            { required: true, message: '请确认密码', trigger: 'blur' },
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
          ]
        },

        //登录表单
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: false
      };
    },
    created() {
      this.checked = this.$cookies.get('checked')=='true'?true:false
      if(this.checked){
        var user = this.$cookies.get('userInfo')
        this.ruleForm2.account = user.account
        this.ruleForm2.checkPass = user.checkPass
      }
      this.keyupSubmit();
    },
    methods: {
      //注册
      toRegister() {
        var userName = this.ruleForm1.account
        var password = this.ruleForm1.pwd
        var checkPwd = this.ruleForm1.checkPwd
        var phone = this.ruleForm1.phone
        var discription = this.ruleForm1.discription

        if(userName == ''){
          this.$message.error("用户名不能为空！")
          return
        }
        if(password == ''){
          this.$message.error("密码不能为空！")
          return
        }
        if(password != checkPwd){
          this.$message.error("两次密码不一致！")
          return
        }
        if(phone == ''){
          this.$message.error("手机号不能为空！")
          return
        }
        var params = {"userName": userName,"password": password,"phone": phone,"discription": discription}
        register(params).then(res => {
          let {code,msg,data} = res
          if(code ==200){
            this.$message({
              message: '注册成功，请登录',
              type: 'success'
            });
          }
          this.isLogin = true
          this.isRegister = false
        })
      },

      remeber() {
        this.checked = !this.checked
        
      },
      //登录
      handleSubmit2(ev) {
        if (this.checked) {
          this.$cookies.set('checked', true)
          this.$cookies.set('userInfo', this.ruleForm2)
        } else {
          this.$cookies.set('checked', false)
          this.$cookies.clear
        }
        var params = {"userName": this.ruleForm2.account, "password": this.ruleForm2.checkPass}
        login(params).then(res => {
          let {code,msg,data} = res
          if(code === 200){
            sessionStorage.clear
            var userMap = JSON.stringify(data)
            var token = 'bearer '+(JSON.parse(userMap)).token
            sessionStorage.setItem('user', userMap)
            sessionStorage.setItem("access-token",token)
            // this.$router.push('/main')
            this.$router.push('/jinHuoList')
          }else{
            this.$message.error(msg);
          }
        })
      },
      //绑定回车按钮事件
      keyupSubmit() {
        document.onkeydown=e=>{
          let _key=window.event.keyCode;
          if(_key===13){
            this.handleSubmit2();
          }
        }
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>