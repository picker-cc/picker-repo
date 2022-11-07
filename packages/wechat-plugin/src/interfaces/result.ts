export interface FollowerResult {
    // "total":2,
    // "count":2,
    // "data":{
    //     "openid":["OPENID1","OPENID2"]},
    // "next_openid":"NEXT_OPENID"
    total: number;
    count: number;
    data: {
        openid: string[]
    };
    next_openid: string;
}

export interface UserInfoResult {
    // 用户是否订阅该公众号标识，值为0时，代表此用户没有关注该公众号，拉取不到其余信息
    subscribe: string;
    // 用户的标识，对当前公众号唯一
    openid: string;
    // 用户的语言，简体中文为zh_CN
    language: string;
    // 用户关注时间，为时间戳。如果用户曾多次关注，则取最后关注时间
    subscribe_time: string;
    // 只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段。
    unionid: string;
    // 公众号运营者对粉丝的备注，公众号运营者可在微信公众平台用户管理界面对粉丝添加备注
    remark: string;
    // 用户所在的分组ID（兼容旧的用户分组接口）
    groupid: string;
    // 用户被打上的标签 ID 列表
    tagid_list: string;
    // 返回用户关注的渠道来源，ADD_SCENE_SEARCH 公众号搜索，ADD_SCENE_ACCOUNT_MIGRATION 公众号迁移，ADD_SCENE_PROFILE_CARD 名片分享，ADD_SCENE_QR_CODE 扫描二维码，ADD_SCENE_PROFILE_LINK 图文页内名称点击，ADD_SCENE_PROFILE_ITEM 图文页右上角菜单，ADD_SCENE_PAID 支付后关注，ADD_SCENE_WECHAT_ADVERTISEMENT 微信广告，ADD_SCENE_REPRINT 他人转载 ,ADD_SCENE_LIVESTREAM 视频号直播，ADD_SCENE_CHANNELS 视频号 , ADD_SCENE_OTHERS 其他
    subscribe_scene: string;
    // 二维码扫码场景（开发者自定义）
    qr_scene: string;
    // 二维码扫码场景描述（开发者自定义）
    qr_scene_str: string;
}
export interface DefaultRequestResult {
  errcode: number;
  errmsg: string;
}

/**
 * 用户网页授权access_token返回结果
 *
 * Result of get access_token which is use by user auth.
 *
 */
export interface UserAccessTokenResult {
  /**
   * access_token
   */
  access_token: string;
  /**
   * access_token 有效期
   * seconde that access_token will expires in
   */
  expires_in: number;
  /**
   * 刷新token
   *
   * Use to refresh the access_token. Expires in 30 days.
   */
  refresh_token: string;
  /**
   * 用户openid
   *
   * user's openid
   */
  openid: string;
  /**
   * access_token's scope
   */
  scope: string;
  /**
   * 正确返回没有该字段
   * There is no this property when success.
   */
  errcode?: number;
  /**
   * 正确返回没有该字段
   * There is no this property when success.
   */
  errmsg?: string;
}

/**
 * 获取签名票据返回结果
 *
 * Result of get ticket
 */
export interface TicketResult {
  /**
   * 返回代码，正确结果是0
   *
   * response code, code = 0 when success
   */
  errcode: number;
  /**
   * 响应消息
   * response message
   */
  errmsg: string;
  /**
   * 票据
   *
   * ticket
   */
  ticket: string;

  /**
   * ticket 有效期
   * seconde that ticket will expires in
   */
  expires_in: number;
}

/**
 * 登录凭证校验
 *
 * Result of auth.code2Session
 */
export interface SessionResult {
  /**
   * 用户唯一标识
   */
  openid: string;
  /**
   * 会话密钥
   */
  session_key: string;
  /**
   * 用户在开放平台的唯一标识符，若当前小程序已绑定到微信开放平台帐号下会返回，详见 UnionID 机制说明。
   */
  unionid?: string;
  /**
   * 错误码
   */
  errcode?: number;
  /**
   * 错误信息
   */
  errmsg?: string;
}

// =============================== 第三方开放平台 ===============================

/**
 * 使用授权码获取授权信息授回结果
 */
export interface AuthorizationResult {
  /**
   * 授权信息
   */
  authorization_info: {
    /**
     * 授权方 appid
     */
    authorizer_appid: string;
    /**
     * 接口调用令牌（在授权的公众号/小程序具备 API 权限时，才有此返回值）
     */
    authorizer_access_token: string;
    /**
     * authorizer_access_token 的有效期（在授权的公众号/小程序具备API权限时，才有此返回值），单位：秒
     */
    expires_in: number;
    /**
     * 刷新令牌（在授权的公众号具备API权限时，才有此返回值），刷新令牌主要用于第三方平台获取和刷新已授权用户的 authorizer_access_token。一旦丢失，只能让用户重新授权，才能再次拿到新的刷新令牌。用户重新授权后，之前的刷新令牌会失效
     */
    authorizer_refresh_token: string;
    /**
     * 授权给开发者的权限集列表
     */
    func_info: {[key: string]: { id: number }}[];
  }
}

/**
 * 获取授权帐号详情返回结果
 */
export interface AuthorizerInfo {
  /**
   * 详见小程序帐号信息
   */
  authorizer_info: {
    /**
     * 昵称
     */
    nick_name: string;
    /**
     * 头像
     */
    head_img: string;
    /**
     * 小程序类型
     */
    service_type_info: {
      id: string;
    };
    /**
     * 小程序认证类型
     */
    verify_type_info: {
      id: string;
    };
    /**
     * 原始 ID
     */
    user_name: string;
    /**
     * 主体名称
     */
    principal_name: string;
    /**
     * 用以了解功能的开通状况（0代表未开通，1代表已开通），详见business_info 说明
     */
    business_info: {
      open_store: number;
      open_scan: number;
      open_pay: number;
      open_card: number;
      open_shake: number;
    };
    /**
     *
     */
    alias: string;
    /**
     * 二维码图片的 URL，开发者最好自行也进行保存
     */
    qrcode_url: string;
    /**
     * 帐号状态，该字段公众号也返回
     */
    account_status: number;
    /**
     * 小程序配置，根据这个字段判断是否为小程序类型授权
     */
    MiniProgramInfo: object;
  }
}

/**
 * 已授权的帐号列表
 */
export interface AuthorizerListResult {
  /**
   * 授权的帐号总数
   */
  total_count: number;
  list: {
    /**
     * 已授权的 appid
     */
    authorizer_appid: string;
    /**
     * 刷新令牌authorizer_access_token
     */
    refresh_token: string;
    /**
     * 授权的时间
     */
    auth_time: number;
  }[];
}

/**
 * 获取手机号码返回结果
 */
export interface PhoneNumberResult extends DefaultRequestResult {
  /**
   * 用户手机号信息
   */
  phone_info: {
    /**
     * 用户绑定的手机号（国外手机号会有区号）
     */
    phoneNumber: string;
    /**
     * 没有区号的手机号
     */
    purePhoneNumber: string;
    /**
     * 区号
     */
    countryCode: number;
    /**
     * 数据水印
     */
    watermark: {
      /**
       * 用户获取手机号操作的时间戳
       */
      timestamp: number;
      /**
       * 小程序appid
       */
      appid: string;
    };
  };
}
