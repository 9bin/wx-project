var _api_root = "{$_api_root}", api = {
  default: {
    store: _api_root + "default/store",
    index: _api_root + 'index',
    buy_data: _api_root + "default/buy_data",
    notice: _api_root + "default/notice",
    getSmsCode: _api_root + "account/sendCode",          //获取短信验证码-不带图形验证码参数
    check_send_code: _api_root + "account/checkSendCode",  //验证手机验证码
    cat_list: _api_root + "class/getClassList",         //获取分类列表
    goods_list: _api_root + "product/getProductList",    //获取商品列表
    getGoods: _api_root + "product/getProductDetail",   //获取商品详情
    get_brand_list: _api_root + "brand/getBrandList",    //获取品牌列表
    get_separate_brand_list: _api_root + "brand/getSeparateBrandList", //获取格式化商品品牌列表
    freight_calculate: _api_root + "product/freightCalculate",   //商品详情运费计算
    upload_image: _api_root + "upload/uploadFile",             //默认上传图片路径
    get_logistics_company: _api_root + "member/return/getLogisticsList",  //查询物流公司
    get_logistics_foot: _api_root + "member/return/getLogisticTrackList",  //查询物流轨迹列表
    get_send_type: _api_root + "default/get_send_type",
    goods_qrcode: _api_root + "default/goods_qrcode"
  },
  share: {
    bind_parent: _api_root + "default/bind_parent"
  },
  order: {
    list: _api_root + "member/order/list",                  //会员订单列表
    detail: _api_root + "member/order/detail",               //订单详情
    cancle_order: _api_root + "member/order/cancel",           //取消订单
    submit_preview: _api_root + "order/getOrderConformData",    //获取订单确认页数据
    get_self_pick_addr_list: _api_root + "order/getSelfPickAddrList",   //获取自提点列表
    pay_order_by_cash: _api_root + "order/payOrderByCash",         //余额支付
    freight_calculate: _api_root + "order/freightCalculate",        //订单运费计算
    check_order: _api_root + "order/checkToBuyForMarket",           //购买活动商品前校验活动数据
    submit: _api_root + "order/submitOrder",                     //提交订单
    pay_data: _api_root + "order/getOrderPayData",                //获取订单支付页数据
    wx_pay: _api_root + "order/orderWXPayApply",                 //订单微信支付申请
    balance_pay: _api_root + "order/payOrderByCash",             //订单余额支付
    pay_callback: _api_root + "order/getOrderPaySuccessData",     //订单支付成功页数据
    refund: _api_root + "member/return/orderList",        //售后申请列表
    refund_apply_detail: _api_root + "member/return/orderDetail",   //售后申请详情
    refund_record: _api_root + "member/return/list",     //退换货记录列表
    refund_detail: _api_root + "member/return/detail",       //	退换货记录详细信息
    refund_apply: _api_root + "member/return/submitRejected",  //新增退换货申请
    calcle_refund: _api_root + "member/return/cancel",       //取消退换货
    sure_reseiving: _api_root + "member/return/confirmReceipt",   //售后换货确认收货
    sure_collection: _api_root + "member/return/confirmRefund",    //售后换货确认收款
    fill_in_logistics: _api_root + "member/return/fillInLogistic",  //填写物流信息
  },
  cart: {
    add_cart: _api_root + "cart/addCart",                //添加到购物车
    get_cart_list: _api_root + "cart/getCartInfo",         //	获取购物车数据
    update_cart: _api_root + "cart/updateCartInfo",       //更新购物车数据
    delete_cart: _api_root + "cart/deleteCartInfo",        //删除购物车数据 
  },
  integralMall: {
    list: _api_root + "marketing/integralMall",           //积分商城商品列表
    order_list: _api_root + ""
  },
  miaosha: {
    list: _api_root + "marketing/seckill",                 //加载秒杀时间段
    appointment: _api_root + "marketing/seckillSubscribe",  //预约秒杀产品
  },
  flash: {
    get_flash_sale: _api_root + "marketing/flashSale",        //限时抢购商品列表
  },
  yushou: {
    list: _api_root + "marketing/presell",                 //预售商品列表
  },
  lottery: {
    load_data: _api_root + "marketing/interaction/detail",      //抽奖详情
    lotto: _api_root + "marketing/interaction/luckyDraw",        //点击抽奖
  },
  evaluate: {
    get_evaluate_list: _api_root + "discuss/getProductComment",      //获取商品评价列表
    order_evaluate_list: _api_root + "discuss/orderEvaluateList",    //待评价订单列表
    finish_evaluate_list: _api_root + "discuss/finishOrderEvaluateList",   //已评价订单列表
    comment_preview: _api_root + "discuss/orderEvaluation",          //获取指定的订单未评价详情
    add_comment: _api_root + "discuss/addOrderDiss",               //订单评价
  },
  coupon: {
    get_coupont_by_product: _api_root + "marketing/coupon/getCoupontByProductId",  //根据商品获取此商品下的优惠券
    receive: _api_root + "marketing/coupon/acquireCoupon",       //领取优惠券
    get_coupon_list: _api_root + "marketing/coupon/list",            //优惠券列表
    my_coupon: _api_root + "marketing/coupon/myCoupon",            //我的优惠券列表
  },
  user: {
    login: _api_root + "account/loginByAccount",                   //微信登录
    collect_list: _api_root + "member/favorite/myFavoriteList",    //我的收藏列表
    collect: _api_root + "member/favorite/saveOrUpdateFavorite",  //收藏或者取消收藏
    get_area_list: _api_root + "member/address/getAreaListByPid",   //获取区域数据
    address_list: _api_root + "member/address/list",              //会员收货列表
    set_default: _api_root + "member/address/setDefault",          //设置默认收货地址
    address_add: _api_root + "member/address/add",                 //新增会员收货地址
    address_save: _api_root + "member/address/update",            //	修改会员收货地址
    address_detail: _api_root + "member/address/detail",          //会员收货地址详情
    address_del: _api_root + "member/address/del",                //删除会员收货地址
    confirm_receipt: _api_root + "member/return/confirmReceipt",    //确认收货
    capital: _api_root + "member/capital",                        //会员总资金/总积分
    index: _api_root + "member/index",                            //会员中心首页
    integral: _api_root + "member/captial/integral",              //会员积分中心
    capial_list: _api_root + "member/captial/capialList",         //会员资金/积分列表
    sign_in: _api_root + "member/captial/signIn",                 //会员签到
    foot: _api_root + "member/foot/myFootList",                   //我的足迹列表
    add_foot: _api_root + "member/foot/add",                     //新增会员足迹
  }
};

module.exports = api;