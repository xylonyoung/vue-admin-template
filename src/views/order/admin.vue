<template>
  <div class="dashboard-container">
    <div>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-input v-model="phone" placeholder="联系电话" />
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">
            <el-select v-model="orderStatus" placeholder="订单状态">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-input v-model="region" placeholder="地区" />
            <!-- <el-select v-model="region" placeholder="地区">
              <el-option
                v-for="item in providerRegions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> -->
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">
            <el-input v-model="worker" placeholder="施工工人" />
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light">
            <el-button @click="getOrders">搜索</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table :data="orders" stripe>
        <el-table-column label="下单时间" width="180px">
          <template slot-scope="scope">
            {{ $dateFormat(scope.row.createdTime) }}
          </template>
        </el-table-column>
        <el-table-column label="地区" width="160px">
          <template slot-scope="scope">
            {{ scope.row.region.__toString }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="类型">
          <template slot-scope="scope">
            {{ type[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" width="180px" />
        <el-table-column prop="contact" label="联系人" />
        <el-table-column prop="phone" label="联系电话" width="180px" />
        <el-table-column label="施工内容" width="100px">
          <template slot-scope="scope">
            <el-popover placement="right" width="400" trigger="click">
              <div>
                <el-table :data="scope.row.items" style="width: 100%">
                  <el-table-column label="服务" width="200px">
                    <template slot-scope="item">
                      {{ item.row.__toString }}
                    </template>
                  </el-table-column>
                  <el-table-column label="数量">
                    <template slot-scope="item">
                      {{ item.row.__metadata.quantity }}
                    </template>
                  </el-table-column>
                  <el-table-column label="价钱">
                    <template slot-scope="item">
                      ￥{{ item.row.__metadata.price }}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <el-button slot="reference" type="text">点击查看</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="订单状态">
          <template slot-scope="scope">
            {{ getStatus(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="服务总价" />
        <el-table-column prop="discount" label="订单折扣" />
        <el-table-column prop="shippingPrice" label="代付运费" />
        <el-table-column prop="price" label="实收金额" />
        <el-table-column prop="workerFee" label="施工工费" />
        <el-table-column label="下单用户">
          <template slot-scope="scope">
            <span>{{ $getValue(scope, 'row.user.__toString') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="施工工人">
          <template slot-scope="scope">
            <span>{{ $getValue(scope, 'row.worker.__toString') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="订单备注" width="180px;" />
        <el-table-column label="操作" width="180px" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="detail(scope.row)">详情</el-button>
            <el-button type="text" @click="toGetWorker(scope.row)">
              指派
            </el-button>
            <el-button type="text" @click="changeWorkerFee(scope.row)">
              设置工费
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination
          :page-sizes="[20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 设置工费 -->
    <el-dialog
      title="请填写给施工工人的工费"
      :visible.sync="toChangeWorkerFee"
      width="30%"
    >
      <div style="padding: 10px">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="施工工费">
            <el-input v-model="workerFee" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toChangeWorkerFee = false">取 消</el-button>
        <el-button type="primary" @click="updateWorkerFee">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 指派工人 -->
    <el-dialog
      title="请选择需要指派的工人"
      :visible.sync="getWorker"
      width="30%"
    >
      <div style="padding: 10px">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="工人区域">
            <el-select
              v-model="workerRegion"
              filterable
              placeholder="地区"
              @change="getWorkerByRegion"
            >
              <el-option
                v-for="item in providerRegions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="指派工人">
            <el-select v-model="choosedWorker" placeholder="工人">
              <el-option
                v-for="item in regionWorkers"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="getWorker = false">取 消</el-button>
        <el-button type="primary" @click="updateWorker">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 详细信息 -->
    <el-dialog title="订单详细" :visible.sync="showDetail" width="40%">
      <div>
        <p>施工类型：{{ type[choosedOrder.type] }}</p>
        <p>订单状态： {{ getStatus(choosedOrder.status) }}</p>
        <p>下单时间：{{ $dateFormat(choosedOrder.createdTime) }}</p>
        <p>施工地区：{{ choosedOrder.region.__toString }}</p>
        <p>详细地址：{{ choosedOrder.address }}</p>
        <p>联系人：{{ choosedOrder.contact }}</p>
        <p>联系电话：{{ choosedOrder.phone }}</p>
        <p>工人：{{ $getValue(choosedOrder, 'worker.__toString') }}</p>

        <div v-if="choosedOrder.items != ''">
          <h5>施工内容</h5>
          <el-table :data="choosedOrder.items" style="width: 100%">
            <el-table-column label="服务" width="200px">
              <template slot-scope="item">
                {{ item.row.__toString }}
              </template>
            </el-table-column>
            <el-table-column label="数量">
              <template slot-scope="item">
                {{ item.row.__metadata.quantity }}
              </template>
            </el-table-column>
            <el-table-column label="价钱">
              <template slot-scope="item">
                ￥{{ item.row.__metadata.price }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p>服务总价：{{ choosedOrder.totalPrice }}</p>
        <p>订单折扣：{{ choosedOrder.discount }}</p>
        <p>代付运费：{{ choosedOrder.shippingPrice }}</p>
        <p>实收金额：{{ choosedOrder.price }}</p>
        <div v-if="choosedOrder.pickupAddress != ''">
          <p>代取地址：{{ choosedOrder.pickupAddress }}</p>
          <p>取货码：{{ choosedOrder.pickupCode }}</p>
        </div>
        <div v-if="choosedOrder.type == 'construction'">
          <h5>墙面情况</h5>
          <div>
            <p v-if="choosedOrder.wallType == 0">腻子墙面</p>
            <p v-if="choosedOrder.wallType == 1">乳胶漆墙面</p>
            <p v-if="choosedOrder.hasScaling == 0">无掉灰</p>
            <p v-if="choosedOrder.hasScaling == 1">有掉灰</p>
            <p v-if="choosedOrder.hasFurintur == 0">有家具</p>
            <p v-if="choosedOrder.hasFurintur == 1">无家具</p>
            <p v-if="choosedOrder.specialWall == 1">特殊造型</p>
            <el-image
              v-if="choosedOrder.specialWall"
              style="width: 100px; height: 100px"
              :src="specialWallPhoto[0]"
              :preview-src-list="specialWallPhoto"
            />
            <p>施工现场图片</p>
            <el-image
              v-if="environmentPhoto.length > 0"
              style="width: 100px; height: 100px"
              :src="environmentPhoto[0]"
              :preview-src-list="environmentPhoto"
            />

            <div v-if="choosedOrder.measureResult != null">
              <p>测量结果</p>
              <p>{{ choosedOrder.measureResult }}</p>
            </div>

            <div v-if="finishPhoto.length > 0">
              <p>完工图片</p>
              <el-image
                style="width: 100px; height: 100px"
                :src="finishPhoto[0]"
                :preview-src-list="finishPhoto"
              />
            </div>
          </div>
        </div>
        <div v-else />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showDetail = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Orders',
  computed: {
    ...mapGetters(['name'])
  },
  data() {
    return {
      showDetail: false,
      toChangeWorkerFee: false,
      workerFee: 0,
      workerRegion: '',
      getWorker: false,
      pageSize: 20,
      page: 1,
      orders: [],
      total: 0,
      type: {
        construction: '施工订单',
        measure: '测量订单'
      },
      statusList: [
        {
          label: '已取消',
          value: -1
        },
        {
          label: '待支付',
          value: 1
        },
        {
          label: '待接工',
          value: 2
        },
        {
          label: '待完工',
          value: 3
        },
        {
          label: '待验收',
          value: 4
        },
        {
          label: '待完成',
          value: 5
        },
        {
          label: '待接单',
          value: 6
        }
      ],
      orderStatus: '',
      phone: '',
      worker: '',
      region: '',
      choosedOrder: {
        region: { __toString: '' }
      },
      providerRegions: [],
      form: {},
      regionWorkers: [],
      choosedWorker: '',
      finishPhoto: [],
      environmentPhoto: [],
      specialWallPhoto: []
    }
  },
  created() {
    this.$api.get('/manage/uni-regions').then((res) => {
      this.providerRegions = res.data.map((e) => ({
        label: e.__toString,
        value: e.id
      }))
    })

    this.getOrders()
  },
  methods: {
    getStatus(value) {
      const result = this.statusList.find((e) => e.value === +value)
      return result?.label ?? ''
    },
    getOrders() {
      let filter = '1'
      if (this.phone != '') {
        filter += ` && entity.getPhone() == ${this.phone}`
      }
      if (this.orderStatus != '') {
        filter += ` && entity.getStatus() == ${this.orderStatus}`
      }
      if (this.worker != '') {
        filter += ` && entity.getWorker().getName() == ${this.worker}`
      }
      if (this.region != '') {
        filter += ` && entity.getRegion().__toString() matches '/${this.region}/'`
      }
      this.$api
        .get(`manage/orders`, {
          params: {
            '@filter': filter,
            '@order': 'createdTime|DESC',
            limit: this.pageSize,
            page: this.page
          }
        })
        .then((res) => {
          console.log(res)
          this.orders = res.data
          this.total = res?.paginator?.totalCount
        })
    },
    updateWorkerFee() {
      const order = this.choosedOrder.id
      this.$api
        .put(`manage/orders/${order}`, { workerFee: this.workerFee })
        .then((res) => {
          this.toChangeWorkerFee = false
          this.$message.success('设置成功！')
          this.getOrders()
        })
    },
    handleSizeChange(e) {
      console.log(e)
      this.pageSize = e
      this.getOrders()
    },
    handleCurrentChange(e) {
      console.log(e)
      this.page = e
      this.getOrders()
    },
    changeWorkerFee(row) {
      this.workerFee = row.workerFee
      this.toChangeWorkerFee = true
      this.choosedOrder = row
    },
    toGetWorker(order) {
      console.log(order)
      this.choosedOrder = order
      this.getWorker = true
    },
    getWorkerByRegion() {
      console.log(this.workerRegion)
      this.$api
        .get(`manage/workers`, {
          params: {
            '@filter': `entity.getRegion().getId() == ${this.workerRegion}`
          }
        })
        .then((res) => {
          console.log(res)
          const regionWorker = []
          for (const i of res.data) {
            const child = {
              label: i.name,
              value: i.id
            }
            regionWorker.push(child)
          }
          this.regionWorkers = regionWorker
        })
    },
    updateWorker() {
      if (this.choosedWorker == '') {
        this.$message.error('请选择工人！')
        return
      }
      this.getWorker = false
      const order = this.choosedOrder.id
      console.log(order, this.choosedWorker)
      this.$api
        .put(`manage/orders/${order}`, {
          worker: this.choosedWorker,
          status: 6
        })
        .then((res) => {
          this.$message.success('指派成功，等待工人接单')
          this.getOrders()
        })
    },
    detail(order) {
      this.choosedOrder = order
      console.log(order)
      const imgUrl = 'http://worker.jgj-qrcode.cn/uploads/images/'
      if (order.environmentPhoto != null) {
        const environmentPhoto = []
        for (const i of order.environmentPhoto) {
          environmentPhoto.push(imgUrl + i)
        }
        this.environmentPhoto = environmentPhoto
      }
      if (order.specialWallPhoto != null) {
        const specialWallPhoto = []
        for (const i of order.specialWallPhoto) {
          specialWallPhoto.push(imgUrl + i)
        }
        this.specialWallPhoto = specialWallPhoto
      }
      if (order.finishPhoto != null) {
        const finishPhoto = []
        for (const i of order.finishPhoto) {
          finishPhoto.push(imgUrl + i)
        }
        this.finishPhoto = finishPhoto
      }
      this.showDetail = true
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
