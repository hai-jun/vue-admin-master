<template>
	<div>
		<div>
			<h3 style="display:inline">基本信息</h3>
			<el-button type="primary" style="margin-right:20px;margin-left:570px" @click="saveOrder">立即创建</el-button>
			<el-button @click="reset">取消</el-button>
			<el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:20%;min-width:800px;">
				<el-form-item label="下单公司" style="display:inline-block">
					<el-input v-model="form.companyName"></el-input>
				</el-form-item>
				<el-form-item label="接单人" style="display:inline-block">
					<el-input v-model="form.person"></el-input>
				</el-form-item>
				
				<el-form-item label="时间区间" >
					<el-col :span="11">
						<el-date-picker type="date" placeholder="选择开始日期" v-model="form.createDate" value-format="yyyy-MM-dd" format="yyyy 年 MM 月 dd 日" style="width: 100%;"></el-date-picker>
					</el-col>
					<el-col class="line" :span="2">-</el-col>
					<el-col :span="11">
						<el-date-picker type="date" placeholder="选择截止日期" v-model="form.termDate"  value-format="yyyy-MM-dd"  format="yyyy 年 MM 月 dd 日" style="width: 100%;"></el-date-picker>
					</el-col>
				</el-form-item>
			
				<el-form-item label="备 注">
					<el-input type="textarea" placeholder="请输入内容" v-model="form.remarks" :maxlength="100"  show-word-limit > </el-input>
				</el-form-item>
				
			</el-form>
		</div>
		<div class="table">
			<h3>订单明细</h3>
			<el-button @click="addLine" type="primary" style="margin-left:20px">添加行数</el-button>
      		
			<el-table :data="orderDetails" class="table">
				<el-table-column prop="detailName" label="名称">
					<template slot-scope="scope">
						<el-input placeholder="名称" v-model="scope.row.detailName"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="goodsId" label="所用货品">
					<template slot-scope="scope">
						<el-select v-model="scope.row.goodsId" placeholder="请选择">
							<el-option 	v-for="item in options" :key="item.goods_id" :label="item.goods_name" :value="item.goods_id"> </el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="goodsNeedstiexianCount" label="铁线质量">
					<template slot-scope="scope">
						<el-input placeholder="铁线质量" v-model="scope.row.goodsNeedstiexianCount"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="goodsNeedszhijuanCount" label="纸卷质量">
					<template slot-scope="scope">
						<el-input placeholder="纸卷质量" v-model="scope.row.goodsNeedszhijuanCount"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="goodsUnit" label="单位">
					<template slot-scope="scope">
						<el-input placeholder="kg" v-model="scope.row.goodsUnit"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="remarks" label="备注">
					<template slot-scope="scope">
						<el-input placeholder="备注" v-model="scope.row.remarks"></el-input>
					</template>
				</el-table-column>
				<el-table-column  label="操作">
					<template slot-scope="scope">
						<el-button type="danger" @click="handleDelete(scope.$index, scope.row)" round>删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div style="margin-top:50px;margin-left:900px">
			<el-button type="primary" style="margin-right:20px" @click="saveOrder">立即创建</el-button>
			<el-button @click="reset">取消</el-button>
		</div>

	</div>
	
</template>

<script>
	import { 
		selectStock,  			//查询下拉框的内容
		saveOrder,				//保存订单
		} from "../../api/axiosapi";
	export default {
		data() {
			return {
				form: {
					companyName: '',
					person: '',
					createDate: '',
					termDate: '',
					remarks: ''
				},
				orderDetails: [],
				options: [],			//下拉框内容
			}
		},
		
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			addLine() {
				var params = {"detailName": "","goodsId": "","goodsNeedstiexianCount": "","goodsNeedszhijuanCount": "","goodsSelledCount": 0,"goodsUnit":"kg","remarks": ""}
				this.orderDetails.push(params)
				this.options = []
				this.selectStocks();
			},
			handleDelete(index) {
				 this.orderDetails.splice(index, 1)
			},
			reset() {
				this.form = {}
				this.orderDetails = []
			},
			//下拉框
			selectStocks() {
				selectStock().then(res => {
					let {code,msg,data} = res
					var par = JSON.stringify(data)
					var params = JSON.parse(par)
					this.options = params
				})
			},

			//保存订单
			saveOrder() {
				//表单验证
				if(this.form.companyName == ''){
					this.$message.error("下单公司名称不能为空！")
					return
				}
				if(this.form.person == ''){
					this.$message.error("请输入接单人！")
					return
				}
				if(this.form.createDate == ''){
					this.$message.error("请输入开始日期！")
					return
				}
				if(this.form.termDate != ''&&this.form.termDate<this.form.createDate){
					this.$message.error("截止日期不得小于开始日期！")
					return
				}
				if(this.orderDetails == []||this.orderDetails==''||this.orderDetails==null){
					this.$message.error("订单明细不能为空！")
					return
				}
				this.orderDetails.forEach(e => {
					if(e.detailName == ''){
						this.$message.error("订单明细的名称不能为空！")
						return
					}
					if(e.goodsId == ''){
						this.$message.error("订单明细的所用货品不能为空！")
						return
					}
					if(e.goodsNeedstiexianCount == ''){
						this.$message.error("订单明细的铁线质量不能为空！")
						return
					}
					let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/
					if(!reg.test(e.goodsNeedstiexianCount)){
						this.$message.error("铁线质量只能是数值类型！")
						return
					}
					if(e.goodsNeedszhijuanCount != ''){
						if(!reg.test(e.goodsNeedszhijuanCount)){
							this.$message.error("纸卷质量只能是数值类型！")
							return
						}
					}
				});
				var params = {"orderInfo": this.form, "orderDetails": this.orderDetails}
				saveOrder(params).then(res => {
					let {code,msg} =  res
					if(code==200){
						this.$confirm('下单成功，是否保存表单信息?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'success'
						}).then(() => {

						}).catch(() => {
							this.form = {}
							this.orderDetails = []
						});
					}
				})
			},
		}
	}

</script>
<style>
	.table{
		margin-top: 10px;
		margin-left: 20px;
		width: 80%
	}
</style>
