<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.orderNum" placeholder="请输入订单编号"> <template slot="prepend">完整的订单编号</template></el-input>
				</el-form-item>
				
				<el-form-item>
					<el-button type="primary" v-on:click="selectOrder">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<h3>订单信息</h3>
		<el-table :data="orderInfo" highlight-current-row  @selection-change="selsChange" style="width: 80%;">
			<el-table-column type="" width="20">
			</el-table-column>
			<el-table-column prop="orderId" label="订单编号" width="150">
			</el-table-column>
			<el-table-column prop="companyName" label="发单公司" width="180">
			</el-table-column>
			<el-table-column prop="person" label="接单人" width="120" >
			</el-table-column>
			<el-table-column prop="createDate" label="创建时间" width="180">
			</el-table-column>
			<el-table-column prop="termDate" label="截止日期" width="180">
			</el-table-column>
			<el-table-column prop="orderStatus" label="状态" min-width="140">
			</el-table-column>
			<el-table-column prop="remarks" label="备注" min-width="100">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleSell(scope.$index, scope.row)">出货</el-button>
				</template>
			</el-table-column>
		</el-table>
		
		<h3>历史出货列表</h3>
		<el-table :data="sellList" highlight-current-row style="width: 80%;">
			<el-table-column type="" label="" width="50">
			</el-table-column>
			<el-table-column type="" prop="sellNumbers" label="出货单号" width="200">
			</el-table-column>
			<el-table-column type="" prop="sellPerson" label="出货人" width="200">
			</el-table-column>
			<el-table-column type="" prop="sellDate" label="日期" width="200" sortable>
			</el-table-column>
			<el-table-column type="" prop="sellTotalprice" label="货品金额" width="200">
			</el-table-column>
			<el-table-column type="" prop="remarks" label="备注" width="300">
			</el-table-column>
			<el-table-column label="" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleDetail(scope.$index, scope.row)">明细</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 查看明细 -->
		<el-dialog title="出货明细" style="width:100%"  :visible.sync="detailsForm" :close-on-click-modal="false">
			<el-table :data="sellDetailList">
				<el-table-column prop="detailName" label="出货商品" width="200%"></el-table-column>
				<el-table-column prop="sellNumbers" label="出货单号"></el-table-column>
				<el-table-column prop="goodsSinglePrice" label="单价(元)"></el-table-column>
				<el-table-column prop="goodsCount" label="数量(kg)"></el-table-column>
				<el-table-column prop="smailTotal" label="小计(元)"></el-table-column>
				<el-table-column prop="remarks" label="备注"></el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="detailsForm = false">取消</el-button>
			</div>
		</el-dialog>

		<!-- 出货弹出层 -->
		<el-dialog title="填写出货信息" style="width:100%" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<h4>基本信息</h4>
			<el-form :inline="true" :model="sellInfo">
				<el-form-item>
					订单编号<el-input placeholder="" v-model="sellInfo.orderId" disabled style="width:80%"></el-input>
				</el-form-item>
				<el-form-item>
					请填写出货单号<el-input placeholder="出货单号" v-model="sellInfo.sellNumbers"></el-input>
				</el-form-item>
				<el-form-item>
					请填写出货人<el-input placeholder="出货人" v-model="sellInfo.sellPerson"></el-input>
				</el-form-item>
				<el-form-item>
					备注<el-input placeholder="备注" v-model="sellInfo.remarks"></el-input>
				</el-form-item>
			</el-form>
			<h4 style="display:inline">明细</h4>
			<el-button @click="addLine" type="primary" style="margin:20px">添加</el-button>
			<el-table :data="sellDetails"    show-summary :summary-method="getSummaries"  highlight-current-row style="width: 150%;">
				<el-table-column label="id" width="50" v-if="false">
				</el-table-column>
				<el-table-column prop="orderDetailsId" label="选择" width="200">
					<template slot-scope="scope">
						<el-select v-model="scope.row.orderDetailsId" placeholder="请选择">
							<el-option 	v-for="item in options" :key="item.id" :label="item.detail_name" :value="item.id"> </el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="goodsSingleprice" label="单价" width="100">
					<template slot-scope="scope">
						<el-input placeholder="单价" v-model="scope.row.goodsSingleprice"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="goodsCount" label="数量" width="100">
					<template slot-scope="scope">
						<el-input placeholder="数量" v-model="scope.row.goodsCount"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="smailTotal" label="小计" width="100">
					<template slot-scope="scope">
						<el-input placeholder="小计" v-model="scope.row.smailTotal" disabled>
							{{scope.row.smailTotal = ((scope.row.goodsSingleprice * scope.row.goodsCount).toFixed(2))}}
						</el-input>
					</template>
				</el-table-column>
				<el-table-column prop="remarks" label="备注" min-width="70">
					<template slot-scope="scope">
						<el-input placeholder="备注" v-model="scope.row.remarks"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="100">
					<template slot-scope="scope">
						<el-button type="danger" size="small" @click="DetailsDel(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<div slot="footer" class="dialog-footer">
				<el-button type="warning" style="margin-right:550px" @click="submit">确认出货</el-button>
				<el-button type="primary" @click.native="editFormVisible = false">取消</el-button>
			</div>
		</el-dialog>
	</section>
