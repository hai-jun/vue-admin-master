<template>
    <section>
        <div>
            <el-table :data="stockLists" style="width:25%;margin-left:60px">
                <el-table-column prop="goodsId" label="id" v-if="false"></el-table-column>
                <el-table-column prop="goodsName" label="名称" width="270%"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
						<el-button type="danger" size="small" @click="DelStock(scope.$index, scope.row)">删除</el-button>
					</template>
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="width:25%;margin-left:60px">
            <el-button type="primary" @click.native="editFormVisible = true">新增</el-button>
                <el-pagination layout="prev, pager, next"  @current-change="handleCurrentChange" :current-page.sync="page" :page-size="10" :total="total" style="float:right;">
                </el-pagination>
	        </el-col>
            <el-dialog title="新增库存" :visible.sync="editFormVisible" :close-on-click-modal="false" style="width:60%">
                <el-form>
                    <el-form-item>
                        请输入名称<el-input v-model="filt.goodsName"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="addStock">保存</el-button>
                    <el-button @click.native="editFormVisible = false">取消</el-button>
                </div>
            </el-dialog>
        </div>
    </section>
</template>
<script>
import {
    getStock,       //分页查询库存列表
    delStock,       //删除一条库存信息
    addStock,       //新增一条库存信息
} from '../../api/axiosapi'
export default {
    data() {
        return {
            stockLists: [{
                goods_id: 1,
                goods_name: 'xxx'
            }],
            total: 0,
            page: 1,
            editFormVisible: false,
            filt: {
                goodsName: ''
            }
        }
    },
    methods: {
        //新增库存
        addStock() {
            this.editFormVisible = true
            var params = {"goodsName": this.filt.goodsName}
            addStock(params).then(res => {
                let {code,msg} = res
                if(code == 200){
                    this.$message({
                        type: 'success',
                        message: msg
                    })
                    this.editFormVisible = false
                    this.getStockList();
                }else{
                    this.$message.error(msg)
                }
            })
        },
        //删除一条库存
        DelStock(index,row) {
            this.$confirm('确认删除吗?', '提示', {
					type: 'warning'
				}).then(() => {
                    var id = row.goodsId;
                    var params = {"goodsId": id}
                    delStock(params).then(res => {
                        let {code,msg} = res
                        if(code==200){
                            this.$message({
                                type: 'success',
                                message: msg
                            })
                            this.getStockList();
                        }else{
                            this.$message.error(msg)
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消删除'
                    });       
                });
        },
        //分页查询库存列表
        getStockList() {
            var params = {"current": this.page}
            getStock(params).then(res => {
                let {code,msg,data} = res
                if(code==200){
                    var par = JSON.parse(JSON.stringify(data))
                    this.total = par.total
                    this.stockLists = par.stockLists
                }else{
                    this.$message.error(msg)
                }
            })
        },
        //改变页时
        handleCurrentChange() {
            this.getStockList();
        },
    },
    created() {
        this.getStockList();
    },
}
</script>

