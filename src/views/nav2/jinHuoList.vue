<template>
	<div>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.jinhuoNumber" placeholder="进货单号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.jinhuoCompany" placeholder="来源公司"></el-input>
				</el-form-item>
				<el-form-item>
					<el-date-picker v-model="date"  @change="logTimeChange" type="month" value-format="yyyy-MM" placeholder="选择月"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="selectByFilters">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
	</section>

	<!--列表-->
	<el-table :data="JHList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
		<el-table-column type="selection" width="55">
		</el-table-column>
		<el-table-column type="" width="20">
		</el-table-column>
		<el-table-column prop="jinhuoNumber" label="进货单号" width="200"  sortable>
		</el-table-column>
		<el-table-column prop="jinhuoCompany" label="来源公司" width="220" sortable>
		</el-table-column>
		<el-table-column prop="jinhuoPerson" label="经手人" width="120"  sortable>
		</el-table-column>
		<el-table-column prop="jinhuoDate" label="进货日期" width="200" sortable>
		</el-table-column>
		<el-table-column prop="jinhuoTotalprice" label="总金额" min-width="140" sortable>
		</el-table-column>
		<el-table-column prop="remarks" label="备注" min-width="100" sortable>
		</el-table-column>
		<el-table-column label="操作" width="150">
			<template slot-scope="scope">
				<el-button size="small" @click="handleEdit(scope.$index, scope.row)">明细</el-button>
				<el-button type="danger" size="small" @click="JHDel(scope.$index, scope.row)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>
	<!--工具条-->
	<el-col :span="24" class="toolbar">
		<!-- <el-button type="danger"  :disabled="this.sels.length===0">批量删除</el-button> -->
		<el-pagination layout="prev, pager, next"  @current-change="handleCurrentChange" :current-page.sync="page" :page-size="10" :total="total" style="float:right;">
		</el-pagination>
	</el-col>
	<!--详情界面-->
		<el-dialog :title='"进货单号："+jinhuoNumber+" "+jinhuoCompany' style="width:100%" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-table :data="JHDetails" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 150%;">
				<el-table-column prop="id" label="id" width="50" v-if="false">
				</el-table-column>
				<el-table-column prop="goods_name" label="名称" width="200" >
				</el-table-column>
				<el-table-column prop="goods_count" label="数目" width="100" >
				</el-table-column>
				<el-table-column prop="goods_singlePrice" label="单价" width="100"  >
				</el-table-column>
				<el-table-column prop="smailtatal" label="小计（元）" width="120" >
				</el-table-column>
				<el-table-column prop="unit" label="单位" width="100" >
				</el-table-column>
				<el-table-column prop="remarks" label="备注" min-width="70" >
				</el-table-column>
				<el-table-column label="操作" width="100">
					<template slot-scope="scope">
						<el-button type="danger" size="small" @click="JHDetailsDel(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="editFormVisible = false">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import {
	getJHList,				//根据条件查询进货列表
	selectDetails,			//根据进货单号查询明细
	delJHDetails,			//删除明细
	delJH,					//删除进货单
} from '../../api/axiosapi'
export default {
	data() {
		return {
			filters: {
				jinhuoNumber: '',
				jinhuoCompany: '',
				jinhuoDate: ''
			},
			date: '',
			JHList: [],
			listLoading: false,
			page: 1,
			total: 3,
			jinhuoNumber: '',			//展示在明细界面里的进货单号
			jinhuoCompany: '',			//展示在明细界面里的来源公司
			editFormVisible: false, 	//明细界面是否显示
			JHDetails: [],
			listLoading: false,
		}
	},
	mounted() {
		this.selectByFilters();
	},
	methods: {
		selsChange: function (sels) {
				this.sels = sels;
		},
		selectByFilters() {
			var params = {"jinhuoNumber": this.filters.jinhuoNumber, "jinhuoCompany": this.filters.jinhuoCompany, "jinhuoDate": this.filters.jinhuoDate, "currentPage": this.page}
			getJHList(params).then(res => {
				let {code,msg,data} = res
				if(code == 200){
					this.JHList = JSON.parse(JSON.stringify(data.list));
					this.total = data.total
				}
			})
		},
		handleCurrentChange() {
			this.selectByFilters();
		},

		//解决了日期控件事件相差8个小时的问题，即日期总是往前错一天，这里的val是日期输入框里的内容，当日期输入框改变时触发logTimeChange事件
		logTimeChange(val) {
			this.filters.jinhuoDate = val;
		},

		//明细界面
		handleEdit(index,row) {
			this.editFormVisible = true;
			var params = {"jinhuoNumber": row.jinhuoNumber}
			selectDetails(params).then(res => {
				let {code,msg,data} = res
				if(code==200){
					this.JHDetails = JSON.parse(JSON.stringify(data))
				}else{
					this.$message.error(msg)
				}
			})
		},

		//删除明细
		JHDetailsDel(index,row) {
			this.$confirm('建议在数据录入错误的情况下删除，还要删除吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
				}).then(() => {
					var id = row.id
					var params = {"id": id}
					delJHDetails(params).then(res => {
						let {code,msg} = res
						if(code == 200){
							this.$message({
								type: 'success',
								message: '删除成功'
							})
							
							this.JHDetails.splice(index,1)
							
						}else{
							this.$message({
								type: 'error',
								message: '删除失败！'
							})
						}
					})
					
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
				});
		},
		JHDel(index, row) {
			this.$confirm('此进货单下包含子进货单，删除之后不可恢复，你最好清楚自己正在干什么，确认删除吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.$prompt('请输入当前账户的密码', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(({ value }) => {
						
						var jinhuoNumber = row.jinhuoNumber
						var user = JSON.parse(sessionStorage.getItem('user'));
						var userId= user.userId
						var params = {"userId": userId, "password": value, "jinhuoNumber": jinhuoNumber}
						delJH(params).then(res => {
							let {code,msg} = res
							if(code==200){
								this.$message({
									message: msg,
									type: 'success'
								});
							}else{
								this.$message({
									message: msg,
									type: 'error'
								});
								return
							}
							this.selectByFilters();
						})
						
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '取消删除'
						});       
					});

				})
		},
	}
}
</script>

<style scoped>

</style>