</template>
<script>
import {
	selectSellLists,		//查询一条订单的出货记录
	selectOneOrder,			//查询订单信息
	getOrderDetail,			//查询下拉列表信息
	addSellList,				//提交出货信息
	selectSellDetails,	//查看明细
} from '../../api/axiosapi'
export default {
	data() {
		return {
			filters: {
				orderNum: ''
			},
			sellList: [],
			orderInfo: [],
			editFormVisible: false,
			sellDetails: [],
			options: [],
			orderNum: '',		//保存订单编号
			sellInfo: {
				orderId: '',
				sellNumbers: '',
				sellTotalprice: '',
				sellPerson: '',
				remarks: ''
			},

			//查看明细数据内容
			sellDetailList: [],
			detailsForm: false,
		}
	},
	methods: {
		//查看明细
		handleDetail(index,row) {
			this.detailsForm = true
			var params = {"sellNumber": row.sellNumbers}
			selectSellDetails(params).then(res => {
				let {code,msg,data} = res
				if(code == 200){
					this.sellDetailList = JSON.parse(JSON.stringify(data))
				}else{
					this.$message.error("系统错误！");
				}
			})
		},


		//提交出货信息
		submit() {
			//表单验证
			if(this.sellInfo.sellNumbers == ''){
				this.$message.error('出货单号不能为空！')
				return
			}
			if(this.sellInfo.sellPerson == ''){
				this.$message.error('出货人不能为空！')
				return
			}
			if(this.sellDetails == []||this.sellDetails == null||this.sellDetails == ''){
				this.$message.error('请填写出货明细！')
				return
			}
			var isr = true;
			this.sellDetails.forEach(e => {
				if(e.orderDetailsId == ''){
					this.$message.error('请选择出货单品！')
					isr = false;
					return;
				}
				if(e.goodsSingleprice == ''){
					this.$message.error('请输入单价！')
					isr = false;
					return
				}
				if(e.goodsCount == ''){
					this.$message.error('请输入数目！')
					isr = false;
					return
				}
				let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/
				if(!reg.test(e.goodsSingleprice)){
					this.$message.error('单价只能是数值类型！')
					isr = false;
					return
				}
				if(!reg.test(e.goodsCount)){
					this.$message.error('数目只能是数值类型！')
					isr = false;
					return
				}
			});
			if(isr==false){
				return;
			}
			var sellInfo = this.sellInfo;
			var sellDetails = this.sellDetails;
			sellDetails.forEach(e => {
				e.sellNumbers = this.sellInfo.sellNumbers
			});
			var params = {"sellInfo": sellInfo,"sellDetails": sellDetails}
			addSellList(params).then(res => {
				let {code,msg} = res
				if(code==200){
					this.$message({
						type: 'success',
						message: '出货成功！'
					})
				this.editFormVisible = false
				this.selectSellList();
				}else{
					this.$message.error(msg)
				}
			})
		},
		getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (index === 1||index ===4) {
            sums[index] = ' ';
            return;
		  }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            // sums[index] += ' 元';
          } else {
            // sums[index] = 'N/A';
          }
          
		  if(index === 2){
			sums[index] += 'kg'
			return;
		  }
		  if(index === 3){
			this.sellInfo.sellTotalprice = sums[index];
			sums[index] += '元'
			return;
		  }
        });
        
        return sums;
      },
		//查询下拉框内容
		getOrderDetails() {
			var params = {"orderId": this.orderNum}
			getOrderDetail(params).then(res => {
				let {code,msg,data} = res
				if(code==200){
					this.options = JSON.parse(JSON.stringify(data));
				}else{
					this.$message.error("获取订单明细失败！")
				}
			})
		},

		//添加明细
		addLine() {
			var params = {"sellNumbers":"","orderDetailsId": "","goodsSingleprice": "","goodsCount": "","smailTotal":"","remarks": ""}
			this.sellDetails.push(params)
			this.options = []
			this.getOrderDetails();
		},
		//删除明细
		DetailsDel(index) {
			 this.sellDetails.splice(index, 1)
		},
		selectOrder() {
			var params = {"orderId": this.filters.orderNum}
			selectOneOrder(params).then(res => {
				let {code,msg,data} = res
				if(code == 200){
					var orderInfo = JSON.parse(JSON.stringify(data));
					for (let index = 0; index < orderInfo.length; index++) {
						orderInfo[index].orderId = (orderInfo[index].orderId).substring(0,10)
						const element = orderInfo[index].orderStatus;
						if(element==0){
							orderInfo[index].orderStatus = '未完成'
						}else if(element == 1){
							orderInfo[index].orderStatus = '已完成'
						}
					}
					this.orderInfo = orderInfo
					this.orderNum = this.filters.orderNum
					this.selectSellList();
				}
			})
		},

		selectSellList() {

			//查询此订单的出货记录
			var params = {"orderNum": this.filters.orderNum}
			selectSellLists(params).then(res => {
				let {code,msg,data} = res
				if(code==200){
					this.sellList = JSON.parse(JSON.stringify(data));
				}

			})
		},
		//点击出货
		handleSell(index,row) {
			this.editFormVisible = true
			this.sellInfo.orderId = this.orderNum
		},
		selsChange: function (sels) {
				this.sels = sels;
		},
	},
}
</script>
