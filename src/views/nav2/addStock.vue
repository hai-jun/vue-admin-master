<template>
  <div>
    <div>
      <h3 style="margin:20px">基本信息</h3>
      <el-form ref="form" :model="form" label-width="80px" class="elform">
        <el-form-item style="padding-left:410px">
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button @click="reset">取消</el-button>
        </el-form-item>
        <el-form-item label="来源公司" class="elformitem">
          <el-input v-model="form.jinhuoCompany"></el-input>
        </el-form-item>
        <el-form-item label="单号" class="elformitem">
          <el-input v-model="form.jinhuoNumber"></el-input>
        </el-form-item>
        <el-form-item label="经手人" class="elformitem">
          <el-input v-model="form.jinhuoPerson"></el-input>
        </el-form-item>
        <el-form-item label="进货时间" class="elformitem">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.jinhuoDate" style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.remarks"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <h3 style="display:inline;margin:20px">进货明细</h3>
			<el-button @click="addLine" type="primary" style="margin-left:20px;margin:20px">添加行数</el-button>
      <el-table :data="tableData" border show-summary :summary-method="getSummaries" style="width: 70%">
        <el-table-column prop="goodsId" label="名称(如果没有就先添加库存)" :min-width="140">
          <template slot-scope="scope">
						<el-select v-model="scope.row.goodsId" placeholder="请选择">
							<el-option 	v-for="item in options" :key="item.goods_id" :label="item.goods_name" :value="item.goods_id"> </el-option>
						</el-select>
					</template>
        </el-table-column>
        <el-table-column prop="goodsCount" label="数目" :min-width="100">
          <template slot-scope="scope">
						<el-input placeholder="数目" v-model="scope.row.goodsCount"></el-input>
					</template>
        </el-table-column>
        <el-table-column prop="goodsSinglePrice" label="单价(元/kg)" :min-width="80">
          <template slot-scope="scope">
						<el-input placeholder="单价" v-model="scope.row.goodsSinglePrice"></el-input>
					</template>
        </el-table-column>
        <el-table-column prop="goodsUnit" label="单位(kg)">
          <template slot-scope="scope">
						<el-input placeholder="kg" v-model="scope.row.goodsUnit" disabled></el-input>
					</template>
        </el-table-column>
        <el-table-column prop="smailtatal" label="小计">
          <template slot-scope="scope">
						<el-input placeholder="0" v-model="scope.row.smailtatal" disabled> {{scope.row.smailtatal = ((scope.row.goodsSinglePrice * scope.row.goodsCount).toFixed(2))}}</el-input>
					</template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" :min-width="200">
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
			<el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button @click="reset">取消</el-button>
		</div>
  </div>
</template>

<script>
  import {
    selectStock,             //查询下拉框的内容
    addJinhuo,               //新增进货信息和进货明细
  } from "../../api/axiosapi"
  export default {
    data() {
      return {
        options: [],			//下拉框内容
        form: {
          jinhuoCompany: '',
          jinhuoNumber: '',
          jinhuoPerson: '',
          jinhuoDate: '',
          remarks: '',
          jinhuoTotalprice: ''
        },
        tableData: [],    //进货明细table
      }
    },
    methods: {
       getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (index === 2) {
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
          if(index === 4){
            this.form.jinhuoTotalprice = sums[index]
          }
        });
        
        return sums;
      },
      
      addLine() {
				var params = {"goodsId": "","goodsCount": "","goodsSinglePrice": 0,"smailtatal":0,"unit":"kg","remarks": ""}
				this.tableData.push(params)
				this.selectStocks();
      },
      handleDelete(index) {
				 this.tableData.splice(index, 1)
      },
      reset() {
				this.form = {}
				this.tableData = []
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
      onSubmit() {
        //表单验证
        if(this.form.jinhuoCompany == ''){
          this.$message.error("请输入来源公司！")
          return
        }
        if(this.form.jinhuoNumber == ''){
          this.$message.error("请输入进货单号！")
          return
        }
        if(this.form.jinhuoPerson == ''){
          this.$message.error("经手人不得为空！")
          return
        }
        if(this.form.jinhuoDate == ''){
          this.$message.error("请选择进货日期！")
          return
        }
        if(this.tableData == []||this.tableData == ''||this.tableData == null){
          this.$message.error("请填写进货明细！")
          return
        }
        this.tableData.forEach(e => {
          if(e.goodsId == ''){
            this.$message.error("请选择所进货物！")
            return
          }
          let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/
          if(e.goodsCount == ''){
            this.$message.error("请输入数目！")
            return
          }else{
            if(!reg.test(e.goodsCount)){
              this.$message.error("数目只能为数值类型！")
              return
            }
          }
          if(e.goodsSinglePrice == ''){
            this.$message.error("请输入单价！")
            return
          }else{
            if(!reg.test(e.goodsSinglePrice)){
              this.$message.error("单价只能为数值类型！")
              return
            }
          }
        });
        var params = {"JinhuoInfo": this.form,"JinhuoDetails": this.tableData}
        addJinhuo(params).then(res => {
          let {code,msg} = res
          if(code==200){
            this.$confirm('入库成功，是否保存表单信息?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'success'
						}).then(() => {

						}).catch(() => {
							this.form = {}
							this.tableData = []
						});
          }
        })
      },

      //统计小计
      countPrice(row) {
        
      }
    }
  }

</script>
<style>
  .elform{
    width: 40%;
    margin: 20px;
  }
  .elformitem{
    width: 324px;
    display: inline-block;
  }
</style>

