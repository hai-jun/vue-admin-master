<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="filtersForm">
				<el-form-item>
					<el-input v-model="filters.orderId" placeholder="订单编号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.companyName" placeholder="公司"></el-input>
				</el-form-item>
				<el-form-item>
					<el-date-picker v-model="filters.createDateOn" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="订单创建最小日期"> 
					 </el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-date-picker v-model="filters.createDateEnd" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="最大日期">  </el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-select v-model="defaultSelect" placeholder="请选择订单 状态">
    					<el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value">
					 </el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="selectOrderByOptions">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="OrderList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column width="45">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" content="复制订单编号" placement="right">
					<el-button  type="text" size="mini" icon="el-icon-document-copy"
						v-clipboard:copy="scope.row.orderId"
						v-clipboard:success="onCopy"
						v-clipboard:error="onError">
					</el-button>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="orderId" label="订单编号" width="150"  sortable>
			</el-table-column>
			<el-table-column prop="companyName" label="发单公司" width="180" sortable>
			</el-table-column>
			<el-table-column prop="person" label="接单人" width="120"  sortable>
			</el-table-column>
			<el-table-column prop="createDate" label="订单创建时间" width="180" sortable>
			</el-table-column>
			<el-table-column prop="termDate" label="订单截止日期" width="180" sortable>
			</el-table-column>
			<el-table-column prop="endDate" label="完成日期" width="120" sortable>
			</el-table-column>
			<el-table-column prop="orderStatus" label="订单状态" min-width="140" sortable>
			</el-table-column>
			<el-table-column prop="remarks" label="备注" min-width="100" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">明细</el-button>
					<el-button type="danger" size="small" @click="OrderDel(scope.$index, scope.row)">删除</el-button>
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
		<el-dialog :title='"订单编号："+orderNum+" "+company' style="width:100%" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-table :data="orderDetails" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 150%;">
				<el-table-column prop="id" label="id" width="50" v-if="false">
				</el-table-column>
				<el-table-column prop="detail_name" label="名称" width="200" >
				</el-table-column>
				<el-table-column prop="goods_name" label="商品" width="100" >
				</el-table-column>
				<el-table-column prop="goods_needsTiexian_count" label="需要铁线" width="100"  >
				</el-table-column>
				<el-table-column prop="goods_needsZhijuan_count" label="所需纸卷" width="100" >
				</el-table-column>
				<el-table-column prop="goods_selled_count" label="已出货物" width="100" >
				</el-table-column>
				<el-table-column prop="goods_unit" label="单位" min-width="70" >
				</el-table-column>
				<el-table-column label="操作" width="100">
					<template slot-scope="scope">
						<!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">明细</el-button> -->
						<el-button type="danger" size="small" @click="OrderDetailsDel(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<div slot="footer" class="dialog-footer">
				<el-button type="warning" :disabled="isDisabled" style="margin-right:550px" @click="closeOrder">结束订单</el-button>
				<el-button type="primary" @click.native="editFormVisible = false">关闭</el-button>
				<!-- <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button> -->
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import {
		getOrderListPage,
		selectOrderDetails,
		closeOrder,
		removeOrder,				//删除订单
		delOrderDetails				//删除订单明细
	}from '../../api/axiosapi'
	export default {
		data() {
			return {
				selectOptions: [{		//订单状态下拉框取值
					value: '',
					label: '全部'
				},
				{
					value: '0',
					label: '未完成'
				},
				{
					value: '1',
					label: '已完成'
				}],
				defaultSelect: '',  //''代表选择了value=''的选项


				filters: {
					orderId: '',
					companyName: '',
					createDateOn: '',
					createDateEnd: '',
					status: ''
				},
				OrderList: [],		//订单列表
				orderDetails: [],	//订单详细列表
				isDisabled: false,
				orderNum: '000000', //订单详细列表展示的订单编号
				company: '',		//订单详细列表展示的发单公司
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				}

			}
		},
		methods: {
			// 复制成功
			onCopy(e){
				console.log(e);
			},
			// 复制失败
			onError(e){
				alert("失败");
			},
			//删除订单明细
			OrderDetailsDel(index, row) {
				this.$confirm('此操作将永久删除该明细, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var params = {"id": row.id};
					delOrderDetails(params).then(res => {
						let {code,msg} = res
						if(code==200){
							this.$message({
								type: 'success',
								message: '该明细删除成功!'
							});
							
							this.orderDetails.splice(index,1)
							
						}else{
							this.$message({
								type: 'error',
								message: msg
							});
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
				});

				
			},

			//订单明细界面关闭订单
			closeOrder() {
				this.$confirm('该订单还未完成，是否要关闭订单?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
					}).then(() => {
						var orderId = this.orderNum
						var params = {"orderId": orderId,"orderStatus": 1}
						closeOrder(params).then(res => {
							let {code,msg} = res
							if(code==200){
								this.$message({
								type: 'success',
								message: '订单已结束!'
								});
								this.editFormVisible = false
								this.getOrderList();
							}else{
								this.$message({
								type: 'error',
								message: '操作失败!'
								});
							}
						})
						
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消结束'
						});          
					});
			},
			handleCurrentChange() {
				this.getOrderList();
			},

			//根据条件查询订单
			selectOrderByOptions(){
				if(this.filters.createDateOn!=''&&this.filters.createDateEnd!=''){
					if(this.filters.createDateOn>this.filters.createDateEnd){
						this.$message.error('截至时间不能小于开始时间');
						return
					}
				}
				this.getOrderList();
			},
			//获取订单列表
			getOrderList() {
				let params = {
					page: this.page,
					orderId: this.filters.orderId,
					companyName: this.filters.companyName,
					createDateOn: this.filters.createDateOn,
					createDateEnd: this.filters.createDateEnd,
					orderStatus: this.defaultSelect
				};
				this.listLoading = true;
				//NProgress.start();
				getOrderListPage(params).then((res) => {
					let {code,msg,data} = res
					this.total = data.total;
					var list = JSON.stringify(data.orderList);
					var  OrderList = JSON.parse(list)
					for (let index = 0; index < OrderList.length; index++) {
						OrderList[index].orderId = OrderList[index].orderId;
						const element = OrderList[index].orderStatus;
						if(element==0){
							OrderList[index].orderStatus = '未完成'
						}else if(element == 1){
							OrderList[index].orderStatus = '已完成'
						}
					}
					this.OrderList = OrderList
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除订单
			OrderDel: function (index, row) {
				this.$confirm('此订单可以包含子订单，删除之后不可恢复，你最好清楚自己正在干什么，确认删除吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.$prompt('请输入当前账户的密码', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(({ value }) => {
						var user = JSON.parse(sessionStorage.getItem('user'));
						var userId= user.userId
						var params = {"userId": userId, "password": value, "orderId": row.orderId}
						this.listLoading = true;

						removeOrder(params).then((res) => {
							this.listLoading = false;
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
							this.getOrderList();
						});
						
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '取消删除'
						});       
					});

				}).catch(() => {

				});
			},
			//显示明细界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
				var orderId = row.orderId
				var orderStatus = row.orderStatus
				if(orderStatus == '已完成'){
					this.isDisabled = true;
				}else{
					this.isDisabled = false;
				}
				var params = {'orderId': orderId}
				selectOrderDetails(params).then(res => {
					let {code,msg,data} = res
					var list = JSON.stringify(data)
					this.orderDetails = JSON.parse(list)
					this.orderNum = orderId
					this.company = row.companyName
				})

			},
			// //显示新增界面
			reset() {
				this.filters = {}
			},
			
			selsChange: function (sels) {
				this.sels = sels;
			}
		},
		mounted() {
			this.getOrderList();
		}
	}

</script>

<style scoped>

</style>