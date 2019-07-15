<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
			</el-col>
			<el-col :span="10">
				<div class="tools" @click.prevent="collapse">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner">
					<!--<img :src="this.sysUserAvatar" /> -->
					{{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<!--<el-dropdown-item>我的消息</el-dropdown-item>-->
						<el-dropdown-item @click.native="editUserForm = true">修改信息</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
			<el-dialog :visible.sync="editUserForm" >
				<el-form  :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-position="left" label-width="0px" class="login-container">
					<h3 class="title">修改用户信息</h3>
					<el-form-item prop="account">
					<el-input type="text"  auto-complete="off" v-model="ruleForm1.account" placeholder="用户名"><template slot="prepend" style="width:800px">用 户 名&nbsp</template></el-input>
					</el-form-item>
					<el-form-item prop="pwd">
					<el-input placeholder="密码" style="width:398px" disabled v-model="ruleForm1.pwd" type="password"><template slot="prepend">密 &nbsp&nbsp&nbsp&nbsp&nbsp码 </template>
					 </el-input>
					 <el-button type="danger" @click.native="changePwdForm = true">修改密码</el-button>
					</el-form-item>
					<!-- <el-form-item prop="checkPwd">
					<el-input placeholder="确认密码" v-model="ruleForm1.checkPwd" type="password"></el-input> -->
					</el-form-item>
					<el-form-item prop="phone">
					<el-input type="text"  auto-complete="off" v-model="ruleForm1.phone" placeholder="手机号"><template slot="prepend">手&nbsp机&nbsp号&nbsp</template></el-input>
					</el-form-item>
					<el-form-item prop="discription">
					<el-input type="text"  auto-complete="off" v-model="ruleForm1.discription" placeholder="描述"><template slot="prepend">用户描述</template></el-input>
					</el-form-item>
					
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="editUserForm = false">取消</el-button>
					<el-button type="primary" @click="submitChange">提交</el-button>
				</div>
				
			</el-dialog>
			<el-dialog :visible.sync="changePwdForm" style="width:50%;left:25%">
				<el-form :model="ruleForm3">
					<el-form-item>
						<el-input type="text" v-model="ruleForm3.oldPwd" placeholder="原密码"/>
					</el-form-item>
					<el-form-item>
						<el-input type="text" v-model="ruleForm3.newPwd" placeholder="新密码"/>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="changePwd">立即修改</el-button>
						<el-button @click="changePwdForm = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router v-show="!collapsed">
					<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden"><i :class="child.iconCls"></i>{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
				<!--导航菜单-折叠后-->
				<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
						<template v-if="!item.leaf">
							<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"> 
								<li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
							</ul>
						</template>
						<template v-else>
							<li class="el-submenu">
								<div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
							</li>
						</template>
					</li>
				</ul>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
		
	</el-row>
	
</template>

<script>
	import {
		submit, 	//修改信息
		changePwd 	//修改密码
	} from '../api/axiosapi';
	export default {
		data() {
			return {
				//修改密码窗
				ruleForm3: {
					oldPwd: '',
					newPwd: ''
				},
				
				//修改用户信息窗
				editUserForm: false,
				changePwdForm: false,
				ruleForm1: {
					userId: '',
					account: '',
					pwd: '',
					phone: '',
					discription: ''
				},
				rules1: {
					account: [
						{ required: true, message: '请输入用户名', trigger: 'blur' },
					],
					phone: [
						{ required: true, message: '请输入手机号', trigger: 'blur' },
					]
				},

				sysName:'VUEADMIN',
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}
			}
		},
		methods: {
			changePwd() {
				var oldPwd = this.ruleForm3.oldPwd
				var newPwd = this.ruleForm3.newPwd
				var userId = this.ruleForm1.userId
				if(oldPwd == ''||oldPwd == null){
					this.$message.error('旧密码不能为空')
					return
				}
				if(newPwd == '' || newPwd ==null){
					this.$message.error('新密码不能为空')
					return
				}
				var params = {"userId": userId,"oldPwd": oldPwd,"newPwd": newPwd}
				changePwd(params).then(res => {
					let {code, msg} = res
					if(code==200){
						this.$message({
							type: 'success',
							message: msg
						});
						sessionStorage.clear();
						setTimeout(()=>{
							this.$router.push('/login')
						},2000)
					}else{
						this.$message({
							type: 'error',
							message: msg
						});
					}
				})
			},
			onSubmit() {
				console.log('submit!');
			},
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect: function (a, b) {
			},

			//修改用户信息
			submitChange() {
				var userId = this.ruleForm1.userId;
				var userName = this.ruleForm1.account
				// var password = this.ruleForm1.pwd
				var phone = this.ruleForm1.phone
				var discription = this.ruleForm1.discription
				if(userName == ''){
					this.$message.error("用户名不能为空！")
					return
				}
				// if(password == ''){
				// 	this.$message.error("密码不能为空！")
				// 	return
				// }
				if(phone == ''){
					this.$message.error("手机号不能为空！")
					return
				}
				var params = {"userId": userId,"userName": userName,"phone": phone,"discription": discription}
				submit(params).then(res => {
					let {code,msg} = res
					if(code==200){
						this.$message({
							type: 'success',
							message: '修改成功!'
							});
					}else{
						this.$message({
							type: 'error',
							message: '操作失败!'
							});
					}
				})
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
					_this.$router.push('/login');
				}).catch(() => {

				});


			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			}
		},
		created() {
			var user = JSON.parse(sessionStorage.getItem('user'));
			if(user==null){
				this.$router.push("/login")
			}
			this.sysUserName = user.userName
			
			this.ruleForm1.userId = user.userId
			this.ruleForm1.account = user.userName
			this.ruleForm1.pwd = user.password.substring(0,6)
			this.ruleForm1.phone = user.phone
			this.ruleForm1.discription = user.discription

			this.$notify({
				title: '系统消息',
				message: '欢迎您， '+user.discription+":"+user.userName,
				position: 'buttom-right',
			});
		}
	}

</script>

<style scoped lang="scss">
	@import '~scss_vars';
	.login-container {
		/*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
		-webkit-border-radius: 5px;
		border-radius: 5px;
		-moz-border-radius: 5px;
		background-clip: padding-box;
		margin: 10px auto;
		width: 500px;
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
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: $color-primary;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				//width:230px;
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:230px;
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}
</style>